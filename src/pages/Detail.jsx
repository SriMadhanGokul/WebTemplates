import { Link, useParams } from 'react-router-dom'
import { templates, getTemplate, getCategory, getPages, asset, liveUrl } from '../data/templates.js'
import TemplateCard from '../components/TemplateCard.jsx'
import NotFound from './NotFound.jsx'

export default function Detail() {
  const { id } = useParams()
  const t = getTemplate(id)
  if (!t) return <NotFound />
  const cat = getCategory(t.category)
  const pages = getPages(t.id)
  const idx = templates.indexOf(t)
  const prev = templates[(idx - 1 + templates.length) % templates.length]
  const next = templates[(idx + 1) % templates.length]
  const related = templates.filter((x) => x.id !== t.id && x.category === t.category).slice(0, 3)
  const more = related.length ? related : templates.filter((x) => x.id !== t.id).slice(0, 3)

  return (
    <main className="container detail">
      <nav className="crumbs"><Link to="/">Home</Link> / <Link to={`/category/${cat.slug}`}>{cat.name}</Link> / <span>{t.name}</span></nav>

      <div className="detail-grid">
        <div className="detail-shot">
          <div className="browser-bar"><i /><i /><i /><span>{t.name.toLowerCase().replace(/\s+/g, '')}.com</span></div>
          <div className="scroll-shot"><img src={asset(t.id, 'full.jpg')} alt={`${t.name} full page`} /></div>
          <p className="hint">Hover to scroll the full page</p>
        </div>

        <aside className="detail-info">
          <Link to={`/category/${cat.slug}`} className="chip">{cat.icon} {cat.name}</Link>
          <h1>{t.name}</h1>
          <h2>{t.title}</h2>
          <p>{t.description}</p>

          <div className="actions">
            <Link to={`/preview/${t.id}`} className="btn btn-dark">Live Preview</Link>
            <a href={liveUrl(t.id)} target="_blank" rel="noreferrer" className="btn btn-outline">Open in new tab ↗</a>
          </div>

          <dl className="specs">
            <div><dt>Template #</dt><dd>{t.id}</dd></div>
            <div><dt>Style</dt><dd>{t.style}</dd></div>
            <div><dt>Pages</dt><dd>{pages.length} pages</dd></div>
            <div><dt>Built with</dt><dd>HTML · CSS · JS</dd></div>
          </dl>

          <h6>Colour palette</h6>
          <div className="palette">{t.palette.map((c) => <div key={c}><i style={{ background: c }} /><span>{c}</span></div>)}</div>

          <h6>Pages included</h6>
          <div className="page-list">
            {pages.map(([s, l]) => (
              <Link key={s} to={s === 'index' ? `/preview/${t.id}` : `/preview/${t.id}?page=${s}`}>{l}<span>↗</span></Link>
            ))}
          </div>

          <h6>Homepage sections</h6>
          <ul className="sections">{t.sections.map((s) => <li key={s}>✓ {s}</li>)}</ul>

          <h6>Tags</h6>
          <div className="tags">{t.tags.map((g) => <Link key={g} to={`/templates?q=${encodeURIComponent(g)}`} className="chip">{g}</Link>)}</div>
        </aside>
      </div>

      <div className="pager">
        <Link to={`/template/${prev.id}`}>← {prev.name}</Link>
        <Link to={`/template/${next.id}`}>{next.name} →</Link>
      </div>

      <section className="section">
        <div className="section-head"><div><span className="eyebrow">{related.length ? `More in ${cat.short}` : 'You may also like'}</span><h2>Similar templates</h2></div></div>
        <div className="card-grid">{more.map((x) => <TemplateCard key={x.id} t={x} />)}</div>
      </section>
    </main>
  )
}
