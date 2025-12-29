"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

function PropertyImages({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
  });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = (index) => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    emblaMainApi.scrollTo(index);
  };

  const onSelect = () => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
    };
  }, [emblaMainApi]);

  if (!images || images.length === 0) {
    return <div className="text-center p-4">No images available</div>;
  }

  return (
    <section className="bg-blue-50 p-4">
      <div className="container mx-auto">
        {/* Main Carousel */}
        <div className="overflow-hidden rounded-lg mb-4" ref={emblaMainRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <Image
                  src={image}
                  alt={`Property image ${index + 1}`}
                  width={900}
                  height={400}
                  priority={index === 0}
                  className="w-full h-auto object-cover rounded-lg"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="overflow-hidden" ref={emblaThumbsRef}>
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onThumbClick(index)}
                  className={`flex-[0_0_calc(20%-0.5rem)] cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedIndex
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={80}
                    className="w-full h-20 object-cover"
                    sizes="20vw"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PropertyImages;
