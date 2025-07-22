import React from "react";

function InstrumentPalette({ categories, selectedInstrument, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{ marginRight: 8 }}>
        Click an instrument, then click on the stage to place it:
      </span>
      {categories.map((cat) => (
        <div key={cat.name} style={{ marginTop: 16 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{cat.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cat.items.map((inst) => (
              <button
                key={inst.name}
                onClick={() => onSelect(inst)}
                style={{
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
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0.5em 1em",
                }}
              >
                {inst.icon}
                <span>{inst.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InstrumentPalette;
