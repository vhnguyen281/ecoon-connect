"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { setDefaults, fromAddress } from "react-geocode";
import Spinner from "./Spinner";

const GoogleMapComponent = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.GoogleMap),
  { ssr: false }
);

const MarkerComponent = dynamic(
  () => import("@react-google-maps/api").then((mod) => mod.Marker),
  { ssr: false }
);

function PropertyMap({ property }) {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    language: "en",
    region: "es",
  });

  useEffect(() => {
    if (!property || !property.location) {
      setError("Property location not available");
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const response = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        if (!response.results || response.results.length === 0) {
          setError("No location found");
          setLoading(false);
          return;
        }

        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching coordinates:", err);
        setError("No location found");
        setLoading(false);
      }
    };
    fetchCoordinates();
  }, [property]);

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "8px",
  };

  const center = {
    lat: lat || 0,
    lng: lng || 0,
  };

  if (loading) return <Spinner loading={loading} />;

  if (error || !lat || !lng) {
    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <p style={{ fontSize: "18px", color: "#999", fontWeight: "500" }}>
          No location found
        </p>
      </div>
    );
  }

  return (
    <GoogleMapComponent
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={15}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
      }}
    >
      <MarkerComponent
        position={center}
        title={property?.name || "Property Location"}
      />
    </GoogleMapComponent>
  );
}

export default PropertyMap;
