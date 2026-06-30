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

export const PRODUCTS = [];

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
