import React from 'react';

const BackgroundVideo = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden bg-black flex items-center justify-center">
      <img
        src="/hero-bg.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
    </div>
  );
};

export default BackgroundVideo;
