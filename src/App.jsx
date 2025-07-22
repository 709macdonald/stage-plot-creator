import { useState, useRef } from "react";
import "./App.css";

const INSTRUMENTS = [
  { name: "Guitar", icon: "🎸" },
  { name: "Vocals", icon: "🎤" },
  { name: "Bass", icon: "🎻" },
  { name: "Drums", icon: "🥁" },
];

function App() {
  const [stageItems, setStageItems] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const stageRef = useRef(null);

  // Click an instrument to select it
  const handlePaletteClick = (inst) => {
    setSelectedInstrument(inst);
  };

  // Click on the stage to place the selected instrument
  const handleStageClick = (e) => {
    if (!selectedInstrument || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStageItems((items) => [
      ...items,
      {
        id: Date.now(),
        ...selectedInstrument,
        x,
        y,
      },
    ]);
    setSelectedInstrument(null);
  };

  // Start dragging an existing icon
  const handleIconMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggedId(id);
    const item = stageItems.find((item) => item.id === id);
    setDragOffset({
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    });
    window.addEventListener("mousemove", handleIconMove);
    window.addEventListener("mouseup", handleIconUp);
  };

  // Move existing icon
  const handleIconMove = (e) => {
    setStageItems((items) =>
      items.map((item) =>
        item.id === draggedId
          ? {
              ...item,
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            }
          : item
      )
    );
  };

  // Drop existing icon
  const handleIconUp = () => {
    setDraggedId(null);
    window.removeEventListener("mousemove", handleIconMove);
    window.removeEventListener("mouseup", handleIconUp);
  };

  return (
    <div className="app-container" style={{ padding: 32 }}>
      <h1>Stage Plot Creator</h1>
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginRight: 8 }}>
          Click an instrument, then click on the stage to place it:
        </span>
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.name}
            onClick={() => handlePaletteClick(inst)}
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
          cursor: selectedInstrument
            ? "crosshair"
            : draggedId
            ? "grabbing"
            : "pointer",
        }}
        onClick={handleStageClick}
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
              zIndex: draggedId === item.id ? 2 : 1,
              transition: draggedId === item.id ? "none" : "box-shadow 0.2s",
              boxShadow: draggedId === item.id ? "0 4px 16px #aaa" : "none",
            }}
            onMouseDown={(e) => handleIconMouseDown(e, item.id)}
          >
            {item.icon}
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, color: "#666" }}>
        Click an instrument from the palette, then click on the stage to place
        it. To move an icon, just drag it. Only one action at a time.
      </p>
    </div>
  );
}

export default App;
