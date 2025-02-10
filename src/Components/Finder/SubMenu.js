import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubMenu = ({ keyword }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Places", path: "/finder" },
    { name: "People", path: "/looker" },
    { name: "Content", path: "/explore" },
    { name: "Products", path: "/market" },
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

export default SubMenu;
