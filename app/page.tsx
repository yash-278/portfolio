import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import WorkSection from "@/components/WorkSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yash Kadam — Technical Lead",
  description:
    "Technical Lead and fullstack developer. I write code, lead teams, and ship things.",
  openGraph: {
    title: "Yash Kadam — Technical Lead",
    description:
      "Technical Lead and fullstack developer. I write code, lead teams, and ship things.",
    url: "https://yashkadam.com",
    siteName: "Yash Kadam",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`,
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
      "Technical Lead and fullstack developer. I write code, lead teams, and ship things.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og.png`],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
