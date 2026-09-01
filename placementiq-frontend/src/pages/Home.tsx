import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import RoadmapSection from "../components/RoadmapSection";
import StatsSection from "../components/StatsSection";
import ModuleSection from "../components/ModuleSection";
import TestimonialSection from "../components/TestimonialSection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <RoadmapSection />
      <StatsSection />
      <ModuleSection />
      <TestimonialSection />
      <Footer />
    </>
  );
}

export default Home;