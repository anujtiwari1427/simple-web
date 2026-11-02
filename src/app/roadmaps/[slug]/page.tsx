import { notFound } from "next/navigation";
import { Metadata } from "next";
import { roadmapsData } from "@/data/roadmapsData";
import { InteractiveRoadmap } from "@/components/roadmaps/InteractiveRoadmap";


interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmapsData.find(r => r.slug === slug);

  if (!roadmap) {
    return {
      title: "Roadmap Not Found | Code Decoded",
    };
  }

  return {
    title: `${roadmap.title} | Interactive Roadmap`,
    description: roadmap.description,
    openGraph: {
      title: `${roadmap.title} - Step-by-Step Learning Track`,
      description: roadmap.description,
    },
  };
}

export async function generateStaticParams() {
  return roadmapsData.map(r => ({
    slug: r.slug,
  }));
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = roadmapsData.find(r => r.slug === slug);

  if (!roadmap) {
    notFound();
  }

  return <InteractiveRoadmap roadmap={roadmap} />;
}
