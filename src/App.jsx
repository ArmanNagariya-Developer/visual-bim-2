import { useSmoothScroll } from './hooks/useSmoothScroll';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';

export default function App() {
  useSmoothScroll();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </>
  );
}
