import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="p-4 dark:bg-gray-100 dark:text-gray-800 shadow">
            <div className="container mx-auto flex justify-between items-center h-16">
                <Link to="/" className="flex items-center p-2">
                    <img src="/logo.png" alt="Blood" className="w-10 h-10 object-contain" />
                </Link>

                {/* Desktop Nav */}
               <ul className="hidden lg:flex space-x-6">
  <li>
    <NavLink
      to="/"
      className={({ isActive }) =>
        isActive ? "text-red-600 font-semibold" : "hover:text-red-600"
      }
    >
      Home
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/about"
      className={({ isActive }) =>
        isActive ? "text-red-600 font-semibold" : "hover:text-red-600"
      }
    >
      About Us
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/blog"
      className={({ isActive }) =>
        isActive ? "text-red-600 font-semibold" : "hover:text-red-600"
      }
    >
      Blog
    </NavLink>
  </li>
  <li>
    <NavLink
      to="/donation"
      className={({ isActive }) =>
        isActive ? "text-red-600 font-semibold" : "hover:text-red-600"
      }
    >
      Blood Donation
    </NavLink>
  </li>
</ul>


                {/* Desktop Buttons */}
                <div className="hidden lg:flex items-center space-x-4">
                    <button className="px-4 py-2 rounded border border-gray-300">Sign in</button>
                    <button className="px-4 py-2 font-semibold rounded bg-violet-600 text-white">Sign up</button>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Nav Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t dark:bg-gray-100">
                    <ul className="flex flex-col px-4 py-2 space-y-2">
                        <li><Link to="/" className="block py-1">Home</Link></li>
                        <li><Link to="/about" className="block py-1">About Us</Link></li>
                        <li><Link to="/blog" className="block py-1">Blog</Link></li>
                        <li><Link to="/donation" className="block py-1">Blood Donation</Link></li>
                    </ul>
                    <div className="px-4 py-2 flex flex-col space-y-2">
                        <button className="px-4 py-2 rounded border border-gray-300">Sign in</button>
                        <button className="px-4 py-2 font-semibold rounded bg-violet-600 text-white">Sign up</button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
