import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="fixed top-6 inset-x-0 z-[100] px-6 sm:px-12 flex items-center justify-between pointer-events-none">
      
      {/* Brand Badge (Left) */}
      <NavLink 
        to="/" 
        className="pointer-events-auto bg-white/80 hover:bg-white text-sky-600 font-bold px-5 py-2.5 rounded-2xl shadow-lg backdrop-blur-md border border-white/40 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base tracking-tight"
      > Home 🏠︎
      </NavLink>

      

      

      {/* Navigation Links (Right) */}
      <nav className="pointer-events-auto flex items-center gap-3">
        <NavLink 
          to="/Contact" 
          className={({ isActive }) =>
            `px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-md backdrop-blur-md border border-white/40 ${
              isActive 
                ? 'bg-sky-500 text-white border-sky-400' 
                : 'bg-white/80 hover:bg-white text-sky-600 hover:scale-105 active:scale-95'
            }`
          }
        >
          Contact us ⓘ
        </NavLink>

        

        <NavLink 
          to="/projects" 
          className={({ isActive }) =>
            `px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-md backdrop-blur-md border border-white/40 ${
              isActive 
                ? 'bg-sky-500 text-white border-sky-400' 
                : 'bg-white/80 hover:bg-white text-sky-600 hover:scale-105 active:scale-95'
            }`
          }
        >
          Shop now 𖠩
        </NavLink>
      </nav>

    </header>
  );
};

export default Navbar;