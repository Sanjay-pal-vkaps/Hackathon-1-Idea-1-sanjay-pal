/** Local high-resolution assets for Iturrieta Sagardotegia. */

export const landingImages = {
  hero: "/images/landing/hero.jpg",
  story: "/images/landing/orchard.jpg",
  orchard: "/images/landing/orchard.jpg",
  ciderPour: "/images/landing/txotx.jpg",
  barrel: "/images/landing/cellar.jpg",
  dining: "/images/landing/cellar.jpg",
  txotx: "/images/landing/txotx.jpg",
  menuCodOmelette: "/images/landing/cod-omelette.jpg",
  menuCodPeppers: "/images/landing/cod-peppers.jpg",
  menuTxuleton: "/images/landing/txuleton.jpg",
  menuIdiazabal: "/images/landing/idiazabal.jpg",
  gallery: [
    "/images/landing/txotx.jpg",
    "/images/landing/txuleton.jpg",
    "/images/landing/cod-omelette.jpg",
    "/images/landing/cellar.jpg",
    "/images/landing/orchard.jpg",
    "/images/landing/cod-peppers.jpg",
  ],
  visit: "/images/landing/hero.jpg",
} as const;

export const landingNav = [
  { href: "#story", label: "Our story" },
  { href: "#txotx", label: "The Txotx Ritual" },
  { href: "#cider", label: "Organic Cider" },
  { href: "#menu", label: "Cider House Menu" },
  { href: "#music", label: "Atmosphere & Music" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit & Contact" },
] as const;
