import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import Detail from './pages/Detail.jsx'
import Preview from './pages/Preview.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const fullscreen = pathname.startsWith('/preview/')

  return (
    <>
      <ScrollToTop />
      {!fullscreen && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Browse />} />
        <Route path="/category/:slug" element={<Browse />} />
        <Route path="/template/:id" element={<Detail />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!fullscreen && <Footer />}
    </>
  )
}
