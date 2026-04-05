import Nav from '../../../app/components/Nav'
import Footer from '../../../app/components/Footer'
import { getNowItems, getLogEntries } from '../../../lib/notion'

export async function generateStaticParams() {
  // @ts-ignore
  const items = await getNowItems()
  return items.map((item: any) => ({ id: item.id }))
}


export default async function NowDetail({ params }: { params: any }) {
  const { id } = await params
  const nowItems = await getNowItems()
  const item = nowItems.find((i: any) => i.id === id) as any
  const logs = await getLogEntries(id)

  if (!item) return <div>Not found</div>

  const props       = item.properties
  const name        = props.Name?.title?.[0]?.plain_text ?? 'Untitled'
  const tagline     = props.Tagline?.rich_text?.[0]?.plain_text ?? ''
  const description = props.Description?.rich_text?.[0]?.plain_text ?? ''
  const category    = props.Category?.select?.name ?? ''
  const progress    = props.Progress?.number ?? 0
  const started     = props.Started?.date?.start ?? ''

  const catColors: any = {
    engineering: { bg: '#E1F5EE', color: '#0F6E56' },
    cooking: { bg: '#FAEEDA', color: '#854F0B' },
    personal: { bg: '#EEEDFE', color: '#534AB7' },
  }
  const cat = catColors[category] ?? { bg: 'var(--border)', color: 'var(--fg-muted)' }

  const typeColors: any = {
    win: { color: '#0F6E56', label: 'win' },
    struggle: { color: '#A32D2D', label: 'struggling with' },
    note: { color: 'var(--fg-muted)', label: 'note' },
  }

  const dotColors: any = {
    win: '#1D9E75',
    struggle: '#E24B4A',
    note: 'var(--fg-faint)',
  }

  return (
    <>
      <Nav />
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '0 2rem 4rem' }}>
        <a href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '1.25rem 0',
          fontSize: '13px',
          color: 'var(--fg-muted)',
        }}>
          ← back
        </a>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '3px 8px',
              borderRadius: '100px',
              background: cat.bg,
              color: cat.color,
              fontWeight: 500,
            }}>{category}</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '6px', lineHeight: 1.3 }}>{name}</h1>
          <p style={{ fontSize: '14px', color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: tagline && description ? '0.5rem' : '1.25rem' }}>{tagline}</p>
          {description && (
            <p style={{ fontSize: '13px', color: 'var(--fg-faint)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{description}</p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '1rem' }}>
            {[
              { label: 'progress', value: `${Math.round(progress * 100)}%` },
              { label: 'started', value: started ? new Date(started).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—' },
              { label: 'wins', value: logs.filter((l: any) => l.properties.Type?.select?.name === 'win').length },
              { label: 'struggles', value: logs.filter((l: any) => l.properties.Type?.select?.name === 'struggle').length },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--border)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                <p style={{ fontSize: '11px', color: 'var(--fg-faint)', marginBottom: '3px' }}>{stat.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{
              height: '3px',
              width: `${progress * 100}%`,
              background: category === 'engineering' ? '#1D9E75' : category === 'cooking' ? '#EF9F27' : '#7F77DD',
              borderRadius: '100px',
            }} />
          </div>
        </div>

        <h2 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem' }}>Learning log</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((log: any) => {
            const logProps = log.properties
            const entry = logProps.Entry?.rich_text?.[0]?.plain_text ?? ''
            const type = logProps.Type?.select?.name ?? 'note'
            const date = logProps.Date?.date?.start ?? ''
            const tc = typeColors[type] ?? typeColors.note
            const dc = dotColors[type] ?? dotColors.note

            return (
              <div key={log.id} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: dc, flexShrink: 0 }} />
                  <div style={{ flex: 1, width: '0.5px', background: 'var(--border)', marginTop: '4px' }} />
                </div>
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 500, color: tc.color }}>{tc.label}</span>
                    {date && (
                      <span style={{ fontSize: '11px', color: 'var(--fg-faint)' }}>
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--fg-muted)', lineHeight: 1.6 }}>{entry}</p>
                </div>
              </div>
            )
          })}
          {logs.length === 0 && (
            <p style={{ fontSize: '13px', color: 'var(--fg-faint)' }}>No log entries yet.</p>
          )}
        </div>
        <Footer />
      </main>
    </>
  )
}