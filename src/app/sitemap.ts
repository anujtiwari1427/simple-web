import { MetadataRoute } from "next";
import { initialResources } from "@/data/resourcesData";
import { roadmapsData } from "@/data/roadmapsData";
import { initialBlogPosts } from "@/data/blogData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://codedecoded.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/roadmaps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const resourceRoutes: MetadataRoute.Sitemap = initialResources.map(r => ({
    url: `${baseUrl}/resources/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const roadmapRoutes: MetadataRoute.Sitemap = roadmapsData.map(r => ({
    url: `${baseUrl}/roadmaps/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogRoutes: MetadataRoute.Sitemap = initialBlogPosts.map(b => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...resourceRoutes, ...roadmapRoutes, ...blogRoutes];
}
