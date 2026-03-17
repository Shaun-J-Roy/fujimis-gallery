import React from 'react';
import BackgroundVideo from './BackgroundVideo';
import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';

const Layout = () => {
  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden pt-0 selection:bg-white/20">
      <BackgroundVideo />
      
      {/* Foreground Content container */}
      <main className="w-full">
         <Navbar />
         <Hero />
         
         {/* Gallery anchored via ID for scrolling */}
         <div id="gallery">
           <Gallery />
         </div>

         {/* About Section */}
         <div id="about">
           <About />
         </div>

         {/* Contact Section */}
         <div id="contact">
           <Contact />
         </div>
      </main>
    </div>
  );
};

export default Layout;
