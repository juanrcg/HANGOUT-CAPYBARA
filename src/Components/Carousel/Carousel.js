import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import portada from './portada.png';
import calendar from './calendar.jpeg';
import disco from './disco.png';
import disco2 from './disco2.jpeg';
import mapa from './mapa.jpeg';
import payment from './payment.jpeg';
import sell from './sell.jpeg';
import videocall from './videocall.jpeg';

const features = [
  { image: portada, description: "" }, // First image with no text
  { image: disco2, description: "🎶 Real-World Party Mode: See nearby venues, check crowd size, music, and who’s open to dance or chat." },
  { image: sell, description: "🛍️ Profile & Inventory: Manage your own products and services." },
  { image: calendar, description: "📅 Integrated Calendar: Sync appointments with Google Calendar." },
  { image: payment, description: "💰 Wallet & Payment: Add payment methods to receive money easily." },
  { image: mapa, description: "📍 Location-Based Search: Find nearby places and directly interact with businesses." },
  { image: disco, description: "🛒 Sale-Post: Post items for sale and allow others to buy or schedule services directly from the post!" },
  { image: sell, description: "🤖 AI-Powered Recommendations: Get personalized product suggestions from Amazon." },
];

const Carousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {features.map((feature, index) => (
          <SwiperSlide key={index}>
            <div className="slide">
              <img src={feature.image} alt={`Slide ${index}`} className="slide-image" />
              {feature.description && <p className="slide-text">{feature.description}</p>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
