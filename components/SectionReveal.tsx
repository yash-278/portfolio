'use client'

import React from 'react'
import { m } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  animate?: 'scroll' | 'mount'
}

export default function SectionReveal({
  children,
  delay = 0,
  animate = 'scroll',
}: SectionRevealProps) {
  const motionProps =
    animate === 'mount'
      ? { initial: 'hidden', animate: 'visible' }
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-80px' },
        }

  return (
    <m.div
      variants={variants}
      {...motionProps}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </m.div>
  )
}
