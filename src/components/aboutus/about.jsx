import "./about.css"
import People from "../../assets/people.png"
import Rocket from "../../assets/rocket.png"
import Diamond from "../../assets/diamond.png"
import Clock from "../../assets/timer.png"

const statsData = [
  {
    id: 1,
    icon: People,
    value: "50+",
    label: "Senior Engineers"
  },
  {
    id: 2,
    icon: Clock,
    value: "10+",
    label: "Years Shipping"
  },
  {
    id: 3,
    icon: Rocket,
    value: "200+",
    label: "Projects Delivered"
  },
  {
    id: 4,
    icon: Diamond,
    value: "98%",
    label: "Client Retention"
  }
];

export const AboutUs = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-cont">
          <div className="info">
            <h1>About Us</h1>
            <p>We are not just a dev shop. We are a team of dedicated engineers, architects, and designers passionate about shipping high-quality software that solves real business problems.</p>
            <p>Our approach combines deep technical expertise with a keen understanding of user experience. We believe that the best code is the code that delivers value, scales effortlessly, and remains maintainable for years to come.</p>
            <a href="#">Read our Manifesto →</a>
          </div>
          <div className="cards">
            {statsData.map((stat) => (
              <div key={stat.id} className="card">
                <div className="card-info">
                  <img src={stat.icon} alt={stat.label} />
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};