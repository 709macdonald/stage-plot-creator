import React, { useState } from "react";

function InstrumentPalette({ categories, selectedInstrument, onSelect }) {
  const [openCategory, setOpenCategory] = useState(null);

  const handleToggle = (catName) => {
    setOpenCategory((prev) => (prev === catName ? null : catName));
  };

  return (
    <div className="instrument-palette">
      <span style={{ marginRight: 8 }}>
        Click a category to expand, then select an instrument:
      </span>
      {categories.map((cat) => (
        <div key={cat.name} className="instrument-category">
          <div
            className="instrument-category-header"
            onClick={() => handleToggle(cat.name)}
            tabIndex={0}
            role="button"
            aria-expanded={openCategory === cat.name}
          >
            <span>{cat.name}</span>
            <span style={{ fontSize: 18 }}>
              {openCategory === cat.name ? "▲" : "▼"}
            </span>
          </div>
          {openCategory === cat.name && (
            <div className="instrument-category-items">
              {cat.items.map((inst) => (
                <button
                  key={inst.name}
                  onClick={() => onSelect(inst)}
                  className={
                    "instrument-btn" +
                    (selectedInstrument && selectedInstrument.name === inst.name
                      ? " selected"
                      : "")
                  }
                >
                  {inst.icon}
                  <span>{inst.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default InstrumentPalette;
