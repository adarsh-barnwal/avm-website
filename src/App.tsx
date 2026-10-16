import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Notices from './pages/Notices';
import Admission from './pages/Admission';
import Achievers from './pages/Achievers';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import type { Page } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    if (hash && ['home', 'notices', 'admission', 'achievers', 'gallery', 'events', 'about', 'contact', 'admin'].includes(hash)) {
      setPage(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  const isAdmin = page === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={navigate} />}
        {page === 'notices' && <Notices />}
        {page === 'admission' && <Admission />}
        {page === 'achievers' && <Achievers />}
        {page === 'gallery' && <Gallery />}
        {page === 'events' && <Events />}
        {page === 'about' && <About onNavigate={navigate} />}
        {page === 'contact' && <Contact />}
        {page === 'admin' && <Admin />}
      </main>
      {!isAdmin && <Footer onNavigate={navigate} />}
    </div>
  );
}
