import { Link } from 'react-router-dom'
import { asset, getCategory } from '../data/templates.js'

export default function TemplateCard({ t }) {
  const cat = getCategory(t.category)
  return (
    <article className="t-card">
      <Link to={`/template/${t.id}`} className="t-thumb">
        <div className="browser-bar"><i /><i /><i /></div>
        <div className="t-shot">
          <img src={asset(t.id, 'full.jpg')} alt={`${t.name} template preview`} loading="lazy" />
        </div>
        <div className="t-overlay">
          <span className="btn btn-light">View Details</span>
        </div>
      </Link>
      <div className="t-body">
        <div className="t-top">
          <Link to={`/category/${t.category}`} className="chip">{cat.icon} {cat.short}</Link>
          <div className="swatches">{t.palette.map((c) => <i key={c} style={{ background: c }} />)}</div>
        </div>
        <h3><Link to={`/template/${t.id}`}>{t.name}</Link></h3>
        <p>{t.title}</p>
        <div className="t-actions">
          <Link to={`/template/${t.id}`} className="link">Details →</Link>
          <Link to={`/preview/${t.id}`} className="btn btn-dark btn-sm">Live Preview</Link>
        </div>
      </div>
    </article>
  )
}
