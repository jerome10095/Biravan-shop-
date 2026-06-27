/**
 * Central place for all shop data and small helper functions.
 * Components import from here instead of redefining their own copies.
 */

export const SHOP = {
  name: "BIRAVAN",
  sub: "LINE BOUTIQUE",
  address: "KN3 Rd, Gisenyi, Rubavu District, Western Province, Rwanda",
  phone: "+250 784 525 336",
  email: "birambaj@gmail.com",
  // Exact pin dropped by the owner — used for "Get Directions".
  mapsLink: "https://maps.app.goo.gl/kGyG7UvHoSjpvrCv8",
  // Coordinates resolved from the link above — used for the embedded map and distance check.
  lat: -1.6931381,
  lng: 29.2599982,
};

/**
 * 👉 Paste your real social links here. Leave any value as "" and that
 * icon will still show in the footer but link to "#" until you fill it in.
 * (WhatsApp is the exception — leave it blank and it's auto-built from SHOP.phone.)
 */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/biravanlane/", // e.g. "https://instagram.com/yourhandle"
  whatsapp: "https://wa.me/250784525336",
  facebook: "",  // e.g. "https://facebook.com/yourpage"
  tiktok: "",    // e.g. "https://tiktok.com/@yourhandle"
  snapchat: "",  // e.g. "https://snapchat.com/add/yourhandle"
  twitter: "",   // e.g. "https://x.com/yourhandle"
};

/** The WhatsApp number that receives orders placed through checkout (Rwandan local format is fine). */
export const ORDER_WHATSAPP_NUMBER = "0784525336";

/**
 * Builds a wa.me link, optionally with a pre-filled message.
 * Accepts either Rwandan local format (0XXXXXXXXX) or already-international digits.
 */
