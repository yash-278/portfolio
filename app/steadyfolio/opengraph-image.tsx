// Steadyfolio's share card uses the app's own dark tokens, not the site's, so a link
// to this page looks like the product rather than like a portfolio subpage.
import { ImageResponse } from 'next/og'

export const alt = 'Steadyfolio, a private expense ledger for iPhone'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#16161f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui',
        }}
      >
        <p style={{ color: '#a9a0f2', fontSize: 28, margin: '0 0 28px' }}>Steadyfolio</p>
        <h1 style={{ color: '#f2f1f8', fontSize: 68, lineHeight: 1.08, margin: 0, maxWidth: 900 }}>
          An expense ledger that never leaves your phone.
        </h1>
        <p style={{ color: '#a9a7b8', fontSize: 28, margin: '32px 0 0' }}>
          iPhone. No account, no bank login.
        </p>
      </div>
    ),
    { ...size }
  )
}
