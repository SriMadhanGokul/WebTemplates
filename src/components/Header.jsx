import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { categories } from '../data/templates.js'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">T</span>Templix
        </Link>

        <nav className={`main-nav ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/templates">All Templates</NavLink>
          <div className="nav-drop">
            <span>Categories ▾</span>
            <div className="drop-menu">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`}>
                  <span>{c.icon}</span>{c.name}
                </Link>
              ))}
            </div>
          </div>
          <a href="#contact">Contact</a>
        </nav>

        <Link to="/templates" className="btn btn-dark header-cta">Browse Templates</Link>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
