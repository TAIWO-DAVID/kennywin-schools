'use client'

import { motion } from 'framer-motion'
import { Award, Target, Heart } from 'lucide-react'

export default function Story() {
  const milestones = [
    {
      year: '2019',
      title: 'KennyWin Schools Founded',
      description: 'Established on Monday, September 16, 2019, with a vision to provide quality education to Nigerian children.',
      icon: Target,
    },
    {
      year: '2019-2023',
      title: 'Building a Community',
      description: 'Grew from a small startup to a thriving community with 100+ students and a dedicated team of educators.',
      icon: Heart,
    },
    {
      year: '2023',
      title: 'Rising from Challenges',
      description: 'After the devastating heavy rainfall and windstorm destroyed our building in 2023, we refused to go back. We are now building state-of-the-art facilities to create an inspiring learning environment.',
      icon: Award,
    },
  ]

  return (
    <section id="story" className="py-20 md:py-32 bg-linear-to-br from-blue-50 via-white to-orange-50">
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
            Our <span className="text-primary">Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From humble beginnings to overcoming adversity, KennyWin Schools is committed to building tomorrow's leaders.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            return (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="p-6 md:p-8 bg-white rounded-xl border border-border hover:border-primary/30 transition-all"
                  >
                    <p className="text-sm font-semibold text-primary mb-2">{milestone.year}</p>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </motion.div>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="shrink-0 w-16 h-16 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center"
                >
                  <Icon className="text-white" size={32} />
                </motion.div>

                {/* Spacer for md screens */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            )
          })}
        </div>

        {/* Inspiration Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 p-8 md:p-12 bg-linear-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">Building Tomorrow's Leaders Today</h3>
          <p className="text-lg text-foreground leading-relaxed mb-6">
            We are raising tomorrow's leaders who will turn the world around for good because of the discipline we are instilling in them. Every challenge we face strengthens our resolve to provide an exceptional learning experience that prepares our students to make meaningful contributions to society and Nigeria at large.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Discipline', 'Excellence', 'Integrity', 'Community'].map((value) => (
              <span
                key={value}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium"
              >
                {value}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
