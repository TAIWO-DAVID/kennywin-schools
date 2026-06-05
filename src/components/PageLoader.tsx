"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { usePageReady } from "@/contexts/AuthContext"

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true)
  const { setPageReady } = usePageReady()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setPageReady(true) // 🔑 animations start now
    }, 500)

    return () => clearTimeout(timer)
  }, [setPageReady])

  return (
    <div className={`page-loader ${!isVisible ? "hide" : ""} bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500` }>
      <Image 
        src="/images/school_logo_enhanced_brightness-no-bg-Photoroom.png"
        alt="School Logo" 
        width={140} 
        height={140} priority />
    </div>
  )
}
