export type ProductKind = "CAPS" | "T_SHIRTS" | "SWEATSHIRTS" | "OUTERWEAR" | "BOTTOMS";
export type Audience = "MEN" | "WOMEN" | "UNISEX";
export type ProductMedia = {
  id: string;
  url: string;
  alt: string;
  position: string;
};
export type LocalProduct = {
  id: string;
  slug: string;
  name: string;
  kind: ProductKind;
  audience: Audience;
  price: number;
  previousPrice?: number;
  tone: string;
  description: string;
  story: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  imagePosition: string;
  images: ProductMedia[];
  label?: string;
};
const editorialFrames = (
  productId: string,
  productName: string,
  imagePosition: string,
  audience: Audience,
): ProductMedia[] =>
  [imagePosition, "54% center", "68% 28%", "82% 62%"].map(
    (position, index) => ({
      id: `${productId}-frame-${index + 1}`,
      url:
        audience === "WOMEN"
          ? "/images/editorial/women-collection.webp"
          : audience === "UNISEX" && index % 2
            ? "/images/editorial/women-collection.webp"
            : "/images/editorial/hero-streetwear.webp",
      alt: `${productName}, editorial view ${index + 1}`,
      position,
    }),
  );
const product = (
  id: string,
  slug: string,
  name: string,
  kind: ProductKind,
  audience: Audience,
  price: number,
  tone: string,
  description: string,
  story: string,
  details: string[],
  sizes: string[],
  colors: { name: string; hex: string }[],
  imagePosition: string,
  label?: string,
  previousPrice?: number,
): LocalProduct => ({
  id,
  slug,
  name,
  kind,
  audience,
  price,
  tone,
  description,
  story,
  details,
  sizes,
  colors,
  imagePosition,
  images: editorialFrames(id, name, imagePosition, audience),
  label,
  previousPrice,
});
const coreCatalog = [
  product(
    "cap-01",
    "field-cap-01",
    "Field Cap / 01",
    "CAPS",
    "UNISEX",
    48,
    "Black / ember stitch",
    "A low-profile six panel with a precise, everyday shape.",
    "Built for the in-between hours: first train, last walk, every unplanned turn.",
    [
      "Structured six-panel crown",
      "Adjustable webbing strap",
      "Embroidered tonal mark",
    ],
    ["One size"],
    [
      { name: "Black", hex: "#101010" },
      { name: "Ember", hex: "#f25e26" },
    ],
    "74% center",
    "New arrival",
  ),
  product(
    "cap-02",
    "night-run-cap",
    "Night Run Cap",
    "CAPS",
    "MEN",
    48,
    "Ink / bone",
    "Clean cotton twill, a shallow crown and a soft inner band.",
    "The piece you reach for when the day keeps going after dark.",
    ["Washed cotton twill", "Moisture-wicking inner band", "Low-curved visor"],
    ["One size"],
    [
      { name: "Ink", hex: "#162033" },
      { name: "Bone", hex: "#ece7dc" },
    ],
    "67% center",
  ),
  product(
    "cap-03",
    "circuit-cap",
    "Circuit Cap",
    "CAPS",
    "WOMEN",
    52,
    "Clay / black",
    "A refined curved peak and quieter proportions.",
    "A small signal of confidence, designed to become your constant.",
    [
      "Soft six-panel construction",
      "Metal rear adjuster",
      "Internal contrast seam",
    ],
    ["One size"],
    [
      { name: "Clay", hex: "#b85637" },
      { name: "Black", hex: "#111111" },
    ],
    "79% center",
    "Limited",
  ),
  product(
    "cap-04",
    "all-terrain-cap",
    "All Terrain Cap",
    "CAPS",
    "UNISEX",
    56,
    "Stone / ink",
    "A more technical cap with a dry hand and a confident profile.",
    "Made for a route that changes halfway through.",
    [
      "Water-resistant nylon blend",
      "Breathable side panels",
      "Elasticated back strap",
    ],
    ["One size"],
    [
      { name: "Stone", hex: "#a8a59b" },
      { name: "Ink", hex: "#172136" },
    ],
    "61% center",
  ),
  product(
    "tee-01",
    "heavy-tee-02",
    "Heavy Tee / 02",
    "T_SHIRTS",
    "UNISEX",
    64,
    "Bone / black mark",
    "A dense jersey tee with an intentional oversized line.",
    "We started with weight, then removed everything that did not improve the wear.",
    ["280gsm heavyweight cotton", "Dropped shoulder seam", "Pre-shrunk finish"],
    ["S", "M", "L", "XL"],
    [
      { name: "Bone", hex: "#eee9dd" },
      { name: "Black", hex: "#111111" },
    ],
    "64% center",
    "Core piece",
  ),
  product(
    "tee-02",
    "after-hours-tee",
    "After Hours Tee",
    "T_SHIRTS",
    "MEN",
    64,
    "Washed black",
    "An everyday silhouette finished with a quieter edge.",
    "For the hours with no audience and no need to perform.",
    ["240gsm washed jersey", "Ribbed collar", "Relaxed boxy fit"],
    ["S", "M", "L", "XL"],
    [
      { name: "Washed black", hex: "#242424" },
      { name: "Smoke", hex: "#66645f" },
    ],
    "82% center",
  ),
  product(
    "tee-03",
    "signal-tee",
    "Signal Tee",
    "T_SHIRTS",
    "WOMEN",
    60,
    "Soft white / clay",
    "A shortened oversized cut with a softer, substantial drape.",
    "The same weight, a different line: designed to move with your rhythm.",
    ["220gsm organic cotton", "Slight cropped length", "Garment-dyed finish"],
    ["XS", "S", "M", "L"],
    [
      { name: "Soft white", hex: "#f4f0e8" },
      { name: "Clay", hex: "#b85637" },
    ],
    "57% center",
    "Archive price",
    72,
  ),
  product(
    "tee-04",
    "first-light-tee",
    "First Light Tee",
    "T_SHIRTS",
    "WOMEN",
    64,
    "Dawn / midnight",
    "Heavy fabric, softened with a wide rib collar and easy balance.",
    "Every collection needs a beginning. This is ours, worn your way.",
    ["260gsm heavyweight jersey", "Wide neckline rib", "Straight hem"],
    ["XS", "S", "M", "L"],
    [
      { name: "Dawn", hex: "#e8d9ca" },
      { name: "Midnight", hex: "#14213d" },
    ],
    "70% center",
  ),
];

