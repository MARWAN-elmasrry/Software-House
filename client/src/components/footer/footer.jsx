import { Link, NavLink } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import './footer.css'

export const Footer = () => {
    const closeMenu = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    return (
        <footer>
            <div className="container">
                <div className="foot-cont">
                    <div className="left-foot">
                        <div className="logo">
                            <img src={Logo} alt="SoftWareHouseIMG" />
                            <h1>Software House</h1>
                        </div>
                        <p>Premium software engineering services for forward-thinking enterprises. We don't just write code, we build legacies.</p>
                    </div>
                    <div className="links">
                        <h2>Links</h2>
                        <NavLink to="/pack" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Packages</NavLink>
                        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Blog</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Contact Us</NavLink>
                    </div>
                </div>
            </div>
                <h3>Some data @ to software house</h3>
        </footer>
    )
}