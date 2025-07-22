import React from "react";

function InstrumentPalette({ instruments, selectedInstrument, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ marginRight: 8 }}>
        Click an instrument, then click on the stage to place it:
      </span>
      {instruments.map((inst) => (
        <button
          key={inst.name}
          onClick={() => onSelect(inst)}
          style={{
            marginRight: 8,
            fontSize: 24,
            cursor: "pointer",
            background:
              selectedInstrument && selectedInstrument.name === inst.name
                ? "#d0eaff"
                : "",
            border:
              selectedInstrument && selectedInstrument.name === inst.name
                ? "2px solid #3399ff"
                : "",
          }}
        >
          {inst.icon} {inst.name}
        </button>
      ))}
    </div>
  );
}

export default InstrumentPalette;
