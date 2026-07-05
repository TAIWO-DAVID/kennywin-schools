'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden pt-20 md:pt-0">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.span
                variants={itemVariants}
                className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium"
              >
                Est. September 2019
              </motion.span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Building a <span className="text-primary">Brighter Future</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                KennyWin Schools empowers children to become the next generation of moral leaders through quality education that inspires academic excellence, moral values, and social responsibility.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#donate"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(220, 53, 69, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all flex items-center gap-2 w-fit"
              >
                Support Our Mission
                <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="#story"
                whileHover={{ scale: 1.05, backgroundColor: 'var(--muted)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg hover:bg-muted transition-all block w-fit"
              >
                Our Story
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 pt-8"
            >
              {[
                { number: '5+', label: 'Years Strong' },
                { number: '100+', label: 'Students' },
                { number: 'Growing', label: 'Community' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/hero-school.png"
              alt="KennyWin Schools Modern Facility"
              fill
              className="object-cover"
              priority
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
