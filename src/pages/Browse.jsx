import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { categories, templates, getCategory, countIn } from '../data/templates.js'
import TemplateCard from '../components/TemplateCard.jsx'
import NotFound from './NotFound.jsx'

const styles = ['All', 'Light', 'Dark', 'Warm', 'Colorful']

export default function Browse() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const style = params.get('style') || 'All'
  const sort = params.get('sort') || 'featured'
  const featuredOnly = params.get('featured') === '1'
  const cat = slug ? getCategory(slug) : null

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const term = q.toLowerCase()
    let out = templates.filter((t) =>
      (!slug || t.category === slug) &&
      (style === 'All' || t.style === style) &&
      (!featuredOnly || t.featured) &&
      (!term || [t.name, t.title, t.description, getCategory(t.category).name, ...t.tags].join(' ').toLowerCase().includes(term)))
    if (sort === 'newest') out = [...out].reverse()
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') out = [...out].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return out
  }, [slug, q, style, sort, featuredOnly])

  if (slug && !cat) return <NotFound />

  return (
    <main className="container browse">
      <div className="browse-head">
        <nav className="crumbs"><Link to="/">Home</Link> / {cat ? <><Link to="/templates">Templates</Link> / <span>{cat.name}</span></> : <span>All templates</span>}</nav>
        <h1>{cat ? <>{cat.icon} {cat.name}</> : 'All templates'}</h1>
        <p>{cat ? cat.blurb : `Every design in one place — ${templates.length} templates across ${categories.length} categories.`}</p>
      </div>

      <div className="browse-layout">
        <aside className="sidebar">
          <h6>Categories</h6>
          <Link to={`/templates?${params}`} className={!slug ? 'active' : ''}>All templates <span>{templates.length}</span></Link>
          {categories.map((c) => (
            <Link key={c.slug} to={`/category/${c.slug}?${params}`} className={slug === c.slug ? 'active' : ''}>
              {c.icon} {c.short} <span>{countIn(c.slug)}</span>
            </Link>
          ))}
          <h6>Style</h6>
          <div className="style-pills">
            {styles.map((s) => <button key={s} className={style === s ? 'on' : ''} onClick={() => set('style', s)}>{s}</button>)}
          </div>
          <label className="check"><input type="checkbox" checked={featuredOnly} onChange={(e) => set('featured', e.target.checked ? '1' : '')} /> Featured only</label>
        </aside>

        <section>
          <div className="toolbar">
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search by name, tag or keyword" />
            </div>
            <span className="result-count">{list.length} template{list.length === 1 ? '' : 's'}</span>
            <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sort">
              <option value="featured">Featured first</option>
              <option value="newest">Newest</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <div className="mobile-cats">
            <Link to="/templates" className={`chip ${!slug ? 'on' : ''}`}>All</Link>
            {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`} className={`chip ${slug === c.slug ? 'on' : ''}`}>{c.icon} {c.short}</Link>)}
          </div>

          {list.length ? (
            <div className="card-grid two">{list.map((t) => <TemplateCard key={t.id} t={t} />)}</div>
          ) : (
            <div className="empty">
              <h3>No templates match your filters</h3>
              <p>Try a different keyword or clear the filters.</p>
              <button className="btn btn-dark" onClick={() => setParams({})}>Clear filters</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
