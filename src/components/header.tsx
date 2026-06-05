"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Sparkles, Menu, X } from "lucide-react";
import Image from "next/image"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Our Blog" },
  { href: "/academics", label: "Academic" },
  { href: "/enroll", label: "Enroll" },
  { href: "/contact", label: "Contact" },
  // { href: "/login", label: "Login" }, to be activated once login completed
];

const Header = () => {
  const flutterwaveLink = "/payment"; // Replace with your Flutterwave link
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <Image src="/images/school_logo_enhanced_brightness-no-bg.png" alt="School Logo" width={40} height={40} />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent"> Standard School <span className="text-amber-950">Moro</span></span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-ash-700 hover:text-primary font-medium transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}

        {/* Animated Pay Now Button */}
        <a
          href={flutterwaveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 relative inline-block"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-60 animate-pulse"></span>
          <button className="relative flex items-center bg-yellow-500 hover:bg-primary text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
            <CreditCard className="w-5 h-5 mr-2" />
            Pay Now
            <Sparkles className="w-4 h-4 ml-1 animate-ping" />
          </button>
        </a>
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-800 hover:text-primary transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center space-y-4 py-6 md:hidden animate-slideDown">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ash-700 hover:text-primary font-medium text-lg"
              onClick={() => setMobileMenuOpen(false)} // Close menu on click
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Pay Now Button */}
          <a
            href={flutterwaveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block mt-2"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-50 animate-pulse"></span>
            <button className="relative flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105">
              <CreditCard className="w-5 h-5 mr-2" />
              Pay Now
              <Sparkles className="w-4 h-4 ml-1 animate-ping" />
            </button>
          </a>
        </div>
      )}

   
    </header>
  );
};

export default Header;
