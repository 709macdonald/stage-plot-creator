import { useState, useRef } from "react";
import "./App.css";
import InstrumentPalette from "./components/InstrumentPalette.jsx";
import Stage from "./components/Stage.jsx";
import TabbedLists from "./components/TabbedLists.jsx";
import BoomMicStand from "./SVGIcons/BoomMicStand.svg?react";
import RoundBaseMicStand from "./SVGIcons/RoundBaseMicStand.svg?react";
import DIBox from "./SVGIcons/DIbox.svg?react";
import StackAmp from "./SVGIcons/StackAmp.svg?react";
import ComboAmp from "./SVGIcons/ComboAmp.svg?react";
import FXUnit from "./SVGIcons/FXunit.svg?react";
import DoubleStackAmp from "./SVGIcons/DoubleStackAmp.svg?react";
import GrandPiano from "./SVGIcons/GrandPiano.svg?react";
import Keyboard from "./SVGIcons/Keyboard.svg?react";
import Saxophone from "./SVGIcons/Saxophone.svg?react";
import Shure57 from "./SVGIcons/Shure57.svg?react";
import Shure58 from "./SVGIcons/Shure58.svg?react";
import BassGuitar from "./SVGIcons/BassGuitar.svg?react";
import JazzGuitar from "./SVGIcons/JazzGuitar.svg?react";
import DrumKit from "./SVGIcons/DrumKit.svg?react";
import ElectricGuitar from "./SVGIcons/ElectricGuitar.svg?react";
import AcousticGuitar from "./SVGIcons/AcousticGuitar.svg?react";
import InEarMonitors from "./SVGIcons/InEarMonitors.svg?react";
import FloorMonitor from "./SVGIcons/FloorMonitor.svg?react";
import PA_Speaker from "./SVGIcons/PA_Speaker.svg?react";
import XLR_Cable from "./SVGIcons/XLR_Cable.svg?react";
import QuarterInch_Cable from "./SVGIcons/QuarterInch_Cable.svg?react";
import StageLight from "./SVGIcons/StageLight.svg?react";
import MixingConsole from "./SVGIcons/MixingConsole.svg?react";
import ShureBeta52 from "./SVGIcons/ShureBeta52.svg?react";
import ShureBeta91 from "./SVGIcons/ShureBeta91.svg?react";
import AKG_C414 from "./SVGIcons/AKG_C414.svg?react";
import Neumann_U87 from "./SVGIcons/Neumann_U87.svg?react";
import Sennheiser_MD421 from "./SVGIcons/Sennheiser_MD421.svg?react";
import AudioTechnica_ATM25 from "./SVGIcons/AudioTechnica_ATM25.svg?react";
import ElectroVoice_RE20 from "./SVGIcons/ElectroVoice_RE20.svg?react";
import Blue_Yeti from "./SVGIcons/Blue_Yeti.svg?react";
import Shure_SM7B from "./SVGIcons/Shure_SM7B.svg?react";

