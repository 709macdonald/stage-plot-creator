import React, { useState } from "react";
import "./EditableItem.css";

const EditableItem = ({ item, onUpdate, onRemoveFromStage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nickname: item.nickname || "",
    gearModel: item.gearModel || "",
    notes: item.notes || "",
  });

  const startEditing = () => {
    setIsEditing(true);
    setEditData({
      nickname: item.nickname || "",
      gearModel: item.gearModel || "",
      notes: item.notes || "",
    });
  };

  const saveEdit = () => {
    onUpdate({
      ...item,
      ...editData,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      nickname: item.nickname || "",
      gearModel: item.gearModel || "",
      notes: item.notes || "",
    });
  };

  const handleFieldChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldBlur = () => {
    // Don't auto-save on blur, let user explicitly save
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="editable-item editing">
        <div className="editable-item-icon">
          {React.cloneElement(item.icon, {
            style: { width: 24, height: 24 },
          })}
        </div>
        <div className="editable-item-fields">
          <div className="editable-field">
            <label>Name:</label>
            <span className="item-name">{item.name}</span>
          </div>
          <div className="editable-field">
            <label>Nickname:</label>
            <input
              type="text"
              value={editData.nickname}
              onChange={(e) => handleFieldChange("nickname", e.target.value)}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter nickname"
            />
          </div>
          <div className="editable-field">
            <label>Gear/Model:</label>
            <input
              type="text"
              value={editData.gearModel}
              onChange={(e) => handleFieldChange("gearModel", e.target.value)}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter gear/model"
            />
          </div>
          <div className="editable-field">
            <label>Notes:</label>
            <textarea
              value={editData.notes}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              onBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              placeholder="Enter notes"
              rows="2"
            />
          </div>
        </div>
        <div className="editable-item-actions">
          <button className="save-btn" onClick={saveEdit} title="Save changes">
            ✓
          </button>
          <button className="cancel-btn" onClick={cancelEdit} title="Cancel">
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editable-item" onClick={startEditing}>
      <div className="editable-item-icon">
        {React.cloneElement(item.icon, {
          style: { width: 24, height: 24 },
        })}
      </div>
      <div className="editable-item-info">
        <div className="editable-item-name">{item.name}</div>
        {item.nickname && (
          <div className="editable-item-nickname">{item.nickname}</div>
        )}
        {item.gearModel && (
          <div className="editable-item-gear">Gear: {item.gearModel}</div>
        )}
        {item.notes && (
          <div className="editable-item-notes">Notes: {item.notes}</div>
        )}
      </div>
      <button
        className="delete-item-btn"
        onClick={(e) => {
          e.stopPropagation();
          onRemoveFromStage(item.id);
        }}
        title="Delete from stage"
      >
        ×
      </button>
    </div>
  );
};

export default EditableItem;
