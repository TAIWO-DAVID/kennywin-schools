"use client"

import Link from "next/link"
import Image from "next/image"
import AOS from "aos"
import "aos/dist/aos.css"
import { Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import LoadingSpinner from "./LoadingSpinner"


// You can reuse your API util or fetch directly from WordPress
async function getHomepagePosts() {
  try {
    const res = await fetch(
      "https://public-api.wordpress.com/wp/v2/sites/taiwodavid0027.wordpress.com/posts?per_page=3",
      { next: { revalidate: 180 } } // ISR: revalidate every 2 minutes
    )

    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Error fetching homepage posts:", error)
    return []
  }
}

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getHomepagePosts()
        setBlogPosts(posts)
      } catch (err) {
        console.error("Error fetching blog posts:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()

    AOS.init({ duration: 3000, once: true }) // duration = speed of animation
  }, [])

  
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent animate-textShine">
            Latest News & Updates
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Stay informed about the latest happenings, achievements, and insights from our school community.
          </p>
        </div>

        {/* Loader */}
        {loading && (
          <LoadingSpinner/>
        )}

        {/* Blog posts */}
        {!loading && blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card data-aos="zoom-in" className="border-gray-50 pt-0 hover:shadow-xl transition-shadow overflow-hidden h-full cursor-pointer">
                  <div className="relative h-64">
                    <Image
                      src={post.jetpack_featured_media_url || "/file.jpg"}
                      alt={post.title?.rendered || "Blog post image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      School News
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center text-sm text-ash-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.date)}
                    </div>
                    <CardTitle
                      className="text-ash-900 group-hover:text-primary transition-colors"
                      dangerouslySetInnerHTML={{
                        __html: post?.title?.rendered || "Untitled",
                      }}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardDescription
                      className="text-gray-500 mb-4 blog-paragraph"
                      dangerouslySetInnerHTML={{
                        __html: post?.excerpt?.rendered || "",
                      }}
                    />
                    <span className="text-primary animate-bounce group-hover:text-gold-700 font-medium inline-flex items-center mo">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 rounded-md text-white font-bold bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500
             transition-transform duration-300 shadow-lg hover:shadow-2xl animate-bounce"
          >
            View All News
          </Link>

        </div>
      </div>
    </section>
  )
}

