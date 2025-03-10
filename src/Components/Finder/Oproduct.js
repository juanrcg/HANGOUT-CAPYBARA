import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function Oproduct({ item }) {
  const buy = () => {
    console.log(`Buying product: ${item.name}`);
  };

  return (
    <div className="p-3 mb-3 border rounded" style={{ backgroundColor: "#222", color: "#fff" }}>
      <h4>{item.name}</h4>
      <p className="text-muted">{item.description}</p>
      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-bold">${item.price}</span>
        <button className="btn btn-outline-light" onClick={buy}>
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default Oproduct;
