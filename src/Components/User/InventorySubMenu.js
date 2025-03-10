import React from "react";

const InventorySubMenu = ({ setActiveTab, activeTab }) => {
  return (
    <div className="sub-menu d-flex justify-content-center w-100 border-bottom" style={{ backgroundColor: "#222", color: "#fff" }}>
      <div
        className={`sub-menu-item px-4 py-3 ${activeTab === "products" ? "active" : ""}`}
        style={{ cursor: "pointer", fontWeight: activeTab === "products" ? "bold" : "normal" }}
        onClick={() => setActiveTab("products")}
      >
        Products
      </div>
      <div
        className={`sub-menu-item px-4 py-3 ${activeTab === "services" ? "active" : ""}`}
        style={{ cursor: "pointer", fontWeight: activeTab === "services" ? "bold" : "normal" }}
        onClick={() => setActiveTab("services")}
      >
        Services
      </div>
      <div
        className={`sub-menu-item px-4 py-3 ${activeTab === "events" ? "active" : ""}`}
        style={{ cursor: "pointer", fontWeight: activeTab === "events" ? "bold" : "normal" }}
        onClick={() => setActiveTab("events")}
      >
        Events
      </div>
    </div>
  );
};

export default InventorySubMenu;
