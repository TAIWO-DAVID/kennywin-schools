'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Parent',
      content: 'Premier Academy has transformed my son&apos;s confidence. The teachers genuinely care about each child&apos;s growth.',
      rating: 5,
      avatar: '👩‍🦰',
    },
    {
      name: 'Michael Chen',
      role: 'Parent',
      content: 'Outstanding facilities and faculty. My daughter has grown academically and socially beyond expectations.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Emma Williams',
      role: 'Student',
      content: 'I love coming to school! The teachers make learning fun, and I&apos;ve made great friends here.',
      rating: 5,
      avatar: '👧',
    },
    {
      name: 'David Patel',
      role: 'Parent',
      content: 'The holistic approach to education here is excellent. My child is developing into a well-rounded individual.',
      rating: 5,
      avatar: '👨‍🦱',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What They <span className="text-primary">Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from parents and students about their Premier Academy experience
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(220, 53, 69, 0.15)' }}
              className="p-6 md:p-8 rounded-2xl bg-linear-to-br from-blue-50 to-white border border-border hover:border-primary/30 transition-all group"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + i * 0.05 }}
                  >
                    <Star
                      size={18}
                      className="fill-accent text-accent"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground text-sm md:text-base leading-relaxed mb-6 italic">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-3xl"
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Testimonial CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-border text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">More Success Stories</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Watch video testimonials from our parents and students sharing their Premier Academy journey
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            View Video Testimonials
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
