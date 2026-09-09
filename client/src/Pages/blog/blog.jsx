import { useEffect, useState, useCallback } from "react";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Linesd from "../../assets/linesd.png";
import { getAllBlogs } from "../../api/service/blogServ";
import "./blog.css";

const DEMO_BLOGS = [
  {
    _id: "demo-1",
    title: "Building Scalable React Apps",
    description:
      "A look at patterns and structures that keep React codebases maintainable as they grow.",
    image: "https://picsum.photos/seed/blog1/600/400",
    link: "https://linkedin.com/in/example",
    important: true,
  },
  {
    _id: "demo-2",
    title: "Node.js Performance Tips",
    description:
      "Practical techniques for speeding up Express APIs and MongoDB queries in production.",
    image: "https://picsum.photos/seed/blog2/600/400",
    link: "#",
    important: false,
  },
  {
    _id: "demo-3",
    title: "From Accounting to Full-Stack Dev",
    description:
      "Notes on transitioning careers into software engineering and what actually helped.",
    image: "https://picsum.photos/seed/blog3/600/400",
    link: "#",
    important: false,
  },
];

export const Blog = ({ theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [isDemo, setIsDemo]     = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsDemo(false);
      const res = await getAllBlogs();
      const data = Array.isArray(res) ? res : res.data ?? [];

      if (data.length === 0) {
        // Treat an empty response as "nothing to show", not a failure
        setProjects([]);
      } else {
        setProjects(data);
      }
    } catch (err) {
      // API failed — fall back to demo content instead of an error screen
      setError(err.message ?? "Something went wrong");
      setProjects(DEMO_BLOGS);
      setIsDemo(true);
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
    <>
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
                <img src={Linesd} />
              </div>

              <div className="blog-info">
                {isDemo && !loading && (
                  <div className="demo-banner">
                    <span>⚠ Couldn't reach the server — showing demo posts.</span>
                    <button className="error-retry" onClick={fetchBlogs}>
                      Retry
                    </button>
                  </div>
                )}

                <div className="cards">

                  {loading && (
                    <div className="loader-wrapper">
                      <div className="loader"></div>
                    </div>
                  )}

                  {!loading && !isDemo && !error && projects.length === 0 && (
                    <div className="empty-state">
                      <p>No posts found.</p>
                    </div>
                  )}

                  {!loading && projects.map((project) => (
                    <div
                      key={project._id}
                      className={`card ${project.important ? "card--important" : "card--side"}`}
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
    </>
  );
};
