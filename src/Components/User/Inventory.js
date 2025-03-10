import React, { useEffect, useContext, useState } from "react";
import { useWebSocket } from "../../Context/WebSocketContext";
import AccountContext from "../../Context/AccountContext";
import Product from "../Products/Product";
import AddProduct from "../Products/NewProduct";
import Feed_Header from "./feed_header";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import InventorySubMenu from "./InventorySubMenu";
import Service from "../Products/Service";
import AddService from "../Products/NewService";

function Inventory() {
  const { getSession } = useContext(AccountContext);
  const { socket, receivedProducts } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProducts, setNewProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // Track selected tab

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      if (fileType === "xlsx" || fileType === "xls") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryString = event.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          const newProducts = jsonData.map((product) => ({
            name: product.Name,
            price: product.Price,
            description: product.Description,
            quantity: product.Quantity,
          }));

          setNewProducts((prevProducts) => [...prevProducts, ...newProducts]);
        };
        reader.readAsBinaryString(file);
      } else if (fileType === "csv") {
        Papa.parse(file, {
          complete: (result) => {
            const newProducts = result.data.map((product) => ({
              name: product.Name,
              price: product.Price,
              description: product.Description,
              quantity: product.Quantity,
            }));
            setNewProducts((prevProducts) => [...prevProducts, ...newProducts]);
          },
          header: true,
        });
      } else {
        alert("Please upload an Excel (.xlsx, .xls) or CSV file.");
      }
    }
  };

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      getSession()
        .then((session) => {
          const owner = session.sub;
          const body = {
            action: "getproducts",
            owner: owner,
          };
          socket.send(JSON.stringify(body));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [socket, getSession]);

  useEffect(() => {
    const fetchedServices = [
      { id: 1, name: "PC Repair", description: "Comprehensive repair service." },
      { id: 2, name: "Software Installation", description: "Installation of essential software." },
    ];
    setServices(fetchedServices);
  }, []);

  return (
    <>
      <Feed_Header />
      <InventorySubMenu setActiveTab={setActiveTab} activeTab={activeTab} />

      <div className="p-5 border border-gray-600 rounded-lg bg-[#1A1A1A] relative text-white">
        <h2 className="text-xl font-semibold mb-4">Inventory - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>

        {activeTab === "products" ? (
          <div className="border border-gray-500 rounded-lg p-4 bg-black h-[400px] overflow-y-auto">
            {receivedProducts.length > 0 || newProducts.length > 0 ? (
              [...receivedProducts, ...newProducts].map((product, index) => (
                <div key={product.id || product.name}>
                  <Product
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    quantity={product.quantity}
                    onEdit={(id) => console.log("Edit product:", id)}
                    onDelete={(id) => console.log("Delete product:", id)}
                  />
                  {index !== [...receivedProducts, ...newProducts].length - 1 && (
                    <div className="border-b border-gray-700 my-2"></div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No products available.</p>
            )}
          </div>
        ) : (
          <div className="border border-gray-500 rounded-lg p-4 bg-black h-[400px] overflow-y-auto">
            {services.length > 0 ? (
              services.map((service) => (
                <Service key={service.id} id={service.id} name={service.name} description={service.description} />
              ))
            ) : (
              <p className="text-gray-400">No services available.</p>
            )}
          </div>
        )}

        {/* Buttons - Only show relevant Add buttons */}
        <div className="flex space-x-4 mt-4 fixed bottom-5 left-1/2 transform -translate-x-1/2">
          {activeTab === "products" && (
            <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
              onClick={() => setIsModalOpen(true)}>
              Add Product
            </button>
          )}

          {activeTab === "services" && (
            <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
              onClick={() => setIsModalOpen(true)}>
              Add Service
            </button>
          )}

          {activeTab === "events" && (
            <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
              onClick={() => setIsModalOpen(true)}>
              Add Event
            </button>
          )}

          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload}
            style={{ display: 'none' }} id="uploadFile" />
          <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
            onClick={() => document.getElementById('uploadFile').click()}>
            Add from File
          </button>
        </div>

        {/* Modal to add product or service */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black p-6 rounded-lg shadow-lg w-96 border border-white">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {activeTab === "products" ? "Add a New Product" :
                 activeTab === "services" ? "Add a New Service" :
                 activeTab === "events" ? "Add a New Event" : ""}
              </h3>
              {activeTab === "products" && <AddProduct />}
              {activeTab === "services" && <AddService />}
              {/* AddEvent component can be added when implemented */}
              <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-opacity-80"
                onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Inventory;
