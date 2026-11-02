"use client";

import { Users, FileText, Video, Download, Star } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      label: "Community Learners",
      value: "75,000+",
      subtext: "Across Instagram & YouTube",
      icon: Users,
      color: "text-cyan-500"
    },
    {
      label: "Decoded Resources",
      value: "45+",
      subtext: "Cheat sheets, notes & templates",
      icon: FileText,
      color: "text-emerald-500"
    },
    {
      label: "Video Masterclasses",
      value: "120+",
      subtext: "DSA, Web Dev & Data Science",
      icon: Video,
      color: "text-red-500"
    },
    {
      label: "Free Downloads",
      value: "100k+",
      subtext: "By engineering students in India",
      icon: Download,
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-12 border-y border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center md:items-start text-center md:text-left p-4 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition group"
              >
                <div className={`p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
