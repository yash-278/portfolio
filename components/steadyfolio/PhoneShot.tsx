// Server Component — no 'use client'
// Frames a real Steadyfolio screenshot. These are actual captures from the app
// (Design/Screenshots in the steadyfolio repo), so nothing here draws a fake UI.
// The screenshots run to the bottom edge of a taller screen than we show, so each
// one is cropped from the top and `fade` covers the cut with a wash to the canvas.
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneShotProps {
  src: string
  alt: string
  priority?: boolean
  fade?: boolean
  className?: string
  /** Rendered CSS width in px at desktop, used to size the responsive source. */
  width?: number
}

export default function PhoneShot({
  src,
  alt,
  priority = false,
  fade = false,
  className,
  width = 322,
}: PhoneShotProps) {
  return (
    <div
      className={cn(
        // 40px frame radius. See the shape rule in the page header comment.
        'relative overflow-hidden rounded-[2.25rem] bg-[var(--sf-surface)]',
        'ring-1 ring-inset ring-white/10',
        'shadow-[0_40px_80px_-32px_rgba(0,0,0,0.75)]',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={644}
        height={1400}
        sizes={`(min-width: 768px) ${width}px, 80vw`}
        priority={priority}
        className="block h-auto w-full"
      />
      {fade && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--sf-canvas)]"
        />
      )}
    </div>
  )
}
