import { useState } from "react"
import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Logo from '../../assets/logo.png'
import Lines from '../../assets/linescont.png'
import Dashed from '../../assets/dashedcont.png'
import { PostContact } from "../../api/service/contactServ.js"
import "./contact.css"

export const Contact = ({ theme, toggleTheme }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "" })
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
      await PostContact(form)
      setStatus("success")
      setForm({ name: "", email: "", subject: "" })
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
          <img className="lines" src={Lines} />
          <img className="dashed" src={Dashed} />
          <div className="container">
            <div className="cont-cont">
              <div className="right">
                <img src={Logo} alt="Logo" />
              </div>

              <div className="left">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder=""
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder=""
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
                      required
                    />
                  </div>

                  {status === "success" && (
                    <p className="form-msg success">Message sent successfully!</p>
                  )}
                  {status === "error" && (
                    <p className="form-msg error">Something went wrong. Try again.</p>
                  )}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Sending..." : <>Send To Us <span className="arrow">→</span></>}
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