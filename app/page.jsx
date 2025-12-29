import Hero from "@/components/Hero";
import InforBoxes from "@/components/InforBoxes";
import HomeProperties from "@/components/HomeProperties";
import FeaturedProperties from "@/components/FeaturedProperties";

export const dynamic = "force-dynamic";

async function HomePage() {
  return (
    <>
      <Hero />
      <InforBoxes />
      <FeaturedProperties />
      <HomeProperties />
    </>
  );
}

export default HomePage;
