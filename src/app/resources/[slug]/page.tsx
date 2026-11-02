import { notFound } from "next/navigation";
import { Metadata } from "next";
import { initialResources } from "@/data/resourcesData";
import { ResourceDetailClient } from "@/components/resources/ResourceDetailClient";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = initialResources.find(r => r.slug === slug);

  if (!resource) {
    return {
      title: "Resource Not Found | Code Decoded",
    };
  }

  return {
    title: `${resource.title} | Free Decoded Resource`,
    description: resource.description,
    openGraph: {
      title: `${resource.title} - Free ${resource.type}`,
      description: resource.description,
    },
  };
}

export async function generateStaticParams() {
  return initialResources.map(r => ({
    slug: r.slug,
  }));
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = initialResources.find(r => r.slug === slug);

  if (!resource) {
    notFound();
  }

  const related = initialResources
    .filter(r => r.topic === resource.topic && r.id !== resource.id)
    .slice(0, 2);

  return <ResourceDetailClient resource={resource} relatedResources={related} />;
}
