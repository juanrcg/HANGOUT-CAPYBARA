import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillWave, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPaypal, faStripe, faCcVisa } from "@fortawesome/free-brands-svg-icons";
import Feed_Header from "./feed_header";
import Earnings from "./Earnings";

const Wallet = () => {
  // Default Payment Method (Cash)
  const defaultMethods = [{ id: "cash", name: "Cash", icon: faMoneyBillWave, isDefault: true }];
  const [paymentMethods, setPaymentMethods] = useState(defaultMethods);
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);

  // Payment Form State
  const [formData, setFormData] = useState({ methodId: "", details: {} });

  // Available Methods
  const availableMethods = [
    { id: "paypal", name: "PayPal", icon: faPaypal, fields: ["Email"] },
    { id: "stripe", name: "Stripe", icon: faStripe, fields: ["Public Key", "Secret Key"] },
    { id: "azul", name: "Azul", icon: faCcVisa, fields: ["Merchant ID", "API Key"] },
  ];

  // Open form to add a method
  const handleAddPayment = (methodId) => {
    const method = availableMethods.find((m) => m.id === methodId);
    setFormData({ methodId: method.id, details: {} });
    setShowForm(true);
  };

  // Handle form field change
  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      details: { ...formData.details, [field]: e.target.value },
    });
  };

  // Save new payment method
  const savePaymentMethod = () => {
    const methodToAdd = availableMethods.find((m) => m.id === formData.methodId);
    if (methodToAdd) {
      const newMethod = {
        id: methodToAdd.id,
        name: methodToAdd.name,
        icon: methodToAdd.icon,
        details: formData.details,
      };
      setPaymentMethods([...paymentMethods, newMethod]);
      setShowForm(false);
      setFormData({ methodId: "", details: {} });
    }
  };

  // Edit Payment Method
  const handleEditPayment = (method) => {
    setEditingMethod(method);
    setFormData({ methodId: method.id, details: method.details });
    setShowForm(true);
  };

  // Save Edited Payment Method
  const saveEditedPaymentMethod = () => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === formData.methodId ? { ...method, details: formData.details } : method
      )
    );
    setEditingMethod(null);
    setShowForm(false);
  };

  // Remove Payment Method (except cash)
  const removePaymentMethod = (id) => {
    if (id !== "cash") {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
      if (selectedMethod === id) setSelectedMethod("cash");
    }
  };

  return (
    <>
    <Feed_Header></Feed_Header>
    <div className="container p-3 bg-white shadow rounded" style={{ maxWidth: "400px", color: "#000" }}>
      <h4 className="text-center mb-3">Wallet</h4>

      {/* Payment Methods List */}
      <div className="list-group">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${selectedMethod === method.id ? "active bg-dark text-white" : ""}`}
            onClick={() => setSelectedMethod(method.id)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <FontAwesomeIcon icon={method.icon} className="me-2" />
              {method.name}
            </div>
            {!method.isDefault && (
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditPayment(method)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => removePaymentMethod(method.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Payment Method Dropdown */}
      <div className="d-flex mt-3">
        <select className="form-select" onChange={(e) => handleAddPayment(e.target.value)}>
          <option value="">Add Payment Method</option>
          {availableMethods
            .filter((method) => !paymentMethods.some((pm) => pm.id === method.id))
            .map((method) => (
              <option key={method.id} value={method.id}>
                {method.name}
              </option>
            ))}
        </select>
      </div>

      {/* Payment Method Form */}
      {showForm && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h5 className="text-center">{editingMethod ? `Edit ${editingMethod.name}` : "Add Payment Method"}</h5>
          {availableMethods
            .find((m) => m.id === formData.methodId)
            ?.fields.map((field) => (
              <div key={field} className="mb-2">
                <label className="form-label">{field}:</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.details[field] || ""}
                  onChange={(e) => handleInputChange(e, field)}
                />
              </div>
            ))}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-dark"
              onClick={editingMethod ? saveEditedPaymentMethod : savePaymentMethod}
            >
              {editingMethod ? "Save Changes" : "Save"}
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Earnings Section with Separation */}
    <div className="container p-3 mt-4 bg-white shadow rounded" style={{ maxWidth: "400px", color: "#000" }}>
      <Earnings />
    </div>
    </>
  );
};

export default Wallet;
