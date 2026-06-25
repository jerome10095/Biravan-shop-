If you have the rights to display an official brand logo (e.g. you're an
authorized retailer), drop the image file here, e.g.:

  zegna.png
  tomford.png
  loropiana.png

Then in src/data.js, point the matching brand's `logo` field at it:

  { name: "Ermenegildo Zegna", logo: "/brands/zegna.png" }

Until a logo path is set, that brand's name is shown as clean text instead.
