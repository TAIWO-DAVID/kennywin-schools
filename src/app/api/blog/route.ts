import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://public-api.wordpress.com/wp/v2/sites/taiwodavid0027.wordpress.com/posts?per_page=3", {
      next: { revalidate: 60 }, // cache for 1 minute
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await res.json();

    // Normalize data to only send what we need
    const formatted = posts.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch posts" }, { status: 500 });
  }
}
