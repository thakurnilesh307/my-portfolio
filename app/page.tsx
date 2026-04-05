import Nav from './components/Nav'
import Hero from './components/Hero'
import Now from './components/Now'
import Footer from './components/Footer'
import { getNowItems, getRecentActivity } from '../lib/notion'

export default async function Home() {
  // @ts-ignore
  const nowItems = await getNowItems()
  // @ts-ignore
  const activity = await getRecentActivity(8)

  const typeStyles: Record<string, { color: string; dot: string; label: string }> = {
    win:      { color: '#1D9E75', dot: '#1D9E75', label: 'win' },
    struggle: { color: '#E24B4A', dot: '#E24B4A', label: 'struggling with' },
    note:     { color: 'var(--fg-muted)', dot: 'var(--fg-faint)', label: 'note' },
  }

  return (
    <main>
      <Nav />
      <Hero />
      <div className="container">
        <Now items={nowItems} />

        {activity.length > 0 && (
          <section style={{ padding: '2rem 0 6rem', borderTop: '1px solid var(--border)' }}>
            <p className="section-label" style={{ marginBottom: '0.5rem' }}>recent</p>
            <h2 style={{ fontSize: '24px', fontWeight: 500, letterSpacing: '-0.01em', marginBottom: '2.5rem' }}>
              latest activity
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activity.map((log: any, i: number) => {
                const p       = log.properties
                const entry   = p.Entry?.rich_text?.[0]?.plain_text ?? ''
                const type    = p.Type?.select?.name ?? 'note'
                const date    = p.Date?.date?.start ?? ''
                const ts = typeStyles[type] ?? typeStyles.note
                const isLast = i === activity.length - 1

                return (
                  <div key={log.id} style={{ display: 'flex', gap: '12px' }}>
                    {/* timeline spine */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5px', flexShrink: 0 }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ts.dot, flexShrink: 0 }} />
                      {!isLast && <div style={{ flex: 1, width: '1px', background: 'var(--border)', margin: '4px 0' }} />}
                    </div>

                    {/* content */}
                    <div style={{ paddingBottom: isLast ? 0 : '1.25rem', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: ts.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {ts.label}
                        </span>
                        {date && (
                          <span style={{ fontSize: '11px', color: 'var(--fg-faint)' }}>
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--fg-muted)', lineHeight: 1.65 }}>{entry}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <Footer />
      </div>
    </main>
  )
}
