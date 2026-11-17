import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="container empty page-404">
      <h1>404</h1>
      <h3>We couldn’t find that page</h3>
      <p>The template or category may have moved.</p>
      <Link to="/templates" className="btn btn-dark">Browse templates</Link>
    </main>
  )
}
