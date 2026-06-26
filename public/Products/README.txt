Optional: if you'd rather store product photos locally instead of linking to
URLs, drop them here, e.g.:

  blazer-1.jpg
  blazer-2-back.jpg
  blazer-3-detail.jpg

Then in src/data.js, reference them with a leading slash:

  images: [
    "/products/blazer-1.jpg",
    "/products/blazer-2-back.jpg",
    "/products/blazer-3-detail.jpg",
  ]

Either local files (/products/...) or full https:// URLs work fine — mix and
match per product as you get real photos.
