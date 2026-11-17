import { Link } from 'react-router-dom'
import { categories, templates } from '../data/templates.js'

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand light"><span className="brand-mark">T</span>Templix</Link>
          <p>{templates.length} hand-crafted, responsive website templates — ready to preview, customise and launch.</p>
        </div>
        <div>
          <h6>Categories</h6>
          {categories.map((c) => <Link key={c.slug} to={`/category/${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h6>Explore</h6>
          <Link to="/templates">All templates</Link>
          <Link to="/templates?sort=newest">Newest</Link>
          <Link to="/templates?featured=1">Featured</Link>
        </div>
        <div>
          <h6>Contact</h6>
          <span>hello@templix.design</span>
          <span>Mon – Sat, 10 AM – 7 PM</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Templix. All rights reserved.</span>
        <span>Photos: Unsplash &amp; AI-generated</span>
      </div>
    </footer>
  )
}
