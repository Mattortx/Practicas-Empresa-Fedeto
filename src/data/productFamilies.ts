import type { ProductFamily } from "../types/commercialCopilot";

export const productFamilies: ProductFamily[] = [
  {
    id: "provisional",
    label: "Proteccion provisional de borde",
    shortLabel: "Provisional",
    description:
      "Sistemas temporales para proteger bordes, huecos o zonas con riesgo durante obra o mantenimiento.",
    examples: ["forjados", "huecos", "cubiertas en obra", "intervenciones temporales"],
    keywords: ["provisional", "temporal", "forjado", "hueco", "obra", "borde", "barandilla"],
    accent: "red"
  },
  {
    id: "definitiva",
    label: "Proteccion definitiva de borde",
    shortLabel: "Definitiva",
    description:
      "Soluciones permanentes para cubiertas, terrazas tecnicas, pasillos tecnicos y zonas de mantenimiento.",
    examples: ["cubiertas", "terrazas tecnicas", "pasillos tecnicos", "zonas industriales"],
    keywords: ["definitiva", "permanente", "cubierta", "terraza", "pasillo", "autoportante"],
    accent: "blue"
  },
  {
    id: "bases-casquillos",
    label: "Bases y casquillos",
    shortLabel: "Bases",
    description:
      "Elementos de anclaje, fijacion y alojamiento para sistemas de proteccion de borde.",
    examples: ["bases atornillables", "casquillos", "anclajes", "fijaciones especiales"],
    keywords: ["base", "bases", "casquillo", "casquillos", "anclaje", "fijacion", "atornillable"],
    accent: "orange"
  },
  {
    id: "auxiliares",
    label: "Auxiliares para la construccion",
    shortLabel: "Auxiliares",
    description:
      "Elementos de apoyo para instalacion, mantenimiento o reposicion de sistemas de proteccion.",
    examples: ["repuestos", "elementos de montaje", "apoyos", "mantenimiento"],
    keywords: ["auxiliar", "auxiliares", "montaje", "mantenimiento", "repuesto", "instalacion"],
    accent: "slate"
  },
  {
    id: "consumibles",
    label: "Consumibles",
    shortLabel: "Consumibles",
    description:
      "Suministros recurrentes o recambios asociados a protecciones y elementos auxiliares.",
    examples: ["cartuchos", "recambios", "suministros recurrentes", "consumo de obra"],
    keywords: ["consumible", "consumibles", "cartucho", "recambio", "suministro"],
    accent: "slate"
  },
  {
    id: "medida",
    label: "Soluciones a medida",
    shortLabel: "A medida",
    description:
      "Consulta para obras singulares, soportes complejos o necesidades que requieren revision personalizada.",
    examples: ["obra singular", "soporte no habitual", "pieza especial", "adaptacion al cliente"],
    keywords: ["medida", "especial", "singular", "adaptada", "personalizada", "pieza"],
    accent: "orange"
  }
];

export function getProductFamily(id?: string) {
  return productFamilies.find((family) => family.id === id);
}

export function classifyFamilyFromText(text: string): ProductFamily | undefined {
  const normalized = normalize(text);

  return productFamilies
    .map((family) => ({
      family,
      score: family.keywords.reduce(
        (total, keyword) => (normalized.includes(normalize(keyword)) ? total + 1 : total),
        0
      )
    }))
    .sort((a, b) => b.score - a.score)
    .find((entry) => entry.score > 0)?.family;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
