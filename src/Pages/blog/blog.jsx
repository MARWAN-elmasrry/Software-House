import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import Linesd from "../../assets/linesd.png"
import "./blog.css"

const projects = [
    {
        id: 1,
        title: "This Main Proj",
        description: "This Main Proj",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
        important: true,
        link: "#"
    },
    {
        id: 2,
        title: "This Side Proj",
        description: "This Main Proj",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
        important: false,
        link: "#"
    },
    {
        id: 3,
        title: "Another Main Proj",
        description: "This Main Proj",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=250&fit=crop",
        important: true,
        link: "#"
    }
]

export const Blog = ({theme, toggleTheme}) =>{
    return(<>
        <div data-theme={theme}>
            <Header onToggleTheme={toggleTheme} />
            <div className="blog">
                <div className="container">
                    <div className="blog-cont">
                        <div className="blog-head">
                            <h1>LETS SEE WHERE WE GO TO THE POINT</h1>
                            <div className="btn">
                                <button>CV</button>
                            </div>
                            <img src={Linesd} />
                        </div>
                        <div className="blog-info">
                            <div className="cards">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className={`card ${project.important ? "card--important" : "card--side"}`}
                                    >
                                        <div className="card-inner">
                                            <div className="card-img">
                                                <img src={project.image} alt={project.title} />
                                            </div>
                                            <div className="card-body">
                                                <h2 className="card-title">{project.title}</h2>
                                                <p className="card-desc">{project.description}</p>
                                                <a href={project.link} className="card-btn">SEE IT</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </>)
}