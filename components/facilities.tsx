'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Facilities() {
  const facilities = [
    {
      title: 'Modern Classrooms',
      description: 'Bright, spacious classrooms equipped with interactive boards and collaborative learning spaces',
      image: '/classroom.png',
    },
    {
      title: 'Sports Complex',
      description: 'Comprehensive sports facilities including playground, basketball court, and athletics track',
      image: '/sports.png',
    },
    {
      title: 'Advanced Library',
      description: 'Extensive collection of books, digital resources, and quiet study areas for research',
      image: '/library.png',
    },
  ]

  return (
    <section id="facilities" className="py-20 md:py-32 bg-white">
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
            World-Class <span className="text-primary">Facilities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            State-of-the-art infrastructure designed to support comprehensive learning and development
          </p>
        </motion.div>

        {/* Facilities Grid */}
        <div className="space-y-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'md:direction-reverse' : ''
              }`}
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`relative h-80 md:h-96 rounded-2xl overflow-hidden ${
                  index % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={index % 2 === 1 ? 'md:order-1' : ''}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {facility.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {facility.description}
                </p>
                <motion.ul
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  {[
                    'Modern infrastructure',
                    'Safety-first design',
                    'Inclusive accessibility',
                    'Sustainable practices',
                  ].map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 8 }}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <span className="w-2 h-2 bg-accent rounded-full" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Additional Facilities */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">More Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              '🍽️ Nutritious Cafeteria',
              '🚌 Safe Transportation',
              '👨‍⚕️ Medical Center',
              '🔒 24/7 Security',
            ].map((feature) => (
              <motion.div
                key={feature}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--muted)' }}
                className="p-6 rounded-xl bg-muted/50 border border-border text-foreground font-medium transition-all text-center cursor-pointer"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
