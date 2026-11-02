"use client";

import { Star, Heart, Quote } from "lucide-react";
import { testimonialsData } from "@/data/testimonialsData";
import { InstagramIcon, YoutubeIcon, LinkedinIcon } from "@/components/common/BrandIcons";

export function Testimonials() {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />;
      case "YouTube":
        return <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-[#070d1a]/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-pink-500 mb-2">
            <Heart className="w-4 h-4 fill-pink-500" />
            <span>Community Love</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Trusted by 75,000+ ambitious students across India
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            From tier-3 college engineering students to professionals landing top tech offers. Here is how Code Decoded simplified their learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialsData.map(t => (
            <div
              key={t.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-2" />

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &quot;{t.content}&quot;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                      {t.companyOrCollege}
                    </p>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800" title={t.platform}>
                  {getPlatformIcon(t.platform)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
