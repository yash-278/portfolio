// Server Component — no 'use client'
// Every call to action on the page is this component, so there is one label per
// intent no matter where it appears. Shape rule: interactive controls are pills.
import { cn } from '@/lib/utils'
import { BETA_EMAIL, TESTFLIGHT_URL } from '@/components/tillwise/beta'

const pill =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 text-[0.95rem] font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]'

export default function BetaCta({ className }: { className?: string }) {
  if (TESTFLIGHT_URL) {
    return (
      <a
        href={TESTFLIGHT_URL}
        className={cn(
          pill,
          'bg-[var(--tl-iris)] text-[var(--tl-canvas)] hover:brightness-110 active:scale-[0.98]',
          className
        )}
      >
        Join the beta
      </a>
    )
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-3', className)}>
      <span
        className={cn(
          pill,
          'cursor-default border border-[var(--tl-line)] bg-[var(--tl-surface)] text-[var(--tl-muted)]'
        )}
      >
        Beta invites soon
      </span>
      <a
        href={BETA_EMAIL}
        className="text-[0.95rem] text-[var(--tl-iris)] underline underline-offset-[5px] transition-colors duration-150 hover:text-[var(--tl-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
      >
        Ask for an invite
      </a>
    </div>
  )
}
