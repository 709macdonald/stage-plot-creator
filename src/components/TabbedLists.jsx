import React, { useState } from "react";
import "./TabbedLists.css";
import InputList from "./InputList.jsx";
import OutputList from "./OutputList.jsx";
import EditableItem from "./EditableItem.jsx";

const TabbedLists = ({
  stageItems,
  onInputUpdate,
  onOutputUpdate,
  onStageItemUpdate,
  onRemoveFromStage,
}) => {
  const [activeTab, setActiveTab] = useState("master");

  const tabs = [
    { id: "master", label: "Master List" },
    { id: "inputs", label: "Input List" },
    { id: "outputs", label: "Output List" },
    { id: "power", label: "Power List" },
  ];

  const renderMasterList = () => {
    return (
      <div className="master-list">
        <h3>All Stage Items</h3>
        <div className="master-items">
          {stageItems.map((item) => (
            <EditableItem
              key={item.id}
              item={item}
              onUpdate={onStageItemUpdate}
              onRemoveFromStage={onRemoveFromStage}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderInputList = () => {
    // Filter out gear items, monitor items, PA items, cables, and lighting from inputs
    // Microphones should create inputs, so they're not filtered out
    const gearItems = ["Boom Mic Stand", "Round Base Mic Stand", "FX Unit"];
    const monitorItems = ["In-Ear Monitors", "Floor Monitor"];
    const paItems = ["PA Speaker", "Mixing Console"];
    const cableItems = ["XLR Cable", "Quarter Inch Cable"];
    const lightingItems = ["Stage Light"];

    const inputStageItems = stageItems.filter(
      (item) =>
        !gearItems.includes(item.name) &&
        !monitorItems.includes(item.name) &&
        !paItems.includes(item.name) &&
        !cableItems.includes(item.name) &&
        !lightingItems.includes(item.name)
    );

    return (
      <div className="input-list-container">
        <InputList
          stageItems={inputStageItems}
          onInputUpdate={onInputUpdate}
          onRemoveFromStage={onRemoveFromStage}
        />
      </div>
    );
  };

  const renderOutputList = () => {
    return (
      <div className="output-list-container">
        <OutputList
          stageItems={stageItems}
          onOutputUpdate={onOutputUpdate}
          onRemoveFromStage={onRemoveFromStage}
        />
      </div>
    );
  };

  const renderPowerList = () => {
    const powerItems = stageItems.filter((item) =>
      [
        "Keyboard",
        "Grand Piano",
        "FX Unit",
        "Stack Amp",
        "Combo Amp",
        "Double Stack Amp",
        "Mixing Console",
        "Stage Light",
      ].includes(item.name)
    );

    return (
      <div className="power-list">
        <h3>Power Requirements</h3>
        <div className="power-summary">
          <div className="power-total">
            <span className="power-count">{powerItems.length}</span>
            <span className="power-label">items need power</span>
          </div>
        </div>
        <div className="power-items">
          {powerItems.map((item) => (
            <EditableItem
              key={item.id}
              item={item}
              onUpdate={onStageItemUpdate}
              onRemoveFromStage={onRemoveFromStage}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "master":
        return renderMasterList();
      case "inputs":
        return renderInputList();
      case "outputs":
        return renderOutputList();
      case "power":
        return renderPowerList();
      default:
        return renderMasterList();
    }
  };

  return (
    <div className="tabbed-lists">
      <div className="tab-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default TabbedLists;
