'use client'

import { motion } from 'framer-motion'
import { Mail, Heart, Share2, Headphones } from 'lucide-react'

export default function Footer() {
  const footerLinks = [
    {
      title: 'School',
      links: ['About Us', 'Our Story', 'Programs', 'Facilities'],
    },
    {
      title: 'Community',
      links: ['Testimonials', 'Achievements', 'Donate', 'Contact Us'],
    },
    {
      title: 'Location',
      links: ['No. 25 Ajegunle Street', 'Obantoko, Abeokuta', 'Ogun State, Nigeria'],
    },
    {
      title: 'Contact',
      links: ['08060343853', '07060621781', 'Globus Bank Account'],
    },
  ]

  const socialLinks = [
    { icon: Mail, label: 'Email', color: 'hover:text-blue-600' },
    { icon: Heart, label: 'Support', color: 'hover:text-red-600' },
    { icon: Share2, label: 'Share', color: 'hover:text-blue-500' },
    { icon: Headphones, label: 'Support', color: 'hover:text-green-600' },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Footer Grid */}
        <div className="grid md:grid-cols-5 gap-8 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-accent to-primary rounded-lg flex items-center justify-center font-bold text-background">
                KW
              </div>
              <h3 className="text-xl font-bold">KennyWin Schools</h3>
            </div>
            <p className="text-sm text-background/70">
              Building Brighter Futures since 2019. Empowering the next generation of moral leaders in Nigeria.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href="#"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-background/60 transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
            >
              <h4 className="font-semibold text-background mb-4">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      className="text-background/70 text-sm hover:text-background transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px bg-background/20 mb-8 origin-left"
        />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/70"
        >
          <p>
            &copy; 2026 KennyWin Schools Limited. All rights reserved.
          </p>
          <p>
            Building Brighter Futures for Nigerian Children
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
