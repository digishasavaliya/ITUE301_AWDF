import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import RequireAuth from './components/RequireAuth';

const Home = lazy(() => import('./pages/Home'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const ContactPage = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return null;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`app-shell ${darkMode ? 'dark' : 'light'}`}>
      <div className="portfolio-shell">
        <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />

        <main className="portfolio-main">
          <ScrollToTop />
          <Suspense fallback={<PageLoader label="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/projects" element={<RequireAuth><ProjectsPage /></RequireAuth>} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer email="digisha@example.com" />
      </div>
    </div>
  );
}

export default App;