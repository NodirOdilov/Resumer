import type { DocumentTemplate, TemplateCategory, DocumentType } from "@/types/template";

// Deterministic pseudo-random so SSR and client agree. Without this, every
// template's rating + reviewCount would differ between server-rendered HTML
// and the client mount, causing React hydration warnings.
function seeded(n: number): number {
  let x = (n * 2654435761) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 2246822507);
  x ^= x >>> 13;
  x = Math.imul(x, 3266489909);
  x ^= x >>> 16;
  return (x >>> 0) / 0xffffffff;
}

function makeTemplate(
  id: number,
  name: string,
  skinId: string,
  category: TemplateCategory,
  type: DocumentType,
  isNew: boolean = false,
  isPremium: boolean = false
): DocumentTemplate {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const ratingSeed = seeded(id * 31 + name.length);
  const reviewSeed = seeded(id * 91 + skinId.length);
  return {
    id: `tpl-${type}-${id}`,
    name,
    slug,
    description: `A ${category} ${type} template designed to help you stand out. Clean layout, ATS-friendly formatting, and easy customization.`,
    thumbnail: `/images/templates/${slug}-${type}.webp`,
    previewImages: [`/images/templates/${slug}-${type}-preview.webp`],
    category,
    type,
    isPremium,
    isFeatured: id <= 8,
    isNew,
    popularity: 100 - id,
    rating: Math.round((4.2 + ratingSeed * 0.8) * 10) / 10,
    reviewCount: Math.floor(200 + reviewSeed * 3000),
    colorSchemes: [
      {
        id: "blue",
        name: "Blue",
        primaryColor: "#0D47A1",
        secondaryColor: "#1565C0",
        accentColor: "#42A5F5",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#0D47A1",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#0D47A1",
      },
      {
        id: "green",
        name: "Green",
        primaryColor: "#1B5E20",
        secondaryColor: "#2E7D32",
        accentColor: "#66BB6A",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#1B5E20",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#1B5E20",
      },
      {
        id: "red",
        name: "Red",
        primaryColor: "#B71C1C",
        secondaryColor: "#C62828",
        accentColor: "#EF5350",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#B71C1C",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#B71C1C",
      },
      {
        id: "purple",
        name: "Purple",
        primaryColor: "#4A148C",
        secondaryColor: "#6A1B9A",
        accentColor: "#AB47BC",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#4A148C",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#4A148C",
      },
      {
        id: "teal",
        name: "Teal",
        primaryColor: "#004D40",
        secondaryColor: "#00695C",
        accentColor: "#26A69A",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#004D40",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#004D40",
      },
      {
        id: "orange",
        name: "Orange",
        primaryColor: "#E65100",
        secondaryColor: "#EF6C00",
        accentColor: "#FFA726",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#E65100",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#E65100",
      },
      {
        id: "slate",
        name: "Slate",
        primaryColor: "#37474F",
        secondaryColor: "#455A64",
        accentColor: "#78909C",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#37474F",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#37474F",
      },
      {
        id: "burgundy",
        name: "Burgundy",
        primaryColor: "#880E4F",
        secondaryColor: "#AD1457",
        accentColor: "#EC407A",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        headingColor: "#880E4F",
        subtitleColor: "#6B7280",
        borderColor: "#E5E7EB",
        linkColor: "#880E4F",
      },
    ],
    defaultColorScheme: "blue",
    supportedLayouts: ["single", "double", "sidebar-left"],
    defaultLayout: category === "creative" ? "sidebar-left" : "single",
    fontPairings: [
      { id: "classic", name: "Classic", headingFont: "Georgia", bodyFont: "Arial", headingWeight: 700, bodyWeight: 400 },
      { id: "modern", name: "Modern", headingFont: "Inter", bodyFont: "Inter", headingWeight: 600, bodyWeight: 400 },
      { id: "serif", name: "Serif", headingFont: "Merriweather", bodyFont: "Source Sans Pro", headingWeight: 700, bodyWeight: 400 },
      { id: "clean", name: "Clean", headingFont: "Lato", bodyFont: "Lato", headingWeight: 700, bodyWeight: 400 },
      { id: "elegant", name: "Elegant", headingFont: "Playfair Display", bodyFont: "Raleway", headingWeight: 700, bodyWeight: 400 },
      { id: "tech", name: "Tech", headingFont: "Roboto", bodyFont: "Roboto", headingWeight: 500, bodyWeight: 400 },
      { id: "minimal", name: "Minimal", headingFont: "Poppins", bodyFont: "Open Sans", headingWeight: 600, bodyWeight: 400 },
      { id: "professional", name: "Professional", headingFont: "Montserrat", bodyFont: "Noto Sans", headingWeight: 600, bodyWeight: 400 },
      { id: "warm", name: "Warm", headingFont: "Nunito", bodyFont: "Nunito Sans", headingWeight: 700, bodyWeight: 400 },
      { id: "bold", name: "Bold", headingFont: "Oswald", bodyFont: "Source Sans Pro", headingWeight: 600, bodyWeight: 400 },
    ],
    defaultFontPairing: "modern",
    tags: [category, type, "ats-friendly"],
    industries: [],
    experienceLevels: ["entry-level", "mid-level", "senior"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  };
}

// --------------------------------------------------------------------------
// All 34 resume templates as specified — name, skinId, category, isNew
// --------------------------------------------------------------------------
const TEMPLATE_DEFS: [string, string, TemplateCategory, boolean, boolean][] = [
  ["Cascade",   "srz1", "professional", false, false],
  ["Ceramica",  "cer1", "modern",       true,  false],
  ["Classic",   "cls1", "professional", false, false],
  ["Concept",   "srz2", "creative",     false, false],
  ["Crisp",     "srz3", "simple",       false, false],
  ["Cubic",     "srz4", "professional", false, false],
  ["Diamond",   "srz5", "professional", false, false],
  ["Dynamic",   "dyn1", "modern",       true,  false],
  ["Enfold",    "srz6", "professional", false, false],
  ["Iconic",    "srz7", "executive",    false, false],
  ["Impetus",   "imp1", "creative",     true,  false],
  ["Influx",    "srz8", "modern",       false, false],
  ["Initials",  "srz9", "creative",     false, false],
  ["Lumina",    "lum1", "modern",       true,  false],
  ["Minimo",    "trz1", "simple",       false, false],
  ["Modern",    "trz2", "modern",       false, false],
  ["Muse",      "trz3", "creative",     false, false],
  ["Nanica",    "trz4", "simple",       false, false],
  ["Newcast",   "trz5", "professional", false, false],
  ["Primo",     "trz6", "executive",    false, false],
  ["Profile",   "pro1", "modern",       true,  false],
  ["Simple",    "trz7", "simple",       false, false],
  ["Spectra",   "spc1", "creative",     true,  false],
  ["Squares",   "sqr1", "modern",       false, false],
  ["Synergy",   "syn1", "executive",    true,  false],
  ["Valera",    "trz8", "professional", false, false],
  ["Vibes",     "trz9", "creative",     false, false],
  ["Vintage",   "vin1", "elegant",      false, false],
  // Additional 6 templates to reach 34
  ["Horizon",   "hrz1", "modern",       false, false],
  ["Nexus",     "nxs1", "professional", false, true],
  ["Clarity",   "clt1", "simple",       false, false],
  ["Elevate",   "elv1", "executive",    false, true],
  ["Zenith",    "znt1", "creative",     false, false],
  ["Atlas",     "atl1", "professional", false, false],
];

export const RESUME_TEMPLATES: DocumentTemplate[] = TEMPLATE_DEFS.map(
  ([name, skinId, cat, isNew, isPremium], i) =>
    makeTemplate(i + 1, name, skinId, cat, "resume", isNew, isPremium)
);

export const CV_TEMPLATES: DocumentTemplate[] = TEMPLATE_DEFS.map(
  ([name, skinId, cat, isNew, isPremium], i) =>
    makeTemplate(i + 1, name + " CV", skinId, cat, "cv", isNew, isPremium)
);

export const COVER_LETTER_TEMPLATES: DocumentTemplate[] = TEMPLATE_DEFS.map(
  ([name, skinId, cat, isNew, isPremium], i) =>
    makeTemplate(i + 1, name + " Letter", skinId, cat, "cover-letter", isNew, isPremium)
);

export const ALL_TEMPLATES: DocumentTemplate[] = [
  ...RESUME_TEMPLATES,
  ...CV_TEMPLATES,
  ...COVER_LETTER_TEMPLATES,
];

export function getTemplateBySlug(slug: string, type: DocumentType): DocumentTemplate | undefined {
  const templates = type === "resume" ? RESUME_TEMPLATES : type === "cv" ? CV_TEMPLATES : COVER_LETTER_TEMPLATES;
  return templates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: TemplateCategory, type: DocumentType): DocumentTemplate[] {
  const templates = type === "resume" ? RESUME_TEMPLATES : type === "cv" ? CV_TEMPLATES : COVER_LETTER_TEMPLATES;
  return templates.filter((t) => t.category === category);
}
