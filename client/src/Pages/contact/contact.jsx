import { useState } from "react"
import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Logo from '../../assets/logo.png'
import Lines from '../../assets/linescont.png'
import Dashed from '../../assets/dashedcont.png'
import { PostContact } from "../../api/service/contactServ.js"
import "./contact.css"

export const Contact = ({ theme, toggleTheme }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "" })
  const [status, setStatus] = useState(null) // "success" | "error" | null
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const payload = {
        ...form,
        name: `${form.name} (${form.phone})`,
      }
      await PostContact(payload)
      setStatus("success")
      setForm({ name: "", email: "", phone: "", subject: "" })
    } catch (error) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div data-theme={theme}>
        <Header onToggleTheme={toggleTheme} />
        <div className="contact">
          <img className="lines" src={Lines} alt="" aria-hidden="true" />
          <img className="dashed" src={Dashed} alt="" aria-hidden="true" />

          <div className="container">
            <div className="cont-cont">

              {/* Logo side */}
              <div className="right">
                <img src={Logo} alt="Logo" />
                <div className="right-text">
                  <h2>Let's Work<br />Together</h2>
                </div>
              </div>

              {/* Form side */}
              <div className="left">
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <p>Tell us about your project and we'll get back to you within 24 hours.</p>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="hello@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <textarea
                      id="subject"
                      name="subject"
                      rows={4}
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>

                  {status === "success" && (
                    <p className="form-msg success">✓ Message sent successfully!</p>
                  )}
                  {status === "error" && (
                    <p className="form-msg error">✕ Something went wrong. Try again.</p>
                  )}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading
                      ? <span className="loading-dots">Sending<span>.</span><span>.</span><span>.</span></span>
                      : <><span>Send To Us</span> <span className="arrow">→</span></>
                    }
                  </button>

                </form>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}