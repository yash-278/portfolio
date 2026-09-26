'use client'

import React from 'react'
import { m, useReducedMotion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

interface SectionRevealProps {
  children: React.ReactNode
  delay?: number
  animate?: 'scroll' | 'mount'
  className?: string
}

export default function SectionReveal({
  children,
  delay = 0,
  animate = 'scroll',
  className,
}: SectionRevealProps) {
  // Reveals are decoration, so they collapse to the finished state rather than
  // replaying instantly when the reader has asked for less motion.
  const reduceMotion = useReducedMotion()

  const motionProps = reduceMotion
    ? { initial: 'visible' as const }
    : animate === 'mount'
      ? { initial: 'hidden', animate: 'visible' }
      : {
          initial: 'hidden',
          whileInView: 'visible',
          viewport: { once: true, margin: '-80px' },
        }

  return (
    <m.div
      className={className}
      variants={variants}
      {...motionProps}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </m.div>
  )
}
