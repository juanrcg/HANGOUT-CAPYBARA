import React from 'react';
import Footer from './footer';
import Header from './header';
import Carousel from './Carousel/Carousel';

/**
 * Home Component
 * 
 * This component represents the home page layout, including:
 * - A header at the top.
 * - A full-page image carousel centered on the screen.
 * - A footer at the bottom.
 * 
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  return (
    <>
      <Header /> {/* Top navigation bar */}

      {/* Main Content - Fullscreen Image Carousel */}
      <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 90px)' }}>
        <Carousel /> {/* Image slider */}
      </div>

      <Footer /> {/* Bottom footer section */}
    </>
  );
}

export default Home;
