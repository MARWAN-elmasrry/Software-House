import { useState, useRef } from "react"
import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Easy from "../../assets/easy.png"
import Medium from "../../assets/medium.png"
import Advanced from "../../assets/advanced.png"
import "./pack.css"
import { Link } from "react-router-dom"

/* ─── Web Plans ─────────────────────────────────────────── */
const webPlans = [
    {
        name: "Easy",
        icon: Easy,
        tagline: "Perfect for MVPs and prototypes.",
        basePrice: 15000,
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
        section: "web",
    },
    {
        name: "Medium",
        icon: Medium,
        tagline: "Best for scaling startups.",
        basePrice: 30000,
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
        section: "web",
    },
    {
        name: "Advanced",
        icon: Advanced,
        tagline: "Enterprise-grade architecture.",
        basePrice: 40000,
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
        section: "web",
    },
]

/* ─── AI Plans ──────────────────────────────────────────── */
const aiPlans = [
    {
        name: "AI Starter",
        tagline: "Integrate smart AI features fast.",
        basePrice: 30000,
        cta: "Choose Starter",
        ctaStyle: "outline",
        recommended: false,
        featuresLabel: "FEATURES",
        features: [
            "AI Chatbot Integration",
            "Basic NLP Processing",
            "Pre-trained Model Setup",
            "Email Support",
        ],
        featuresActive: false,
        section: "ai",
    },
    {
        name: "AI Pro",
        tagline: "Custom models for growing products.",
        basePrice: 50000,
        cta: "Get AI Pro",
        ctaStyle: "filled",
        recommended: true,
        featuresLabel: "EVERYTHING IN STARTER, PLUS:",
        features: [
            "Custom Model Fine-tuning",
            "RAG Pipeline Setup",
            "API & Dashboard Integration",
            "Priority Slack Support",
        ],
        featuresActive: true,
        section: "ai",
    },
    {
        name: "AI Enterprise",
        tagline: "Full-scale AI infrastructure.",
        basePrice: 70000,
        cta: "Contact Sales",
        ctaStyle: "outline",
        recommended: false,
        featuresLabel: "EVERYTHING IN PRO, PLUS:",
        features: [
            "On-premise LLM Deployment",
            "Dedicated AI Engineer",
            "Real-time Data Pipelines",
            "Quarterly AI Strategy Call",
        ],
        featuresActive: false,
        section: "ai",
    },
]

/* ─── Format price helper ───────────────────────────────── */
const fmt = (n) => n.toLocaleString("en-US")

