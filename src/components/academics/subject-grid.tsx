'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TypeIcon as type, LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// IntersectionObserver to trigger fade/slide-in on scroll
function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            obs.unobserve(e.target)
          }
        })
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1, ...(options || {}) }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [options])
  return { ref, inView }
}

type Department = {
  name: string
  icon: LucideIcon
  description: string
  subjects: { name: string; summary: string }[]
}

export default function SubjectGrid({
  departments,
  accent = 'primary',
}: {
  departments: Department[]
  accent?: 'primary' | 'secondary'
}) {
  return (
    <div className="space-y-10">
      {departments.map((dept, idx) => (
        <DepartmentSection key={dept.name} dept={dept} dir={idx % 2 === 0 ? 'left' : 'right'} />
      ))}
    </div>
  )
}

function DepartmentSection({ dept, dir }: { dept: Department; dir: 'left' | 'right' }) {
  const { ref, inView } = useInView()

  const slideClass = dir === 'left' ? 'slide-in-from-left-6' : 'slide-in-from-right-6'

  return (
    <div
      ref={ref}
      className={[
        'rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:p-6',
        inView ? `animate-in ${slideClass} fade-in-50 duration-700` : 'opacity-0',
      ].join(' ')}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            <dept.icon className="h-4 w-4" />
            {dept.name}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{dept.name} Department</h3>
          <p className="mt-1 max-w-2xl text-slate-600">{dept.description}</p>
        </div>
        <img
          src="/abstract-geometric-shapes.png"
          alt={`${dept.name} department visual`}
          className="hidden h-[90px] w-[140px] rounded-md border border-slate-200 object-cover shadow-sm sm:block"
          loading="lazy"
        />
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dept.subjects.map((s, i) => (
          <FlipCard key={`${dept.name}-${s.name}-${i}`} title={s.name} summary={s.summary} />
        ))}
      </div>
    </div>
  )
}

function FlipCard({ title, summary }: { title: string; summary: string }) {
  return (
    <div className="group perspective" aria-label={`${title} details`}>
      <div
        className={[
          'relative h-full min-h-[160px] w-full rounded-xl border border-slate-200 bg-white shadow-sm',
          'transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]',
          'focus-within:[transform:rotateY(180deg)]',
        ].join(' ')}
      >
        {/* Front */}
        <div
          className={[
            'absolute inset-0 rounded-xl p-5',
            'flex flex-col justify-between',
            '[backface-visibility:hidden]',
          ].join(' ')}
        >
          <div>
            <h4 className="text-base font-semibold text-slate-900">{title}</h4>
            <p className="mt-1 text-sm text-slate-600">{summary}</p>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2">
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
              Learn more
            </span>
            <img
              src="/subject-icon.png"
              alt=""
              className="h-7 w-7 rounded border border-slate-100 object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Back */}
        <div
          className={[
            'absolute inset-0 rounded-xl p-5',
            'flex flex-col justify-between',
            'bg-gradient-to-br from-amber-50 to-white',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
          ].join(' ')}
        >
          <div>
            <h4 className="text-base font-semibold text-amber-800">{title}</h4>
            <p className="mt-1 text-xs text-slate-700">
              Key outcomes: understanding, application, and confidence. Activities include practice,
              projects, and presentations.
            </p>
          </div>
          <div className="mt-0 flex items-center justify-between pt-2">
            <span className="text-xs text-slate-600">Hover or tap to flip back</span>
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
              Core goals
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
