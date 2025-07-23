import React from "react";

function Stage({
  stageItems,
  onStageClick,
  onIconMouseDown,
  stageRef,
  selectedInstrument,
  onResizeMouseDown,
  onDeleteIcon,
  selectedStageItemId,
}) {
  return (
    <div
      ref={stageRef}
      className="stage-area"
      style={{
        width: 600,
        height: 400,
        border: "2px solid #404040",
        borderRadius: 16,
        position: "relative",
        background: "#ffffff",
        margin: "0 auto",
        overflow: "hidden",
        cursor: selectedInstrument ? "crosshair" : "pointer",
      }}
      onClick={onStageClick}
    >
      {stageItems.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x - (item.size || 32) / 2,
            top: item.y - (item.size || 32) / 2,
            cursor: "grab",
            userSelect: "none",
            fontSize: 0,
            zIndex: 1,
          }}
          onMouseDown={(e) => onIconMouseDown(e, item.id)}
        >
          {/* Only show controls if this item is selected */}
          {selectedStageItemId === item.id && (
            <>
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteIcon(item.id);
                }}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "none",
                  background: "#ff4d4f",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  zIndex: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
                title="Delete"
                tabIndex={-1}
              >
                ×
              </button>
              {/* Resize handle */}
              <div
                onMouseDown={(e) => onResizeMouseDown(e, item.id)}
                style={{
                  position: "absolute",
                  right: -7,
                  bottom: -7,
                  width: 14,
                  height: 14,
                  background: "#007acc",
                  borderRadius: 3,
                  border: "2px solid #ffffff",
                  cursor: "nwse-resize",
                  zIndex: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Resize"
                tabIndex={-1}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  style={{ display: "block" }}
                >
                  <polyline
                    points="2,8 8,8 8,2"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </>
          )}
          {/* Icon itself */}
          <span
            style={{
              display: "inline-block",
              width: item.size || 32,
              height: item.size || 32,
              fontSize: item.size || 32,
              verticalAlign: "middle",
              pointerEvents: "none",
            }}
          >
            {React.cloneElement(item.icon, {
              style: {
                width: item.size || 32,
                height: item.size || 32,
                display: "block",
              },
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Stage;
