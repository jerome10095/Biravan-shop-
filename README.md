# BIRAVAN Line Boutique — organized for your `my-react-project`

This package mirrors your existing project layout (`src/Components/...`) so you
can drop these files straight in. Every component lives in its own file and is
exported/imported properly, the way you asked.

## 1. Install the two packages this project needs

Your project doesn't have Tailwind CSS or the icon library yet. From your
project root (`my-react-project`), run:

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```

## 2. Copy these files into your project

| From this package          | Goes to (in `my-react-project`)      | Action |
|-----------------------------|----------------------------------------|--------|
| `tailwind.config.js`        | project root                          | add |
| `postcss.config.js`         | project root                          | add (overwrite if one already exists) |
| `src/data.js`                | `src/data.js`                         | add |
| `src/App.jsx`                | `src/App.jsx`                         | **overwrite** |
| `src/main.jsx`                | `src/main.jsx`                       | **overwrite** (it's the standard Vite entry file, just confirming it imports `index.css` and `App.jsx`) |
| `src/index.css`               | `src/index.css`                      | **overwrite** |
| `src/Components/Header.jsx`   | `src/Components/Header.jsx`          | **overwrite** (yours is currently empty) |
| `src/Components/Footer.jsx`   | `src/Components/Footer.jsx`          | **overwrite** (yours is currently empty) |
| `src/Components/Main.jsx`     | `src/Components/Main.jsx`            | **overwrite** (yours is currently empty) |
| `src/Components/*.jsx` (the rest) | `src/Components/` | add — these are new files |
| `public/videos/README.txt`    | `public/videos/README.txt`           | add (just notes — see step 4) |

Your `src/Components/Great.jsx` isn't used by this project — leave it or
delete it, it won't affect anything since nothing imports it.

You can ignore/keep your existing `src/App.css` — it's not imported anymore
(everything is styled with Tailwind + `index.css` instead).

## 3. Run it

```bash
npm run dev
```

Open the local URL it prints. You should see the full BIRAVAN site.

## 4. Add your hero video whenever it's ready

Drop your clip into `public/videos/hero-loop.mp4` (exact name). The hero
section in `src/Components/Hero.jsx` already looks for it and will play it
automatically — until then, the fallback photo shows instead. See
`public/videos/README.txt` for the recommended specs.

## How the files fit together

```
src/
├─ data.js                     ← shop info, product list, helper functions (no UI)
├─ App.jsx                     ← holds all the shared state (cart, checkout, etc.)
│                                 and assembles everything below
└─ Components/
   ├─ Buttons.jsx              ← shared <GoldButton>, <OutlineButton>, <Divider>
   ├─ Header.jsx               ← announcement bar + top nav + mobile menu
   ├─ FloatingDock.jsx         ← the floating icon shortcuts on the right edge
   ├─ Main.jsx                 ← the page body: Hero + TrustStrip + Shop + Location
   │  ├─ Hero.jsx               ← video/photo banner
   │  ├─ TrustStrip.jsx         ← delivery / mobile money / quality row
   │  ├─ Shop.jsx               ← search + category filters + product grid
   │  │  └─ ProductCard.jsx     ← a single product tile
   │  └─ Location.jsx           ← address, geolocation distance, embedded map
   ├─ Footer.jsx
   ├─ ProductDetail.jsx        ← popup when you click a product
   ├─ SizeGuide.jsx            ← popup from the ruler icon / size guide link
   ├─ Cart.jsx                 ← slide-out bag drawer
   ├─ Checkout.jsx             ← shipping + payment screen
   └─ OrderConfirmation.jsx    ← "order confirmed" popup
```

`App.jsx` is the only file that holds state (cart contents, which modal is
open, the checkout form, etc.). Every other component just receives what it
needs as **props** and calls functions passed down to it — that's the
"separate files, properly exported/imported" structure you asked for.
