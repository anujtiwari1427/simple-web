export interface Testimonial {
  id: string;
  name: string;
  role: string;
  collegeOrCompany: string;
  avatarUrl: string;
  rating: number;
  text: string;
  highlightTag: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: "test-1",
    name: "Aman Verma",
    role: "Incoming SDE 1",
    collegeOrCompany: "Placed at Microsoft (Tier-3 College)",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "The Two Pointers and Sliding Window cheat sheets changed everything for me. Instead of memorizing 300 LeetCode problems, the patterns in Code Decoded's visual PDFs made interview problems trivial.",
    highlightTag: "DSA Patterns"
  },
  {
    id: "test-2",
    name: "Pooja Nair",
    role: "Full-Stack Developer",
    collegeOrCompany: "Accenture India",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "The Next.js 16 roadmap and React handwritten notes are gold. Clear, no corporate fluff, straight to the point.",
    highlightTag: "Full Stack Roadmap"
  },
  {
    id: "test-3",
    name: "Rohan Kulkarni",
    role: "Data Analyst Intern",
    collegeOrCompany: "Tier-2 NIT",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Python for Data Science was so easy to understand with the visual vectorization matrices. Highly recommended to every junior in college.",
    highlightTag: "Python & Pandas"
  }
];

export const mockYouTubeVideos = [
  {
    id: "0N9wxDj6rOs",
    title: "Bubble, Merge & Insertion Sort Demystified",
    thumbnail: "https://i.ytimg.com/vi/0N9wxDj6rOs/hqdefault.jpg",
    thumbnailUrl: "https://i.ytimg.com/vi/0N9wxDj6rOs/hqdefault.jpg",
    publishedAt: "Latest video",
    views: "New Masterclass",
    viewCount: "New Masterclass",
    duration: "Full Lecture",
    url: "https://youtu.be/0N9wxDj6rOs",
    youtubeUrl: "https://youtu.be/0N9wxDj6rOs",
    category: "DSA"
  },
  {
    id: "yt-1",
    title: "Dynamic Programming in 60 Minutes (The 4-Step Mental Model)",
    thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc042942f74?auto=format&fit=crop&w=640&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1516116211227-bbc042942f74?auto=format&fit=crop&w=640&q=80",
    publishedAt: "3 days ago",
    views: "42K views",
    viewCount: "42K views",
    duration: "58:14",
    url: "https://www.youtube.com/@codedecoded01",
    youtubeUrl: "https://www.youtube.com/@codedecoded01",
    category: "DSA"
  },
  {
    id: "yt-2",
    title: "Next.js 16 App Router & Server Components Crash Course for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=640&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=640&q=80",
    publishedAt: "1 week ago",
    views: "68K views",
    viewCount: "68K views",
    duration: "1:24:10",
    url: "https://www.youtube.com/@codedecoded01",
    youtubeUrl: "https://www.youtube.com/@codedecoded01",
    category: "Web Dev"
  },
  {
    id: "yt-3",
    title: "Pandas & Python Data Science Complete Tutorial with Real Projects",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&q=80",
    publishedAt: "2 weeks ago",
    views: "89K views",
    viewCount: "89K views",
    duration: "2:05:40",
    url: "https://www.youtube.com/@codedecoded01",
    youtubeUrl: "https://www.youtube.com/@codedecoded01",
    category: "Data Science"
  }
];
