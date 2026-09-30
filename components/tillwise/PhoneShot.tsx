// Server Component — no 'use client'
// Frames a real Tillwise screenshot. These are actual captures from the app
// (Design/Screenshots in the app repo), so nothing here draws a fake UI.
// `cropped` shows only the top of the capture: the caller sets the height with an
// aspect class and the frame loses its bottom corners, so it has to sit on an edge
// that clips it (the hero's bottom border, the foot of a card).
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhoneShotProps {
  src: string
  alt: string
  priority?: boolean
  cropped?: boolean
  className?: string
  /** Rendered CSS width in px at desktop, used to size the responsive source. */
  width?: number
}

export default function PhoneShot({
  src,
  alt,
  priority = false,
  cropped = false,
  className,
  width = 322,
}: PhoneShotProps) {
  return (
    <div
      className={cn(
        // 36px frame radius. See the shape rule in the page header comment.
        'relative overflow-hidden rounded-[2.25rem] bg-[var(--tl-surface)]',
        'ring-1 ring-inset ring-white/10',
        'shadow-[0_40px_80px_-32px_rgba(0,0,0,0.75)]',
        cropped && 'rounded-b-none',
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
        className={
          cropped ? 'absolute inset-0 h-full w-full object-cover object-top' : 'block h-auto w-full'
        }
      />
    </div>
  )
}
