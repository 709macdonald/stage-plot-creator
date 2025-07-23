import React, { useState, useEffect } from "react";
import "./InputList.css";

const InputList = ({ stageItems, onInputUpdate }) => {
  const [inputs, setInputs] = useState([]);
  const [editingInput, setEditingInput] = useState(null);
  const [draggedInput, setDraggedInput] = useState(null);
  const [dragOverGroup, setDragOverGroup] = useState(null);

  // Generate inputs based on stage items
  useEffect(() => {
    const newInputs = [];
    let inputNumber = 1;

    stageItems.forEach((item) => {
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
            notes: "",
            isStereo: inputConfig.isStereo,
            groupId: groupId,
            isGrouped: inputConfig.isGrouped,
          });
        });
      }
    });

    setInputs(newInputs);
  }, [stageItems]);

  const getInputConfig = (instrumentName) => {
    const configs = {
      Keyboard: { channels: ["L", "R"], isStereo: true, isGrouped: true },
      "Grand Piano": { channels: ["L", "R"], isStereo: true, isGrouped: true },
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
      },
      "Shure 57": { channels: ["Mic"], isStereo: false, isGrouped: false },
      "Shure 58": { channels: ["Mic"], isStereo: false, isGrouped: false },
      "DI Box": { channels: ["DI"], isStereo: false, isGrouped: false },
      "FX Unit": { channels: ["FX"], isStereo: false, isGrouped: false },
      "Bass Guitar": { channels: ["Bass"], isStereo: false, isGrouped: false },
      "Jazz Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: false,
      },
      "Electric Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: false,
      },
      "Acoustic Guitar": {
        channels: ["Guitar"],
        isStereo: false,
        isGrouped: false,
      },
      Saxophone: { channels: ["Mic"], isStereo: false, isGrouped: false },
    };
    return configs[instrumentName];
  };

  const removeInput = (inputId) => {
    setInputs((prev) => prev.filter((input) => input.id !== inputId));
    // Renumber remaining inputs
    setInputs((prev) =>
      prev.map((input, index) => ({ ...input, inputNumber: index + 1 }))
    );
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
        // Convert to stereo - add second channel
        const newInput = {
          ...input,
          id: `${input.stageItemId}-${input.instrumentName}-1`,
          channel: input.channel === "L" ? "R" : "L",
          inputNumber: input.inputNumber + 1,
          name: `${input.instrumentName} ${input.channel === "L" ? "R" : "L"}`,
          isGrouped: true,
          groupId: `${input.stageItemId}-${input.instrumentName}`,
        };
        return [...prev, newInput].map((i, index) => ({
          ...i,
          inputNumber: index + 1,
        }));
      }
    });
  };

  const handleDragStart = (e, input) => {
    setDraggedInput(input);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, groupId) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = () => {
    setDragOverGroup(null);
  };

  const handleDrop = (e, targetGroupId) => {
    e.preventDefault();
    if (!draggedInput) return;

    setInputs((prev) => {
      // Remove the dragged input from its current position
      const filtered = prev.filter((input) => input.id !== draggedInput.id);

      // Find the target group and insert the input
      const targetGroupIndex = filtered.findIndex(
        (input) => input.groupId === targetGroupId
      );

      if (targetGroupIndex !== -1) {
        // Insert into the middle of the group
        const before = filtered.slice(0, targetGroupIndex);
        const after = filtered.slice(targetGroupIndex);
        const newInput = {
          ...draggedInput,
          groupId: targetGroupId,
          isGrouped: true,
        };
        return [...before, newInput, ...after].map((input, index) => ({
          ...input,
          inputNumber: index + 1,
        }));
      } else {
        // Insert at the end
        const newInput = {
          ...draggedInput,
          groupId: targetGroupId,
          isGrouped: true,
        };
        return [...filtered, newInput].map((input, index) => ({
          ...input,
          inputNumber: index + 1,
        }));
      }
    });

    setDraggedInput(null);
    setDragOverGroup(null);
  };

  const startEditing = (input) => {
    setEditingInput({ ...input });
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

  const cancelEdit = () => {
    setEditingInput(null);
  };

  const groupedInputs = inputs.reduce((groups, input) => {
    if (input.isGrouped) {
      if (!groups[input.groupId]) {
        groups[input.groupId] = [];
      }
      groups[input.groupId].push(input);
    } else {
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
    <div className="input-list">
      <h2>Input List</h2>
      <div className="input-list-content">
        {inputs.length === 0 ? (
          <p className="no-inputs">
            No inputs yet. Add instruments to the stage!
          </p>
        ) : (
          <div className="input-items">
            {Object.entries(groupedInputs).map(([groupId, groupInputs]) => (
              <div key={groupId} className="input-group">
                {groupInputs.length > 1 && (
                  <div className="group-header">
                    <span className="group-name">
                      {groupInputs[0].instrumentName}
                    </span>
                    <button
                      className="stereo-toggle"
                      onClick={() => toggleStereo(groupId)}
                      title={
                        groupInputs.length === 2
                          ? "Convert to Mono"
                          : "Convert to Stereo"
                      }
                    >
                      {groupInputs.length === 2 ? "STEREO" : "MONO"}
                    </button>
                  </div>
                )}
                {groupInputs.map((input) => (
                  <div key={input.id} className="input-item">
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
                            onBlur={saveEdit}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <span onClick={() => startEditing(input)}>
                            {input.name}
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
                            onBlur={saveEdit}
                            onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          />
                        ) : (
                          <span
                            onClick={() => startEditing(input)}
                            className={input.notes ? "has-notes" : "no-notes"}
                          >
                            {input.notes || "Click to add notes..."}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="remove-input"
                      onClick={() => removeInput(input.id)}
                      title="Remove input"
                    >
                      ×
                    </button>
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
