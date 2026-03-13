import { useState } from "react";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Dashsd  from "../../assets/dashesd.png"
import "./pay.css";

/* ─── SVG Icons ─────────────────────────────────────────── */

const CreditCardIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);

const PayPalIcon = ({ size = 30 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            fill="#009cde"
            d="M6.5 21.5H3.3a.8.8 0 0 1-.8-.92L5.42 3.1A.8.8 0 0 1 6.2 2.5h7.1
               c2.1 0 3.64.5 4.57 1.49.88.93 1.18 2.1.93 3.65l-.01.07
               C18.1 10.8 15.9 12.5 12.6 12.5h-2.1a.8.8 0 0 0-.79.68
               l-.95 6.04-.26 1.63a.4.4 0 0 1-.4.34H6.5z"
        />
        <path
            fill="#012169"
            d="M20.1 7.6c-.01.07-.02.14-.03.21C19.3 12 16.6 13.9 12.6 13.9h-2.1
               a.8.8 0 0 0-.79.68l-1.21 7.67a.4.4 0 0 0 .4.46h2.8
               a.7.7 0 0 0 .69-.59l.03-.16.55-3.47.04-.19a.7.7 0 0 1 .69-.59h.44
               c2.82 0 5.02-1.14 5.67-4.45.27-1.38.13-2.53-.58-3.34
               a2.77 2.77 0 0 0-.63-.42z"
        />
        <path
            fill="#003087"
            d="M19.4 7.3a5.8 5.8 0 0 0-.72-.16 9.1 9.1 0 0 0-1.44-.11h-4.37
               a.7.7 0 0 0-.69.59l-.93 5.9-.03.17a.8.8 0 0 1 .79-.68h2.1
               c3.3 0 5.5-1.7 6.19-4.78 0-.07.02-.14.03-.21
               a3.74 3.74 0 0 0-.93-.72z"
        />
    </svg>
);

const CalendarIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const LockIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const UserIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MapPinIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const LeafIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
);

const ShieldIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ArrowRightIcon = ({ size = 30, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

/* ─── Component ─────────────────────────────────────────── */

export const Payment = ({ theme, toggleTheme }) => {
    const [activeMethod, setActiveMethod] = useState("credit");
    var ActiveLink = "var(--active-link)"

    return (
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />

            <div className="pay">
                <div className="container">

                    {/* ── Hero ── */}
                    <div className="pay-cont">
                        <div className="pay-head">
                            <h1>Secure &amp; Transparent Payments</h1>
                            <p>All payments are encrypted and protected to ensure your data stays safe.</p>
                            <img src={Dashsd} alt="" />
                        </div>
                    </div>

                    {/* ── Payment form ── */}
                    <div className="pay-form-section">

                        {/* Left: form */}
                        <div className="pay-form">
                            <h2 className="pay-form-title">Payment Method</h2>

                            <div className="pay-methods">
                                <button
                                    className={`pay-method-btn ${activeMethod === "credit" ? "active" : ""}`}
                                    onClick={() => setActiveMethod("credit")}
                                >
                                    <CreditCardIcon size={30} color={activeMethod === "credit" ? ActiveLink : "#888"} />
                                    Credit Card
                                    {activeMethod === "credit" && <span className="pay-method-dot" />}
                                </button>
                                <button
                                    className={`pay-method-btn ${activeMethod === "paypal" ? "active" : ""}`}
                                    onClick={() => setActiveMethod("paypal")}
                                >
                                    <PayPalIcon size={30} />
                                    Pay Pal
                                    {activeMethod === "paypal" && <span className="pay-method-dot" />}
                                </button>
                            </div>

                            <div className="pay-divider" />

                            <label className="pay-label">Card Information</label>
                            <div className="pay-input-wrap">
                                <CreditCardIcon size={30} color={ActiveLink} />
                                <input className="pay-input" placeholder="0000 0000 0000 0000" />
                            </div>

                            <div className="pay-row">
                                <div className="pay-input-wrap">
                                    <CalendarIcon size={30} color={ActiveLink} />
                                    <input className="pay-input" placeholder="MM \ YY" />
                                </div>
                                <div className="pay-input-wrap">
                                    <LockIcon size={30} color={ActiveLink} />
                                    <input className="pay-input" placeholder="CVC" />
                                </div>
                            </div>

                            <label className="pay-label">Name on Card</label>
                            <div className="pay-input-wrap">
                                <UserIcon size={30} color={ActiveLink} />
                                <input className="pay-input" placeholder="Joe Doe" />
                            </div>

                            <label className="pay-label">Zip Code</label>
                            <div className="pay-input-wrap">
                                <MapPinIcon size={30} color={ActiveLink} />
                                <input className="pay-input" placeholder="1001" />
                            </div>
                        </div>

                        {/* Right: order summary */}
                        <div className="pay-summary">
                            <h2 className="pay-summary-title">Order Summary</h2>

                            <div className="pay-plan-row">
                                <div className="pay-plan-icon">
                                    <LeafIcon size={30} color={ActiveLink}  />
                                </div>
                                <span className="pay-plan-name">Easy</span>
                                <span className="pay-plan-price">$999</span>
                            </div>

                            <div className="pay-summary-divider" />

                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Subtotal</span>
                                <span className="pay-summary-value">$999</span>
                            </div>
                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Taxes (Estimated)</span>
                                <span className="pay-summary-value">$90</span>
                            </div>
                            <div className="pay-summary-row">
                                <span className="pay-summary-label">Service Fee</span>
                                <span className="pay-summary-value">$0.00</span>
                            </div>

                            <div className="pay-summary-divider" />

                            <div className="pay-total-row">
                                <span className="pay-total-label">Total Due</span>
                                <span className="pay-total-value">$1,089</span>
                            </div>

                            <button className="pay-confirm-btn">
                                Confirm and Pay <ArrowRightIcon size={30} color="#111" />
                            </button>

                            <div className="pay-ssl">
                                <ShieldIcon size={30} color="#555" />
                                Payments are 256-bit SSL Encrypted
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};