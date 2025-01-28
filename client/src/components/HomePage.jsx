import React, { useState, useEffect } from "react";
import { PlaceCard } from "./PlaceCard";
import { SearchBar } from "./SearchBar";

export const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(null);
  const [data, setData] = useState({ places: [] });

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch("/api/places");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const onSearch = (query) => {
    if (query) {
      let searchTerm = query.toLowerCase();
      const filteredPlaces = data.places.filter((place) => {
        console.log(place);
        return (
          place.name.toLowerCase().includes(searchTerm) ||
          place.city_name.toLowerCase().includes(searchTerm)
        );
      });
      console.log(filteredPlaces);
      setFilteredData({ places: filteredPlaces });
    } else {
      setFilteredData(null);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <main className="max-w-6xl mx-auto px-4">
        {/* Search */}
        <div className="flex-grow max-w-2xl">
          <SearchBar onSearch={onSearch} />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8">
          Discover Amazing Places
        </h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData
              ? filteredData?.places?.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))
              : data?.places?.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
          </div>
        )}
      </main>
    </div>
  );
};
