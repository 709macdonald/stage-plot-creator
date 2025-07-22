import React from "react";

function Stage({
  stageItems,
  onStageClick,
  onIconMouseDown,
  stageRef,
  selectedInstrument,
}) {
  return (
    <div
      ref={stageRef}
      className="stage-area"
      style={{
        width: 600,
        height: 400,
        border: "2px solid #333",
        borderRadius: 16,
        position: "relative",
        background: "#f7f7f7",
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
            left: item.x - 24,
            top: item.y - 24,
            cursor: "grab",
            fontSize: 48,
            userSelect: "none",
          }}
          onMouseDown={(e) => onIconMouseDown(e, item.id)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

export default Stage;
