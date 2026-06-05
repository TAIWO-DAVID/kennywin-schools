'use client'

import { useEffect, useRef, useState } from 'react'

type ImageItem = { src: string; alt: string }

export default function PhotoGallery({
  title = 'Photo Gallery',
  images = [],
}: {
  title?: string
  images: ImageItem[]
}) {
  return (
    <section aria-labelledby="gallery-title" className="bg-white">
      <div className="flex items-center justify-between">
        <h3 id="gallery-title" className="text-2xl font-semibold text-slate-900">
          {title}
        </h3>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
          {images.length} photos
        </span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <FadeIn key={img.src + i}>
            <div className="group overflow-hidden rounded-xl border border-slate-100">
              <img
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

function FadeIn({ children }: { children: React.ReactNode }) {
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
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={inView ? 'animate-in fade-in-50 duration-700' : 'opacity-0'}
    >
      {children}
    </div>
  )
}
