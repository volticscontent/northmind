export type FragrancePriceTier = "entrada" | "mid-premium" | "premium";

type FragranceOverride = {
  price: number;
  originalPrice: number;
  priceTier: FragrancePriceTier;
  sizes?: string[];
};

export const DEFAULT_FRAGRANCE_SIZES = ["100ml"] as const;

export const FRAGRANCE_OVERRIDE_ENTRIES: Array<[string, FragranceOverride]> = [
  ["212 Men Carolina Herrera Edt", { price: 29.99, originalPrice: 121, priceTier: "entrada" }],
  ["Amadeirado Floral Fragrância Marcante", { price: 29.99, originalPrice: 133, priceTier: "entrada" }],
  ["Armaf Club De Nuit Intense", { price: 29.99, originalPrice: 131, priceTier: "entrada" }],
  ["Azzaro Pour Homme Eau De Toilette", { price: 29.99, originalPrice: 134, priceTier: "entrada" }],
  ["Boss The Scent Hugo Boss", { price: 29.99, originalPrice: 126, priceTier: "entrada" }],
  ["Burberry Her Eau de Parfum", { price: 29.99, originalPrice: 125, priceTier: "entrada" }],
  ["Chloé Eau De Parfum", { price: 29.99, originalPrice: 121, priceTier: "entrada" }],
  ["Creed Love In White", { price: 29.99, originalPrice: 120, priceTier: "entrada" }],
  ["Dolce & Gabbana Light Blue Eau de Toilette", { price: 29.99, originalPrice: 125, priceTier: "entrada" }],
  ["Versace Dylan Turquoise", { price: 29.99, originalPrice: 143, priceTier: "entrada" }],
  ["Ferrari Black Eau De Toilette", { price: 29.99, originalPrice: 139, priceTier: "entrada" }],
  ["Givenchy Amarige", { price: 29.99, originalPrice: 121, priceTier: "entrada" }],
  ["Hugo Boss Perfume Bottled", { price: 29.99, originalPrice: 131, priceTier: "entrada" }],
  ["Lancôme La Vie Est Belle Vanille Nude", { price: 29.99, originalPrice: 126, priceTier: "entrada" }],
  ["Marc Jacobs Perfect Eau de Toilette", { price: 29.99, originalPrice: 123, priceTier: "entrada" }],
  ["Moschino Toy Boy", { price: 29.99, originalPrice: 122, priceTier: "entrada" }],
  ["Paco Rabanne Olympéa", { price: 29.99, originalPrice: 126, priceTier: "entrada" }],
  ["Pure Xs Paco Rabanne Edt", { price: 29.99, originalPrice: 129, priceTier: "entrada" }],
  ["Rabanne Phantom Parfum", { price: 29.99, originalPrice: 119, priceTier: "entrada" }],
  ["Silver Scent Intense Jacques Bogart Eau de Toilette", { price: 29.99, originalPrice: 140, priceTier: "entrada" }],
  ["Valentino Uomo Born In Roma", { price: 29.99, originalPrice: 129, priceTier: "entrada" }],
  ["Carolina Herrera 212 Vip Rose", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Carolina Herrera 212 Vip Black", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Giorgio Armani Acqua Di Giò Profondo", { price: 34.99, originalPrice: 130, priceTier: "mid-premium" }],
  ["Angel Mugler Les Perfuma Corps", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Alien Eau de Parfum", { price: 34.99, originalPrice: 146, priceTier: "mid-premium" }],
  ["Angel Eau de Toilette", { price: 34.99, originalPrice: 155, priceTier: "mid-premium" }],
  ["Armani Beauty Eau pour Homme Pour homme", { price: 34.99, originalPrice: 140, priceTier: "mid-premium" }],
  ["Armani Beauty Sì Eau de Parfum Refilável", { price: 34.99, originalPrice: 134, priceTier: "mid-premium" }],
  ["Armani Beauty Stronger With You Intensely", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Armani Code Giorgio Armani", { price: 34.99, originalPrice: 153, priceTier: "mid-premium" }],
  ["Bad Boy Extreme Eau de Parfum", { price: 34.99, originalPrice: 141, priceTier: "mid-premium" }],
  ["Black Opium Eau de Parfum", { price: 34.99, originalPrice: 144, priceTier: "mid-premium" }],
  ["Bleu De Chanel Eau De Toilette", { price: 34.99, originalPrice: 134, priceTier: "mid-premium" }],
  ["Bottled Infinite", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Bvlgari Man In Black Parfum", { price: 34.99, originalPrice: 143, priceTier: "mid-premium" }],
  ["Carolina Herrera Good", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Coco Mademoiselle Eau de Parfum", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Dior Hypnotic Poison Eau De Toillete", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Dior J'adore L'or Essence De Parfum", { price: 34.99, originalPrice: 139, priceTier: "mid-premium" }],
  ["Dior Sauvage Eau de Toilette", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Versace Dylan Blue Eau", { price: 34.99, originalPrice: 146, priceTier: "mid-premium" }],
  ["Eau de Parfum Guerlain L'Homme Idéal L'Intense", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Rabanne Fame Edp", { price: 34.99, originalPrice: 148, priceTier: "mid-premium" }],
  ["French Avenue Royal Blend Extrait De Parfum", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Gentleman Réserve Privée Givenchy", { price: 34.99, originalPrice: 146, priceTier: "mid-premium" }],
  ["Givenchy Gentleman Society Ambrée", { price: 34.99, originalPrice: 140, priceTier: "mid-premium" }],
  ["Giorgio Armani Si Eau De Parfum", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Gucci Flora Gorgeous Gardenia Eau De Parfum", { price: 34.99, originalPrice: 136, priceTier: "mid-premium" }],
  ["Gucci Guilty Pour Homme Eau de Parfum", { price: 34.99, originalPrice: 140, priceTier: "mid-premium" }],
  ["Invictus De Paco Rabanne Eau De Toilette", { price: 34.99, originalPrice: 142, priceTier: "mid-premium" }],
  ["Invictus Legend", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Invictus Victory Paco Rabanne Edp", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Jean Paul Gaultier (Le Male)", { price: 34.99, originalPrice: 152, priceTier: "mid-premium" }],
  ["Jean Paul Gaultier Le Male Elixir", { price: 34.99, originalPrice: 140, priceTier: "mid-premium", sizes: ["75ml", "125ml"] }],
  ["Jean Paul Gaultier Scandal", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Jean Paul Gaultier Ultra Male Eau de Toilette Intense", { price: 34.99, originalPrice: 140, priceTier: "mid-premium" }],
  ["Kenzo Homme Eau de Parfum", { price: 34.99, originalPrice: 142, priceTier: "mid-premium" }],
  ["Lancôme La Nuit Trésor Fem", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Libre Eau de Parfum da Yves Saint Laurent", { price: 34.99, originalPrice: 127, priceTier: "mid-premium" }],
  ["L'interdit Eau De Parfum", { price: 34.99, originalPrice: 122, priceTier: "mid-premium" }],
  ["Louis Vuitton Imagination", { price: 34.99, originalPrice: 150, priceTier: "mid-premium" }],
  ["M. Micallef GnTonic", { price: 34.99, originalPrice: 141, priceTier: "mid-premium" }],
  ["Million Gold for Her", { price: 34.99, originalPrice: 142, priceTier: "mid-premium" }],
  ["Yves Saint Laurent Mon Paris Eau de Parfum", { price: 34.99, originalPrice: 137, priceTier: "mid-premium" }],
  ["Montblanc Explorer Extreme Eau De", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Montblanc Signature Absolue", { price: 34.99, originalPrice: 134, priceTier: "mid-premium" }],
  ["Nuit d'Issey da marca Issey Miyake", { price: 34.99, originalPrice: 130, priceTier: "mid-premium", sizes: ["75ml", "125ml"] }],
  ["One Million Paco Rabanne", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Paco Rabanne One Million", { price: 34.99, originalPrice: 145, priceTier: "mid-premium" }],
  ["Orientica Royal Bleu Eau De Parfum", { price: 34.99, originalPrice: 139, priceTier: "mid-premium", sizes: ["80ml", "150ml"] }],
  ["Paco Rabanne Phantom", { price: 34.99, originalPrice: 144, priceTier: "mid-premium" }],
  ["Paradoxe Prada", { price: 34.99, originalPrice: 130, priceTier: "mid-premium" }],
  ["Prada Luna Rossa Black", { price: 34.99, originalPrice: 152, priceTier: "mid-premium" }],
  ["Scandal Pour Homme", { price: 34.99, originalPrice: 146, priceTier: "mid-premium" }],
  ["The Only One da marca Dolce&Gabbana", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Valentino Donna Born In Roma Intense Eau De", { price: 34.99, originalPrice: 133, priceTier: "mid-premium" }],
  ["Versace Eros Eau de Parfum", { price: 34.99, originalPrice: 137, priceTier: "mid-premium" }],
  ["Versace Eros Pour Femme", { price: 34.99, originalPrice: 148, priceTier: "mid-premium" }],
  ["Versace Eros Energy Eau de Parfum", { price: 34.99, originalPrice: 148, priceTier: "mid-premium" }],
  ["Y by YSL / Y Elixir Ysl Parfum Intense", { price: 34.99, originalPrice: 142, priceTier: "mid-premium" }],
  ["Y Le Parfum da marca Yves Saint Laurent", { price: 34.99, originalPrice: 135, priceTier: "mid-premium" }],
  ["Bleu De Chanel Parfum", { price: 39.99, originalPrice: 142, priceTier: "premium" }],
  ["Byredo Rose Of No Man's Land", { price: 39.99, originalPrice: 149, priceTier: "premium" }],
  ["Creed Aventus", { price: 39.99, originalPrice: 142, priceTier: "premium" }],
  ["De Nicho Layton", { price: 39.99, originalPrice: 143, priceTier: "premium", sizes: ["125ml"] }],
  ["Frederic Malle Portrait Of A Lady Perfume", { price: 39.99, originalPrice: 122, priceTier: "premium" }],
  ["Initio Oud for Greatness", { price: 39.99, originalPrice: 127, priceTier: "premium" }],
  ["Le Labo Santal 33", { price: 39.99, originalPrice: 135, priceTier: "premium" }],
  ["Tom Ford Beauty Tobacco Vanille Eau", { price: 39.99, originalPrice: 144, priceTier: "premium" }],
  ["Xerjoff Erba Pura Eau De Parfum", { price: 39.99, originalPrice: 120, priceTier: "premium" }],
];

const FRAGRANCE_OVERRIDES = new Map(
  FRAGRANCE_OVERRIDE_ENTRIES.map(([title, override]) => [normalizeFragranceTitle(title), override]),
);

export function normalizeFragranceTitle(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function isFragranceCollection(collection?: string): boolean {
  const normalized = String(collection || "").toLowerCase();
  return normalized.includes("fragrance") || normalized.includes("3x1") || normalized.includes("offer");
}

export function getFragranceOverride(title: string): FragranceOverride | undefined {
  return FRAGRANCE_OVERRIDES.get(normalizeFragranceTitle(title));
}

export function getFragranceSizes(override?: FragranceOverride): string[] {
  return override?.sizes ? [...override.sizes] : [...DEFAULT_FRAGRANCE_SIZES];
}

export function mergePriceTierTag(existingTags: string[] = [], priceTier: FragrancePriceTier): string[] {
  const nextTags = existingTags.filter((tag) => !["entrada", "mid-premium", "premium"].includes(tag));
  nextTags.push(priceTier);
  return Array.from(new Set(nextTags));
}

export function calculateDiscountPercent(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) {
    return 0;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

type OverrideTarget = {
  title: string;
  price: number;
  originalPrice: number;
  collection?: string;
  tipo?: "ROUPA" | "PERFUME";
  opcoesTamanho?: string[];
  tags?: string[];
};

export function applyFragranceOverride<T extends OverrideTarget>(product: T): T & {
  tags?: string[];
  priceTier?: FragrancePriceTier;
} {
  if (!isFragranceCollection(product.collection) && product.tipo !== "PERFUME") {
    return product;
  }

  const override = getFragranceOverride(product.title);
  if (!override) {
    return product;
  }

  return {
    ...product,
    price: override.price,
    originalPrice: override.originalPrice,
    opcoesTamanho: getFragranceSizes(override),
    tags: mergePriceTierTag(product.tags, override.priceTier),
    priceTier: override.priceTier,
  };
}

export const FRAGRANCE_COLLECTION_BUNDLES = [
  {
    id: "bundle-3",
    title: "Bundle 3 perfumes",
    price: 89.99,
    badge: "Bundle Destaque",
    description: "Monte um bundle com 3 fragrancias por um valor fixo.",
    queryValue: "3",
  },
  {
    id: "bundle-5",
    title: "Bundle 5 perfumes",
    price: 149.99,
    badge: "Melhor Valor",
    description: "Escolha 5 fragrancias e garanta o melhor custo por perfume.",
    queryValue: "5",
  },
] as const;
