import React, { useState, useEffect } from "react";
import "./OutputList.css";

const OutputList = ({ stageItems, onOutputUpdate, onRemoveFromStage }) => {
  const [outputs, setOutputs] = useState([]);
  const [editingOutput, setEditingOutput] = useState(null);
  const [draggedOutput, setDraggedOutput] = useState(null);
  const [draggedGroup, setDraggedGroup] = useState(null);

  // Generate outputs based on stage items
  useEffect(() => {
    setOutputs((prevOutputs) => {
      const newOutputs = [];
      const processedStageItems = new Set();

      // Filter for output items (monitors, speakers, in-ears)
      const outputItems = stageItems.filter((item) =>
        ["In-Ear Monitors", "Floor Monitor", "PA Speaker"].includes(item.name)
      );

      // First, preserve existing outputs that still have corresponding stage items
      const existingOutputs = prevOutputs.filter((output) => {
        const stageItem = outputItems.find(
          (item) => item.id === output.stageItemId
        );
        if (stageItem) {
          processedStageItems.add(stageItem.id);
          return true; // Keep this output
        }
        return false; // Remove this output (stage item was deleted)
      });

      // Add existing outputs to the new list, preserving their data and order
      existingOutputs.forEach((output) => {
        newOutputs.push({ ...output });
      });

      // Now add new outputs for stage items that don't have outputs yet
      outputItems.forEach((item) => {
        if (!processedStageItems.has(item.id)) {
          const outputConfig = getOutputConfig(item.name);
          if (outputConfig) {
            const nextOutputNumber = newOutputs.length + 1;

            outputConfig.channels.forEach((channel, index) => {
              newOutputs.push({
                id: `${item.id}-${item.name}-${index}`,
                stageItemId: item.id,
                instrumentName: item.name,
                channel: channel,
                outputNumber: nextOutputNumber + index,
                name: `${item.name} ${channel}`,
                nickname: item.nickname || "",
                gearModel: "",
                notes: "",
                isStereo: outputConfig.isStereo,
                groupId: outputConfig.isGrouped
                  ? `${item.id}-${item.name}`
                  : null,
                isGrouped: outputConfig.isGrouped,
              });
            });
          }
        }
      });

      // Sort by output number to ensure proper order
      newOutputs.sort((a, b) => a.outputNumber - b.outputNumber);

      return newOutputs;
    });
  }, [stageItems]);

  // Sync nicknames from stage items to outputs
  useEffect(() => {
    setOutputs((prevOutputs) =>
      prevOutputs.map((output) => {
        const stageItem = stageItems.find(
          (item) => item.id === output.stageItemId
        );
        if (stageItem && stageItem.nickname !== output.nickname) {
          return { ...output, nickname: stageItem.nickname || "" };
        }
        return output;
      })
    );
  }, [stageItems]);

  const getOutputConfig = (instrumentName) => {
    const configs = {
      "In-Ear Monitors and Headphones": {
        channels: ["L", "R"],
        isStereo: true,
        isGrouped: true,
      },
      "Wedge Monitor": {
        channels: ["Monitor"],
        isStereo: false,
        isGrouped: false,
      },
      "FOH Speaker": {
        channels: ["L", "R"],
        isStereo: true,
        isGrouped: true,
      },
      Subwoofer: {
        channels: ["Sub"],
        isStereo: false,
        isGrouped: false,
      },
    };
    return configs[instrumentName];
  };

  const removeOutput = (outputId) => {
    setOutputs((prev) => {
      const outputToRemove = prev.find((output) => output.id === outputId);
      if (!outputToRemove) return prev;

      // Check if this is the last output for this instrument
      const remainingOutputsForInstrument = prev.filter(
        (output) =>
          output.id !== outputId &&
          output.stageItemId === outputToRemove.stageItemId
      );

      // If this is the last output for the instrument, remove it from stage
      if (remainingOutputsForInstrument.length === 0 && onRemoveFromStage) {
        onRemoveFromStage(outputToRemove.stageItemId);
      }

      const filtered = prev.filter((output) => output.id !== outputId);
      return filtered.map((output, index) => ({
        ...output,
        outputNumber: index + 1,
      }));
    });
  };

  // Reorder outputs by changing their output numbers
  const reorderOutputs = (newOrder) => {
    setOutputs((prev) => {
      const updated = [...prev];

      // Update output numbers based on new order
      newOrder.forEach((outputId, index) => {
        const output = updated.find((o) => o.id === outputId);
        if (output) {
          output.outputNumber = index + 1;
        }
      });

      // Sort by new output numbers
      return updated.sort((a, b) => a.outputNumber - b.outputNumber);
    });
  };

  // Handle manual output number changes
  const handleOutputNumberChange = (outputId, newNumber) => {
    const num = parseInt(newNumber);
    if (isNaN(num) || num < 1) return;

    setOutputs((prev) => {
      const updated = [...prev];
      const targetOutput = updated.find((output) => output.id === outputId);
      if (!targetOutput) return prev;

      const oldNumber = targetOutput.outputNumber;
      if (oldNumber === num) return prev;

      // If moving to a higher number, shift others down
      if (num > oldNumber) {
        updated.forEach((output) => {
          if (output.outputNumber > oldNumber && output.outputNumber <= num) {
            output.outputNumber--;
          }
        });
      } else {
        // If moving to a lower number, shift others up
        updated.forEach((output) => {
          if (output.outputNumber >= num && output.outputNumber < oldNumber) {
            output.outputNumber++;
          }
        });
      }

      targetOutput.outputNumber = num;
      return updated.sort((a, b) => a.outputNumber - b.outputNumber);
    });
  };

  const handleDragStart = (e, output) => {
    setDraggedOutput(output);
    setDraggedGroup(null);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };

  const handleGroupDragStart = (e, groupId) => {
    console.log("Output group drag start:", groupId);
    setDraggedGroup(groupId);
    setDraggedOutput(null);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e, targetOutput) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedOutput || !targetOutput) return;

    setOutputs((prev) => {
      // Remove the dragged output from its current position
      const filtered = prev.filter((output) => output.id !== draggedOutput.id);

      // Find the target output's position
      const targetIndex = filtered.findIndex(
        (output) => output.id === targetOutput.id
      );

      if (targetIndex !== -1) {
        // Insert at the target position
        const before = filtered.slice(0, targetIndex);
        const after = filtered.slice(targetIndex);
        const newOutput = { ...draggedOutput };
        const newOrder = [...before, newOutput, ...after].map(
          (output) => output.id
        );
        reorderOutputs(newOrder);
        return [...before, newOutput, ...after];
      } else {
        // Insert at the end
        const newOutput = { ...draggedOutput };
        const newOrder = [...filtered, newOutput].map((output) => output.id);
        reorderOutputs(newOrder);
        return [...filtered, newOutput];
      }
    });

    setDraggedOutput(null);
  };

  const handleGroupDrop = (e, targetGroupId) => {
    console.log("Output group drop:", draggedGroup, "->", targetGroupId);
    e.preventDefault();
    e.stopPropagation();
    if (!draggedGroup || !targetGroupId) return;

    setOutputs((prev) => {
      // Get all outputs from the dragged group
      const draggedGroupOutputs = prev.filter(
        (output) => output.groupId === draggedGroup
      );

      // Remove all outputs from the dragged group
      const filtered = prev.filter((output) => output.groupId !== draggedGroup);

      // Find the first output in the target group
      const targetGroupOutputs = filtered.filter(
        (output) => output.groupId === targetGroupId
      );
      let targetIndex = filtered.length; // Default to end

      if (targetGroupOutputs.length > 0) {
        targetIndex = filtered.findIndex(
          (output) => output.id === targetGroupOutputs[0].id
        );
      }

      // Insert all dragged group outputs at the target position
      const before = filtered.slice(0, targetIndex);
      const after = filtered.slice(targetIndex);
      const newOrder = [...before, ...draggedGroupOutputs, ...after].map(
        (output) => output.id
      );

      // Use the reorderOutputs function to properly update numbers
      reorderOutputs(newOrder);

      return [...before, ...draggedGroupOutputs, ...after];
    });

    setDraggedGroup(null);
  };

  const startEditing = (output) => {
    setEditingOutput({ ...output });
  };

  const saveEdit = () => {
    if (!editingOutput) return;

    setOutputs((prev) =>
      prev.map((output) =>
        output.id === editingOutput.id ? editingOutput : output
      )
    );

    // Update the stage item with the new nickname
    if (onOutputUpdate) {
      onOutputUpdate({
        stageItemId: editingOutput.stageItemId,
        nickname: editingOutput.nickname,
      });
    }

    setEditingOutput(null);
  };

  const handleFieldBlur = (e) => {
    // Don't auto-save on blur
  };

  const cancelEdit = () => {
    setEditingOutput(null);
  };

  // Group outputs by their groupId
  const groupedOutputs = outputs.reduce((groups, output) => {
    if (output.isGrouped && output.groupId) {
      if (!groups[output.groupId]) {
        groups[output.groupId] = [];
      }
      groups[output.groupId].push(output);
    } else {
      if (!groups.single) {
        groups.single = [];
      }
      groups.single.push(output);
    }
    return groups;
  }, {});

  if (outputs.length === 0) {
    return (
      <div className="output-list">
        <h3>Output List</h3>
        <p className="no-outputs">
          No outputs on stage yet. Add monitors, speakers, or in-ears to see
          outputs!
        </p>
      </div>
    );
  }

  return (
    <div className="output-list">
      <h3>Output List</h3>
      <div className="output-list-content">
        {Object.entries(groupedOutputs).map(([groupId, groupOutputs]) => (
          <div
            key={groupId}
            className={`output-group ${
              draggedGroup === groupId ? "dragging" : ""
            }`}
            draggable={groupOutputs.length > 1}
            onDragStart={(e) => {
              console.log(
                "Output group drag start triggered, length:",
                groupOutputs.length
              );
              if (groupOutputs.length > 1) {
                handleGroupDragStart(e, groupId);
              }
            }}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => {
              if (draggedGroup) {
                handleGroupDrop(e, groupId);
              } else if (draggedOutput) {
                // Find the first output in this group to drop on
                const firstOutput = groupOutputs[0];
                handleDrop(e, firstOutput);
              }
            }}
          >
            {groupOutputs.map((output) => (
              <div
                key={output.id}
                className={`output-item ${
                  draggedOutput?.id === output.id ? "dragging" : ""
                }`}
                draggable={groupOutputs.length === 1}
                onDragStart={(e) => {
                  if (groupOutputs.length === 1) {
                    handleDragStart(e, output);
                  }
                }}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, output)}
              >
                <div className="output-number">
                  <input
                    type="number"
                    min="1"
                    value={output.outputNumber}
                    onChange={(e) =>
                      handleOutputNumberChange(output.id, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{
                      width: "40px",
                      textAlign: "center",
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
                <div className="output-icon">
                  <span className="channel-label">{output.channel}</span>
                </div>
                <div className="output-details">
                  <div className="output-name">
                    {editingOutput?.id === output.id ? (
                      <input
                        type="text"
                        value={editingOutput.name}
                        onChange={(e) =>
                          setEditingOutput({
                            ...editingOutput,
                            name: e.target.value,
                          })
                        }
                        onBlur={handleFieldBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(output);
                        }}
                      >
                        {output.name}
                      </span>
                    )}
                  </div>
                  <div className="output-nickname">
                    {editingOutput?.id === output.id ? (
                      <input
                        type="text"
                        placeholder="Nickname (shows on stage)..."
                        value={editingOutput.nickname}
                        onChange={(e) =>
                          setEditingOutput({
                            ...editingOutput,
                            nickname: e.target.value,
                          })
                        }
                        onBlur={handleFieldBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                        }}
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(output);
                        }}
                        className={
                          output.nickname ? "has-nickname" : "no-nickname"
                        }
                      >
                        {output.nickname || "Click to add nickname..."}
                      </span>
                    )}
                  </div>
                  <div className="output-gear-model">
                    {editingOutput?.id === output.id ? (
                      <input
                        type="text"
                        placeholder="Gear/Model..."
                        value={editingOutput.gearModel}
                        onChange={(e) =>
                          setEditingOutput({
                            ...editingOutput,
                            gearModel: e.target.value,
                          })
                        }
                        onBlur={handleFieldBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                        }}
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(output);
                        }}
                        className={output.gearModel ? "has-gear" : "no-gear"}
                      >
                        {output.gearModel || "Click to add gear/model..."}
                      </span>
                    )}
                  </div>
                  <div className="output-notes">
                    {editingOutput?.id === output.id ? (
                      <input
                        type="text"
                        placeholder="Add notes..."
                        value={editingOutput.notes}
                        onChange={(e) =>
                          setEditingOutput({
                            ...editingOutput,
                            notes: e.target.value,
                          })
                        }
                        onBlur={handleFieldBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit();
                          }
                        }}
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(output);
                        }}
                        className={output.notes ? "has-notes" : "no-notes"}
                      >
                        {output.notes || "Click to add notes..."}
                      </span>
                    )}
                  </div>
                </div>
                <div className="output-actions">
                  <button
                    className="delete-output-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOutput(output.id);
                    }}
                    title="Delete output"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutputList;
