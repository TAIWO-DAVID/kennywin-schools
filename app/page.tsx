'use client'

import Header from '@/components/header'
import Hero from '@/components/hero'
import About from '@/components/about'
import Story from '@/components/story'
import Programs from '@/components/programs'
import Facilities from '@/components/facilities'
import Achievements from '@/components/achievements'
import Testimonials from '@/components/testimonials'
import Donate from '@/components/donate'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Story />
        <Programs />
        <Facilities />
        <Achievements />
        <Testimonials />
        <Donate />
      </main>
      <Footer />
    </div>
  )
}
