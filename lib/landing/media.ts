/** Curated Unsplash URLs — orchard, cider, dining (demo; replace with licensed assets for production). */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const landingImages = {
  hero: u("photo-1508514170455-325109bf6f78", 1920),
  story: u("photo-1566385101042-e5f0e0d1f64e", 1200),
  orchard: u("photo-1464226184775-7db066ed56d7", 1200),
  ciderPour: u("photo-1510810872334-fbf388fc5490", 1200),
  barrel: u("photo-1569529465841-df5a29fbdc8e", 1200),
  dining: u("photo-1414235077428-338989a2e8c0", 1200),
  txotx: u("photo-1559339352-11d035aa65de", 1200),
  menu1: u("photo-1546069901-ba9599a7e63c", 800),
  menu2: u("photo-1565299624946-b28f40a0ae38", 800),
  menu3: u("photo-1565958011703-44f9824ba187", 800),
  gallery: [
    u("photo-1509440159596-0249088772ff", 800),
    u("photo-1495474472287-4d71bcdd2085", 800),
    u("photo-1551218808-94e220a79635", 800),
    u("photo-1517248135467-4c7edcad34c4", 800),
    u("photo-1574489418509-9c066b509113", 800),
    u("photo-1604908176997-12518829aaf4", 800),
  ],
  visit: u("photo-1476234686869-4c0f5a5d1c3c", 1200),
} as const;

export const landingNav = [
  { href: "#story", label: "Our story" },
  { href: "#cider", label: "Cider" },
  { href: "#experience", label: "Experience" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#visit", label: "Visit" },
] as const;
