import React, { useState } from "react";
import "./TabbedLists.css";
import InputList from "./InputList.jsx";

const TabbedLists = ({ stageItems, onInputUpdate, onRemoveFromStage }) => {
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
            <div key={item.id} className="master-item">
              <div className="master-item-icon">
                {React.cloneElement(item.icon, {
                  style: { width: 24, height: 24 },
                })}
              </div>
              <div className="master-item-info">
                <div className="master-item-name">{item.name}</div>
                {item.nickname && (
                  <div className="master-item-nickname">{item.nickname}</div>
                )}
                <div className="master-item-gear">
                  Gear: {item.gearModel || "Not specified"}
                </div>
                <div className="master-item-notes">
                  Notes: {item.notes || "No notes"}
                </div>
              </div>
              <button
                className="delete-item-btn"
                onClick={() => onRemoveFromStage(item.id)}
                title="Delete from stage"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInputList = () => {
    // Filter out gear items, monitor items, PA items, cables, and lighting from inputs
    const gearItems = [
      "Boom Mic Stand",
      "Round Base Mic Stand",
      "DI Box",
      "FX Unit",
      "Shure 57",
      "Shure 58",
    ];
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
    const monitorItems = stageItems.filter((item) =>
      ["In-Ear Monitors", "Floor Monitor"].includes(item.name)
    );

    return (
      <div className="output-list">
        <h3>Output List</h3>
        {monitorItems.length === 0 ? (
          <p className="no-outputs">
            No monitors on stage yet. Add monitors to see outputs!
          </p>
        ) : (
          <div className="output-items">
            {monitorItems.map((item) => (
              <div key={item.id} className="output-item">
                <div className="output-item-icon">
                  {React.cloneElement(item.icon, {
                    style: { width: 24, height: 24 },
                  })}
                </div>
                <div className="output-item-info">
                  <div className="output-item-name">{item.name}</div>
                  {item.nickname && (
                    <div className="output-item-nickname">{item.nickname}</div>
                  )}
                </div>
                <button
                  className="delete-item-btn"
                  onClick={() => onRemoveFromStage(item.id)}
                  title="Delete from stage"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
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
            <div key={item.id} className="power-item">
              <div className="power-item-icon">
                {React.cloneElement(item.icon, {
                  style: { width: 24, height: 24 },
                })}
              </div>
              <div className="power-item-info">
                <div className="power-item-name">{item.name}</div>
                {item.nickname && (
                  <div className="power-item-nickname">{item.nickname}</div>
                )}
              </div>
              <button
                className="delete-item-btn"
                onClick={() => onRemoveFromStage(item.id)}
                title="Delete from stage"
              >
                ×
              </button>
            </div>
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
