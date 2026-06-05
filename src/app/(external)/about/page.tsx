"use client"

// import campus from "@/images/campus.jpg"
import Link from "next/link"
import Image from "next/image"
import { GraduationCap, Heart, Target, Lightbulb, Users, BookOpen } from "lucide-react"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"


export default function Component() {
  useEffect(()=>{
    AOS.init({ duration: 3000, once: true }) // duration = speed of animation
  },[])

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Hero Section */ }
      {/* <section className="relative bg-gradient-to-br from-yellow-50 to-gray-50 py-16 md:py-24"> */}
      <section className="relative bg-white  py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm sm:text-xs lg:text-xl font-medium">
                Excellence in Education Since Our Foundation
              </div>
              <h1 className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-popin">
                About <span className="text-yellow-600">Standard School</span> Moro
              </h1>
              {/* <p className="fade-in-20 justify-center text-xl text-gray-600 leading-relaxed "> */}
              {/* <div className="wrap-break-word max-w-80"> */}
              <p data-aos="fade-up" className="justify-center text-xl text-gray-600 leading-relaxed overflow-hidden border-r-2 border-black">
                Founded on the principles of discipline, innovation, and character-building, 
                Standard School provides a solid foundation from Early Years through Secondary Education. 
                Our curriculum combines national standards with global best practices, ensuring pupils develop 
                critical thinking, confidence, and leadership skills.
              </p>
              {/* </div> */}
            </div>
            <div className="relative animate-popin">
              <Image
                // src="/images/campus.jpg"
                src="/images/students_attentiveness2.jpg"
                alt="Standard School Campus"
                width={700}
                height={250}
                className="w-500 h-{250} md:w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-white p-4 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Levels */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div data-aos="fade-right" className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nursery School</h3>
              <p className="text-gray-600">
                Early childhood development with a focus on foundational learning and character building.
              </p>
            </div>
            <div data-aos="fade-down" className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Primary School</h3>
              <p className="text-gray-600">
                Comprehensive primary education that builds strong academic foundations and moral values.
              </p>
            </div>
            <div data-aos="fade-left" className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secondary School</h3>
              <p className="text-gray-600">
                Standard School offering both boarding and day options for comprehensive education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our <span className="text-yellow-600">Story</span>
              </h2>
              <div data-aos="zoom-in" className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Standard Nursery and Primary School was originally established in Oogi, Osun State, before relocating
                  to Moro. It was founded with the aim of providing qualitative education grounded in moral values and
                  the teachings of Jesus Christ.
                </p>
                <p>
                  The name "Standard" was chosen to reflect the high expectations and educational quality that the
                  school strives for. Our vision extends to establishing a secondary school — High Standard Model
                  College, which will offer both boarding and day options.
                </p>
                <p>
                  The school's operations are supported by a committed board, teachers, and administrative leaders,
                  guided by a passion to raise disciplined, God-fearing, and academically excellent students.
                </p>
              </div>
            </div>
            <div data-aos="fade-up" className="relative">
              <Image
                src="/images/female_teacher.jpg"
                alt="Students and Teachers"
                width={600}
                height={500}
                className="md:w-full rounded-2xl shadow-xl"
              />
              <div className="absolute -top-6 -right-6 bg-gray-800 text-white p-4 rounded-xl shadow-lg">
                <Heart className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Passion */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Vision, Mission & <span className="text-yellow-400">Passion</span>
            </h2>
            <div className="text-xl max-w-3xl mx-auto">
              Guided by our core values, we strive to shape the leaders of tomorrow through excellence in education and
              character development.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Vision */}
            <div data-aos="fade-up-right" className="bg-gray-800 p-8 rounded-xl border duration-300 animate-accordion-down border-yellow-400 md:border-gray-600 hover:border-yellow-400 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">Vision</h3>
              <p className="!text-gray-100 text-center leading-relaxed">
                To prepare candidates with quality education who will stand and defend their certificates, and be
                ambassadors of the institution.
              </p>
            </div>

            {/* Mission */}
            <div data-aos="zoom-in" className="bg-gray-800 p-8 rounded-xl border border-yellow-400 md:border-gray-600 hover:border-yellow-400 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">Mission</h3>
              <p className="!text-gray-100 text-center leading-relaxed">
                To catch them young and instill academic and moral values in them through dedicated teachers.
              </p>
            </div>

            {/* Passion */}
            <div data-aos="fade-up-left" className="bg-gray-800 p-8 rounded-xl border border-yellow-400 md:border-gray-600 hover:border-yellow-400 transition-colors">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">Passion</h3>
              <p className="!text-gray-100 text-center leading-relaxed">
                Daily progress rooted in purpose, godliness, and student-centered development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-yellow-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join the Standard School Family</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience excellence in education with a foundation built on Christian values and academic achievement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enroll">
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors animate-bounce">
              Apply for Admission
            </button>
            </Link>
            <Link href="/contact">
            <button className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact Us
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
