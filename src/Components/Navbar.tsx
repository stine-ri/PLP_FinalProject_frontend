import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-purple-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-purple-900/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Mamashule
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-md font-medium transition duration-300"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-md font-medium transition duration-300"
              >
                About
              </Link>
              <Link 
                to="/features" 
                className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-md font-medium transition duration-300"
              >
                Features
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-yellow-300 px-3 py-2 rounded-md text-md font-medium transition duration-300"
              >
                Contact
              </Link>
              <div className="flex space-x-4 ml-4">
                <Link
                  to="/login"
                  className="text-white hover:bg-purple-700 hover:text-yellow-300 px-4 py-2 rounded-md text-md font-medium transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 hover:from-yellow-300 hover:to-yellow-400 px-4 py-2 rounded-md text-md font-bold transition duration-300 shadow-lg hover:shadow-yellow-400/30"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-yellow-300 focus:outline-none transition duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-800/95">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/features"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition duration-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-4 pb-2 border-t border-purple-700">
            <Link
              to="/login"
              className="block w-full px-4 py-2 text-center rounded-md text-base font-medium text-white hover:text-yellow-300 hover:bg-purple-700 transition duration-300 mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full px-4 py-2 text-center rounded-md text-base font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 hover:from-yellow-300 hover:to-yellow-400 transition duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;