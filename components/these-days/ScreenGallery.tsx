'use client'

import { useId, useRef, useState } from 'react'
import { BookOpen, PencilLine, Sparkles } from 'lucide-react'
import DeviceFrame from './DeviceFrame'
import todayScreen from '@/public/these-days/today.png'
import journalScreen from '@/public/these-days/journal.png'
import reflectScreen from '@/public/these-days/reflect.png'
import styles from '@/app/these-days/these-days.module.css'

const screens = [
  {
    name: 'Write',
    icon: PencilLine,
    title: 'A line is a good place to start.',
    description:
      'Open on today, write what comes to mind, and save it to your day. Each thought gets its own time. A longer entry is always one tap away.',
    detail: 'Quick capture, with room for more.',
    src: todayScreen,
    alt: 'Today, showing dated sample entries and a field for writing another line.',
    quote: 'Coffee by the open window. The street was still quiet.',
    tag: '#smallthings',
  },
  {
    name: 'Revisit',
    icon: BookOpen,
    title: 'Find your way back to a day.',
    description:
      'Read an old entry, browse the calendar, or find a familiar name. Inline tags and people connect the moments you want to come back to.',
    detail: 'Search by a word, a tag, or a person.',
    src: journalScreen,
    alt: 'Journal, with 20 sample entries grouped by day, favorite stars, inline tags, and a mention of Maya Chen.',
    quote: 'Walked to the bakery with @Maya Chen. Took the long way back through the park.',
    tag: '#outside',
  },
  {
    name: 'Reflect',
    icon: Sparkles,
    title: 'Some days, start with a question.',
    description:
      'Pick a question when the words are hard to find. Look back at your answers, revisit this day in another year, or see what you wrote yesterday.',
    detail: 'Your answers stay with their questions.',
    src: reflectScreen,
    alt: 'Reflect, with a writing question, an On this day entry from the previous year, and entries from yesterday.',
    quote: 'What will you remember about this week?',
    tag: 'A question to write from',
  },
]

export default function ScreenGallery() {
  const [selected, setSelected] = useState(0)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const screen = screens[selected]

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryControls} role="tablist" aria-label="Explore the app">
        {screens.map(({ name, icon: Icon }, index) => (
          <button
            key={name}
            ref={(element) => { buttons.current[index] = element }}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next: number
              if (event.key === 'ArrowRight') next = (selected + 1) % screens.length
              else if (event.key === 'ArrowLeft') next = (selected + screens.length - 1) % screens.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = screens.length - 1
              else return
              event.preventDefault()
              setSelected(next)
              buttons.current[next]?.focus()
            }}
          >
            <Icon size={19} strokeWidth={1.6} aria-hidden="true" />{name}
          </button>
        ))}
      </div>
      {screens.map((item, index) => (
        <div
          key={item.name}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={selected !== index}
          tabIndex={0}
          className={styles.galleryPanel}
        >
          {selected === index && (
            <>
              <div className={styles.galleryCopy}>
                <h3>{screen.title}</h3>
                <p>{screen.description}</p>
                <div className={styles.sample}>
                  <p>{screen.quote}</p>
                  <span>{screen.tag}</span>
                </div>
                <p className={styles.galleryDetail}>{screen.detail}</p>
              </div>
              <figure className={styles.galleryVisual}>
                <DeviceFrame
                  className={styles.galleryPhone}
                  src={screen.src}
                  alt={screen.alt}
                  sizes="(max-width: 700px) 250px, 280px"
                />
                <figcaption>Development preview. Sample entries.</figcaption>
              </figure>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
