import { useEffect, useState, useCallback } from "react";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Linesd from "../../assets/linesd.png";
import { getAllBlogs } from "../../api/service/blogServ";
import ModlPreview from "../../assets/projects/modl.png";
import GaddhaPreview from "../../assets/projects/gaddha.png";
import "./blog.css";

// Real portfolio projects — shown if the API request fails,
// so the page never shows an empty/error state to visitors.
const REAL_PROJECTS = [
  {
    _id: "modl-digital-craft",
    title: "MODL – Digital Craft",
    description:
      "A digital architecture studio site for parametric design, 3D visualization, and urban simulation — RTL Arabic UI with a dark, editorial aesthetic.",
    image: ModlPreview,
    link: "https://www.modl.work/",
    important: true,
  },
  {
    _id: "gaddha",
    title: "قدها ولا بس سوالف؟",
    description:
      "An interactive Saudi/Gulf trivia game platform — team-based categories, lifelines, and timers designed for social gatherings.",
    image: GaddhaPreview,
    link: "https://gaddha.vercel.app/",
    important: false,
  },
];

export const Blog = ({ theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllBlogs();
      const data = Array.isArray(res) ? res : res.data ?? [];
      // If the API returns nothing useful, still show real work instead of an empty page
      setProjects(data.length > 0 ? data : REAL_PROJECTS);
    } catch (err) {
      setError(err.message ?? "Something went wrong");
      setProjects(REAL_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const getLinkLabel = (link) => {
    if (!link) return "SEE IT";
    if (link.includes("linkedin.com")) return "LinkedIn";
    return "SEE IT";
  };

  return (
    <div data-theme={theme}>
      <Header onToggleTheme={toggleTheme} />
      <div className="blog">
        <div className="container">
          <div className="blog-cont">
            <div className="blog-head">
              <h1>LETS SEE WHERE WE GO TO THE POINT</h1>
              <div className="btn">
                <button>Resume</button>
              </div>
              <img src={Linesd} alt="" />
            </div>

            <div className="blog-info">
              <div className="cards">
                {loading && (
                  <div className="loader-wrapper">
                    <div className="loader"></div>
                  </div>
                )}

                {!loading &&
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className={`card ${
                        project.important ? "card--important" : "card--side"
                      }`}
                    >
                      <div className="card-inner">
                        <div className="card-img">
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                          />
                        </div>
                        <div className="card-body">
                          <h2 className="card-title">{project.title}</h2>
                          <p className="card-desc">{project.description}</p>
                          
                            href={project.link}
                            className="card-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {getLinkLabel(project.link)}
                          </a>
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
  );
};
