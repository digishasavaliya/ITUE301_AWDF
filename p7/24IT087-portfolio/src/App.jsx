import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/Projects';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './components/RequireAuth';

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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<RequireAuth><ProjectsPage /></RequireAuth>} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer email="digisha@example.com" />
      </div>
    </div>
  );
}

export default App;