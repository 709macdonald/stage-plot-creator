import React, { useState, useEffect } from "react";
import "./InputList.css";

const InputList = ({ stageItems, onInputUpdate, onRemoveFromStage }) => {
  const [inputs, setInputs] = useState([]);
  const [editingInput, setEditingInput] = useState(null);
  const [draggedInput, setDraggedInput] = useState(null);
  const [draggedGroup, setDraggedGroup] = useState(null);

  // Generate inputs based on stage items
  useEffect(() => {
    setInputs((prevInputs) => {
      const newInputs = [];
      let inputNumber = 1;
      const processedStageItems = new Set();

      // First, preserve existing inputs that still have corresponding stage items
      const existingInputs = prevInputs.filter((input) => {
        const stageItem = stageItems.find(
          (item) => item.id === input.stageItemId
        );
        if (stageItem) {
          processedStageItems.add(stageItem.id);
          return true; // Keep this input
        }
        return false; // Remove this input (stage item was deleted)
      });

      // Add existing inputs to the new list, preserving their data
      existingInputs.forEach((input) => {
        newInputs.push({
          ...input,
          inputNumber: inputNumber++,
        });
      });

      // Now add new inputs for stage items that don't have inputs yet
      stageItems.forEach((item) => {
        if (!processedStageItems.has(item.id)) {
          const inputConfig = getInputConfig(item.name);
          if (inputConfig) {
            const groupId = `${item.id}-${item.name}`;

            inputConfig.channels.forEach((channel, index) => {
              newInputs.push({
                id: `${groupId}-${index}`,
                stageItemId: item.id,
                instrumentName: item.name,
                channel: channel,
                inputNumber: inputNumber++,
                name: `${item.name} ${channel}`,
                nickname: "",
                gearModel: "",
                notes: "",
                isStereo: inputConfig.isStereo,
                groupId: inputConfig.isGrouped ? groupId : null,
                isGrouped: inputConfig.isGrouped,
                canToggleStereo: inputConfig.canToggleStereo,
                isNaturalMultiInput: inputConfig.isGrouped,
              });
            });
          }
        }
      });

      return newInputs;
    });
  }, [stageItems]);

  const getInputConfig = (instrumentName) => {
    const configs = {
      Keyboard: {
        channels: ["L", "R"],
        isStereo: true,
        isGrouped: true,
        canToggleStereo: true,
      },
      "Grand Piano": {
        channels: ["L", "R"],
        isStereo: true,
        isGrouped: true,
        canToggleStereo: true,
      },
      "Drum Kit": {
        channels: [
          "Kick",
          "Snare",
          "Hi-Hat",
          "Tom 1",
          "Tom 2",
          "Overhead L",
          "Overhead R",
        ],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: false,
      },
      "Shure 57": {
        channels: ["Mic"],
        isStereo: false,
        isGrouped: false,
        canToggleStereo: false,
      },
      "Shure 58": {
        channels: ["Mic"],
        isStereo: false,
        isGrouped: false,
        canToggleStereo: false,
      },
      "DI Box": {
        channels: ["DI"],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: true,
      },
      "FX Unit": {
        channels: ["FX"],
        isStereo: false,
        isGrouped: false,
        canToggleStereo: false,
      },
      "Bass Guitar": {
        channels: ["Bass"],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: true,
      },
      "Jazz Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: true,
      },
      "Electric Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: true,
      },
      "Acoustic Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: true,
        canToggleStereo: true,
      },
      Saxophone: {
        channels: ["Mic"],
        isStereo: false,
        isGrouped: false,
        canToggleStereo: false,
      },
    };
    return configs[instrumentName];
  };

  const removeInput = (inputId) => {
    // Save any current edit before removing input
    if (editingInput) {
      saveEdit();
    }

    setInputs((prev) => {
      const inputToRemove = prev.find((input) => input.id === inputId);
      if (!inputToRemove) return prev;

      // Check if this is the last input for this instrument
      const remainingInputsForInstrument = prev.filter(
        (input) =>
          input.id !== inputId &&
          input.stageItemId === inputToRemove.stageItemId
      );

      // If this is the last input for the instrument, remove it from stage
      if (remainingInputsForInstrument.length === 0 && onRemoveFromStage) {
        onRemoveFromStage(inputToRemove.stageItemId);
      }

      const filtered = prev.filter((input) => input.id !== inputId);
      return filtered.map((input, index) => ({
        ...input,
        inputNumber: index + 1,
      }));
    });
  };

  const addChannelToGroup = (groupId) => {
    // Save any current edit before adding channel
    if (editingInput) {
      saveEdit();
    }

    setInputs((prev) => {
      const groupInputs = prev.filter((input) => input.groupId === groupId);
      if (groupInputs.length === 0) return prev;

      const firstInput = groupInputs[0];
      const existingChannels = groupInputs.map((input) => input.channel);

      // Determine the next channel name based on instrument type
      let newChannel;
      if (firstInput.instrumentName === "Drum Kit") {
        // For drums, add numbered channels
        const drumChannels = [
          "Kick",
          "Snare",
          "Hi-Hat",
          "Tom 1",
          "Tom 2",
          "Overhead L",
          "Overhead R",
        ];
        const usedDrumChannels = existingChannels.filter((ch) =>
          drumChannels.includes(ch)
        );
        const availableChannels = drumChannels.filter(
          (ch) => !usedDrumChannels.includes(ch)
        );
        newChannel =
          availableChannels[0] || `Extra ${existingChannels.length + 1}`;
      } else if (
        firstInput.instrumentName === "Keyboard" ||
        firstInput.instrumentName === "Grand Piano"
      ) {
        // For keyboards, add C (Center) for LCR, or numbered channels
        if (!existingChannels.includes("C")) {
          newChannel = "C";
        } else {
          newChannel = `Extra ${existingChannels.length + 1}`;
        }
      } else {
        // For other instruments, just add numbered channels
        newChannel = `Extra ${existingChannels.length + 1}`;
      }

      const newInput = {
        id: `${firstInput.stageItemId}-${firstInput.instrumentName}-${newChannel}`,
        stageItemId: firstInput.stageItemId,
        instrumentName: firstInput.instrumentName,
        channel: newChannel,
        inputNumber: prev.length + 1,
        name: `${firstInput.instrumentName} ${newChannel}`,
        nickname: "",
        gearModel: "",
        notes: "",
        isStereo: firstInput.isStereo,
        groupId: groupId,
        isGrouped: true,
        canToggleStereo: firstInput.canToggleStereo,
      };

      return [...prev, newInput].map((input, index) => ({
        ...input,
        inputNumber: index + 1,
      }));
    });
  };

  const toggleStereo = (groupId) => {
    setInputs((prev) => {
      const groupInputs = prev.filter((input) => input.groupId === groupId);
      if (groupInputs.length === 2) {
        // Convert to mono - keep only first input
        return prev
          .filter((input) => input.id !== groupInputs[1].id)
          .map((input, index) => ({ ...input, inputNumber: index + 1 }));
      } else {
        // Convert to stereo - add second channel
        const firstInput = groupInputs[0];
        const newInput = {
          ...firstInput,
          id: `${firstInput.stageItemId}-${firstInput.instrumentName}-1`,
          channel: "R",
          inputNumber: firstInput.inputNumber + 1,
          name: `${firstInput.instrumentName} R`,
          isGrouped: true,
        };
        return [...prev, newInput].map((input, index) => ({
          ...input,
          inputNumber: index + 1,
        }));
      }
    });
  };

  const toggleInputStereo = (inputId) => {
    // Save any current edit before toggling stereo
    if (editingInput) {
      saveEdit();
    }

    setInputs((prev) => {
      const input = prev.find((i) => i.id === inputId);
      if (!input) return prev;

      // Check if this input is part of a stereo pair
      const stereoPair = prev.filter(
        (i) =>
          i.stageItemId === input.stageItemId &&
          i.instrumentName === input.instrumentName
      );

      if (stereoPair.length === 2) {
        // Convert to mono - keep only this input
        const otherInput = stereoPair.find((i) => i.id !== inputId);
        return prev
          .filter((i) => i.id !== otherInput.id)
          .map((i, index) => ({ ...i, inputNumber: index + 1 }));
      } else {
        // Convert to stereo - add second channel and group them
        const newChannel = input.channel === "L" ? "R" : "L";
        const newInput = {
          ...input,
          id: `${input.stageItemId}-${input.instrumentName}-${newChannel}`,
          channel: newChannel,
          inputNumber: input.inputNumber + 1,
          name: `${input.instrumentName} ${newChannel}`,
          isGrouped: true, // Always group stereo pairs
          groupId: `${input.stageItemId}-${input.instrumentName}`,
          isNaturalMultiInput: input.isNaturalMultiInput,
        };
        return [...prev, newInput].map((i, index) => ({
          ...i,
          inputNumber: index + 1,
        }));
      }
    });
  };

  const handleDragStart = (e, input) => {
    // Save any current edit before starting drag
    if (editingInput) {
      saveEdit();
    }
    setDraggedInput(input);
    setDraggedGroup(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleGroupDragStart = (e, groupId) => {
    // Save any current edit before starting group drag
    if (editingInput) {
      saveEdit();
    }
    setDraggedGroup(groupId);
    setDraggedInput(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    // No longer needed
  };

  const handleDrop = (e, targetInput) => {
    e.preventDefault();
    if (!draggedInput || !targetInput) return;

    setInputs((prev) => {
      // Remove the dragged input from its current position
      const filtered = prev.filter((input) => input.id !== draggedInput.id);

      // Find the target input's position
      const targetIndex = filtered.findIndex(
        (input) => input.id === targetInput.id
      );

      if (targetIndex !== -1) {
        // Insert at the target position
        const before = filtered.slice(0, targetIndex);
        const after = filtered.slice(targetIndex);
        const newInput = { ...draggedInput };
        return [...before, newInput, ...after].map((input, index) => ({
          ...input,
          inputNumber: index + 1,
        }));
      } else {
        // Insert at the end
        const newInput = { ...draggedInput };
        return [...filtered, newInput].map((input, index) => ({
          ...input,
          inputNumber: index + 1,
        }));
      }
    });

    setDraggedInput(null);
  };

  const handleGroupDrop = (e, targetGroupId) => {
    e.preventDefault();
    if (!draggedGroup || !targetGroupId) return;

    setInputs((prev) => {
      // Get all inputs from the dragged group
      const draggedGroupInputs = prev.filter(
        (input) => input.groupId === draggedGroup
      );

      // Remove all inputs from the dragged group
      const filtered = prev.filter((input) => input.groupId !== draggedGroup);

      // Find the first input in the target group
      const targetGroupInputs = filtered.filter(
        (input) => input.groupId === targetGroupId
      );
      let targetIndex = filtered.length; // Default to end

      if (targetGroupInputs.length > 0) {
        targetIndex = filtered.findIndex(
          (input) => input.id === targetGroupInputs[0].id
        );
      }

      // Insert all dragged group inputs at the target position
      const before = filtered.slice(0, targetIndex);
      const after = filtered.slice(targetIndex);

      return [...before, ...draggedGroupInputs, ...after].map(
        (input, index) => ({
          ...input,
          inputNumber: index + 1,
        })
      );
    });

    setDraggedGroup(null);
  };

  const startEditing = (input) => {
    // Only start editing if we're not already editing this input
    if (editingInput?.id !== input.id) {
      setEditingInput({ ...input });
    }
  };

  const saveEdit = () => {
    if (editingInput) {
      setInputs((prev) =>
        prev.map((input) =>
          input.id === editingInput.id ? editingInput : input
        )
      );
      setEditingInput(null);
    }
  };

  const handleFieldBlur = (e) => {
    // Don't auto-save on blur - let user control when to save
    // This prevents the immediate exit when clicking on input fields
  };

  const cancelEdit = () => {
    setEditingInput(null);
  };

  const groupedInputs = inputs.reduce((groups, input) => {
    // Group instruments that naturally have multiple inputs OR are stereo pairs
    if (input.isGrouped) {
      if (!groups[input.groupId]) {
        groups[input.groupId] = [];
      }
      groups[input.groupId].push(input);
    } else {
      // Single input, not grouped
      groups[input.id] = [input];
    }
    return groups;
  }, {});

  const isStereoPair = (input) => {
    const stereoPair = inputs.filter(
      (i) =>
        i.stageItemId === input.stageItemId &&
        i.instrumentName === input.instrumentName
    );
    return stereoPair.length === 2;
  };

  return (
    <div
      className="input-list"
      onClick={(e) => {
        // Only save if clicking directly on the container, not on any child elements
        if (e.target === e.currentTarget) {
          saveEdit();
        }
      }}
    >
      <h2>Input List</h2>
      <div
        className="input-list-content"
        onClick={(e) => {
          // Only save if clicking directly on the content area, not on any child elements
          if (e.target === e.currentTarget) {
            saveEdit();
          }
        }}
      >
        {inputs.length === 0 ? (
          <p className="no-inputs">
            No inputs yet. Add instruments to the stage!
          </p>
        ) : (
          <div className="input-items">
            {Object.entries(groupedInputs).map(([groupId, groupInputs]) => (
              <div
                key={groupId}
                className={`input-group ${
                  draggedGroup === groupId ? "dragging" : ""
                }`}
                draggable={groupInputs.length > 1}
                onDragStart={(e) =>
                  groupInputs.length > 1 && handleGroupDragStart(e, groupId)
                }
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => {
                  if (draggedGroup) {
                    handleGroupDrop(e, groupId);
                  } else if (draggedInput) {
                    // Find the first input in this group to drop on
                    const firstInput = groupInputs[0];
                    handleDrop(e, firstInput);
                  }
                }}
              >
                {groupInputs.length > 1 && (
                  <div className="group-header">
                    <span className="group-name">
                      {groupInputs[0].instrumentName}
                    </span>
                    <button
                      className="add-channel-btn"
                      onClick={() => addChannelToGroup(groupId)}
                      title="Add channel to group"
                    >
                      +
                    </button>
                  </div>
                )}
                {groupInputs.map((input) => (
                  <div
                    key={input.id}
                    className={`input-item ${
                      draggedInput?.id === input.id ? "dragging" : ""
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, input)}
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, input)}
                  >
                    <div className="input-number">{input.inputNumber}</div>
                    <div className="input-icon">
                      <span className="channel-label">{input.channel}</span>
                    </div>
                    <div className="input-details">
                      <div className="input-name">
                        {editingInput?.id === input.id ? (
                          <input
                            type="text"
                            value={editingInput.name}
                            onChange={(e) =>
                              setEditingInput({
                                ...editingInput,
                                name: e.target.value,
                              })
                            }
                            onBlur={handleFieldBlur}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
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
                              startEditing(input);
                            }}
                          >
                            {input.name}
                          </span>
                        )}
                      </div>
                      <div className="input-nickname">
                        {editingInput?.id === input.id ? (
                          <input
                            type="text"
                            placeholder="Nickname (shows on stage)..."
                            value={editingInput.nickname}
                            onChange={(e) =>
                              setEditingInput({
                                ...editingInput,
                                nickname: e.target.value,
                              })
                            }
                            onBlur={handleFieldBlur}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
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
                              startEditing(input);
                            }}
                            className={
                              input.nickname ? "has-nickname" : "no-nickname"
                            }
                          >
                            {input.nickname || "Click to add nickname..."}
                          </span>
                        )}
                      </div>
                      <div className="input-gear-model">
                        {editingInput?.id === input.id ? (
                          <input
                            type="text"
                            placeholder="Gear/Model..."
                            value={editingInput.gearModel}
                            onChange={(e) =>
                              setEditingInput({
                                ...editingInput,
                                gearModel: e.target.value,
                              })
                            }
                            onBlur={handleFieldBlur}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
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
                              startEditing(input);
                            }}
                            className={input.gearModel ? "has-gear" : "no-gear"}
                          >
                            {input.gearModel || "Click to add gear/model..."}
                          </span>
                        )}
                      </div>
                      <div className="input-notes">
                        {editingInput?.id === input.id ? (
                          <input
                            type="text"
                            placeholder="Add notes..."
                            value={editingInput.notes}
                            onChange={(e) =>
                              setEditingInput({
                                ...editingInput,
                                notes: e.target.value,
                              })
                            }
                            onBlur={handleFieldBlur}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
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
                              startEditing(input);
                            }}
                            className={input.notes ? "has-notes" : "no-notes"}
                          >
                            {input.notes || "Click to add notes..."}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="input-actions">
                      {input.canToggleStereo && groupInputs.length <= 2 && (
                        <button
                          className="stereo-toggle-small"
                          onClick={() => toggleInputStereo(input.id)}
                          title={
                            isStereoPair(input)
                              ? "Convert to Mono"
                              : "Convert to Stereo"
                          }
                        >
                          {isStereoPair(input) ? "S" : "M"}
                        </button>
                      )}
                      <button
                        className="remove-input"
                        onClick={() => removeInput(input.id)}
                        title="Remove input"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputList;
