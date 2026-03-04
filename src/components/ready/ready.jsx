import Lines from "../../assets/lines.png"
import Dashes from "../../assets/dashes.png"
import "./ready.css"

export const Ready = () =>{
    return(<>
        <div className="ready">
            <div className="container">
                <div className="ready-cont">
                    <img src={Lines} alt="Lines" className="lines-decoration" />
                    <img src={Dashes} alt="Dashes" className="dashes-decoration" />
                    
                    <div className="ready-card">
                        <h2>Ready to build something extraordinary?</h2>
                        <p>Let's discuss how we can help you architect the next generation of your software infrastructure.</p>
                        
                        <div className="ready-buttons">
                            <button className="schedule-btn">Schedule a Consultation</button>
                            <button className="view-services-btn">View Services</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}