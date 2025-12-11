import React, { useState } from "react";
import Link from "next/link";
// Component for the Logo
const Logo = () => (
  <div className="flex items-center space-x-2">
    {/* A placeholder for the diamond logo */}
    <div className="w-4 h-4 transform rotate-45 bg-white"></div>
    {/* TEXT SIZE SCALING: text-sm by default, scales up to sm:text-base on small screens and larger */}
    <span className="text-sm font-semibold tracking-wider text-white sm:text-base">
      BIONZ TRADING
    </span>
  </div>
);

// Array defining the navigation links
const navItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "MarketCap", href: "/marketcap" },
  { name: "News", href: "/news" },
  { name: "Tips", href: "/tips" },
  { name: "Signals", href: "/signals" },
  { name: "Analyze", href: "/analyze" },
  { name: "More", href: "/more" },
];

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = "bg-neutral-800";

  // DESKTOP LINK STYLE: Uses 'text-sm' for a sleek, compact look on larger screens.
  const linkStyle =
    "text-sm text-white relative transition-all duration-300 hover:text-gray-300 hover:scale-[1.06]";

  return (
    // Fixed positioning at the top with a high Z-index
    <nav
      className={`fixed top-0 w-full ${bgColor} z-50 border-b border-gray-700 shadow-lg`}
    >
      {/* Desktop and Main Bar Container */}
      <div className="container px-2 py-2 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex p-2 items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links (Uses 'text-sm' via linkStyle) */}
          <div className="hidden space-x-6 sm:flex sm:items-center m-4">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className={linkStyle}>
                {item.name}
              </a>
            ))}
          </div>

          {/* Sign In Button (Desktop - Uses 'text-sm') */}
          <div className="hidden sm:block">
            <button>
              <Link
                href="/authentication"
                className="text-sm text-white relative transition-all duration-300 hover:text-gray-300 hover:scale-[1.06]"
              >
                Sign in
              </Link>
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger/X icon) */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU: Animated Slide-down Panel */}
      <div
        className={`sm:hidden transition-all duration-500 ease-in-out overflow-hidden ${bgColor} ${
          isOpen
            ? "max-h-110 opacity-100 py-3 border-t border-gray-700"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-2 space-y-2 -mt-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              // MOBILE LINK SIZE: Explicitly uses 'text-base' for better mobile touch targets/readability.
              className="block px-3 py-2 text-base font-medium rounded-md text-white hover:text-gray-300 transition-all duration-300"
            >
              {item.name}
            </a>
          ))}

          {/* Mobile Sign In Button (Uses 'text-base') */}
          <button className="w-full px-3 py-2 text-base font-medium text-center text-white bg-transparent border border-white rounded-md hover:bg-white hover:text-neutral-800 transition-all duration-300 ease-in-out">
            <Link
              href="/authentication"
              className="text-sm text-white relative transition-all duration-300 hover:text-gray-300 hover:scale-[1.06]"
            >
              Sign in
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
