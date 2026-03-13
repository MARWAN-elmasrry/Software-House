import "./word.css"
import Profile from "../../assets/profile.png"

export const Word =()=>{
    return(<>
        <div className="word">
            <div className="container">
                <div className="word-cont">
                    <div className="w-card">
                        <div className="img">
                            <img src={Profile} alt="Profile"/>
                            <span>‘’</span>
                        </div>
                        <div className="info">
                            <p><span>"</span>Technology is only as good as the problem it solves. We don't just write code; we engineer outcomes that drive business forward <span>"</span></p>
                            <div className="line"></div>
                            <h3>Name</h3>
                            <span>Founder & Ceo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}