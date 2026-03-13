import { useEffect, useState } from "react";
import { Footer } from "../../components/footer/footer";
import { Header } from "../../components/header/header";
import Linesd from "../../assets/linesd.png";
import { getAllBlogs } from "../../api/service/blogServ";
import "./blog.css";

export const Blog = ({ theme, toggleTheme }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await getAllBlogs();
        setProjects(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
                  <button>CV</button>
                </div>
                <img src={Linesd} />
              </div>
              <div className="blog-info">
                <div className="cards">
                  {loading && <p>Loading...</p>}
                  {error   && <p style={{ color: "red" }}>Error: {error}</p>}
                  {!loading && !error && projects.map((project) => (
                    <div
                      key={project._id}
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
    </>
  );
};