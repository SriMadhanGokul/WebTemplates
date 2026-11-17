import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories, templates, countIn, asset } from '../data/templates.js'
import TemplateCard from '../components/TemplateCard.jsx'

export default function Home() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const featured = templates.filter((t) => t.featured)
  const showcase = ['003', '006', '011']

  const search = (e) => {
    e.preventDefault()
    navigate(`/templates${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow-pill">✦ {templates.length} premium templates · {categories.length} categories</span>
            <h1>Beautiful websites,<br /><em>ready to launch.</em></h1>
            <p>Browse hand-crafted, fully responsive templates for fashion, electronics, real estate, food and more. Preview live, pick your favourite and make it yours.</p>
            <form className="hero-search" onSubmit={search}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates — e.g. headphones, saree, villa" />
              <button className="btn btn-dark">Search</button>
            </form>
            <div className="quick-cats">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="chip">{c.icon} {c.short}</Link>
              ))}
            </div>
          </div>
          <div className="hero-stack" aria-hidden="true">
            {showcase.map((id, i) => (
              <div key={id} className={`stack-card s${i}`}>
                <div className="browser-bar"><i /><i /><i /></div>
                <img src={asset(id, 'thumb.jpg')} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container stats-row">
        <div><b>{templates.length}</b><span>Templates</span></div>
        <div><b>{categories.length}</b><span>Categories</span></div>
        <div><b>100%</b><span>Responsive</span></div>
        <div><b>4K</b><span>Imagery</span></div>
      </section>

      {/* Categories */}
      <section className="container section">
        <div className="section-head">
          <div><span className="eyebrow">Browse by category</span><h2>Find the right fit for your business</h2></div>
          <Link to="/templates" className="link">View all templates →</Link>
        </div>
        <div className="cat-grid">
          {categories.map((c) => {
            const first = templates.find((t) => t.category === c.slug)
            return (
              <Link key={c.slug} to={`/category/${c.slug}`} className="cat-card">
                <div className="cat-img"><img src={asset(first.id, 'thumb.jpg')} alt="" loading="lazy" /></div>
                <div className="cat-info">
                  <span className="cat-icon">{c.icon}</span>
                  <div><h3>{c.name}</h3><p>{c.blurb}</p></div>
                  <span className="count">{countIn(c.slug)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container section">
        <div className="section-head">
          <div><span className="eyebrow">Hand-picked</span><h2>Featured templates</h2></div>
          <Link to="/templates?featured=1" className="link">See all featured →</Link>
        </div>
        <div className="card-grid">
          {featured.slice(0, 6).map((t) => <TemplateCard key={t.id} t={t} />)}
        </div>
      </section>

      {/* Steps */}
      <section className="container section steps">
        <div className="section-head center"><div><span className="eyebrow">How it works</span><h2>From browsing to launch in three steps</h2></div></div>
        <div className="steps-grid">
          <div><span>01</span><h3>Browse &amp; filter</h3><p>Explore templates by category, style or keyword.</p></div>
          <div><span>02</span><h3>Preview live</h3><p>Open any template full-screen on desktop, tablet or mobile size.</p></div>
          <div><span>03</span><h3>Customise &amp; launch</h3><p>Swap text and images in plain HTML/CSS and publish anywhere.</p></div>
        </div>
      </section>

      {/* CTA */}
      <section className="container section">
        <div className="cta-band">
          <div><h2>Ready to explore every template?</h2><p>See all {templates.length} designs side by side and filter by what you need.</p></div>
          <Link to="/templates" className="btn btn-light">Browse all templates →</Link>
        </div>
      </section>
    </main>
  )
}
