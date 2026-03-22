import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import './footer.css'

export const Footer = () => {
    const closeMenu = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <footer>
            <div className="container">
                <div className="foot-cont">
                    <div className="left-foot">
                        <div className="logo">
                            <img src={Logo} alt="SoftWareHouseIMG" />
                            <h1>Softuuare House</h1>
                        </div>
                        <p>Premium software engineering services for forward-thinking enterprises. We don't just write code, we build legacies.</p>
                    </div>

                    <div className="links">
                        <h2>Links</h2>
                        <NavLink to="/pack"    className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Packages</NavLink>
                        <NavLink to="/blog"    className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Blog</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Contact Us</NavLink>

                        {/* ── Contact info ── */}
                        <div className="foot-contact">
                            <a href="mailto:softuuarehouse@gmail.com" className="foot-contact__item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                softuuarehouse@gmail.com
                            </a>
                            <a href="tel:01012106005" className="foot-contact__item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                                </svg>
                                01012106005
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <h3>© 2025 Software House. All rights reserved.</h3>
        </footer>
    )
}