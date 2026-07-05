'use client'

import { motion } from 'framer-motion'
import { Heart, MapPin, Phone, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function Donate() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const inKindNeeds = [
    'Cements',
    'Blocks',
    'Iron rods for pillars and decking',
    'Granite, sharp sand, plaster sand',
    'Roofing materials',
    'Playground swings',
    'Paint',
    'Furniture (desks, chairs, etc.)',
  ]

  const impacts = [
    {
      icon: '📚',
      title: 'Enhanced Education',
      description: 'Improve quality of education across Nigeria',
    },
    {
      icon: '🏫',
      title: 'Modern Facility',
      description: 'Create a safe, inspiring learning environment',
    },
    {
      icon: '👥',
      title: 'Future Leaders',
      description: "Support the development of tomorrow's leaders",
    },
    {
      icon: '🙏',
      title: 'God\'s Work',
      description: 'Be part of something meaningful for generations',
    },
  ]

  return (
    <section id="donate" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4"
          >
            <Heart size={16} />
            Support Our Mission
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Help Us <span className="text-primary">Build a Brighter Future</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve come to a point where we can&apos;t go back. After the 2023 disaster, we&apos;re rebuilding stronger than ever. Your generous donation will directly impact our students and the future of education in Nigeria.
          </p>
        </motion.div>

        {/* Impact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-linear-to-br from-blue-50 to-white border border-border hover:border-primary/30 transition-all text-center"
            >
              <div className="text-4xl mb-3">{impact.icon}</div>
              <h3 className="font-semibold text-foreground mb-2">{impact.title}</h3>
              <p className="text-sm text-muted-foreground">{impact.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* In-Kind Donations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl bg-linear-to-br from-orange-50 to-white border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">In-Kind Donations</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              We&apos;re actively seeking donations of building materials and supplies to construct our new facility.
            </p>
            <div className="grid grid-cols-1 gap-2">
              {inKindNeeds.map((need, index) => (
                <motion.div
                  key={need}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-foreground">{need}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Financial Donations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl bg-linear-to-br from-blue-50 to-white border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💳</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Financial Donations</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Send financial support to our school account to accelerate our construction and development projects.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold text-lg text-foreground">1000274527</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard('1000274527', 'account')}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {copied === 'account' ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-gray-600" />
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                <p className="font-bold text-foreground">Globus Bank</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Account Name</p>
                <p className="font-bold text-foreground">Kennywin Schools Limited</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 bg-linear-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Location */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-primary" size={24} />
                <h4 className="font-bold text-foreground">Physical Address</h4>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                No. 25, Ajegunle Street,
                <br />
                Off Fajol Hotel,
                <br />
                Obantoko,
                <br />
                Abeokuta, Ogun State
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl bg-white border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-primary" size={24} />
                <h4 className="font-bold text-foreground">Contact Numbers</h4>
              </div>
              <div className="space-y-2">
                {['08060343853', '07060621781'].map((phone) => (
                  <motion.button
                    key={phone}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => copyToClipboard(phone, phone)}
                    className="flex items-center justify-between gap-3 p-3 w-full text-left rounded-lg hover:bg-muted transition-colors group"
                  >
                    <span className="font-mono text-foreground group-hover:text-primary transition-colors">{phone}</span>
                    {copied === phone ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-gray-400 group-hover:text-gray-600" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recognition */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 p-6 bg-white rounded-xl border border-border text-center"
          >
            <p className="text-muted-foreground mb-3">
              <span className="font-semibold text-foreground">Donor Recognition:</span> All donors will be recognized on our school website, social media, and at our annual graduation ceremony. May God bless and reward your generosity!
            </p>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Together, we can build a state-of-the-art facility that will inspire generations of leaders. Thank you for being part of KennyWin Schools&apos; mission.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(220, 53, 69, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-primary hover:cursor-pointer text-primary-foreground rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
          >
            <Heart size={20} />
            Support KennyWin Schools
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