const INSTRUMENT_CATEGORIES = [
  {
    name: "Gear",
    items: [
      {
        name: "Boom Mic Stand",
        icon: <BoomMicStand style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Round Base Mic Stand",
        icon: <RoundBaseMicStand style={{ width: 32, height: 32 }} />,
      },
      { name: "DI Box", icon: <DIBox style={{ width: 32, height: 32 }} /> },
      { name: "FX Unit", icon: <FXUnit style={{ width: 32, height: 32 }} /> },
    ],
  },
  {
    name: "Microphones",
    items: [
      {
        name: "Shure 57",
        icon: <Shure57 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Shure 58",
        icon: <Shure58 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Shure Beta 52",
        icon: <ShureBeta52 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Shure Beta 91",
        icon: <ShureBeta91 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "AKG C414",
        icon: <AKG_C414 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Neumann U87",
        icon: <Neumann_U87 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Sennheiser MD421",
        icon: <Sennheiser_MD421 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Audio Technica ATM25",
        icon: <AudioTechnica_ATM25 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Electro-Voice RE20",
        icon: <ElectroVoice_RE20 style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Blue Yeti",
        icon: <Blue_Yeti style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Shure SM7B",
        icon: <Shure_SM7B style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Amps",
    items: [
      {
        name: "Stack Amp",
        icon: <StackAmp style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Combo Amp",
        icon: <ComboAmp style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Double Stack Amp",
        icon: <DoubleStackAmp style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Strings",
    items: [
      {
        name: "Bass Guitar",
        icon: <BassGuitar style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Jazz Guitar",
        icon: <JazzGuitar style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Electric Guitar",
        icon: <ElectricGuitar style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Acoustic Guitar",
        icon: <AcousticGuitar style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Percussion",
    items: [
      { name: "Drum Kit", icon: <DrumKit style={{ width: 32, height: 32 }} /> },
    ],
  },
  {
    name: "Keys",
    items: [
      {
        name: "Grand Piano",
        icon: <GrandPiano style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Keyboard",
        icon: <Keyboard style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Other",
    items: [
      {
        name: "Saxophone",
        icon: <Saxophone style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Monitors",
    items: [
      {
        name: "In-Ear Monitors",
        icon: <InEarMonitors style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Floor Monitor",
        icon: <FloorMonitor style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "PA System",
    items: [
      {
        name: "PA Speaker",
        icon: <PA_Speaker style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Mixing Console",
        icon: <MixingConsole style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Cables",
    items: [
      {
        name: "XLR Cable",
        icon: <XLR_Cable style={{ width: 32, height: 32 }} />,
      },
      {
        name: "Quarter Inch Cable",
        icon: <QuarterInch_Cable style={{ width: 32, height: 32 }} />,
      },
    ],
  },
  {
    name: "Lighting",
    items: [
      {
        name: "Stage Light",
        icon: <StageLight style={{ width: 32, height: 32 }} />,
      },
    ],
  },
];

function App() {
  const [stageItems, setStageItems] = useState([]);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const stageRef = useRef(null);

  // Drag state refs for moving icons
  const draggedIdRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Track which stage item is selected
  const [selectedStageItemId, setSelectedStageItemId] = useState(null);

  // Click an instrument to select it
  const handlePaletteClick = (inst) => {
    setSelectedInstrument(inst);
  };

  // Click on the stage to place or deselect
  const handleStageClick = (e) => {
    if (selectedInstrument && stageRef.current) {
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
          size: 32,
          nickname: "",
        },
      ]);
      setSelectedInstrument(null);
      setSelectedStageItemId(null);
    } else if (e.target === stageRef.current) {
      setSelectedStageItemId(null); // Only deselect if clicking the background
    }
  };

  // Handle resizing
  const resizingIdRef = useRef(null);
  const initialSizeRef = useRef(32);
  const initialMouseRef = useRef({ x: 0, y: 0 });

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    resizingIdRef.current = id;
    const item = stageItems.find((item) => item.id === id);
    initialSizeRef.current = item.size || 32;
    initialMouseRef.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e) => {
    setStageItems((items) =>
      items.map((item) => {
        if (item.id !== resizingIdRef.current) return item;
        const dx = e.clientX - initialMouseRef.current.x;
        const dy = e.clientY - initialMouseRef.current.y;
        // Use the larger of dx or dy for uniform scaling
        const delta = Math.max(dx, dy);
        const newSize = Math.max(
          16,
          Math.min(128, initialSizeRef.current + delta)
        );
        return { ...item, size: newSize };
      })
    );
  };

  const handleResizeMouseUp = () => {
    resizingIdRef.current = null;
    window.removeEventListener("mousemove", handleResizeMouseMove);
    window.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // Handle rotation
  const rotatingIdRef = useRef(null);
  const initialRotationRef = useRef(0);
  const initialMouseRotationRef = useRef({ x: 0, y: 0 });

  const handleRotateMouseDown = (e, id) => {
    e.stopPropagation();
    rotatingIdRef.current = id;
    const item = stageItems.find((item) => item.id === id);
    initialRotationRef.current = item.rotation || 0;
    initialMouseRotationRef.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", handleRotateMouseMove);
    window.addEventListener("mouseup", handleRotateMouseUp);
  };

  const handleRotateMouseMove = (e) => {
    setStageItems((items) =>
      items.map((item) => {
        if (item.id !== rotatingIdRef.current) return item;
        const itemElement = document.querySelector(
          `[data-item-id="${item.id}"]`
        );
        if (!itemElement) return item;

        const rect = itemElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle =
          Math.atan2(e.clientY - centerY, e.clientX - centerX) *
          (180 / Math.PI);

        const newRotation = (angle + 90) % 360; // Adjust for natural rotation
        return { ...item, rotation: newRotation };
      })
    );
  };

  const handleRotateMouseUp = () => {
    rotatingIdRef.current = null;
    window.removeEventListener("mousemove", handleRotateMouseMove);
    window.removeEventListener("mouseup", handleRotateMouseUp);
  };

  // Handle delete
  const handleDeleteIcon = (id) => {
    setStageItems((items) => items.filter((item) => item.id !== id));
  };

  // Handle input updates (including nickname updates)
  const handleInputUpdate = (inputData) => {
    setStageItems((items) =>
      items.map((item) => {
        if (item.id === inputData.stageItemId) {
          return { ...item, nickname: inputData.nickname };
        }
        return item;
      })
    );
  };

  // Handle output updates (including nickname updates)
  const handleOutputUpdate = (outputData) => {
    setStageItems((items) =>
      items.map((item) => {
        if (item.id === outputData.stageItemId) {
          return { ...item, nickname: outputData.nickname };
        }
        return item;
      })
    );
  };

  // Handle stage item updates (for all lists)
  const handleStageItemUpdate = (updatedItem) => {
    setStageItems((items) =>
      items.map((item) => {
        if (item.id === updatedItem.id) {
          return { ...item, ...updatedItem };
        }
        return item;
      })
    );
  };

  // When clicking an icon, select it
  const handleIconMouseDown = (e, id) => {
    e.stopPropagation();
    setSelectedStageItemId(id);
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
    <div className="app-container">
      <h1>Stage Plot Creator</h1>
      <div className="main-content">
        <div className="left-panel">
          <Stage
            stageItems={stageItems}
            onStageClick={handleStageClick}
            onIconMouseDown={handleIconMouseDown}
            stageRef={stageRef}
            selectedInstrument={selectedInstrument}
            onResizeMouseDown={handleResizeMouseDown}
            onRotateMouseDown={handleRotateMouseDown}
            onDeleteIcon={handleDeleteIcon}
            selectedStageItemId={selectedStageItemId}
          />
          <InstrumentPalette
            categories={INSTRUMENT_CATEGORIES}
            selectedInstrument={selectedInstrument}
            onSelect={handlePaletteClick}
          />
        </div>
        <div className="right-panel">
          <TabbedLists
            stageItems={stageItems}
            onInputUpdate={handleInputUpdate}
            onOutputUpdate={handleOutputUpdate}
            onStageItemUpdate={handleStageItemUpdate}
            onRemoveFromStage={(stageItemId) => {
              setStageItems((items) =>
                items.filter((item) => item.id !== stageItemId)
              );
            }}
          />
        </div>
      </div>
      <p style={{ marginTop: 16, color: "#888" }}>
        Click an instrument from the palette, then click on the stage to place
        it. To move an icon, just drag it. Only one action at a time.
      </p>
    </div>
  );
}

export default App;
