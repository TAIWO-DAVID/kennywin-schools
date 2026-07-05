'use client'

import { motion } from 'framer-motion'
import { Award, Trophy, Star, BookOpen } from 'lucide-react'

export default function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: 'National Academic Awards',
      description: 'Recognized for excellence in education and curriculum innovation',
      stat: '5 Awards',
    },
    {
      icon: Award,
      title: 'Sports Championship',
      description: 'Consistent winners in district-level sports tournaments',
      stat: '15 Titles',
    },
    {
      icon: Star,
      title: 'Student Achievements',
      description: 'Our students excel in academics, arts, and athletics',
      stat: '92% Success',
    },
    {
      icon: BookOpen,
      title: 'Research & Innovation',
      description: 'Leading initiatives in modern pedagogical methods',
      stat: '20+ Programs',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-linear-to-br from-blue-50 via-white to-orange-50">
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
            Our <span className="text-primary">Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognition of excellence across all dimensions of school life
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            return (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="relative p-8 rounded-2xl bg-white border border-border hover:border-primary/30 group cursor-pointer overflow-hidden"
              >
                {/* Background decoration */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150"
                  transition={{ duration: 0.6 }}
                />

                <motion.div
                  whileHover={{ rotate: 10, scale: 1.2 }}
                  className="w-14 h-14 bg-linear-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4 relative z-10"
                >
                  <Icon className="text-primary" size={28} />
                </motion.div>

                <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">
                  {achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 relative z-10">
                  {achievement.description}
                </p>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-lg font-bold relative z-10"
                >
                  {achievement.stat}
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Recognition Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Our Community Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '1000+',
                label: 'Students Educated',
                description: 'Across multiple generations',
              },
              {
                number: '20+',
                label: 'Qualified Staff',
                description: 'Dedicated educators and mentors',
              },
              {
                number: '95%',
                label: 'Parent Satisfaction',
                description: 'Trusted by families',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-primary mb-2"
                >
                  {stat.number}
                </motion.p>
                <p className="text-lg font-semibold text-foreground mb-1">{stat.label}</p>
                <p className="text-muted-foreground">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
