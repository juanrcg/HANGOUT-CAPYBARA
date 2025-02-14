import React from 'react';
import Footer from './footer';
import Header from './header';
import Carousel from './Carousel/Carousel';

function Home() {
  return (
    <>
      <Header /> {/* Header component */}

      {/* Image container */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: 'calc(100vh - 90px)' }} // Adjust based on header height
      >
        <Carousel />
      </div>

      <Footer /> {/* Footer component */}
    </>
  );
}

export default Home;
