import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'These Days. Before the day goes, keep a line of it. A private journal for iPhone.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fraunces = await readFile(join(process.cwd(), 'public/these-days/fonts/Fraunces-300.ttf'))

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 76px', background: '#0e1a3c', color: '#eef1fb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }}>
          <span>These Days</span>
          <span style={{ fontSize: 22, color: '#b8c0dd' }}>A private journal for iPhone</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Fraunces', fontWeight: 300, fontSize: 94, lineHeight: 1.05, letterSpacing: '-3px' }}>
          <span>Before the day goes,</span>
          <span>keep a line of it.</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, color: '#8f9bc6' }}>
          <span>Free on the App Store</span>
          <span>yashkadam.com/these-days</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Fraunces', data: new Uint8Array(fraunces).buffer, weight: 300, style: 'normal' }],
    },
  )
}
