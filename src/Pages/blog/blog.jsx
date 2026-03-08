import { Footer } from "../../components/footer/footer"
import { Header } from "../../components/header/header"
import "./blog.css"

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
                        </div>
                        <div className="blog-info">

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </>)
}