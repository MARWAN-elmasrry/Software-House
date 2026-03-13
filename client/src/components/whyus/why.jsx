import './why.css'
import Cloud from "../../assets/cloud.png"
import Brain from "../../assets/brain.png"
import Code from "../../assets/mobile.png"
import Chip from "../../assets/sys.png"
import Design from "../../assets/pin.png"
import Digital from "../../assets/digtal.png"

export const WhyUs = () => {
    return (
        <div className="why">
            <div className="container">
                <div className="why-cont">
                    <h1 className="why-title">
                        <span className="title-dots"></span>
                        Why us
                        <span className="title-dots"></span>
                    </h1>
                    <div className="cards">
                        <div className="card">
                            <div className="card-icon">
                                <img src={Cloud} alt="Cloud" />
                            </div>
                            <div className="h2">
                                <h2>Scalable Cloud Solutions</h2>
                            </div>  
                            <p>We build secure, high-performance cloud architectures that scale effortlessly as your business grows.</p>
                        </div>
                        
                        <div className="card">
                            <div className="card-icon">
                                <img src={Brain} alt="AI Brain" />
                            </div>
                            <div className="h2">
                                <h2>Smart AI-Driven Systems</h2>
                            </div>
                            <p>We turn data into decisions using intelligent AI models that automate, predict, and optimize outcomes.</p>
                        </div>
                        
                        <div className="card">
                            <div className="card-icon">
                                <img src={Code} alt="Code" />
                            </div>
                            <div className="h2">
                                <h2>Modern App Development</h2>
                            </div>
                            <p>We create fast, responsive web and mobile applications with clean code and exceptional user experience.</p>
                        </div>
                        
                        <div className="card">
                            <div className="card-icon">
                                <img src={Chip} alt="Chip" />
                            </div>
                            <div className="h2">
                                <h2>Reliable Embedded Systems</h2>
                            </div>
                            <p>We design efficient, low-level systems that deliver hardware with precision, stability, and performance.</p>
                        </div>
                        
                        <div className="card">
                            <div className="card-icon">
                                <img src={Design} alt="Design" />
                            </div>
                            <div className="h2">
                                <h2>User-Centered Design</h2>
                            </div>
                            <p>We craft intuitive interfaces and seamless experiences that users love and businesses trust.</p>
                        </div>
                        
                        <div className="card">
                            <div className="card-icon">
                                <img src={Digital} alt="Digital" />
                            </div>
                            <div className="h2">
                                <h2>Complete Digital Solutions</h2>
                            </div>
                            <p>From concept to deployment, we deliver full-cycle solutions tailored to your business goals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}