export function buildWhatsappUrl(number, message) {
  const digits = number.replace(/[^0-9]/g, "");
  const intl = digits.length === 10 && digits.startsWith("0") ? `250${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Resolves the general contact WhatsApp link: your manual override if set, otherwise built from SHOP.phone. */
export function getWhatsappUrl() {
  return SOCIAL_LINKS.whatsapp || buildWhatsappUrl(SHOP.phone);
}

/** Friendly labels for the checkout payment method ids — used in the UI and in the WhatsApp order message. */
export const PAYMENT_METHOD_LABELS = {
  momo: "MTN Mobile Money",
  airtel: "Airtel Money",
  card: "Debit / Credit Card",
  cod: "Cash on Delivery",
};

/**
 * Brands carried in-store. `logo` is optional — if you have the rights to
 * display an official brand logo, drop the image file into /public/brands/
 * and point `logo` at it (e.g. "/brands/zegna.png"). Until then, each name
 * is shown as clean typography instead of a recreated logo.
 */
export const BRANDS = [
  { name: "Nike", logo: "" },
  { name: "Polo Ralph Lauren", logo: "" },
  { name: "Ermenegildo Zegna", logo: "" },
  { name: "Brunello Cucinelli", logo: "" },
  { name: "Tom Ford", logo: "" },
  { name: "Loro Piana", logo: "" },
];

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

/**
 * 👉 Generates an "empty slot" placeholder for extra gallery photos you haven't
 * added yet. Wraps the given label onto a couple of lines so it reads clearly
 * inside the image frame (e.g. "Add a back-view photo here").
 */
export function imagePlaceholder(label) {
  const words = label.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='600'>
    <rect width='100%' height='100%' fill='#15130F'/>
    <rect x='14' y='14' width='452' height='572' fill='none' stroke='#D4AF37' stroke-width='2' stroke-dasharray='10 8'/>
    <text x='50%' y='47%' font-family='Inter, sans-serif' font-size='20' fill='#D4AF37' text-anchor='middle'>${line1}</text>
    <text x='50%' y='53%' font-family='Inter, sans-serif' font-size='20' fill='#D4AF37' text-anchor='middle'>${line2}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRODUCTS = [
  { id: 1, name: "Tailored Wool Blazer", category: "Clothing", price: 145000, tag: "Trending",
    images: [
      "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Charcoal", hex: "#2b2b2b" }, { name: "Camel", hex: "#9c7a4a" },
      { name: "Navy", hex: "#1f2a44" }, { name: "Black", hex: "#111111" }, { name: "Grey", hex: "#6b6b6b" },
    ] },
  { id: 2, name: "Slim-Fit Oxford Shirt", category: "Clothing", price: 38000, tag: "New",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620799139834-6dc8df5aa9c3?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "White", hex: "#f5f3ee" }, { name: "Sky", hex: "#6f8faa" }, { name: "Black", hex: "#111111" },
      { name: "Light Pink", hex: "#e3b9bb" }, { name: "Lavender", hex: "#a59cc2" },
    ] },
  { id: 3, name: "Classic Denim Jacket", category: "Clothing", price: 52000, tag: "Trending",
    images: [
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Indigo", hex: "#33455c" }, { name: "Black", hex: "#111111" },
      { name: "Light Wash", hex: "#7d93a8" }, { name: "Grey", hex: "#6b6b6b" },
    ] },
  { id: 4, name: "Linen Resort Shirt", category: "Clothing", price: 34000, tag: null,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Sand", hex: "#c9b48b" }, { name: "Olive", hex: "#5c5b3f" },
      { name: "White", hex: "#f5f3ee" }, { name: "Terracotta", hex: "#a85c41" },
    ] },
  { id: 5, name: "Wool Flannel Trousers", category: "Clothing", price: 46000, tag: null,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584865288642-42078afe6942?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Graphite", hex: "#3a3a3a" }, { name: "Navy", hex: "#1f2a44" },
      { name: "Black", hex: "#111111" }, { name: "Camel", hex: "#9c7a4a" },
    ] },
  { id: 6, name: "Chukka Leather Boots", category: "Shoes", price: 95000, tag: "Trending",
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520219306100-ec4afbdb4e8f?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Cognac", hex: "#8a4b2b" }, { name: "Black", hex: "#111111" }, { name: "Dark Brown", hex: "#4a3322" },
    ] },
  { id: 7, name: "Classic Derby Shoes", category: "Shoes", price: 88000, tag: null,
    images: [
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583209814683-c81ed7eb8f00?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Black", hex: "#111111" }, { name: "Brown", hex: "#5b3a24" }, { name: "Burgundy", hex: "#5c2027" },
    ] },
  { id: 8, name: "Canvas Low-Top Sneakers", category: "Shoes", price: 42000, tag: "New",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "White", hex: "#f2f2f2" }, { name: "Black", hex: "#111111" },
      { name: "Grey", hex: "#8a8a8a" }, { name: "Navy", hex: "#1f2a44" },
    ] },
  { id: 9, name: "Full-Grain Leather Belt", category: "Accessories", price: 22000, tag: null,
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611816001670-0cde22d7f7b2?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617196034096-1d90b6c91584?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Black", hex: "#111111" }, { name: "Brown", hex: "#5b3a24" }, { name: "Tan", hex: "#b08c5f" },
    ] },
  { id: 10, name: "Aviator Sunglasses", category: "Accessories", price: 28000, tag: "Trending",
    images: [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Gold", hex: "#D4AF37" }, { name: "Black", hex: "#111111" },
      { name: "Tortoise", hex: "#6b4a2a" }, { name: "Silver", hex: "#b9bdc1" },
    ] },
  { id: 11, name: "Automatic Chrono Watch", category: "Accessories", price: 135000, tag: "New",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Gold", hex: "#D4AF37" }, { name: "Steel", hex: "#9aa0a6" },
      { name: "Black", hex: "#111111" }, { name: "Rose Gold", hex: "#b76e64" },
    ] },
  { id: 12, name: "Merino Wool Beanie", category: "Accessories", price: 15000, tag: null,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510590337257-9bff36b8d51c?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603252109360-909baaf261ae?w=600&q=80&auto=format&fit=crop",
    ],
    colors: [
      { name: "Charcoal", hex: "#2b2b2b" }, { name: "Camel", hex: "#9c7a4a" },
      { name: "Black", hex: "#111111" }, { name: "Burgundy", hex: "#5c2027" },
    ] },
  { id: 13, name: "Brunchelo", category: "Shoes", price: 15000, tag: null,
    images: [
      "/Products/Shoes/Brunchelo.jfif",
      "/Products/Shoes/shoe.jfif",
      "/Products/Shoes/sample.jfif",
    ],
    colors: [
      { name: "Charcoal", hex: "#2b2b2b" }, { name: "Dark green", hex: "#055c18" },
      { name: "Black", hex: "#111111" }, { name: "Burgundy", hex: "#5c2027" },
    ] },
  { id: 14, name: "Loro Piana Summer Walk", category: "Shoes", price: 15000, tag: null,
    images: [
      "/Products/Shoes/Loro piana summer walk.jfif",
      "/Products/Shoes/Loro piana shoe.jfif",
      "/Products/Shoes/summer walk collection.jfif",
    ],
    colors: [
      { name: "Charcoal", hex: "#2b2b2b" }, { name: "Camel", hex: "#9c7a4a" },
      { name: "Black", hex: "#111111" }, { name: "White", hex: "#f3eeef" },
    ] },
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
