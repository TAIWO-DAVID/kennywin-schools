"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface BlogPost {
  jetpack_featured_media_url: string;
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

export default function BlogSinglePage() {
  const { slug } = useParams(); // /blog/[slug]
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  <LoadingSpinner/>

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // const res = await fetch(
        //   `https://public-api.wordpress.com/wp/v2/sites/taiwodavid0027.wordpress.com/posts?_embed&slug=${slug}`
        // );
        // const data = await res.json();
        const res = await fetch(
          `https://public-api.wordpress.com/wp/v2/sites/taiwodavid0027.wordpress.com/posts?slug=${slug}&_embed`
        );
        const data = await res.json();
        const post = data[0]; // because WP returns an array

        setPost(post || null);
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    <LoadingSpinner/>
  }

  if (!post) {
    return (
      <div className="py-40 text-center text-gray-500">
        Post not found or unavailable.
      </div>
    );
  }

  const imgUrl =
    post.jetpack_featured_media_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "/fallback.jpg";

  return (
    <article className="py-20 pt-5 bg-white">
      <Link href="/blog" className=" px-10 pb-10">
        {/* <!-- From Uiverse.io by xopc333 -->  */}
        <button className="button">
          <div className="button-box">
            <span className="button-elem">
              <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
              </svg>
            </span>
            <span className="button-elem">
              <svg viewBox="0 0 46 40">
                <path
                  d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z"
                ></path>
              </svg>
            </span>
          </div>
        </button>
      </Link>
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        {/* Post Title */}
        <h1
          className="text-4xl font-extrabold text-ash-900 mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Date */}
        <div className="flex items-center text-sm text-ash-500 mb-6">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(post.date)}
        </div>

        {/* Featured Image */}
        <div className="relative h-65 lg:h-[70vh] md:h-[70vh] w-full mb-8">
          <Image
            // src={post.jetpack_featured_media_url || "/file.jpg"}
            src={imgUrl}
            alt={post.title.rendered}
            // width={800}
            // height={500}
            fill
            className="rounded-xl object-cover"
            // className="object-cover group-hover:scale-105 transition-transform duration-500"

            unoptimized
          />

        </div>

        {/* Post Content */}
        <div
          className="text-sm sm:text-base md:text-lg prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>
    </article>
  );
}
