'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, HeartPulse, Sparkles, Computer, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

type Slide = {
  title: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  image?: string
}

const defaultSlides: Slide[] = [
  {
    title: 'Excellence & Discipline',
    description:
      'High expectations with compassionate guidance—students grow in knowledge, character, and purpose.',
    icon: Sparkles,
    image:
      '/student-teacher-assembly.png',
  },
  {
    title: 'Student-Centered Learning',
    description:
      'Interactive lessons, collaboration, and projects that spark curiosity and ownership.',
    icon: Users,
    image:
      '/collaborative-students.png',
  },
  {
    title: 'Values and Wellbeing',
    description:
      'A supportive environment grounded in strong values, empathy, and wellbeing.',
    icon: HeartPulse,
    image:
      '/happy-students-school-values.png',
  },
  {
    title: 'Digital Literacy',
    description:
      'Responsible use of technology and future-ready skills in ICT.',
    icon: Computer,
    // image:
      // '/placeholder-l06q2.png',,
  },
  {
    title: 'Mastery of Fundamentals',
    description:
      'A strong foundation in reading, writing, and mathematics for lifelong learning.',
    icon: BookOpen,
    image:
      '/classroom-learning.png',
  },
]

export default function TeachingPhilosophyCarousel({
  slides = defaultSlides,
  intervalMs = 5000,
}: {
  slides?: Slide[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number | null>(null)
  const count = slides.length

  const go = (dir: number) => {
    setIndex((i) => (i + dir + count) % count)
  }

  const goto = (i: number) => setIndex(i)

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => go(1), intervalMs)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [index, intervalMs])

  const translateStyle = useMemo(
    () => ({ transform: `translateX(-${index * 100}%)` }),
    [index]
  )

  return (
    <div
      role="region"
      aria-label="Teaching philosophy carousel"
      className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={translateStyle}
      >
        {slides.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={s.title}
              className="min-w-full animate-in fade-in-50"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
            >
              <div className="grid grid-cols-1 items-center gap-6 p-6 sm:p-8 lg:grid-cols-2">
                <div className="order-2 lg:order-1">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                    <Icon className="h-4 w-4" />
                    Teaching Philosophy
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 max-w-prose text-slate-600">{s.description}</p>
                </div>
                <div className="order-1 lg:order-2">
                  <Card className="h-full overflow-hidden p-0.5">
                    <CardContent className="p-0">
                      <img
                        src={s.image ?? '/placeholder.svg?height=360&width=840&query=school%20learning%20environment'}
                        alt={s.title}
                        className="rounded-lg h-48 lg:h-96 w-full object-cover transition duration-500 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 md:bottom-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goto(i)}
            className={[
              'pointer-events-auto h-2.5 w-2.5 rounded-full border transition',
              i === index
                ? 'border-amber-600 bg-amber-600'
                : 'border-amber-300 bg-amber-100 hover:bg-amber-200',
            ].join(' ')}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => go(-1)}
          className="pointer-events-auto h-8 w-8 border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50"
          aria-label="Previous slide"
        >
          {'<'}
        </Button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => go(1)}
          className="pointer-events-auto h-8 w-8 border-amber-200 bg-white/80 text-amber-700 hover:bg-amber-50"
          aria-label="Next slide"
        >
          {'>'}
        </Button>
      </div>
    </div>
  )
}
