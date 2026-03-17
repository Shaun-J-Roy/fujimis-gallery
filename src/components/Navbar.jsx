import React from 'react';
import { Menu, Instagram, Linkedin, Mail } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference text-white">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold tracking-tighter">Fujimi.</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#gallery"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm font-medium tracking-widest uppercase hover:text-white/70 transition-colors"
        >
          Gallery
        </a>

        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm font-medium tracking-widest uppercase hover:text-white/70 transition-colors"
        >
          About
        </a>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-sm font-medium tracking-widest uppercase hover:text-white/70 transition-colors"
        >
          Contact
        </a>

        <div className="w-[1px] h-4 bg-white/30 hidden lg:block"></div>

        {/* Social Icons */}
        <div className="hidden lg:flex gap-5">
          <a
            href="https://instagram.com/shaun.j.r"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href="https://www.linkedin.com/in/shaun-roy-14b500316"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href="mailto:shaunroyx2404@gmail.com"
            className="hover:text-white/70 transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      <button className="md:hidden">
        <Menu className="w-6 h-6" />
      </button>
    </nav>
  );
};

export default Navbar;