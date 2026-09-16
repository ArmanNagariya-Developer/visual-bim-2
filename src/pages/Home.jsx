/**
 * Home — single-page composition of every Visual BIM section.
 */
import About from '../components/About';
import Services from '../components/Services';
import BIMProcess from '../components/BIMProcess';
import Projects from '../components/Projects';
import CTA from '../components/CTA';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import TechnologySection from '../components/TechnologySection';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <BIMProcess />
      <TechnologySection />
      <Projects />
      <CTA />
      <Contact />
    </>
  );
}
