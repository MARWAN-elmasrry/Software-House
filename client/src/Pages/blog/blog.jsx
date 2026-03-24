import { useEffect, useState, useCallback } from "react";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Linesd from "../../assets/linesd.png";
import { getAllBlogs } from "../../api/service/blogServ";
import "./blog.css";

export const Blog = ({ theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllBlogs();
      setProjects(Array.isArray(res) ? res : res.data ?? []);
    } catch (err) {
      setError(err.message ?? "Something went wrong");
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
                  <button>Portfolio</button>
                </div>
                <img src={Linesd} />
              </div>
              <div className="blog-info">
                <div className="cards">

                  {loading && (
                    <div className="loader-wrapper">
                      <div className="loader"></div>
                    </div>
                  )}

                  {error && !loading && (
                    <div className="error-state">
                      <div className="error-icon">⚠</div>
                      <p className="error-title">Failed to load posts</p>
                      <p className="error-msg">{error}</p>
                      <button className="error-retry" onClick={fetchBlogs}>
                        Try again
                      </button>
                    </div>
                  )}

                  {!loading && !error && projects.length === 0 && (
                    <div className="empty-state">
                      <p>No posts found.</p>
                    </div>
                  )}

                  {!loading && !error && projects.map((project) => (
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
                          <a
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