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
const TagIcon        = ({ size = 20, color = "currentColor" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>);

const formatPrice       = (num) => "$" + num.toLocaleString("en-US", { minimumFractionDigits: 0 });
const getTodayFormatted = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const SECTION_LABELS = { web: "🌐 Web", ai: "🤖 AI", mobile: "📱 Mobile", embedded: "🔌 Embedded", "3d": "🎲 3D" };

const ADDONS = {
    web:      [{ key: "mobileAddon", label: "📱 Mobile App",       price: 5000,  description: "Add a full React Native / Flutter mobile app · Vodafone Cash / Instapay" },  { key: "aiAddon",     label: "🤖 AI Integration",  price: 10000, description: "Embed AI features — chatbot, recommendations, or NLP · Vodafone Cash / Instapay" }],
    ai:       [{ key: "webAddon",    label: "🌐 Web Project",      price: 15000, description: "Pair your AI solution with a complete web platform · Vodafone Cash / Instapay" },                  { key: "mobileAddon", label: "📱 Mobile App",       price: 5000,  description: "Ship your AI features inside a native mobile app · Vodafone Cash / Instapay" }],
    mobile:   [{ key: "webAddon",    label: "🌐 Web Project",      price: 15000, description: "Launch a web version alongside your mobile app · Vodafone Cash / Instapay" },                      { key: "aiAddon",     label: "🤖 AI Integration",  price: 10000, description: "Supercharge your mobile app with smart AI capabilities · Vodafone Cash / Instapay" }],
    embedded: [{ key: "webAddon",    label: "🌐 Web Dashboard",    price: 15000, description: "Build a web interface to monitor and control your embedded system · Vodafone Cash / Instapay" },   { key: "mobileAddon", label: "📱 Mobile Control",   price: 5000,  description: "Add a mobile app to remotely control your hardware · Vodafone Cash / Instapay" }],
    "3d":     [{ key: "webAddon",    label: "🌐 Web Integration",  price: 15000, description: "Embed your 3D experience into a full custom web platform · Vodafone Cash / Instapay" },            { key: "mobileAddon", label: "📱 Mobile Version",   price: 5000,  description: "Bring your 3D experience to iOS and Android · Vodafone Cash / Instapay" }],
};

const VODAFONE_CASH_NUMBER = "01012106005";
const MAX_B64_BYTES        = 2 * 1024 * 1024;
const DISCOUNT_AMOUNT      = 5000;

const compressImageToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement("canvas");
            const attempt = (quality, maxDim) => {
                let w = img.naturalWidth, h = img.naturalHeight;
                if (w > maxDim || h > maxDim) {
                    if (w >= h) { h = Math.round((h / w) * maxDim); w = maxDim; }
                    else        { w = Math.round((w / h) * maxDim); h = maxDim; }
                }
                canvas.width = w; canvas.height = h;
                canvas.getContext("2d").drawImage(img, 0, 0, w, h);
                const b64 = canvas.toDataURL("image/jpeg", quality);
                if (b64.length <= MAX_B64_BYTES || quality <= 0.1) { resolve(b64); return; }
                const nextQ   = quality > 0.4 ? quality - 0.15 : quality - 0.05;
                const nextDim = quality <= 0.4 ? Math.round(maxDim * 0.75) : maxDim;
                attempt(Math.max(nextQ, 0.1), nextDim);
            };
            attempt(0.85, 1600);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image.")); };
        img.src = url;
    });

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
    const [imgError,       setImgError]       = useState(null);
    const [compressing,    setCompressing]    = useState(false);
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

    const subtotalOriginal = selectedPlan.basePrice;
    const subtotalDiscounted = subtotalOriginal - DISCOUNT_AMOUNT;
    const addonsTotal = sectionAddons.reduce((sum, a) => sum + (addonState[a.key] ? a.price : 0), 0);
    const total       = subtotalDiscounted + addonsTotal;
    const deposit     = Math.round(total * 0.30);

    const handleScreenshot = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setImgError("Please upload an image file (PNG, JPG, etc.).");
            return;
        }
        setImgError(null);
        setScreenshot(file);
        setScreenshotPrev(URL.createObjectURL(file));
        setScreenshotB64("");
        setCompressing(true);
        try {
            const b64 = await compressImageToBase64(file);
            setScreenshotB64(b64);
        } catch {
            setImgError("Could not process this image. Please try a different file.");
            setScreenshot(null);
            setScreenshotPrev(null);
        } finally {
            setCompressing(false);
        }
    };

    const handleConfirm = async () => {
        if (!projectName.trim() || !clientName.trim()) { setSubmitError("Please fill in Project Name and Client Name."); return; }
        if (!senderName.trim())  { setSubmitError("Please enter the name used for the Vodafone Cash / Instapay transfer."); return; }
        if (!whatsappNum.trim()) { setSubmitError("Please enter your WhatsApp number."); return; }
        if (!screenshot)         { setSubmitError("Please upload a screenshot of your payment."); return; }
        if (compressing)         { setSubmitError("Please wait — image is still being processed."); return; }
        if (!screenshotB64)      { setSubmitError("Image failed to process. Please re-upload the screenshot."); return; }

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
                depositPaid:       false,
                depositAmount:     deposit,
            });
            setSubmitted(true);
        } catch (err) {
            setSubmitError(typeof err === "string" ? err : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const activeAddons = sectionAddons.filter((a) => addonState[a.key]);

    return (
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />
            <div className="pay">
                <div className="container">
                    <div className="pay-cont">
                        <div className="pay-head">
                            <h1>Secure &amp; Transparent Payments</h1>
                            <p>All payments are processed via Vodafone Cash or Instapay. Simple, fast, and secure.</p>
                            <img src={Dashsd} alt="" />
                        </div>
                    </div>

                    <div className="pay-form-section">

                        {/* ── Left: form ── */}
                        <div className="pay-form">
                            <h2 className="pay-form-title">Vodafone Cash / Instapay Payment</h2>

                            <div className="pay-deposit-notice">
                                <InfoIcon size={18} color="var(--active-link)" />
                                <div>
                                    <p className="pay-deposit-notice__title">30% Deposit Required to Start</p>
                                    <p className="pay-deposit-notice__sub">
                                        Send <strong>{formatPrice(deposit)}</strong> to our Vodafone Cash or Instapay number below to confirm your project.
                                        The remaining <strong>{formatPrice(total - deposit)}</strong> is due on delivery.
                                    </p>
                                </div>
                            </div>

                            <div className="pay-vf-box">
                                <div className="pay-vf-box__label">Send to Vodafone Cash or Instapay Number</div>
                                <div className="pay-vf-box__number">{VODAFONE_CASH_NUMBER}</div>
                                <div className="pay-vf-box__amount">
                                    Amount to send: <strong>{formatPrice(deposit)}</strong>
                                    <span className="pay-vf-box__pct"> (30% deposit)</span>
                                </div>
                            </div>

                            <div className="pay-divider" />

                            <label className="pay-label">Name Used for Transfer</label>
                            <div className="pay-input-wrap">
                                <UserIcon size={20} color={ActiveLink} />
                                <input className="pay-input" placeholder="Name on your Vodafone Cash / Instapay account"
                                    value={senderName} onChange={(e) => { setSenderName(e.target.value); setSubmitError(null); }} />
                            </div>

                            <label className="pay-label">WhatsApp Number</label>
                            <div className="pay-input-wrap">
                                <PhoneIcon size={20} color={ActiveLink} />
                                <input className="pay-input" placeholder="e.g. 01012345678"
                                    value={whatsappNum} onChange={(e) => { setWhatsappNum(e.target.value); setSubmitError(null); }} />
                            </div>

                            <label className="pay-label">Payment Screenshot</label>
                            <label className={`pay-upload-zone ${screenshotPrev ? "pay-upload-zone--filled" : ""} ${compressing ? "pay-upload-zone--compressing" : ""}`}>
                                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleScreenshot} disabled={compressing} />
                                {compressing ? (
                                    <div className="pay-upload-placeholder">
                                        <div className="pay-upload-spinner" />
                                        <span>Compressing image…</span>
                                        <span className="pay-upload-hint">Optimizing to under 2 MB</span>
                                    </div>
                                ) : screenshotPrev ? (
                                    <div className="pay-upload-preview">
                                        <img src={screenshotPrev} alt="Payment screenshot" />
                                        <span className="pay-upload-change">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="pay-upload-placeholder">
                                        <UploadIcon size={28} color="var(--active-link)" />
                                        <span>Upload Vodafone Cash / Instapay screenshot</span>
                                        <span className="pay-upload-hint">PNG, JPG — auto-compressed to 2 MB</span>
                                    </div>
                                )}
                            </label>
                            {imgError && <p className="pay-img-error">{imgError}</p>}

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

                            {/* ── Plan row ── */}
                            <div className="pay-plan-row">
                                <div className="pay-plan-icon">
                                    {selectedPlan.icon
                                        ? <img src={selectedPlan.icon} alt={selectedPlan.name} style={{ width: 30, height: 30 }} />
                                        : <LeafIcon size={30} color={ActiveLink} />}
                                </div>
                                <div className="pay-plan-details">
                                    <span className="pay-plan-name">{selectedPlan.name}</span>
                                    <div className="pay-plan-price-wrapper">
                                        <span className="pay-plan-price-original">{formatPrice(subtotalOriginal)}</span>
                                        <span className="pay-plan-price">{formatPrice(subtotalDiscounted)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ── Discount badge ── */}
                            <div className="pay-discount-badge">
                                <TagIcon size={16} color="var(--active-link)" />
                                <span>Limited Time: {formatPrice(DISCOUNT_AMOUNT)} OFF</span>
                            </div>

                            {/* ── Active addon rows — appear immediately under plan, above divider ── */}
                            {activeAddons.length > 0 && (
                                <div className="pay-addon-rows">
                                    {activeAddons.map((addon) => (
                                        <div key={addon.key} className="pay-addon-row">
                                            <span className="pay-addon-row__emoji">{addon.label.split(" ")[0]}</span>
                                            <span className="pay-addon-row__name">{addon.label.replace(/^[^\s]+\s/, "")}</span>
                                            <span className="pay-addon-row__price">+{formatPrice(addon.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pay-summary-divider" />

                            {/* ── Subtotal (updates as addons toggle) ── */}
                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Subtotal</span>
                                <span className="pay-summary-value">{formatPrice(subtotalDiscounted + addonsTotal)}</span>
                            </div>

                            <div className="pay-summary-divider" />

                            <div className="pay-total-row">
                                <span className="pay-total-label">Total Due</span>
                                <span className="pay-total-value">{formatPrice(total)}</span>
                            </div>

                            <div className="pay-savings-notice">
                                You're saving {formatPrice(DISCOUNT_AMOUNT)} with this offer!
                            </div>

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
                                <button className="pay-confirm-btn" onClick={handleConfirm} disabled={submitting || compressing}>
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