import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center z-20 text-white px-6">
      <div className="flex flex-col items-center max-w-4xl text-center mix-blend-difference">
         <h1 className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] text-white">
            FUJIMI'S<br/>GALLERY
         </h1>
         <p className="mt-8 text-lg md:text-xl font-serif italic text-white/80 max-w-xl">
           Curating moments in time. Photography by Fujimi. 
         </p>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={scrollToGallery}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-2 mix-blend-difference hover:opacity-70 transition-opacity"
      >
        <span className="text-xs uppercase tracking-[0.3em] font-medium">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </button>
    </section>
  );
};

export default Hero;
