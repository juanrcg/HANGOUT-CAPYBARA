import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";

const Earnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);

  // Fetch data for earnings (dummy function for now)
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchedEarnings = 1500; // Replace with actual API call
    const fetchedTransactions = 5; // Replace with actual API call

    setTotalEarnings(fetchedEarnings);
    setTransactionsCount(fetchedTransactions);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          fontSize: "24px",
          color: "#1A1A1A",
          fontWeight: "bold",
        }}
      >
        Earnings Summary
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <FontAwesomeIcon
          icon={faDollarSign}
          style={{ fontSize: "30px", color: "#1A1A1A", marginRight: "10px" }}
        />
        <span
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#1A1A1A",
          }}
        >
          ${totalEarnings.toFixed(2)}
        </span>
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "16px",
          color: "#555",
        }}
      >
        <p>{transactionsCount} transactions</p>
      </div>
    </div>
  );
};

export default Earnings;
