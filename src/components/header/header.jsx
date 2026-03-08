import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import './header.css'

export const Header = ({ onToggleTheme }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = (e) => {
    setIsDark(e.target.checked)
    onToggleTheme(e)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  }

  return (
    <header>
        <div className="head-cont">
          <NavLink to="/" className="logo">
            <img src={Logo} alt="SoftWareHouseIMG" />
            <h2>Software House</h2>
          </NavLink>
          
          <div className={`links ${isMenuOpen ? 'active' : ''}`}>
            <NavLink to="/pack" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Packages</NavLink>
            <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Blog</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Contact Us</NavLink>
          </div> 
          
          <div className="header-btn">
            <div className="toggle">
              <input 
                type="checkbox" 
                id="toggle"  
                checked={isDark}
                onChange={handleToggle} 
              />
              <label htmlFor="toggle" className="toggle-track">
                <div className="toggle-thumb">
                  <svg viewBox="0 0 24 24" className="icon">
                    {isDark ? (
                      <path d="M11.264 15.488a4.224 4.224 90 110-8.448 4.224 4.224 90 010 8.448m0 1.408a5.632 5.632 90 100-11.264 5.632 5.632 90 000 11.264M11.264 0a.704.704 90 01.704.704v2.816a.704.704 90 01-1.408 0v-2.816A.704.704 90 0111.264 0m0 18.304a.704.704 90 01.704.704v2.816a.704.704 90 01-1.408 0v-2.816A.704.704 90 0111.264 18.304m11.264-7.04a.704.704 90 01-.704.704h-2.816a.704.704 90 010-1.408h2.816a.704.704 90 01.704.704M4.224 11.264a.704.704 90 01-.704.704h-2.816a.704.704 90 010-1.408h2.816A.704.704 90 014.224 11.264m15.0051-7.9651a.704.704 90 010 .9955l-1.9909 1.9923a.704.704 90 11-.9955-.9969l1.9909-1.9909a.704.704 90 01.9955 0m-12.9437 12.9437a.704.704 90 010 .9955L4.2944 19.2291a.704.704 90 01-.9955-.9955l1.9909-1.9909a.704.704 90 01.9955 0m12.9437 2.9864a.704.704 90 01-.9955 0l-1.9909-1.9909a.704.704 90 01.9955-.9955l1.9909 1.9909a.704.704 90 010 .9955M6.2853 6.2867a.704.704 90 01-.9955 0L3.2989 4.2944a.704.704 90 11.9955-.9955l1.9909 1.9909a.704.704 90 010 .996"/>
                    ) : (
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                    )}
                  </svg>
                </div>
              </label>
            </div>
            <div className="start-btn">
              <button>Start a Project</button>
            </div>
            <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
              <span className={isMenuOpen ? 'active' : ''}></span>
              <span className={isMenuOpen ? 'active' : ''}></span>
              <span className={isMenuOpen ? 'active' : ''}></span>
            </button>
          </div>
        </div>
        {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </header>
  )
}