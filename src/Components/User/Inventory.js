import React, { useEffect, useContext, useState } from "react";
import { useWebSocket } from "../../Context/WebSocketContext";
import AccountContext from "../../Context/AccountContext";
import Product from "../Products/Product";
import AddProduct from "../Products/NewProduct";
import Feed_Header from "./feed_header";
import * as XLSX from 'xlsx'; // To handle Excel file parsing
import Papa from 'papaparse'; // To handle CSV file parsing
import InventorySubMenu from "./InventorySubMenu";

function Inventory() {
  const { getSession } = useContext(AccountContext);
  const { socket, receivedProducts } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [newProducts, setNewProducts] = useState([]); // State to store products from file upload

  // Function to handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();

      if (fileType === "xlsx" || fileType === "xls") {
        // Handle Excel file
        const reader = new FileReader();
        reader.onload = (event) => {
          const binaryString = event.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          // Assuming the sheet columns are: Name, Price, Description, Quantity
          const newProducts = jsonData.map((product) => ({
            name: product.Name,
            price: product.Price,
            description: product.Description,
            quantity: product.Quantity,
          }));

          setNewProducts((prevProducts) => [...prevProducts, ...newProducts]);
          console.log("Products from Excel:", newProducts);
        };
        reader.readAsBinaryString(file);
      } else if (fileType === "csv") {
        // Handle CSV file
        Papa.parse(file, {
          complete: (result) => {
            // Assuming the CSV has headers: Name, Price, Description, Quantity
            const newProducts = result.data.map((product) => ({
              name: product.Name,
              price: product.Price,
              description: product.Description,
              quantity: product.Quantity,
            }));

            setNewProducts((prevProducts) => [...prevProducts, ...newProducts]);
            console.log("Products from CSV:", newProducts);
          },
          header: true, // Tells PapaParse that the first row is headers
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
          console.log(`Sent "getproducts" action to WebSocket ${owner}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [socket, getSession]);

  return (
    <>
      <Feed_Header></Feed_Header>
      <InventorySubMenu></InventorySubMenu>
      <div className="p-5 border border-gray-600 rounded-lg bg-[#1A1A1A] relative text-white">
        <h2 className="text-xl font-semibold mb-4">Product Inventory</h2>
        <div className="border border-gray-500 rounded-lg p-4 bg-black h-[400px] overflow-y-auto">
          {/* Scrollable product list */}
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
                {/* Add line between products */}
                {index !== [...receivedProducts, ...newProducts].length - 1 && (
                  <div className="border-b border-gray-700 my-2"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No products available.</p>
          )}
        </div>

        {/* Buttons to open modals */}
        <div className="flex space-x-4 mt-4 fixed bottom-5 left-1/2 transform -translate-x-1/2">
          <button
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            Add Product
          </button>

          {/* Add from Excel button */}
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="uploadFile"
          />
          <button
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg"
            onClick={() => document.getElementById('uploadFile').click()}
          >
            Add from File
          </button>
        </div>

        {/* Modal to add products */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black p-6 rounded-lg shadow-lg w-96 border border-white">
              <h3 className="text-lg font-semibold mb-4 text-white">Add a New Product</h3>
              <AddProduct />
              <button
                className="mt-4 px-4 py-2 bg-white text-black rounded-lg hover:bg-opacity-80"
                onClick={() => setIsModalOpen(false)}
              >
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
