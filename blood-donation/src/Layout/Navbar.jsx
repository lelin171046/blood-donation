import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Simulated auth state (replace with real auth logic)
  const isLoggedIn = true;
  const user = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/40', // Placeholder avatar
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'text-red-600 font-semibold' : 'hover:text-red-600';

  const handleLogout = () => {
    console.log('Logging out...');
    // Add real logout logic
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 p-4 bg-white/30 dark:bg-gray-100/30 backdrop-blur-md backdrop-saturate-150 border-b border-white/20 dark:border-gray-200/20 shadow">


      <div className="container mx-auto flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center p-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6 items-center">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/donation" className={navLinkClass}>
              Donation Requests
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
          </li>
          {isLoggedIn && (
            <li>
              <NavLink to="/fundings" className={navLinkClass}>
                Fundings
              </NavLink>
            </li>
          )}
           <li>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
          </li>
        </ul>

        {/* Auth Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isLoggedIn ? (
            <Link to="/login" className="px-4 py-2 rounded border border-gray-300">
              Login
            </Link>
          ) : (
            <div className="relative group">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg hidden group-hover:block z-10">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t dark:bg-gray-100">
          <ul className="flex flex-col px-4 py-2 space-y-2">
            <li>
              <Link to="/donation" className="block py-1">
                Donation Requests
              </Link>
            </li>
            <li>
              <Link to="/blog" className="block py-1">
                Blog
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/fundings" className="block py-1">
                  Fundings
                </Link>
              </li>
            )}
          </ul>
          <div className="px-4 py-2 flex flex-col space-y-2">
            {!isLoggedIn ? (
              <Link to="/login" className="px-4 py-2 rounded border border-gray-300">
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded border border-gray-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-semibold rounded bg-red-600 text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
