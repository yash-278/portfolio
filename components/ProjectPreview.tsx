// Server Component — no 'use client'
// Illustrative stand-ins for real screenshots, with sample data.
// The raw hex values are deliberate: these depict each project's own (light) UI,
// so they must not follow the site's semantic tokens or a future light-mode toggle.

export type PreviewName = 'nekomori' | 'brew-index'

type Episode = { title: string; detail: string; state?: 'next' | 'done' }

const schedule: { day: string; today?: boolean; episodes: Episode[] }[] = [
  { day: 'Wed 16', episodes: [{ title: 'Dandadan', detail: 'Ep 8, watched', state: 'done' }] },
  {
    day: 'Thu 17',
    episodes: [
      { title: 'Blue Lock', detail: 'Ep 11, watched', state: 'done' },
      { title: 'Orb', detail: 'Ep 6, watched', state: 'done' },
    ],
  },
  {
    day: 'Today',
    today: true,
    episodes: [
      { title: 'Frieren', detail: 'Ep 9, airs 20:30', state: 'next' },
      { title: 'Apothecary Diaries', detail: 'Ep 3, airs 23:45' },
    ],
  },
  {
    day: 'Sat 19',
    episodes: [
      { title: 'Spy x Family', detail: 'Ep 4, 19:00' },
      { title: 'Kaiju No. 8', detail: 'Ep 7, 23:00' },
    ],
  },
  { day: 'Sun 20', episodes: [{ title: 'One Piece', detail: 'Ep 1122, 09:30' }] },
  { day: 'Mon 21', episodes: [{ title: 'Mushishi', detail: 'Rewatch, ep 12' }] },
]

const formulae = [
  { name: 'jq', summary: 'Lightweight and flexible command-line JSON processor', version: '1.7.1' },
  { name: 'gron', summary: 'Make JSON greppable', version: '0.7.1' },
  { name: 'jless', summary: 'Command-line pager for JSON data', version: '0.9.0' },
  { name: 'fx', summary: 'Terminal JSON viewer', version: '35.0.0' },
]

function Frame({ title, tabs, children }: { title: string; tabs: string[]; children: React.ReactNode }) {
  return (
    <div className="rounded-tl-xl bg-[#f4f7f4] text-[0.82rem] leading-tight text-[#14241f] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-5 border-b border-[#dbe3dd] px-5 py-3.5">
        <b className="text-base">{title}</b>
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={i === 0 ? 'pb-0.5 font-semibold shadow-[0_2px_0_#14241f]' : 'text-[#6b7d75]'}
          >
            {tab}
          </span>
        ))}
      </div>
      {children}
    </div>
  )
}

export default function ProjectPreview({ name }: { name: PreviewName }) {
  if (name === 'nekomori') {
    return (
      <Frame title="Nekomori" tabs={['Schedule', 'Watchlist', 'Finished']}>
        <div className="grid grid-cols-6">
          {schedule.map((col, i) => (
            <div key={col.day} className={`min-h-[19rem] px-2.5 pb-6 pt-3 ${i > 0 ? 'border-l border-[#dbe3dd]' : ''}`}>
              <p className={`mb-2.5 text-xs font-semibold ${col.today ? 'text-[#9a5f09]' : 'text-[#6b7d75]'}`}>
                {col.day}
              </p>
              {col.episodes.map((ep) => (
                <div
                  key={ep.title}
                  className={`mb-2 rounded-lg px-2.5 py-2 ${
                    ep.state === 'done'
                      ? 'border border-dashed border-[#c3d0c8] text-[#7c8d85]'
                      : ep.state === 'next'
                        ? 'bg-[#f6dcae]'
                        : 'bg-[#dfeae4]'
                  }`}
                >
                  <b className="block">{ep.title}</b>
                  <span className="text-[0.72rem] text-[#55685f]">{ep.detail}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Frame>
    )
  }

  return (
    <Frame title="Brew Index" tabs={['Formulae', 'Casks']}>
      <div className="mx-5 mb-1.5 mt-4 rounded-[10px] border border-[#cfdad3] bg-white px-4 py-3 text-base">
        json
      </div>
      <ul className="px-5 pb-20">
        {formulae.map((formula, i) => (
          <li
            key={formula.name}
            className={`grid grid-cols-[7rem_1fr_4.5rem] items-baseline gap-4 py-3 ${
              i === 0 ? '-mx-2.5 rounded-lg bg-[#e8f0eb] px-2.5' : 'border-b border-[#dbe3dd]'
            }`}
          >
            <b className="text-[0.95rem]">{formula.name}</b>
            <span className="text-[#55685f]">{formula.summary}</span>
            <span className="tabular-nums text-[#6b7d75]">{formula.version}</span>
          </li>
        ))}
      </ul>
    </Frame>
  )
}
