import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const MediaCarousel = ({ mediaFiles, openImageModal }) => {
  const swiperRef = useRef(null);

  return (
    <div className="carousel-container" style={{ position: "relative" }}>
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}" style="background-color: white;"></span>`;
          },
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
      >
        {mediaFiles.map((file, index) => (
          <SwiperSlide key={index}>
            <div className="slide" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              {file.type === "image" ? (
                <img
                  src={file.src}
                  alt={`Slide ${index}`}
                  className="slide-image"
                  onClick={() => openImageModal(file.src)}
                  style={{
                    width: "90%",
                    height: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <video
                  controls
                  onPlay={() => swiperRef.current.swiper.autoplay.stop()} // Stop autoplay when playing video
                  onPause={() => swiperRef.current.swiper.autoplay.start()} // Resume autoplay when video pauses
                  style={{
                    width: "90%",
                    height: "auto", // Auto-adjust height
                    maxHeight: "400px", // Prevent overflow
                    objectFit: "contain", // Prevents stretching
                    borderRadius: "8px",
                  }}
                >
                  <source src={file.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Arrows Visibility on Hover */}
      <style jsx>{`
        .swiper-button-next, .swiper-button-prev {
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .carousel-container:hover .swiper-button-next,
        .carousel-container:hover .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MediaCarousel;
