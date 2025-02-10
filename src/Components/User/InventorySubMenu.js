import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InventorySubMenu = ({ keyword }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Products", path: "/inventory/products" },
    { name: "Services", path: "/inventory/services" },
  ];

  const handleNavigation = (path) => {
    navigate(`${path}?keyword=${keyword}`);
  };

  return (
    <div className="sub-menu d-flex justify-content-around border-bottom">
      {menuItems.map((item) => (
        <div
          key={item.name}
          className={`sub-menu-item px-4 py-2 ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => handleNavigation(item.path)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default InventorySubMenu;
