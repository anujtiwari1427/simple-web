import { Users, Heart, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { InstagramIcon, YoutubeIcon, TelegramIcon, DiscordIcon, GithubIcon } from "@/components/common/BrandIcons";

export const metadata = {
  title: "Join the Community | Code Decoded",
  description: "Connect with 75,000+ ambitious developers across India on Instagram, YouTube, Telegram, Discord, and GitHub."
};

export default function CommunityPage() {
  const channels = [
    {
      name: "Instagram",
      handle: "@coded.ecoded",
      members: "50,000+ Followers",
      description: "Daily 60-second animated reels, carousel breakdowns of DSA patterns, placement interview tips, and humorous developer stories.",
      color: "border-pink-500/30 hover:border-pink-500",
      iconBg: "bg-pink-500/10 text-pink-500",
      link: "https://www.instagram.com/coded.ecoded",
      cta: "Follow on Instagram",
      icon: InstagramIcon
    },
    {
      name: "YouTube",
      handle: "@codedecoded01",
      members: "25,000+ Subscribers",
      description: "In-depth video lectures (1-2 hours), LeetCode pattern masterclasses, full-stack project builds, and career guidance sessions.",
      color: "border-red-500/30 hover:border-red-500",
      iconBg: "bg-red-500/10 text-red-500",
      link: "https://www.youtube.com/@codedecoded01",
      cta: "Subscribe on YouTube",
      icon: YoutubeIcon
    },
    {
      name: "Telegram Channel",
      handle: "t.me/codedecoded",
      members: "18,000+ Students",
      description: "Instant PDF notifications, cheat sheet download links directly to your phone, off-campus placement alerts, and interview updates.",
      color: "border-sky-500/30 hover:border-sky-500",
      iconBg: "bg-sky-500/10 text-sky-400",
      link: "https://t.me/codedecoded",
      cta: "Join Telegram Channel",
      icon: TelegramIcon
    },
    {
      name: "Discord Server",
      handle: "discord.gg/codedecoded",
      members: "12,000+ Members",
      description: "24/7 peer doubt-solving rooms, 100 Days of Code accountability channels, resume review sessions, and voice study rooms.",
      color: "border-indigo-500/30 hover:border-indigo-500",
      iconBg: "bg-indigo-500/10 text-indigo-400",
      link: "https://discord.gg/codedecoded",
      cta: "Join Discord Server",
      icon: DiscordIcon
    },
    {
      name: "GitHub Organization",
      handle: "github.com/codedecoded",
      members: "3,500+ Stars",
      description: "Open-source starter templates, Next.js boilperplates, clean code implementations of LeetCode patterns, and community contributions.",
      color: "border-slate-500/30 hover:border-slate-400",
      iconBg: "bg-slate-500/10 text-slate-300",
      link: "https://github.com/codedecoded",
      cta: "Star on GitHub",
      icon: GithubIcon
    }
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-cyan-500" />
            <span>The Code Decoded Collective</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Connect, Collaborate & Level Up Together
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Learning to code can feel lonely. Join 75,000+ peers sharing notes, solving bugs, and cheering each other on across our official channels.
          </p>
        </div>

        {/* Channel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map(channel => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.name}
                className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/80 border ${channel.color} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${channel.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {channel.members}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {channel.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                    {channel.handle}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
                  >
                    <span>{channel.cta}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Guidelines */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-4">
          <div className="flex items-center gap-2 text-cyan-500 font-bold text-lg">
            <ShieldCheck className="w-5 h-5" />
            <span>Our Community Code of Conduct</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>Be respectful & friendly:</strong> We all started as beginners. No question is too basic or silly.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>No spam or promotional links:</strong> Keep discussions focused on learning, projects, and interview prep.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>Help before asking:</strong> If you see a peer stuck on a bug in Discord or Telegram, offer a hint.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>Share the love:</strong> Share honest feedback so we can keep improving our free resources.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
