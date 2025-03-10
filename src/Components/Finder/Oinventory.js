import React, { useEffect, useState } from "react";
import Oproduct from "./Oproduct";
import Oservice from "./Oservice";
import Feed_Header from "../User/feed_header";
import InventorySubMenu from "../User/InventorySubMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useWebSocket } from '../../Context/WebSocketContext';

function Oinventory() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get("username");
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [productPage, setProductPage] = useState(0);
  const [servicePage, setServicePage] = useState(0);
  const [activeTab, setActiveTab] = useState("products"); // Track selected tab
  const itemsPerPage = 5;
  const { socket, receivedProducts , receivedServices } = useWebSocket();

  

  const getProducts = () => {
    

    if (socket && socket.readyState === WebSocket.OPEN) {

        let body = {
            action: "getproducts",
            owner: username,
          };
          socket.send(JSON.stringify(body));

          body = {
            action: "getservices",
            owner: username,
          };
          socket.send(JSON.stringify(body));



          console.log("Fetching products for sub:", username);
    }

   
    console.log(receivedProducts);
    setProducts(receivedProducts);
    setServices(receivedServices);
  };

  useEffect(() => {

    if (socket && socket.readyState === WebSocket.OPEN) {
    getProducts();

    }
  }, [socket]);
  


  return (
    <>
      <Feed_Header />

      {/* Full-width submenu */}
      <InventorySubMenu setActiveTab={setActiveTab} activeTab={activeTab} />

      <div className="container p-4 mt-4 shadow rounded" style={{ maxWidth: "900px", backgroundColor: "#000", color: "#fff" }}>
        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === "products" && (
          <>
            {receivedProducts.length === 0 ? (
              <p className="text-muted text-center">No products available.</p>
            ) : (
              <>
                {receivedProducts.slice(productPage * itemsPerPage, (productPage + 1) * itemsPerPage).map(item => (
                  <Oproduct key={item.id} item={item} />
                ))}
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-light"
                    disabled={productPage === 0}
                    onClick={() => setProductPage(prev => prev - 1)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Previous
                  </button>
                  <button
                    className="btn btn-outline-light"
                    disabled={(productPage + 1) * itemsPerPage >= products.length}
                    onClick={() => setProductPage(prev => prev + 1)}
                  >
                    Next <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "services" && (
          <>
            {receivedServices.length === 0 ? (
              <p className="text-muted text-center">No services available.</p>
            ) : (
              <>
                {receivedServices.slice(servicePage * itemsPerPage, (servicePage + 1) * itemsPerPage).map(item => (
                  <Oservice key={item.id} item={item} />
                ))}
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-light"
                    disabled={servicePage === 0}
                    onClick={() => setServicePage(prev => prev - 1)}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Previous
                  </button>
                  <button
                    className="btn btn-outline-light"
                    disabled={(servicePage + 1) * itemsPerPage >= services.length}
                    onClick={() => setServicePage(prev => prev + 1)}
                  >
                    Next <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Oinventory;
