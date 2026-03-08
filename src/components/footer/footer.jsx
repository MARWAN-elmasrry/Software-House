import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import './footer.css'

export const Footer = () => {
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
                        <NavLink to="/pack" className={({ isActive }) => isActive ? 'active' : ''}>Packages</NavLink>
                        <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>Blog</NavLink>
                        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</NavLink>
                    </div>
                </div>
            </div>
            <h3>Some data @ to software house</h3>
        </footer>
    )
}