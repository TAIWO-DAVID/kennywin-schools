"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AOS from "aos";
import "aos/dist/aos.css";
import LoadingSpinner from "@/components/LoadingSpinner";

interface BlogPost {
  jetpack_featured_media_url: string;
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "https://public-api.wordpress.com/wp/v2/sites/taiwodavid0027.wordpress.com/posts?_embed&per_page=10"
        );
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
    AOS.init({ duration: 3000, once: true }) // duration = speed of animation
  }, []);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return <LoadingSpinner/>
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent animate-textShine">
            All News & Updates
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Browse through all the latest happenings, achievements, and insights
            from our school community.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-35">
            <p className="text-gray-600">No posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => {
               const imgUrl =
                    post.jetpack_featured_media_url ||
                    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/fallback.jpg";

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`} // ✅ ensure your route folder is /blogs/[slug]
                  className="group"
                >
                  <Card data-aos="zoom-in" className="border-gray-50 pt-0 hover:shadow-xl transition-shadow overflow-hidden h-full cursor-pointer">
                    <div className="relative h-64">
                      <Image
                        src={imgUrl}
                        alt={post.title.rendered}
                        fill
                        // width={600}
                        // height={400}
                        className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized // remove if you add WordPress domain in next.config.js
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
                        className="text-ash-900 group-hover:text-primary transition-colors line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                    </CardHeader>
                    <CardContent>
                      <CardDescription
                        className="text-gray-500 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      <span className="text-primary group-hover:text-gold-700 font-medium inline-flex items-center">
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
