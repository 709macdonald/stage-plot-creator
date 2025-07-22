import { useState, useRef } from "react";
import "./App.css";
import InstrumentPalette from "./components/InstrumentPalette.jsx";
import Stage from "./components/Stage.jsx";

const INSTRUMENTS = [
  { name: "Guitar", icon: "🎸" },
  { name: "Vocals", icon: "🎤" },
  { name: "Bass", icon: "🎻" },
  { name: "Drums", icon: "🥁" },
];

function App() {
  const [stageItems, setStageItems] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const stageRef = useRef(null);

  // Drag state refs for moving icons
  const draggedIdRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

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
    draggedIdRef.current = id;
    const item = stageItems.find((item) => item.id === id);
    dragOffsetRef.current = {
      x: e.clientX - item.x,
      y: e.clientY - item.y,
    };
    window.addEventListener("mousemove", handleIconMove);
    window.addEventListener("mouseup", handleIconUp);
  };

  // Move existing icon
  const handleIconMove = (e) => {
    setStageItems((items) =>
      items.map((item) =>
        item.id === draggedIdRef.current
          ? {
              ...item,
              x: e.clientX - dragOffsetRef.current.x,
              y: e.clientY - dragOffsetRef.current.y,
            }
          : item
      )
    );
  };

  // Drop existing icon
  const handleIconUp = () => {
    draggedIdRef.current = null;
    dragOffsetRef.current = { x: 0, y: 0 };
    window.removeEventListener("mousemove", handleIconMove);
    window.removeEventListener("mouseup", handleIconUp);
  };

  return (
    <div className="app-container" style={{ padding: 32 }}>
      <h1>Stage Plot Creator</h1>
      <InstrumentPalette
        instruments={INSTRUMENTS}
        selectedInstrument={selectedInstrument}
        onSelect={handlePaletteClick}
      />
      <Stage
        stageItems={stageItems}
        onStageClick={handleStageClick}
        onIconMouseDown={handleIconMouseDown}
        stageRef={stageRef}
        selectedInstrument={selectedInstrument}
      />
      <p style={{ marginTop: 16, color: "#666" }}>
        Click an instrument from the palette, then click on the stage to place
        it. To move an icon, just drag it. Only one action at a time.
      </p>
    </div>
  );
}

export default App;
