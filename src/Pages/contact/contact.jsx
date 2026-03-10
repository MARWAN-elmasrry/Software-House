import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Logo from '../../assets/logo.png'
import Lines from '../../assets/linescont.png'
import Dashed from '../../assets/dashedcont.png'
import "./contact.css"

export const Contact = ({ theme, toggleTheme }) => {
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
                <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name" placeholder="" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" placeholder="" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <textarea id="subject" name="subject" rows={4} />
                  </div>

                  <button type="submit" className="submit-btn">
                    Send To Us <span className="arrow">→</span>
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