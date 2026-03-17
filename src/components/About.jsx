import React, { useRef, useState, useEffect } from 'react';

const About = () => {
  return (
    <section className="relative z-10 w-full bg-black/60 backdrop-blur-3xl px-4 sm:px-8 lg:px-12 py-32 rounded-t-[3rem] mt-[-3rem] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl lg:text-6xl font-medium tracking-tight text-white mb-2">About the Artist</h2>
          <span className="text-white/50 text-sm tracking-widest uppercase mb-4">Behind the Lens</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* Left: Portrait/Visual */}
          <div className="w-full lg:w-1/2">
            <div className="w-full aspect-[3/4] rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white/5">
                {/* Reusing the hero portrait for consistency, or replace with another */}
                <img src="/hero-bg.jpg" alt="Fujimi" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
          </div>

          {/* Right: Bio */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-3xl font-serif italic text-white/90 mb-8">
              “Still learning to see the world a little differently, one frame at a time.”
            </h3>

            <div className="space-y-6 text-white/60 leading-relaxed text-lg font-light">
              <p>
                I’m an amateur photographer who’s still learning the art of photography and the many ways light, color, and perspective can tell a story.
                Most of my photos come from moments that simply catch my eye.
              </p>
              <p>
                I enjoy photographing nature, wildlife, and the small abstract details that often go unnoticed. Sometimes it’s a landscape, sometimes an animal in motion, and sometimes just a pattern or texture that feels interesting in the moment.

                This space is a collection of those moments. It’s not about perfection, but about exploration, curiosity, and slowly improving with every shot.
              </p>
              <p>
                Currently based out of the city, always chasing the dying light.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="w-12 h-[1px] bg-white/30"></div>
              <span className="text-xs uppercase tracking-widest text-white/50 font-medium">Fujimi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
