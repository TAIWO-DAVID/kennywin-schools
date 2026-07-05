'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Phone, Mail } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary via-secondary to-accent overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
          >
            Ready to Start Your Child&apos;s Journey?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            Join Premier Academy and watch your child flourish academically, socially, and personally.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-primary rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Enroll Now
              <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white/20 text-white rounded-lg font-bold text-lg border-2 border-white hover:bg-white/30 transition-all w-full sm:w-auto"
            >
              Schedule Tour
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-16 border-t border-white/20 grid md:grid-cols-2 gap-8"
        >
          {[
            {
              icon: Phone,
              label: 'Call Us',
              value: '+1 (555) 123-4567',
            },
            {
              icon: Mail,
              label: 'Email Us',
              value: 'admissions@premieracademy.edu',
            },
          ].map((contact) => {
            const Icon = contact.icon
            return (
              <motion.a
                key={contact.value}
                href={contact.label === 'Call Us' ? 'tel:+15551234567' : 'mailto:admissions@premieracademy.edu'}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 text-white group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all"
                >
                  <Icon size={24} />
                </motion.div>
                <div>
                  <p className="text-sm text-white/80">{contact.label}</p>
                  <p className="text-lg font-semibold">{contact.value}</p>
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-white/90 text-sm"
        >
          📍 123 Education Lane, Knowledge City, KN 12345
        </motion.div>
      </div>
    </section>
  )
}
