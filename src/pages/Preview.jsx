import { useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getTemplate, getPages, liveUrl } from '../data/templates.js'
import NotFound from './NotFound.jsx'

const devices = [
  { key: 'desktop', label: 'Desktop', width: '100%' },
  { key: 'tablet', label: 'Tablet', width: '820px' },
  { key: 'mobile', label: 'Mobile', width: '390px' },
]

export default function Preview() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const t = getTemplate(id)
  const [device, setDevice] = useState('desktop')
  const [shown, setShown] = useState(null)
  const frame = useRef(null)
  if (!t) return <NotFound />
  const pages = getPages(t.id)
  const known = (s) => pages.some(([p]) => p === s)
  const src = known(params.get('page')) ? params.get('page') : 'index'
  const current = shown && known(shown) ? shown : src
  const width = devices.find((d) => d.key === device).width

  const go = (slug) => {
    setShown(slug)
    if (slug === src && frame.current) frame.current.contentWindow.location.href = liveUrl(t.id, slug)
    else setParams(slug === 'index' ? {} : { page: slug }, { replace: true })
  }

  // keep the page picker in sync when the visitor clicks links inside the template
  const onLoad = () => {
    try {
      const file = frame.current.contentWindow.location.pathname.split('/').pop().replace('.html', '') || 'index'
      if (known(file)) setShown(file)
    } catch { /* cross-origin: ignore */ }
  }

  return (
    <div className="preview">
      <div className="preview-bar">
        <Link to={`/template/${t.id}`} className="back">← Back</Link>
        <strong>{t.name} <span>· {t.title}</span></strong>
        <label className="page-pick">
          <span>Page</span>
          <select value={current} onChange={(e) => go(e.target.value)} aria-label="Choose a page to preview">
            {pages.map(([s, l]) => <option key={s} value={s}>{l}</option>)}
          </select>
        </label>
        <div className="devices">
          {devices.map((d) => (
            <button key={d.key} className={device === d.key ? 'on' : ''} onClick={() => setDevice(d.key)}>{d.label}</button>
          ))}
        </div>
        <a href={liveUrl(t.id, current)} target="_blank" rel="noreferrer" className="btn btn-light btn-sm">Open ↗</a>
      </div>
      <div className="preview-stage">
        <iframe ref={frame} key={t.id} src={liveUrl(t.id, src)} onLoad={onLoad} title={`${t.name} live preview`} style={{ width }} />
      </div>
    </div>
  )
}
