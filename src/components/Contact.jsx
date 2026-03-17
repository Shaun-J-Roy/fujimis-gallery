import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Contact = () => {
  return (
    <footer className="relative z-10 w-full bg-black/60 backdrop-blur-3xl px-4 sm:px-8 lg:px-12 py-32 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">

        <span className="text-white/40 text-sm tracking-widest uppercase mb-6">
          Thanks for visiting
        </span>

        <a
          href="mailto:shaunroyx2404@gmail.com"
          className="group flex flex-col items-center"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white/90 group-hover:text-white transition-colors duration-500 mb-8">
            Get in<br />touch.
          </h2>

          <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-500">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
        </a>

        {/* Footer Links */}
        <div className="w-full flex justify-between items-center mt-32 pt-8 border-t border-white/10">

          <span className="text-sm text-white/40">
            © {new Date().getFullYear()} Shaun Roy. All photos belong to their respective photographer.
          </span>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/shaun.j.r"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 uppercase tracking-widest hover:text-white transition-colors"
            >
              Instagram
            </a>

            <a
              href="https://www.linkedin.com/in/shaun-roy-14b500316"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 uppercase tracking-widest hover:text-white transition-colors"
            >
              LinkedIn
            </a>

            <a
              href="mailto:shaunroyx2404@gmail.com"
              className="text-xs text-white/60 uppercase tracking-widest hover:text-white transition-colors"
            >
              Gmail
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Contact;