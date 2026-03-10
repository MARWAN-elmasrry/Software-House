import './index.css'
import { LandingPage } from './Pages/landing';
import { Package } from './Pages/Package/pack';
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Blog } from './Pages/blog/blog';
import { Payment } from './Pages/payment/pay';
import { Contact } from './Pages/contact/contact';

export const App = () => {

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'white';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'white' ? 'dark' : 'white'));

  return (
    <Routes>
      <Route path="/" element={<LandingPage data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/pack" element={<Package data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/blog" element={<Blog data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/pay" element={<Payment data-theme={theme} toggleTheme={toggleTheme} />} />
      <Route path="/contact" element={<Contact data-theme={theme} toggleTheme={toggleTheme} />} />
    </Routes>
  );
}