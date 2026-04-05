import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { getAllProjects } from '../../lib/notion'

export default async function ProjectsPage() {
  // @ts-ignore
  const allProjects = await getAllProjects()
  const projects = [...allProjects].sort((a: any, b: any) => {
    const aFeatured = a.properties.Featured?.checkbox ?? false
    const bFeatured = b.properties.Featured?.checkbox ?? false
    return Number(bFeatured) - Number(aFeatured)
  })

  return (
    <main>
      <Nav />
      <div className="container">
        <div style={{ padding: '4rem 0 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="section-label">work</p>
            <h1 style={{ fontSize: '32px', fontWeight: 500, letterSpacing: '-0.02em' }}>projects</h1>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--fg-faint)' }}>{projects.length} total</span>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginBottom: '6rem' }}>
          {projects.map((project: any, i: number) => {
            const props       = project.properties
            const name        = props.Name?.title?.[0]?.plain_text ?? 'Untitled'
            const tagline     = props.Tagline?.rich_text?.[0]?.plain_text ?? ''
            const description = props.Description?.rich_text?.[0]?.plain_text ?? ''
            const tags        = props.Tags?.multi_select?.map((t: any) => t.name) ?? []
            const category    = props.Category?.select?.name ?? ''
            const status      = props.Status?.select?.name ?? ''
            const link        = props.Link?.url ?? ''
            const github      = props.GitHub?.url ?? props.Github?.url ?? ''
            const featured    = props.Featured?.checkbox ?? false
            const year        = props.Date?.date?.start
              ? new Date(props.Date.date.start).getFullYear() : null

            const statusColor: Record<string, string> = {
              'shipped':     'var(--accent)',
              'in progress': '#EF9F27',
              'archived':    'var(--fg-faint)',
              'active':      'var(--accent)',
            }
            const sc = statusColor[status?.toLowerCase()] ?? 'var(--fg-faint)'

            return (
              <div key={project.id} className="project-row" style={{ cursor: 'default', display: 'grid', gridTemplateColumns: '2rem 1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                <span style={{ fontSize: '12px', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums', paddingTop: '2px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {category && <span className="chip">{category}</span>}
                    {featured && (
                      <span style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                        ★ featured
                      </span>
                    )}
                    {status && (
                      <span style={{ fontSize: '11px', color: sc, letterSpacing: '0.03em' }}>
                        {status}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px', color: 'var(--fg)' }}>{name}</p>
                  <p style={{ fontSize: '13px', color: 'var(--fg-muted)', lineHeight: 1.6 }}>{tagline}</p>
                  {description && (
                    <p style={{ fontSize: '12px', color: 'var(--fg-faint)', lineHeight: 1.7, marginTop: '6px' }}>{description}</p>
                  )}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--accent)' }}>
                        live ↗
                      </a>
                    )}
                    {github && (
                      <a href={github} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
                        github ↗
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', paddingTop: '2px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {tags.map((tag: string) => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                  </div>
                  {year && (
                    <span style={{ fontSize: '12px', color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
                      {year}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Footer />
      </div>
    </main>
  )
}
