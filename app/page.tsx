import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import WritingSection from "@/components/WritingSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yash Kadam — Technical Lead",
  description:
    "Technical lead and fullstack developer. I build web products end to end, and lead the team that ships them.",
  openGraph: {
    title: "Yash Kadam — Technical Lead",
    description:
      "Technical lead and fullstack developer. I build web products end to end, and lead the team that ships them.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yashkadam.com",
    siteName: "Yash Kadam",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Kadam — Technical Lead",
    description:
      "Technical lead and fullstack developer. I build web products end to end, and lead the team that ships them.",
    images: ["/og.png"],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 md:grid-cols-[7fr_5fr] md:gap-24 md:py-28">
        <AboutSection />
        <WritingSection />
      </div>
      <ContactSection />
    </>
  );
}
