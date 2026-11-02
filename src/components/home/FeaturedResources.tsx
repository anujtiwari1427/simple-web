"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tag } from "@/components/common/Tag";
import { ResourceCard } from "@/components/common/ResourceCard";
import { initialResources } from "@/data/resourcesData";

const TOPICS = ["All", "Python", "Web dev", "DSA", "DBMS", "Data science"];

export function FeaturedResources() {
  const [selectedTopic, setSelectedTopic] = useState("All");

  const filteredResources = useMemo(() => {
    let list = initialResources;
    if (selectedTopic !== "All") {
      list = list.filter(
        r => r.topic.toLowerCase() === selectedTopic.toLowerCase()
      );
    }
    return list.slice(0, 6);
  }, [selectedTopic]);

  return (
    <section className="py-16 sm:py-24 border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-h2 font-display font-bold text-[var(--heading)]">
              New resources
            </h2>
            <p className="mt-2 text-small text-[var(--muted)] max-w-xl">
              Free notes, cheat sheets, and templates for practical learning.
            </p>
          </div>

          <Link
            href="/resources"
            className="text-sm font-display font-semibold text-[var(--accent)] hover:underline self-start sm:self-auto"
          >
            Browse all resources
          </Link>
        </div>

        {/* Filterable Topic Strip per Section 6 & 7 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {TOPICS.map(topic => (
            <Tag
              key={topic}
              asButton
              active={selectedTopic === topic}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic}
            </Tag>
          ))}
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              enableHoverDecode={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
