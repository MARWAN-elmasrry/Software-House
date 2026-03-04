import { Header } from "../components/header/header";
import { Footer } from '../components/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutUs } from '../components/aboutus/about';
import { WhyUs } from '../components/whyus/why';
import { Word } from '../components/word/word';
import { Ready } from '../components/ready/ready';
import { useState, useEffect } from 'react';

export const LandingPage = () =>{
    const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'white';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'white' ? 'dark' : 'white'));

    return(    <div theme={theme}>
        <Header onToggleTheme={toggleTheme} />
      <Hero />
      <AboutUs />
      <WhyUs />
      <Word />
      <Ready />
      <Footer />
    </div>)
}