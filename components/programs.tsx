'use client'

import { motion } from 'framer-motion'

export default function Programs() {
  const programs = [
    {
      name: 'Early Years (KG)',
      age: 'Ages 4-5',
      description: 'Foundation building through play-based learning, developing early literacy and numeracy skills',
      color: 'from-blue-50 to-blue-100',
      accent: 'bg-secondary',
    },
    {
      name: 'Pre-nursery',
      age: 'Ages 6-7',
      description: 'Strengthening core academic skills with introduction to scientific thinking and problem solving',
      color: 'from-orange-50 to-orange-100',
      accent: 'bg-accent',
    },
    {
      name: 'Nursery',
      age: 'Ages 8-9',
      description: 'Advanced academics paired with leadership development and creative expression programs',
      color: 'from-red-50 to-red-100',
      accent: 'bg-primary',
    },
    {
      name: 'Primary',
      age: 'Ages 10-11',
      description: 'Comprehensive curriculum preparing students for secondary school with emphasis on independence',
      color: 'from-purple-50 to-purple-100',
      accent: 'bg-secondary',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="programs" className="py-20 md:py-32 bg-linear-to-b from-white via-blue-50/30 to-white">
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
            Our <span className="text-primary">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Carefully designed curricula for each grade level, tailored to developmental needs
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.name}
              variants={itemVariants}
              whileHover={{ y: -12, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className={`bg-linear-to-br ${program.color} rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all group cursor-pointer`}
            >
              {/* Age badge */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`inline-block px-3 py-1 ${program.accent} text-white rounded-full text-xs font-semibold mb-4`}
              >
                {program.age}
              </motion.div>

              <h3 className="text-xl font-bold text-foreground mb-2">{program.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{program.description}</p>

              {/* Hover reveal */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileHover={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-border/30"
              >
                <ul className="text-xs text-foreground space-y-2">
                  <li>✓ Personalized learning paths</li>
                  <li>✓ Expert faculty guidance</li>
                  <li>✓ Regular progress tracking</li>
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Special Programs Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Beyond the Classroom
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Arts & Music', description: 'Fostering creativity through visual arts, performing arts, and music programs' },
              { title: 'Sports & Fitness', description: 'Building healthy habits and team spirit through diverse sporting activities' },
              { title: 'Technology & Innovation', description: 'Coding, robotics, and digital literacy for the modern world' },
            ].map((program) => (
              <motion.div
                key={program.title}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6"
              >
                <h4 className="text-lg font-semibold text-primary mb-2">{program.title}</h4>
                <p className="text-muted-foreground">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
