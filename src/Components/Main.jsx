import Hero from "./Hero";
import TrustStrip from "./TrustStrip";
import Shop from "./Shop";
import Location from "./Location";
import React from "react";


/**
 * Everything between the header and the footer.
 *
 * Props:
 *  - activeCategory, setActiveCategory, search, setSearch — shop filters
 *  - wishlist, onToggleWish, onOpenProduct — product grid callbacks
 *  - geo, onFindMyLocation, directionsUrl, mapEmbedUrl — location section
 */
export default function Main({
  products,
  activeCategory,
  setActiveCategory,
  search,
  setSearch,
  wishlist,
  onToggleWish,
  onOpenProduct,
  geo,
  onFindMyLocation,
  directionsUrl,
  mapEmbedUrl,
}) {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Shop
        products={products}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        wishlist={wishlist}
        onToggleWish={onToggleWish}
        onOpenProduct={onOpenProduct}
      />
      <Location
        geo={geo}
        onFindMyLocation={onFindMyLocation}
        directionsUrl={directionsUrl}
        mapEmbedUrl={mapEmbedUrl}
      />
    </main>
  );
}
