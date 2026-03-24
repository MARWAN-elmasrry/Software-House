import './index.css'
import { LandingPage } from './Pages/landing';
import { Package } from './Pages/Package/pack';
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Blog } from './Pages/blog/blog';
import { Payment } from './Pages/payment/pay';
import { Contact } from './Pages/contact/contact';
import Admin from './Pages/admin/admin';

export const App = () => {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'white';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // ─── Disable DevTools ───────────────────────────────────────────────
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();

    // Disable F12, Ctrl+Shift+I/J/C, Ctrl+U
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    // Detect if DevTools is open and redirect/blur
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        document.body.innerHTML = ''; // Clear page if DevTools detected
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    const devToolsInterval = setInterval(detectDevTools, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);
  // ────────────────────────────────────────────────────────────────────

  const toggleTheme = () => setTheme(t => (t === 'white' ? 'dark' : 'white'));

  return (
    <Routes>
      <Route path="/" element={<LandingPage data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/pack" element={<Package data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/blog" element={<Blog data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/pay" element={<Payment data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/contact" element={<Contact data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/admin" element={<Admin data-theme={theme} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}