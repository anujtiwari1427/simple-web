export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ResourceTopic =
  | 'Python'
  | 'Web Dev'
  | 'DSA'
  | 'DBMS'
  | 'Data Science'
  | 'Interview Prep'
  | 'DevOps';

export type ResourceType =
  | 'PDF'
  | 'Cheat Sheet'
  | 'Notes'
  | 'GitHub Repo'
  | 'Tool'
  | 'Free Course';

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: ResourceTopic;
  type: ResourceType;
  difficulty: Difficulty;
  tags: string[];
  downloadUrl: string;
  previewUrl?: string;
  downloadsCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  publishedAt: string;
  fileSize?: string;
  pageCount?: number;
  author: string;
  keyTakeaways: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  topics: string[];
  resources: {
    title: string;
    url: string;
    type: 'video' | 'doc' | 'cheat-sheet' | 'practice';
  }[];
  estimatedTime: string;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  duration: string;
  prerequisites: string[];
  phases: RoadmapPhase[];
  icon: string;
  color: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown formatted
  coverImage?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readingTimeMinutes: number;
  tags: string[];
  viewsCount: number;
}

export interface UpdateAnnouncement {
  id: string;
  title: string;
  category: 'YouTube' | 'Resource' | 'Event' | 'Instagram' | 'News';
  date: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
  badge?: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  companyOrCollege: string;
  avatar: string;
  rating: number;
  content: string;
  platform: 'Instagram' | 'YouTube' | 'LinkedIn';
  handle: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  views: string;
  duration: string;
  url: string;
  category: string;
}
