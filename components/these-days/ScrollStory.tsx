'use client'

import { useEffect, useRef, useState } from 'react'
import type { StaticImageData } from 'next/image'
import DeviceFrame from '@/components/these-days/DeviceFrame'
import styles from './ScrollStory.module.css'

export type StoryStep = {
  name: string
  title: string
  description: string
  sample: string
  sampleNote: string
  src: StaticImageData
  alt: string
}

// One pinned phone, three steps of copy. The screen follows the step that is
// most in view. Below 900px wide or 620px tall, each step carries its own phone.
// Reduced motion keeps the pinned layout and only removes the cross-fade.
export default function ScrollStory({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLElement[]
    if (!elements.length) return
    let frame = 0
    // Pick the step whose centre is nearest the viewport centre. Geometry rather than
    // intersection, so an anchor jump or a fast scroll lands on the right screen.
    const update = () => {
      frame = 0
      const middle = window.innerHeight / 2
      let nearest = 0
      let distance = Infinity
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
        const gap = Math.abs(rect.top + rect.height / 2 - middle)
        if (gap < distance) {
          distance = gap
          nearest = index
        }
      })
      setActive(nearest)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className={styles.story}>
      <div className={styles.pinned} aria-hidden="true">
        <div className={styles.stack}>
          {steps.map((step, index) => (
            <DeviceFrame
              key={step.name}
              className={`${styles.phone} ${active === index ? styles.visible : ''}`}
              src={step.src}
              alt=""
              sizes="(max-width: 1100px) 280px, 320px"
            />
          ))}
        </div>
        <ol className={styles.progress}>
          {steps.map((step, index) => (
            <li key={step.name} className={active === index ? styles.current : undefined}>{step.name}</li>
          ))}
        </ol>
      </div>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <section
            key={step.name}
            ref={(element) => { stepRefs.current[index] = element }}
            data-step={index}
            className={styles.step}
            aria-labelledby={`story-${index}`}
          >
            <p className={styles.stepName}>{step.name}</p>
            <h3 id={`story-${index}`}>{step.title}</h3>
            <p className={styles.stepText}>{step.description}</p>
            <figure className={styles.sample}>
              <blockquote>{step.sample}</blockquote>
              <figcaption>{step.sampleNote}</figcaption>
            </figure>
            <DeviceFrame
              className={styles.inlinePhone}
              src={step.src}
              alt={step.alt}
              sizes="(max-width: 420px) 240px, 280px"
            />
          </section>
        ))}
      </div>
    </div>
  )
}
