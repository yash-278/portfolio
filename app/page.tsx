import type { Metadata } from 'next'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import WorkSection from '@/components/WorkSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Yash Kadam — Technical Lead',
  description:
    'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
  openGraph: {
    title: 'Yash Kadam — Technical Lead',
    description:
      'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
    url: 'https://yashkadam.com',
    siteName: 'Yash Kadam',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Kadam — Technical Lead',
    description:
      'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og.png`],
  },
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}
