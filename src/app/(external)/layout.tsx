"use client"; // 👈 mark as client
import React from "react";
// import { ReactNode } from "react";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Particles from "@/components/particles";
import "@/styles/globals.css";
import "@/styles/animations.css";
import AOS from "aos";
import "aos/dist/aos.css";


export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, // how long the animation lasts
      once: false,     // animate only once as you scroll down
      // mirror: true,
    });
    window.addEventListener("resize", AOS.refresh);
    return () => {
      window.removeEventListener("resize", AOS.refresh);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Header />
      <div className="pt-14 to-5% pb--20">
        <Particles />
        {children}
      </div>
      <Footer />
    </>
  );
}