/* ─── Web Plan Card (with mobile add-on) ────────────────── */
const WebPlanCard = ({ plan, mobileChecked, onMobileToggle }) => {
    const finalPrice = plan.basePrice + (mobileChecked ? 5000 : 0)

    const passedPlan = {
        name:           plan.name,
        tagline:        plan.tagline,
        icon:           plan.icon ?? null,
        basePrice:      plan.basePrice,
        mobileAddon:    mobileChecked,
        section:        plan.section,
        features:       plan.features,
        featuresLabel:  plan.featuresLabel,
        featuresActive: plan.featuresActive,
    }

    return (
        <div className={`card${plan.recommended ? " recommended" : ""}`}>
            {plan.recommended && <div className="rec-badge">RECOMMENDED</div>}

            <div className="card-name">
                {plan.name}
                {plan.icon && <img src={plan.icon} alt={plan.name} className="icon" />}
            </div>

            <p className="card-tagline">{plan.tagline}</p>

            <div className="card-price">
                {fmt(finalPrice)}
                {mobileChecked && <span className="price-addon"> +5,000</span>}
            </div>

            {/* Mobile App Add-on Checkbox — Web only */}
            <label className="mobile-addon">
                <input
                    type="checkbox"
                    checked={mobileChecked}
                    onChange={onMobileToggle}
                    className="mobile-checkbox"
                />
                <span className="mobile-addon-text">
                    📱 Add Mobile App  <strong>+$5,000</strong>
                </span>
            </label>

            <Link
                style={{ textDecoration: "none" }}
                to="/pay"
                state={{ plan: passedPlan }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <button className={`card-cta ${plan.ctaStyle}`}>{plan.cta}</button>
            </Link>

            <div className="features-label">{plan.featuresLabel}</div>

            <ul className="feature-list">
                {plan.features.map((f) => (
                    <li key={f} className="feature-item">
                        <span className={`check-icon ${plan.featuresActive ? "active" : "inactive"}`}>✓</span>
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    )
}

/* ─── AI Plan Card (with web project add-on) ────────────── */
const AIPlanCard = ({ plan, webChecked, onWebToggle }) => {
    const finalPrice = plan.basePrice + (webChecked ? 15000 : 0)

    const passedPlan = {
        name:           plan.name,
        tagline:        plan.tagline,
        icon:           plan.icon ?? null,
        basePrice:      plan.basePrice,
        webAddon:       webChecked,
        section:        plan.section,
        features:       plan.features,
        featuresLabel:  plan.featuresLabel,
        featuresActive: plan.featuresActive,
    }

    return (
        <div className={`card${plan.recommended ? " recommended" : ""}`}>
            {plan.recommended && <div className="rec-badge">RECOMMENDED</div>}

            <div className="card-name">
                {plan.name}
                {plan.icon && <img src={plan.icon} alt={plan.name} className="icon" />}
            </div>

            <p className="card-tagline">{plan.tagline}</p>

            <div className="card-price">
                {fmt(finalPrice)}
                {webChecked && <span className="price-addon"> +15,000</span>}
            </div>

            {/* Web Project Add-on Checkbox — AI only */}
            <label className="mobile-addon">
                <input
                    type="checkbox"
                    checked={webChecked}
                    onChange={onWebToggle}
                    className="mobile-checkbox"
                />
                <span className="mobile-addon-text">
                    🌐 Add Web Project  <strong>+$15,000</strong>
                </span>
            </label>

            <Link
                style={{ textDecoration: "none" }}
                to="/pay"
                state={{ plan: passedPlan }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <button className={`card-cta ${plan.ctaStyle}`}>{plan.cta}</button>
            </Link>

            <div className="features-label">{plan.featuresLabel}</div>

            <ul className="feature-list">
                {plan.features.map((f) => (
                    <li key={f} className="feature-item">
                        <span className={`check-icon ${plan.featuresActive ? "active" : "inactive"}`}>✓</span>
                        {f}
                    </li>
                ))}
            </ul>
        </div>
    )
}

/* ─── Main Component ────────────────────────────────────── */
export const Package = ({ theme, toggleTheme }) => {
    const [webMobile, setWebMobile] = useState({
        Easy: false, Medium: false, Advanced: false,
    })

    const [aiWeb, setAiWeb] = useState({
        "AI Starter": false, "AI Pro": false, "AI Enterprise": false,
    })

    const contactRef = useRef(null)
    const [formData, setFormData] = useState({ name: "", email: "", message: "" })
    const [formSent, setFormSent] = useState(false)
    const [formType, setFormType] = useState("3d") // "3d" | "embedded"

    const scrollToContact = (type = "3d") => {
        setFormType(type)
        // small delay so state updates before scroll
        setTimeout(() => contactRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setFormSent(true)
    }

    return (
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />

            <div className="pack">
                <div className="container">
                    <div className="pack-cont">

                        {/* ══ WEB SECTION ══ */}
                        <div className="pack-head">
                            <span className="section-tag">WEB DEVELOPMENT</span>
                            <h1>Tailored Software Solutions <span>for Every Stage</span></h1>
                            <p>Choose the specialized tech service package that fits your business needs. Transparent pricing, no hidden fees.</p>
                        </div>

                        <div className="cards">
                            {webPlans.map((plan) => (
                                <WebPlanCard
                                    key={plan.name}
                                    plan={plan}
                                    mobileChecked={webMobile[plan.name]}
                                    onMobileToggle={() =>
                                        setWebMobile((prev) => ({ ...prev, [plan.name]: !prev[plan.name] }))
                                    }
                                />
                            ))}
                        </div>

                        {/* ══ AI SECTION ══ */}
                        <div className="pack-section-divider">
                            <div className="section-label ai-label">
                                <span className="section-tag">AI-POWERED</span>
                                <h2>Intelligent Solutions <span>Built to Scale</span></h2>
                                <p>Integrate cutting-edge AI into your product. From chatbots to custom LLM pipelines — we build it end-to-end.</p>
                            </div>
                        </div>

                        <div className="cards">
                            {aiPlans.map((plan) => (
                                <AIPlanCard
                                    key={plan.name}
                                    plan={plan}
                                    webChecked={aiWeb[plan.name]}
                                    onWebToggle={() =>
                                        setAiWeb((prev) => ({ ...prev, [plan.name]: !prev[plan.name] }))
                                    }
                                />
                            ))}
                        </div>

                        {/* ══ EMBEDDED SYSTEMS SECTION ══ */}
                        <div className="pack-section-divider">
                            <div className="section-label embedded-label">
                                <span className="section-tag embedded-tag">EMBEDDED SYSTEMS</span>
                                <h2>Hardware Meets Software <span>Built to Perform</span></h2>
                                <p>Every embedded project has unique constraints. Pricing depends on hardware scope, protocols, and certifications. Let's engineer it together.</p>
                            </div>
                        </div>

                        <div className="threed-section">
                            <div className="threed-card embedded-card">
                                <div className="threed-orb threed-orb-1 embedded-orb-1" />
                                <div className="threed-orb threed-orb-2 embedded-orb-2" />
                                <div className="threed-orb threed-orb-3 embedded-orb-3" />

                                <div className="threed-content">
                                    <div className="threed-badge embedded-badge">CUSTOM PRICING</div>
                                    <h3 className="threed-title">Embedded Systems Development</h3>
                                    <p className="threed-desc">
                                        From bare-metal firmware to full IoT platforms — we design, prototype, and deploy embedded systems built for reliability, performance, and the real world.
                                    </p>

                                    <ul className="threed-features">
                                        {[
                                            "Microcontroller & RTOS Programming",
                                            "PCB Design & Prototyping",
                                            "IoT Connectivity (MQTT / BLE / LoRa)",
                                            "Custom FPGA / ASIC Solutions",
                                            "Safety & Certification Support",
                                            "Hardware-Software Co-design",
                                        ].map((f) => (
                                            <li key={f}>
                                                <span className="threed-check embedded-check">⬡</span> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="threed-price-note">
                                        Price varies based on hardware scope &amp; complexity
                                    </div>

                                    <button className="threed-cta embedded-cta" onClick={() => scrollToContact("embedded")}>
                                        Book a Free Call
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ══ 3D SECTION ══ */}
                        <div className="pack-section-divider">
                            <div className="section-label threed-label">
                                <span className="section-tag threed-tag">3D & IMMERSIVE</span>
                                <h2>Custom 3D Experiences <span>Beyond the Screen</span></h2>
                                <p>Every 3D project is unique. Pricing depends on scope, complexity, and assets. Let's talk about your vision.</p>
                            </div>
                        </div>

                        <div className="threed-section">
                            <div className="threed-card">
                                <div className="threed-orb threed-orb-1" />
                                <div className="threed-orb threed-orb-2" />
                                <div className="threed-orb threed-orb-3" />

                                <div className="threed-content">
                                    <div className="threed-badge">CUSTOM PRICING</div>
                                    <h3 className="threed-title">3D Design & Development</h3>
                                    <p className="threed-desc">
                                        Interactive 3D web experiences, product configurators, architectural visualizations, and immersive WebGL scenes — crafted to your exact specifications.
                                    </p>

                                    <ul className="threed-features">
                                        {[
                                            "WebGL & Three.js Development",
                                            "3D Product Configurators",
                                            "Architectural Visualization",
                                            "Immersive Landing Pages",
                                            "Custom Asset Creation",
                                            "Performance Optimization",
                                        ].map((f) => (
                                            <li key={f}>
                                                <span className="threed-check">✦</span> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="threed-price-note">
                                        Price varies based on scope &amp; complexity
                                    </div>

                                    <button className="threed-cta" onClick={() => scrollToContact("3d")}>
                                        Book a Free Call
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ══ CONTACT FORM ══ */}
                        <div className="contact-section" ref={contactRef}>
                            <div className="contact-head">
                                <span className="section-tag">GET IN TOUCH</span>
                                <h2>
                                    Tell Us About{" "}
                                    <span>
                                        {formType === "embedded" ? "Your Embedded Project" : "Your 3D Project"}
                                    </span>
                                </h2>
                                <p>Share your idea and we'll get back to you with a custom quote within 24 hours.</p>
                            </div>

                            {formSent ? (
                                <div className="form-success">
                                    <span className="success-icon">✓</span>
                                    <h3>Message Sent!</h3>
                                    <p>We'll reach out within 24 hours.</p>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleFormSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Your Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@company.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Tell us about your project</label>
                                        <textarea
                                            placeholder={
                                                formType === "embedded"
                                                    ? "Describe your embedded system, hardware requirements, protocols, and timeline..."
                                                    : "Describe your 3D project, goals, timeline, and any references..."
                                            }
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="form-submit">
                                        Send Message →
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}