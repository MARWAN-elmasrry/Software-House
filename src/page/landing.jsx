import { Header } from "../components/header/header";
import { Hero } from "../components/hero/hero";
import { AboutUs } from "../components/aboutus/about";
import { WhyUs } from "../components/whyus/why";
import { Word } from "../components/word/word";
import { Ready } from "../components/ready/ready";
import { Footer } from "../components/footer/footer";

export const LandingPage = ({ theme, toggleTheme }) => {
  return (
    <div data-theme={theme}>
      <Header onToggleTheme={toggleTheme} />
      <Hero />
      <AboutUs />
      <WhyUs />
      <Word />
      <Ready />
      <Footer />
    </div>
  );
};