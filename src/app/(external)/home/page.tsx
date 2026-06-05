"use client"
// import BlogSection from "@/components/BlogSection";
import { useEffect, useState, useRef } from "react";
import Particles from "@/components/particles";
import { motion } from "framer-motion";
import BlogSection from "@/components/BlogSection";
import { usePageReady } from "@/contexts/AuthContext"
// import PageReveal from "@/components/PageReveal"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  X,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

{/* Tailwind + JSX Animations */}
function CountUp({ end, duration = 1000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          console.log("CountUp triggered!");
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const increment = end / (duration / 50);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 30);

    return () => clearInterval(timer);
  }, [end, duration, hasStarted]);

  return (
    <div ref={elementRef} className="text-3xl lg:text-4xl font-bold text-white mb-2">
      {count.toLocaleString()}
      {end > 100 ? "+" : end === 95 ? "%" : ""}
    </div>
  );
}


export default function Home() {
  
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);
  
  const { pageReady } = usePageReady()
  // <PageReveal>
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          id="top"
          className={`relative bg-gradient-to-br from-gold-50 to-ash-50 py-20 lg:py-32 overflow-hidden ${pageReady ? "animate-hero" : "hero-hidden"}`}
        >
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div
                className="space-y-6 relative z-10"
                style={{
                  transform: `translateY(${offsetY * 0.1}px)`,
                  transition: "transform 5s",
                }}
              >
                <Particles/>
                {/* Gradient Blob Highlight */}
                <div className="absolute -top-10 -left-4 w-72 h-24 bg-gradient-to-r from-yellow-400 via-yellow-200 to-transparent rounded-full opacity-30 blur-xl animate-blob"></div>

                <span className="bg-primary/40 text-gold-500 px-3 py-1 rounded-full inline-block animate-fade-in-down">
                  Excellence in Education Since 1998
                </span>

                <h1 className="text-4xl lg:text-6xl font-bold text-ash-900 leading-tight animate-fade-in-left">
                  Shaping Tomorrow's <span className="text-primary">Leaders</span>
                </h1>

                <p data-aos="fade-up" className=" text-lg text-gray-500 max-w-lg">
                  At Standard School Moro, we provide world-class education that
                  nurtures academic excellence, character development, and prepares
                  students for success in an ever-changing world.
                </p>

                <div className="flex flex-row gap-4 flex-wrap justify-start animate-fade-in-up">
                  {/* Stories & Insights Button */}
                  <Link href="/blog">
                    <Button className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group animate-bounce-slow">
                      Stories & Insights
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      {/* Gradient Shift Overlay */}
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 opacity-30 rounded-full blur-xl animate-gradient-x pointer-events-none"></span>
                      {/* Sparkle overlay */}
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-sparkle"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                          }}
                        ></span>
                      ))}
                    </Button>
                  </Link>

                  {/* Learn More Button */}
                  <Link href="/about">
                    <Button className="relative overflow-hidden border-ash-300 text-yellow-600 bg-transparent px-6 py-3 hover:bg-yellow-200 rounded-full font-semibold shadow hover:shadow-lg transition-all duration-500 transform hover:scale-105 group animate-bounce-slow">
                      Learn More
                      {/* Gradient Overlay for subtle shine */}
                      <span className="absolute inset-0 bg-ash-50 opacity-20 rounded-full blur-xl animate-gradient-x pointer-events-none"></span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <div
                className="relative animate-float mt-20"
                style={{
                  transform: `translateY(${offsetY * 0.05}px)`,
                  transition: "transform 0.1s",
                }}
              >
                <Image
                  src="/images/school_frontage_edited2.jpg"
                  alt="Standard School Campus"
                  width={600}
                  height={350}
                  className="rounded-lg shadow-xl p-0 h-full transform transition-transform duration-700 hover:scale-105"
                />

                {/* Floating Sparkles */}
                <div className="absolute top-0 left-1/2 w-full h-full pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-sparkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

  
          
        </section>

        {/* Features Section */}
        <section id="about" className="py-20 bg-ash-50 relative z-10">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent animate-textShine">
              
                Why Families Choose <span className="text-gold-600">Standard School</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A learning environment built on academic rigor, inspiring teachers, and
                opportunities beyond the classroom — shaping leaders for tomorrow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <BookOpen className="h-8 w-8 text-gold-600 relative z-10" />,
                  title: "Academic Excellence",
                  desc: "A rigorous and adaptive curriculum that challenges students to think critically, solve problems creatively, and excel in their chosen paths.",
                },
                {
                  icon: <Users className="h-8 w-8 text-gold-600 relative z-10" />,
                  title: "Expert Faculty",
                  desc: "Passionate educators with advanced expertise who mentor, guide, and inspire students to discover and maximize their unique talents.",
                },
                {
                  icon: <Award className="h-8 w-8 text-gold-600 relative z-10" />,
                  title: "Holistic Development",
                  desc: "Beyond academics: arts, sports, leadership, and service opportunities designed to nurture well-rounded, confident, and compassionate individuals.",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="p-[1px] rounded-2xl bg-gradient-to-r from-gold-300 to-gold-500 shadow-lg hover:shadow-gold-400/40 transition-all duration-500 hover:-translate-y-2"
                >
                  <Card className="bg-white rounded-2xl h-full flex flex-col justify-between">
                    <CardHeader className="text-center pt-8">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gold-400 via-gold-200 to-gold-300 opacity-30 blur-xl animate-blob"></div>
                        {card.icon}
                      </div>
                      <CardTitle className="text-ash-900 font-semibold text-xl">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center px-6 pb-6">
                        {card.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-500 py-20 overflow-hidden">
          {/* Floating blobs */}
          <div className="absolute top-0 left-1/2 w-72 h-72 bg-gold-300 opacity-20 rounded-full filter blur-3xl animate-blob -z-10"></div>
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-ash-200 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>

          <div className="container mx-auto px-4 lg:px-6 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {/* Students */}
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <CountUp end={1200} />
                </div>
                <div className="text-white/80">Students</div>
              </div>

              {/* College Acceptance */}
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <CountUp end={95} />
                </div>
                <div className="text-white/80">College Acceptance</div>
              </div>

              {/* Teachers */}
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <CountUp end={50} />
                </div>
                <div className="text-white/80">Expert Teachers</div>
              </div>

              {/* Years */}
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  <CountUp end={38} />
                </div>
                <div className="text-white/80">Years of Excellence</div>
              </div>
            </div>
          </div>

      
        </section>

        {/* BlogSection */}
        <BlogSection />  

        {/* CTA Section */}
        <section id="bottom" className="py-20 bg-primary">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
              Take the first step towards your child's bright future. Schedule a
              campus tour or apply for admission today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-transparent hover:text-white">
                Schedule Campus Tour
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent animate-bounce hover:animate-none"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  {/* </PageReveal> */}
}
