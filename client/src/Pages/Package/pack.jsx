import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Easy from "../../assets/easy.png"
import Medium from "../../assets/medium.png"
import Advanced from "../../assets/advanced.png"
import "./pack.css"
import { Link } from "react-router-dom"

const plans = [
    {
        name: "Easy",
        icon:Easy,
        tagline: "Perfect for MVPs and prototypes.",
        price: "$999",
        cta: "Choose Easy",
        ctaStyle: "outline",
        recommended: false,
        featuresLabel: "FEATURES",
        features: [
            "Basic UI/UX Design",
            "Frontend implementation",
            "Weekly updates",
            "Email Support",
        ],
        featuresActive: false,
    },
    {
        name: "Medium",
        icon: Medium,
        tagline: "Best for scaling startups.",
        price: "$2,499",
        cta: "Get Started",
        ctaStyle: "filled",
        recommended: true,
        featuresLabel: "EVERYTHING IN EASY, PLUS:",
        features: [
            "Full-stack development",
            "QA testing & Automation",
            "DevOps setup",
            "Priority Slack Support",
        ],
        featuresActive: true,
    },
    {
        name: "Advanced",
        icon:Advanced,
        tagline: "Enterprise-grade architecture.",
        price: "$4,999",
        cta: "Contact Sales",
        ctaStyle: "outline",
        recommended: false,
        featuresLabel: "EVERYTHING IN MID, PLUS:",
        features: [
            "Microservices Architecture",
            "Monthly Strategy Call",
            "Dedicated Project Manager",
            "Quarterly Security Audits",
        ],
        featuresActive: false,
    },
]

export const Package = ({ theme, toggleTheme }) => {

    const closeMenu = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    return (
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />

            <div className="pack">
                <div className="container">
                    <div className="pack-cont">

                        <div className="pack-head">
                            <h1>Tailored Software Solutions <span>for Every Stage</span></h1>
                            <p>Choose the specialized tech service package that fits your business needs. Transparent pricing, no hidden fees.</p>
                        </div>

                        <div className="cards">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`card${plan.recommended ? " recommended" : ""}`}
                                >
                                    {plan.recommended && (
                                        <div className="rec-badge">RECOMMENDED</div>
                                    )}

                                    <div className="card-name">
                                        {plan.name}
                                        <img src={plan.icon} alt={plan.name} className="icon" />
                                    </div>

                                    <p className="card-tagline">{plan.tagline}</p>
                                    <div className="card-price">{plan.price}</div>
                             <Link style={{textDecoration:"none"}} to="/pay" onClick={closeMenu}>
                                    <button className={`card-cta ${plan.ctaStyle}`}>
                                        {plan.cta}
                                    </button>
                             </Link>

                                    <div className="features-label">{plan.featuresLabel}</div>

                                    <ul className="feature-list">
                                        {plan.features.map((f) => (
                                            <li key={f} className="feature-item">
                                                <span className={`check-icon ${plan.featuresActive ? "active" : "inactive"}`}>
                                                    ✓
                                                </span>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}