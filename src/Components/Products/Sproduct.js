import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../Context/WebSocketContext";
import MediaCarousel from "../User/MediaCarousel";
import Feed_Header from "../User/feed_header"; // Assuming you have this component

const Sproduct = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ProductId = urlParams.get("ProductId");
  const { socket, receivedProducts_s } = useWebSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && ProductId) {
      const body = {
        action: "getproduct_s",
        ProductId: String(ProductId),
      };
      socket.send(JSON.stringify(body));
      setLoading(false); // Set loading to false after sending the request
    }
  }, [socket, ProductId]); // Only trigger when socket or ProductId changes

  if (loading) {
    return <p style={{ color: "#fff" }}>Loading product details...</p>;
  }

  if (!receivedProducts_s) {
    return <p style={{ color: "#fff" }}>Product not found...</p>;
  }

  const { name, price, description, files } = receivedProducts_s;
  const parsedFiles = Array.isArray(files) ? files : [];

  const imageFiles = parsedFiles.filter((file) =>
    file.match(/\.(jpg|png|jpeg|webp|JPG)$/)
  );

  const videoFiles = parsedFiles.filter((file) =>
    file.match(/\.(mp4|webm|ogg|mov|MOV)$/)
  );

  const mediaFiles = [
    ...imageFiles.map((file) => ({ type: "image", src: file })),
    ...videoFiles.map((file) => ({ type: "video", src: file })),
  ];

  const handleBuyNow = () => {
    console.log("Buy Now clicked!");  // Placeholder for your buy function
  };

  return (
    <>
      <Feed_Header />

      <div
        style={{
          padding: "40px 20px",
          maxWidth: "800px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#1A1A1A",  // Dark gray background for product details container
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          color: "#fff",  // White text color for better contrast
        }}
      >
        <h2
          style={{
            color: "#fff",  // White color for the title
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          {name}
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: "18px",
            fontWeight: "500",
            color: "#fff",  // White price text
            marginBottom: "20px",
          }}
        >
          <strong>Price:</strong> ${price}
        </p>
        <p
          style={{
            color: "#d1d1d1",  // Lighter gray for description to reduce harshness
            lineHeight: "1.6",
            fontSize: "16px",
            marginBottom: "30px",
          }}
        >
          {description}
        </p>

        {/* Media Files Section */}
        {(imageFiles.length > 0 || videoFiles.length > 0) && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "700px",
              height: "auto",
              maxHeight: "400px",
              overflow: "hidden",
              borderRadius: "12px",
              backgroundColor: "#333",  // Dark background for media section
              margin: "0 auto",
            }}
          >
            {mediaFiles.length > 1 ? (
              <MediaCarousel mediaFiles={mediaFiles} openImageModal={() => {}} />
            ) : mediaFiles[0].type === "image" ? (
              <img
                src={mediaFiles[0].src}
                alt="Product Media"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <video
                controls
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  borderRadius: "12px",
                  objectFit: "contain",
                }}
              >
                <source src={mediaFiles[0].src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        {/* Buy Now Button */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={handleBuyNow}
            style={{
              backgroundColor: "#fff",  // White background for the button
              color: "#1A1A1A",  // Black text
              padding: "12px 25px",
              fontSize: "18px",
              fontWeight: "600",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#f4f4f4")}  // Lighten button on hover
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
};

export default Sproduct;
