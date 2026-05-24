import type { Metadata } from 'next'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'

export const metadata: Metadata = {
  title: 'Yash Kadam — Technical Lead',
  description:
    'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
    </>
  )
}
