import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import EventsCarousel from "@/components/home/EventsCarousel";
import ActionsOverview from "@/components/home/ActionsOverview";
import CTASection from "@/components/home/CTASection";
import MusicBanner from "@/components/home/MusicBanner";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <EventsCarousel />
      <ActionsOverview />
      <MusicBanner />
      <CTASection />
    </Layout>
  );
};

export default Home;