type ProductBlueprint = {
  id: string;
  slug: string;
  name: string;
  kind: ProductKind;
  audience: Audience;
  price: number;
  tone: string;
  description: string;
  imagePosition: string;
  label?: string;
};

const additionalPieces = [
  ["cap-05", "daybreak-cap", "Daybreak Cap", "CAPS", "WOMEN", 50, "Dawn / black", "A soft structured cap made for everyday distance.", "58% center", "New"],
  ["cap-06", "grid-cap", "Grid Cap", "CAPS", "MEN", 54, "Graphite / stone", "Technical texture with an easy, low-profile fit.", "70% center"],
  ["cap-07", "union-cap", "Union Cap", "CAPS", "UNISEX", 52, "Ink / red stitch", "A clean all-day cap with a small signal at the crown.", "62% center"],
  ["tee-05", "studio-tee", "Studio Tee", "T_SHIRTS", "WOMEN", 62, "Charcoal / bone", "A dense tee with a relaxed shoulder and soft finish.", "55% center"],
  ["tee-06", "transit-tee", "Transit Tee", "T_SHIRTS", "MEN", 66, "Bone / ink", "Heavy cotton, cut for movement through the city.", "76% center", "Core"],
  ["tee-07", "common-tee", "Common Tee", "T_SHIRTS", "UNISEX", 64, "Oat / black", "An oversized base layer with just enough weight.", "65% center"],
  ["sweat-01", "relay-crew", "Relay Crew", "SWEATSHIRTS", "UNISEX", 98, "Washed black", "A brushed fleece crew for colder early starts.", "73% center", "New"],
  ["sweat-02", "dawn-crew", "Dawn Crew", "SWEATSHIRTS", "WOMEN", 96, "Dust / red", "A cropped heavy crew with an easy lived-in finish.", "58% center"],
  ["sweat-03", "night-crew", "Night Crew", "SWEATSHIRTS", "MEN", 102, "Ink / bone", "A considered fleece layer with a quiet oversized line.", "80% center"],
  ["outer-01", "route-shell", "Route Shell", "OUTERWEAR", "UNISEX", 148, "Slate / ember", "A lightweight shell that holds up when the weather turns.", "62% center", "Limited"],
  ["outer-02", "shift-jacket", "Shift Jacket", "OUTERWEAR", "WOMEN", 154, "Clay / black", "A relaxed technical jacket, shaped for everyday movement.", "52% center"],
  ["outer-03", "signal-jacket", "Signal Jacket", "OUTERWEAR", "MEN", 158, "Black / bone", "A structured outer layer with utility in the right places.", "78% center"],
  ["bottom-01", "studio-pant", "Studio Pant", "BOTTOMS", "WOMEN", 108, "Charcoal", "Relaxed utility trousers with a softer, tapered line.", "54% center"],
  ["bottom-02", "field-pant", "Field Pant", "BOTTOMS", "MEN", 112, "Stone / ink", "Easy technical trousers for the route between plans.", "76% center"],
  ["bottom-03", "everyday-pant", "Everyday Pant", "BOTTOMS", "UNISEX", 110, "Washed black", "A clean wide-leg pant made for repeat wear.", "66% center"],
  ["tee-08", "line-tee", "Line Tee", "T_SHIRTS", "WOMEN", 60, "Soft white / red", "A softer heavyweight tee with a cropped proportion.", "56% center"],
  ["cap-08", "waypoint-cap", "Waypoint Cap", "CAPS", "MEN", 56, "Olive / black", "A water-resistant cap for changing forecasts.", "74% center"],
  ["sweat-04", "form-hoodie", "Form Hoodie", "SWEATSHIRTS", "UNISEX", 116, "Bone / ink", "Dense brushed fleece in a balanced oversized shape.", "66% center", "Core"],
  ["outer-04", "arc-vest", "Arc Vest", "OUTERWEAR", "WOMEN", 124, "Black / ember", "A light insulated vest for layers without the bulk.", "55% center"],
  ["bottom-04", "relay-short", "Relay Short", "BOTTOMS", "MEN", 72, "Graphite", "Technical everyday shorts with a clean finish.", "78% center"],
  ["tee-09", "object-tee", "Object Tee", "T_SHIRTS", "UNISEX", 68, "Ink / soft white", "An elevated foundation tee in dense organic cotton.", "63% center"],
  ["cap-09", "edition-cap", "Edition Cap", "CAPS", "WOMEN", 54, "Red / black", "A curved peak and refined scale for daily wear.", "57% center"],
].map(([id, slug, name, kind, audience, price, tone, description, imagePosition, label]) => ({
  id,
  slug,
  name,
  kind,
  audience,
  price,
  tone,
  description,
  imagePosition,
  label,
})) as ProductBlueprint[];

const additionalCatalog = additionalPieces.map((piece) =>
  product(
    piece.id,
    piece.slug,
    piece.name,
    piece.kind,
    piece.audience,
    piece.price,
    piece.tone,
    piece.description,
    "Designed as a focused part of the first Eagle Supply uniform.",
    ["Considered daily construction", "Limited collection finish", "Made for repeat wear"],
    piece.kind === "CAPS" ? ["One size"] : ["XS", "S", "M", "L", "XL"],
    [
      { name: "Black", hex: "#111111" },
      { name: "Bone", hex: "#eee9dd" },
    ],
    piece.imagePosition,
    piece.label,
  ),
);

export const localCatalog = [...coreCatalog, ...additionalCatalog];
export const caps = localCatalog.filter((item) => item.kind === "CAPS");
export const tees = localCatalog.filter((item) => item.kind === "T_SHIRTS");
export const productBySlug = (slug: string) =>
  localCatalog.find((item) => item.slug === slug);
export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
