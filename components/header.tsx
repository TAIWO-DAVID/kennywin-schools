'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Our Story', href: '#story' },
    { label: 'Programs', href: '#programs' },
    { label: 'Donate', href: '#donate' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {/* <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              KW
            </div> */}
            <img className="w-10 h-10 md:w-20 md:h-20 " src="KennyWinLogo-removebg-preview.png" alt="" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-primary font-serif">KennyWin Schools</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Building Brighter Futures</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ color: 'var(--primary)' }}
                className="text-foreground text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.a
            href="#donate"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:inline-flex px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all"
          >
            Support Us
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <nav className="flex flex-col gap-2 pb-4 pt-2">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                whileHover={{ x: 8 }}
                className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
            <a href="#donate" className="w-full mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all block text-center">
              Support Us
            </a>
          </nav>
        </motion.div>
      </div>
    </header>
  )
}
