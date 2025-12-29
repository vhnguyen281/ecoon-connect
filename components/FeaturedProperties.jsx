import { fetchProperties } from "@/Utils/requests";
import FeaturedPropertyCard from "./FeaturedPropertyCard";

export const dynamic = "force-dynamic";

async function FeaturedProperties() {
  try {
    const properties = await fetchProperties({ showFeatured: true });
    console.log(properties);

    if (!properties || properties.length === 0) {
      return (
        <section className="bg-blue-50 px-4 pt-6 pb-10">
          <div className="container-xl lg:container m-auto">
            <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
              Featured Properties
            </h2>
            <p className="text-center">No featured properties available</p>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-blue-50 px-4 pt-6 pb-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <FeaturedPropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return (
      <section className="bg-blue-50 px-4 pt-6 pb-10">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Featured Properties
          </h2>
          <p className="text-center">Unable to load featured properties</p>
        </div>
      </section>
    );
  }
}

export default FeaturedProperties;
