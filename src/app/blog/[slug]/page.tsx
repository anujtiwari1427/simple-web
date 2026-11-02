import { notFound } from "next/navigation";
import { Metadata } from "next";
import { initialBlogPosts } from "@/data/blogData";
import { BlogReaderClient } from "@/components/blog/BlogReaderClient";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = initialBlogPosts.find(b => b.slug === slug);

  if (!post) {
    return {
      title: "Tutorial Not Found | Code Decoded",
    };
  }

  return {
    title: `${post.title} | Code Decoded Tutorial`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export async function generateStaticParams() {
  return initialBlogPosts.map(b => ({
    slug: b.slug,
  }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = initialBlogPosts.find(b => b.slug === slug);

  if (!post) {
    notFound();
  }

  const related = initialBlogPosts
    .filter(b => b.id !== post.id)
    .slice(0, 2);

  return <BlogReaderClient post={post} relatedPosts={related} />;
}
