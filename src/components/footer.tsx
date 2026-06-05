import React from 'react'
import {
    Phone,
    BookOpen,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
} from "lucide-react";
import Link from 'next/link';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Standard School</span>
            </div>
            <div className="!text-white mb-4">
              Committed to excellence in education and developing tomorrow's
              leaders through innovative learning experiences.
            </div>
            
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2 text-ash-300">
              <li>
                <Link href="/about" className="hover:text-gold-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/academics" className="hover:text-gold-400">
                  Academic Programs
                </Link>
              </li>
              <li>
                <Link href="/enroll" className="hover:text-gold-400">
                  Admissions
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold-400">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-ash-300">
              <li>
                <Link href="#" className="hover:text-gold-400">
                  Nursery School
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-400">
                  Primary School
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold-400">
                  High School
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-gold-400">
                  Payment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-ash-300">
              <div className="flex items-center">
                <MapPin className="h-6 w-8 mr-2 text-gold-400" />
                <span className='text-xs'>Standard High School, Moro Road, Ife North West Local Government, Osun State, Nigeria.</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gold-400" />
                <span><a href="+234706 877 7735">+234 706 877 7735</a></span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gold-400" />
                <span><a href="+2348139345775">+234 813 934 5775</a></span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gold-400" />
                <span>standardshs2017@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className='pt-10'>
          <div className="flex justify-center items-center space-x-4">
              <Facebook className="h-5 w-5 text-ash-400 hover:text-gold-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-ash-400 hover:text-gold-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-ash-400 hover:text-gold-400 cursor-pointer" />
            </div>
        </div>

        <div className="border-t border-ash-700 mt-12 pt-8 text-center text-ash-400">
          <p>
            &copy; {new Date().getFullYear()} Standard School. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer