import React from "react";

function Stage({
  stageItems,
  onStageClick,
  onIconMouseDown,
  stageRef,
  selectedInstrument,
  onResizeMouseDown,
  onRotateMouseDown,
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
          data-item-id={item.id}
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
              {/* Rotate handle */}
              <div
                onMouseDown={(e) => onRotateMouseDown(e, item.id)}
                style={{
                  position: "absolute",
                  left: -7,
                  bottom: -7,
                  width: 14,
                  height: 14,
                  background: "#28a745",
                  borderRadius: 3,
                  border: "2px solid #ffffff",
                  cursor: "grab",
                  zIndex: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Rotate"
                tabIndex={-1}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  style={{ display: "block" }}
                >
                  <path
                    d="M8,2 C8,2 7,1 5,1 C3,1 2,2 2,3 C2,4 3,5 5,5 C6,5 7,4 7,3"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <polygon points="7,3 8,2 7,1" fill="#fff" />
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
              transform: `rotate(${item.rotation || 0}deg)`,
              transformOrigin: "center center",
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

          {/* Nickname display */}
          {item.nickname && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: 4,
                fontSize: Math.max(10, (item.size || 32) * 0.25),
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                textShadow: "1px 1px 2px rgba(255,255,255,0.8)",
                zIndex: 1,
              }}
            >
              {item.nickname}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Stage;
