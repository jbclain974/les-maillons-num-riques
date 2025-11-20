import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ActionsOverview from "@/components/home/ActionsOverview";
import CTASection from "@/components/home/CTASection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ActionsOverview />
      <CTASection />
    </Layout>
  );
};

export default Home;
