/**
 * Central place for all shop data and small helper functions.
 * Components import from here instead of redefining their own copies.
 */

export const SHOP = {
  name: "BIRAVAN LINE",
  sub: "BOUTIQUE",
  address: "KN3 Rd, Gisenyi, Rubavu District, Western Province, Rwanda",
  phone: "+250 784525336",
  email: "biravan@gmail.com",
  lat: -1.7037,
  lng: 29.2557,
};

export const CATEGORIES = ["Trending", "All", "Clothing", "Shoes", "Accessories"];

export const SIZE_SETS = {
  Clothing: ["S", "M", "L", "XL", "XXL"],
  Shoes: ["40", "41", "42", "43", "44", "45"],
  Accessories: ["One Size"],
};

/** Generates a gold-on-black placeholder image (used when a product photo fails to load). */
export function placeholder(letter) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='600'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#1b1814'/><stop offset='1' stop-color='#0b0a09'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <rect x='18' y='18' width='444' height='564' fill='none' stroke='#D4AF37' stroke-width='1.5'/>
    <text x='50%' y='53%' font-family='Georgia, serif' font-size='58' fill='#D4AF37' text-anchor='middle'>${letter}</text>
    <text x='50%' y='60%' font-family='Georgia, serif' font-size='12' letter-spacing='3' fill='#9C7A24' text-anchor='middle'>BIRAVAN</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRODUCTS = [
  { id: 1, name: "Tailored Wool Blazer", category: "Clothing", price: 145000, tag: "Trending",
    img: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Charcoal", hex: "#2b2b2b" }, { name: "Camel", hex: "#9c7a4a" }] },
  { id: 2, name: "Slim-Fit Oxford Shirt", category: "Clothing", price: 38000, tag: "New",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "White", hex: "#f5f3ee" }, { name: "Sky", hex: "#6f8faa" }, { name: "Black", hex: "#111111" }] },
  { id: 3, name: "Classic Denim Jacket", category: "Clothing", price: 52000, tag: "Trending",
    img: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Indigo", hex: "#33455c" }, { name: "Black", hex: "#111111" }] },
  { id: 4, name: "Linen Resort Shirt", category: "Clothing", price: 34000, tag: null,
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Sand", hex: "#c9b48b" }, { name: "Olive", hex: "#5c5b3f" }] },
  { id: 5, name: "Wool Flannel Trousers", category: "Clothing", price: 46000, tag: null,
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Graphite", hex: "#3a3a3a" }, { name: "Navy", hex: "#1f2a44" }] },
  { id: 6, name: "Chukka Leather Boots", category: "Shoes", price: 95000, tag: "Trending",
    img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Cognac", hex: "#8a4b2b" }, { name: "Black", hex: "#111111" }] },
  { id: 7, name: "Classic Derby Shoes", category: "Shoes", price: 88000, tag: null,
    img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Black", hex: "#111111" }, { name: "Brown", hex: "#5b3a24" }] },
  { id: 8, name: "Canvas Low-Top Sneakers", category: "Shoes", price: 42000, tag: "New",
    img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "White", hex: "#f2f2f2" }, { name: "Black", hex: "#111111" }] },
  { id: 9, name: "Full-Grain Leather Belt", category: "Accessories", price: 22000, tag: null,
    img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Black", hex: "#111111" }, { name: "Brown", hex: "#5b3a24" }] },
  { id: 10, name: "Aviator Sunglasses", category: "Accessories", price: 28000, tag: "Trending",
    img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Gold", hex: "#D4AF37" }, { name: "Black", hex: "#111111" }] },
  { id: 11, name: "Automatic Chrono Watch", category: "Accessories", price: 135000, tag: "New",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Gold", hex: "#D4AF37" }, { name: "Steel", hex: "#9aa0a6" }] },
  { id: 12, name: "Merino Wool Beanie", category: "Accessories", price: 15000, tag: null,
    img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80&auto=format&fit=crop",
    colors: [{ name: "Charcoal", hex: "#2b2b2b" }, { name: "Camel", hex: "#9c7a4a" }] },
];

/** Formats a number of Rwandan francs, e.g. 45000 -> "45,000 RWF" */
export const formatRWF = (n) => `${new Intl.NumberFormat("en-RW").format(n)} RWF`;

/** Straight-line distance in kilometers between two lat/lng points (Haversine formula). */
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
