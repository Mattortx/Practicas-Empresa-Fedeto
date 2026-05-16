import type { ProductFamily } from "../types/commercialCopilot";

export const productFamilies: ProductFamily[] = [
  {
    id: "provisional",
    label: "Protección provisional de borde",
    shortLabel: "Provisional",
    description:
      "Sistemas temporales para proteger bordes, huecos o zonas con riesgo durante obra o mantenimiento.",
    examples: ["forjados", "huecos", "cubiertas en obra", "intervenciones temporales"],
    subcategories: [
      {
        id: "borde-forjado",
        label: "Borde de forjado",
        description: "Consulta orientada a cantos de forjado, plantas en ejecución o zonas abiertas de obra.",
        keywords: ["forjado", "canto", "planta", "estructura", "borde"],
        followUpQuestion: "¿El canto de forjado permite fijación directa o hay restricciones de perforación?"
      },
      {
        id: "cubierta-obra",
        label: "Cubierta en obra",
        description: "Protección temporal en cubierta, nave o zona superior durante ejecución o mantenimiento.",
        keywords: ["cubierta", "nave", "tejado", "mantenimiento", "impermeabilizacion"],
        followUpQuestion: "¿La cubierta está en fase de obra o ya se usa para mantenimiento?"
      },
      {
        id: "huecos-y-perimetros",
        label: "Huecos y perímetros",
        description: "Necesidad temporal alrededor de huecos, patios, zonas abiertas o pasos de obra.",
        keywords: ["hueco", "patio", "perimetro", "abertura", "paso"],
        followUpQuestion: "¿Se trata de un borde exterior, un hueco interior o una combinación de ambos?"
      }
    ],
    keywords: ["provisional", "temporal", "forjado", "hueco", "obra", "borde", "barandilla"],
    accent: "red"
  },
  {
    id: "definitiva",
    label: "Protección definitiva de borde",
    shortLabel: "Definitiva",
    description:
      "Soluciones permanentes para cubiertas, terrazas técnicas, pasillos técnicos y zonas de mantenimiento.",
    examples: ["cubiertas", "terrazas técnicas", "pasillos técnicos", "zonas industriales"],
    subcategories: [
      {
        id: "cubierta-industrial",
        label: "Cubierta industrial",
        description: "Protección permanente para accesos de mantenimiento, instalaciones o recorridos en cubierta.",
        keywords: ["cubierta", "industrial", "nave", "mantenimiento", "instalacion"],
        followUpQuestion: "¿La cubierta se usa para mantenimiento recurrente o para accesos puntuales?"
      },
      {
        id: "terraza-tecnica",
        label: "Terraza técnica",
        description: "Barandilla o protección definitiva en terrazas con equipos, instalaciones o uso técnico.",
        keywords: ["terraza", "tecnica", "equipos", "climatizacion", "maquinaria"],
        followUpQuestion: "¿Hay equipos o instalaciones que condicionen el recorrido o la fijación?"
      },
      {
        id: "pasillo-tecnico",
        label: "Pasillo técnico",
        description: "Protección permanente para recorrido seguro en zona industrial o de mantenimiento.",
        keywords: ["pasillo", "recorrido", "mantenimiento", "transito", "acceso"],
        followUpQuestion: "¿El recorrido requiere continuidad perimetral o puntos concretos de protección?"
      },
      {
        id: "autoportante",
        label: "Solución sin perforación",
        description: "Consulta que puede requerir valorar alternativas cuando no se desea fijar al soporte.",
        keywords: ["autoportante", "sin perforar", "no se puede perforar", "sin fijación", "lastre"],
        followUpQuestion: "¿La restricción de no perforar afecta a toda la cubierta o solo a zonas concretas?"
      }
    ],
    keywords: ["definitiva", "permanente", "cubierta", "terraza", "pasillo", "autoportante"],
    accent: "blue"
  },
  {
    id: "bases-casquillos",
    label: "Bases y casquillos",
    shortLabel: "Bases",
    description:
      "Elementos de anclaje, fijación y alojamiento para sistemas de protección de borde.",
    examples: ["bases atornillables", "casquillos", "anclajes", "fijaciones especiales"],
    subcategories: [
      {
        id: "base-atornillable",
        label: "Base atornillable",
        description: "Consulta de suministro o compatibilidad para bases fijadas mecánicamente.",
        keywords: ["base", "atornillable", "atornillada", "tornillo", "placa"],
        followUpQuestion: "¿La base irá sobre hormigón, estructura metálica u otro soporte?"
      },
      {
        id: "casquillo-recto",
        label: "Casquillo recto",
        description: "Elemento de alojamiento para poste o balaustre en configuraciones habituales.",
        keywords: ["casquillo recto", "recto", "poste", "balaustre"],
        followUpQuestion: "¿El casquillo debe alojar un poste existente o forma parte de un sistema nuevo?"
      },
      {
        id: "casquillo-acodado",
        label: "Casquillo acodado",
        description: "Consulta de alojamiento o fijación con geometría condicionada por el soporte.",
        keywords: ["casquillo acodado", "acodado", "angulo", "lateral"],
        followUpQuestion: "¿La fijación se realiza en lateral, canto, superficie horizontal u otro punto?"
      },
      {
        id: "fijacion-especial",
        label: "Fijación especial",
        description: "Caso que puede requerir revisión de compatibilidad, soporte o referencias.",
        keywords: ["especial", "anclaje", "fijación", "compatible", "referencia"],
        followUpQuestion: "¿Dispone de referencia, plano o fotografía de la pieza o soporte?"
      }
    ],
    keywords: ["base", "bases", "casquillo", "casquillos", "anclaje", "fijación", "atornillable"],
    accent: "orange"
  },
  {
    id: "auxiliares",
    label: "Auxiliares para la construcción",
    shortLabel: "Auxiliares",
    description:
      "Elementos de apoyo para instalación, mantenimiento o reposición de sistemas de protección.",
    examples: ["repuestos", "elementos de montaje", "apoyos", "mantenimiento"],
    subcategories: [
      {
        id: "reposicion",
        label: "Reposición",
        description: "Suministro de elementos para sustituir o completar material existente.",
        keywords: ["reposicion", "repuesto", "sustituir", "recambio", "falta"],
        followUpQuestion: "¿Tiene referencia del elemento existente o fotografías para identificarlo?"
      },
      {
        id: "montaje-apoyo",
        label: "Apoyo a instalación",
        description: "Material auxiliar asociado a instalación, montaje o mantenimiento.",
        keywords: ["montaje", "instalacion", "apoyo", "mantenimiento", "herramienta"],
        followUpQuestion: "¿El material auxiliar es para instalación nueva, mantenimiento o adaptación?"
      },
      {
        id: "suministro-obra",
        label: "Suministro de obra",
        description: "Consulta comercial de suministro puntual para obra o mantenimiento.",
        keywords: ["suministro", "obra", "pedido", "entrega", "stock"],
        followUpQuestion: "¿La entrega se necesita de forma urgente o puede programarse?"
      }
    ],
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
    subcategories: [
      {
        id: "recambio",
        label: "Recambio",
        description: "Reposición de consumible o elemento asociado a material ya identificado.",
        keywords: ["recambio", "repuesto", "sustitucion", "reposicion"],
        followUpQuestion: "¿Tiene referencia o descripción del consumible que necesita reponer?"
      },
      {
        id: "compra-recurrente",
        label: "Compra recurrente",
        description: "Necesidad periódica de suministro para obra, mantenimiento o almacén.",
        keywords: ["recurrente", "periódico", "mensual", "stock", "almacén"],
        followUpQuestion: "¿La compra sería puntual o recurrente para varias obras?"
      },
      {
        id: "suministro-puntual",
        label: "Suministro puntual",
        description: "Pedido concreto con cantidad, ubicación y urgencia de entrega.",
        keywords: ["pedido", "suministro", "entrega", "cantidad", "urgente"],
        followUpQuestion: "¿Qué cantidad aproximada y plazo de entrega necesita?"
      }
    ],
    keywords: ["consumible", "consumibles", "cartucho", "recambio", "suministro"],
    accent: "slate"
  },
  {
    id: "medida",
    label: "Soluciones a medida",
    shortLabel: "A medida",
    description:
      "Consulta para obras singulares, soportes complejos o necesidades que requieren revisión personalizada.",
    examples: ["obra singular", "soporte no habitual", "pieza especial", "adaptación al cliente"],
    subcategories: [
      {
        id: "obra-singular",
        label: "Obra singular",
        description: "Entorno o geometría no estándar que requiere análisis técnico-comercial.",
        keywords: ["singular", "especial", "no habitual", "complejo", "infraestructura"],
        followUpQuestion: "¿Dispone de planos, mediciones o fotografías para revisar el caso?"
      },
      {
        id: "soporte-complejo",
        label: "Soporte complejo",
        description: "Restricciones de fijación, soporte o entorno que condicionan la solución.",
        keywords: ["soporte", "restriccion", "sin perforar", "hormigon", "metal", "cubierta"],
        followUpQuestion: "¿Qué restricciones principales tiene el soporte o la zona de instalación?"
      },
      {
        id: "pieza-especial",
        label: "Pieza o adaptación especial",
        description: "Necesidad de adaptación, fabricación o ajuste a un caso concreto.",
        keywords: ["pieza", "adaptacion", "fabricacion", "personalizada", "medida"],
        followUpQuestion: "¿La necesidad es adaptar un sistema existente o fabricar una pieza específica?"
      }
    ],
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
