'use client'

import { motion } from 'framer-motion'
import { BookOpen, Heart, Zap, Users } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: BookOpen,
      title: 'Intellectual Growth',
      description: 'Quality education fostering intellectual growth and lifelong learning passion',
    },
    {
      icon: Heart,
      title: 'Moral Values',
      description: 'Building well-rounded individuals with strong moral character and integrity',
    },
    {
      icon: Zap,
      title: 'Creativity & Innovation',
      description: 'Encouraging creativity and innovation to equip learners for a changing world',
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Fostering respect, empathy and inclusivity in our learning community',
    },
  ]

  return (
    <section id="about" className="py-20 md:py-32 bg-white">
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
            About <span className="text-primary">KennyWin Schools</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Since 2019, we&apos;ve been committed to providing quality education that empowers children to become the next generation of moral leaders in Nigeria.
          </p>
        </motion.div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-border hover:border-primary/30 transition-all"
              >
                <motion.div
                  className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Icon className="text-accent" size={24} />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 border border-primary/10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">Our Mission & Vision</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-2">Mission</h4>
              <p className="text-lg text-foreground leading-relaxed">
                Providing a nurturing environment that fosters intellectual growth, creativity, and innovation. We develop well-rounded individuals with strong moral character and a passion for lifelong learning, equipping learners with skills and knowledge to succeed in a rapidly changing world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-foreground mb-2">Vision</h4>
              <p className="text-lg text-foreground leading-relaxed">
                To be a leading institution in our community and Nigeria, providing quality education that inspires academic excellence, moral values, and social responsibility.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
