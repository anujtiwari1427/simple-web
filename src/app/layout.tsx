import type { Metadata, Viewport } from "next";
import { Inter_Tight, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FA" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1828" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://codedecoded.com"),
  title: {
    default: "Code Decoded | Free resources, roadmaps, tutorials, and notes",
    template: "%s | Code Decoded",
  },
  description:
    "Free notes, cheat sheets, and roadmaps for Python, web development, DSA, and data science. Coding made simple and decoded for you.",
  keywords: [
    "Code Decoded",
    "DSA Cheatsheet",
    "Python for Data Science",
    "Web Development Roadmap",
    "DBMS Notes",
    "LeetCode Patterns",
    "Programming Notes",
  ],
  authors: [{ name: "Code Decoded" }],
  creator: "Code Decoded",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://codedecoded.com",
    title: "Code Decoded",
    description:
      "Free notes, cheat sheets, and roadmaps for Python, web development, DSA, and data science.",
    siteName: "Code Decoded",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Decoded",
    description:
      "Free notes, cheat sheets, and roadmaps for Python, web development, DSA, and data science.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--ink-950)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
