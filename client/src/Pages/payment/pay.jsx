import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Dashsd from "../../assets/dashesd.png";
import { createProject } from "../../api/service/projectServ";
import "./pay.css";

const ShieldIcon     = ({ size = 30, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const ArrowRightIcon = ({ size = 30, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const LeafIcon       = ({ size = 30, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>);
const FolderIcon     = ({ size = 20, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>);
const BadgeIcon      = ({ size = 20, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>);
const UserIcon       = ({ size = 20, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const PhoneIcon      = ({ size = 20, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" /></svg>);
const UploadIcon     = ({ size = 24, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>);
const InfoIcon       = ({ size = 18, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);

const formatPrice       = (num) => "$" + num.toLocaleString("en-US", { minimumFractionDigits: 0 });
const getTodayFormatted = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const SECTION_LABELS = { web: "🌐 Web", ai: "🤖 AI", mobile: "📱 Mobile", embedded: "🔌 Embedded", "3d": "🎲 3D" };

const ADDONS = {
    web:      [{ key: "mobileAddon", label: "📱 Mobile App",       price: 5000,  description: "Add a full React Native / Flutter mobile app to your web project" },  { key: "aiAddon",     label: "🤖 AI Integration",  price: 10000, description: "Embed AI features — chatbot, recommendations, or NLP" }],
    ai:       [{ key: "webAddon",    label: "🌐 Web Project",      price: 15000, description: "Pair your AI solution with a complete web platform" },                  { key: "mobileAddon", label: "📱 Mobile App",       price: 5000,  description: "Ship your AI features inside a native mobile app" }],
    mobile:   [{ key: "webAddon",    label: "🌐 Web Project",      price: 15000, description: "Launch a web version alongside your mobile app" },                      { key: "aiAddon",     label: "🤖 AI Integration",  price: 10000, description: "Supercharge your mobile app with smart AI capabilities" }],
    embedded: [{ key: "webAddon",    label: "🌐 Web Dashboard",    price: 15000, description: "Build a web interface to monitor and control your embedded system" },   { key: "mobileAddon", label: "📱 Mobile Control",   price: 5000,  description: "Add a mobile app to remotely control your hardware" }],
    "3d":     [{ key: "webAddon",    label: "🌐 Web Integration",  price: 15000, description: "Embed your 3D experience into a full custom web platform" },            { key: "mobileAddon", label: "📱 Mobile Version",   price: 5000,  description: "Bring your 3D experience to iOS and Android" }],
};

// ── Your Vodafone Cash number ──────────────────────────────
const VODAFONE_CASH_NUMBER = "01XXXXXXXXX";

const AddonCard = ({ addon, active, onToggle }) => (
    <div className={`pay-addon-card ${active ? "pay-addon-card--active" : ""}`} onClick={onToggle}>
        <div className="pay-addon-info">
            <span className="pay-addon-label">{addon.label}</span>
            <span className="pay-addon-desc">{addon.description}</span>
        </div>
        <div className="pay-addon-right">
            <span className="pay-addon-price">+{formatPrice(addon.price)}</span>
            <div className={`pay-addon-toggle ${active ? "pay-addon-toggle--on" : ""}`}>
                <div className="pay-addon-toggle-dot" />
            </div>
        </div>
    </div>
);

export const Payment = ({ theme, toggleTheme }) => {
    const [projectName,    setProjectName]    = useState("");
    const [clientName,     setClientName]     = useState("");
    const [senderName,     setSenderName]     = useState("");
    const [whatsappNum,    setWhatsappNum]     = useState("");
    const [screenshot,     setScreenshot]     = useState(null);
    const [screenshotPrev, setScreenshotPrev] = useState(null);
    const [screenshotB64,  setScreenshotB64]  = useState("");
    const [submitting,     setSubmitting]     = useState(false);
    const [submitError,    setSubmitError]    = useState(null);
    const [submitted,      setSubmitted]      = useState(false);

    const { state }  = useLocation();
    const ActiveLink = "var(--active-link)";

    const selectedPlan = state?.plan ?? {
        name: "Easy", icon: null, basePrice: 15000, section: "web",
        features: ["Basic UI/UX Design", "Frontend implementation", "Weekly updates", "Email Support"],
    };

    const sectionAddons = ADDONS[selectedPlan.section] ?? [];
    const [addonState, setAddonState] = useState(
        Object.fromEntries(sectionAddons.map((a) => [a.key, false]))
    );
    const toggleAddon = (key) => setAddonState((prev) => ({ ...prev, [key]: !prev[key] }));

    const subtotal    = selectedPlan.basePrice;
    const addonsTotal = sectionAddons.reduce((sum, a) => sum + (addonState[a.key] ? a.price : 0), 0);
    const taxes       = Math.round((subtotal + addonsTotal) * 0.09);
    const total       = subtotal + addonsTotal + taxes;
    const deposit     = Math.round(total * 0.30);

    // ── Screenshot → base64 ────────────────────────────────
    const handleScreenshot = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setScreenshot(file);
        setScreenshotPrev(URL.createObjectURL(file));
        const reader = new FileReader();
        reader.onloadend = () => setScreenshotB64(reader.result);
        reader.readAsDataURL(file);
    };

    // ── Submit ─────────────────────────────────────────────
    const handleConfirm = async () => {
        if (!projectName.trim() || !clientName.trim()) { setSubmitError("Please fill in Project Name and Client Name."); return; }
        if (!senderName.trim())  { setSubmitError("Please enter the name used for the Vodafone Cash transfer."); return; }
        if (!whatsappNum.trim()) { setSubmitError("Please enter your WhatsApp number."); return; }
        if (!screenshot)         { setSubmitError("Please upload a screenshot of your Vodafone Cash payment."); return; }

        setSubmitError(null);
        setSubmitting(true);
        try {
            await createProject({
                name:              projectName.trim(),
                client:            clientName.trim(),
                price:             total,
                mobileAddon:       addonState.mobileAddon ?? false,
                webAddon:          addonState.webAddon    ?? false,
                aiAddon:           addonState.aiAddon     ?? false,
                section:           selectedPlan.section   ?? "web",
                due:               getTodayFormatted(),
                status:            "review",
                progress:          0,
                senderName:        senderName.trim(),
                whatsappNumber:    whatsappNum.trim(),
                paymentScreenshot: screenshotB64,
                depositPaid:       true,
                depositAmount:     deposit,
            });
            setSubmitted(true);
        } catch (err) {
            setSubmitError(typeof err === "string" ? err : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />
            <div className="pay">
                <div className="container">
                    <div className="pay-cont">
                        <div className="pay-head">
                            <h1>Secure &amp; Transparent Payments</h1>
                            <p>All payments are processed via Vodafone Cash. Simple, fast, and secure.</p>
                            <img src={Dashsd} alt="" />
                        </div>
                    </div>

                    <div className="pay-form-section">

                        {/* ── Left: form ── */}
                        <div className="pay-form">
                            <h2 className="pay-form-title">Vodafone Cash Payment</h2>

                            {/* Deposit notice */}
                            <div className="pay-deposit-notice">
                                <InfoIcon size={18} color="var(--active-link)" />
                                <div>
                                    <p className="pay-deposit-notice__title">30% Deposit Required to Start</p>
                                    <p className="pay-deposit-notice__sub">
                                        Send <strong>{formatPrice(deposit)}</strong> to our Vodafone Cash number below to confirm your project.
                                        The remaining <strong>{formatPrice(total - deposit)}</strong> is due on delivery.
                                    </p>
                                </div>
                            </div>

                            {/* VF Cash number box */}
                            <div className="pay-vf-box">
                                <div className="pay-vf-box__label">Send to Vodafone Cash Number</div>
                                <div className="pay-vf-box__number">{VODAFONE_CASH_NUMBER}</div>
                                <div className="pay-vf-box__amount">
                                    Amount to send: <strong>{formatPrice(deposit)}</strong>
                                    <span className="pay-vf-box__pct"> (30% deposit)</span>
                                </div>
                            </div>

                            <div className="pay-divider" />

                            {/* Sender name */}
                            <label className="pay-label">Name Used for Transfer</label>
                            <div className="pay-input-wrap">
                                <UserIcon size={20} color={ActiveLink} />
                                <input className="pay-input" placeholder="Name on your Vodafone Cash account"
                                    value={senderName} onChange={(e) => { setSenderName(e.target.value); setSubmitError(null); }} />
                            </div>

                            {/* WhatsApp */}
                            <label className="pay-label">WhatsApp Number</label>
                            <div className="pay-input-wrap">
                                <PhoneIcon size={20} color={ActiveLink} />
                                <input className="pay-input" placeholder="e.g. 01012345678"
                                    value={whatsappNum} onChange={(e) => { setWhatsappNum(e.target.value); setSubmitError(null); }} />
                            </div>

                            {/* Screenshot */}
                            <label className="pay-label">Payment Screenshot</label>
                            <label className={`pay-upload-zone ${screenshotPrev ? "pay-upload-zone--filled" : ""}`}>
                                <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleScreenshot} />
                                {screenshotPrev ? (
                                    <div className="pay-upload-preview">
                                        <img src={screenshotPrev} alt="Payment screenshot" />
                                        <span className="pay-upload-change">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="pay-upload-placeholder">
                                        <UploadIcon size={28} color="var(--active-link)" />
                                        <span>Upload Vodafone Cash screenshot</span>
                                        <span className="pay-upload-hint">PNG, JPG up to 10MB</span>
                                    </div>
                                )}
                            </label>

                            {/* Add-ons */}
                            {sectionAddons.length > 0 && (
                                <>
                                    <div className="pay-divider" />
                                    <label className="pay-label">Optional Add-ons</label>
                                    <div className="pay-addons">
                                        {sectionAddons.map((addon) => (
                                            <AddonCard key={addon.key} addon={addon} active={addonState[addon.key]} onToggle={() => toggleAddon(addon.key)} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Right: summary ── */}
                        <div className="pay-summary">
                            <h2 className="pay-summary-title">Order Summary</h2>

                            <div className={`pay-section-badge pay-section-badge--${selectedPlan.section}`}>
                                {SECTION_LABELS[selectedPlan.section] ?? selectedPlan.section}
                            </div>

                            <div className="pay-plan-row">
                                <div className="pay-plan-icon">
                                    {selectedPlan.icon ? <img src={selectedPlan.icon} alt={selectedPlan.name} style={{ width:30, height:30 }} /> : <LeafIcon size={30} color={ActiveLink} />}
                                </div>
                                <span className="pay-plan-name">{selectedPlan.name}</span>
                                <span className="pay-plan-price">{formatPrice(subtotal)}</span>
                            </div>

                            {sectionAddons.filter((a) => addonState[a.key]).map((addon) => (
                                <div key={addon.key} className="pay-plan-row">
                                    <div className="pay-plan-icon"><span style={{ fontSize:22 }}>{addon.label.split(" ")[0]}</span></div>
                                    <span className="pay-plan-name">{addon.label.replace(/^[^\s]+\s/, "")}</span>
                                    <span className="pay-plan-price">{formatPrice(addon.price)}</span>
                                </div>
                            ))}

                            <div className="pay-summary-divider" />

                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Subtotal</span>
                                <span className="pay-summary-value">{formatPrice(subtotal + addonsTotal)}</span>
                            </div>
                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Taxes (Estimated 9%)</span>
                                <span className="pay-summary-value">{formatPrice(taxes)}</span>
                            </div>
                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Service Fee</span>
                                <span className="pay-summary-value">$0.00</span>
                            </div>

                            <div className="pay-summary-divider" />

                            <div className="pay-total-row">
                                <span className="pay-total-label">Total Due</span>
                                <span className="pay-total-value">{formatPrice(total)}</span>
                            </div>

                            {/* Deposit breakdown */}
                            <div className="pay-deposit-breakdown">
                                <div className="pay-deposit-breakdown__row pay-deposit-breakdown__row--now">
                                    <span>Due now (30% deposit)</span>
                                    <strong>{formatPrice(deposit)}</strong>
                                </div>
                                <div className="pay-deposit-breakdown__row pay-deposit-breakdown__row--later">
                                    <span>Due on delivery (70%)</span>
                                    <strong>{formatPrice(total - deposit)}</strong>
                                </div>
                            </div>

                            <div className="pay-summary-divider" />

                            <div className="pay-project-section">
                                <p className="pay-project-label">Project Details</p>
                                <div className="pay-input-wrap">
                                    <FolderIcon size={20} color={ActiveLink} />
                                    <input className="pay-input" placeholder="Project Name" value={projectName}
                                        onChange={(e) => { setProjectName(e.target.value); setSubmitError(null); }} />
                                </div>
                                <div className="pay-input-wrap">
                                    <BadgeIcon size={20} color={ActiveLink} />
                                    <input className="pay-input" placeholder="Client Name" value={clientName}
                                        onChange={(e) => { setClientName(e.target.value); setSubmitError(null); }} />
                                </div>
                            </div>

                            {submitError && <p className="pay-error">{submitError}</p>}

                            {submitted ? (
                                <div className="pay-submitted-msg">
                                    <div className="pay-submitted-msg__icon">✓</div>
                                    <p className="pay-submitted-msg__title">Request Submitted!</p>
                                    <p className="pay-submitted-msg__sub">We'll review your payment and reach out via WhatsApp within 24 hours.</p>
                                </div>
                            ) : (
                                <button className="pay-confirm-btn" onClick={handleConfirm} disabled={submitting}>
                                    {submitting ? "Submitting…" : <> Confirm Payment <ArrowRightIcon size={26} color="#111" /></>}
                                </button>
                            )}

                            <div className="pay-ssl">
                                <ShieldIcon size={24} color="#555" />
                                Your details are kept strictly confidential
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};