import type { ProductFamily } from "../types/commercialCopilot";

export const productFamilies: ProductFamily[] = [
  {
    id: "provisional",
    label: "Proteccion provisional de borde",
    shortLabel: "Provisional",
    description:
      "Sistemas temporales para proteger bordes, huecos o zonas con riesgo durante obra o mantenimiento.",
    examples: ["forjados", "huecos", "cubiertas en obra", "intervenciones temporales"],
    subcategories: [
      {
        id: "borde-forjado",
        label: "Borde de forjado",
        description: "Consulta orientada a cantos de forjado, plantas en ejecucion o zonas abiertas de obra.",
        keywords: ["forjado", "canto", "planta", "estructura", "borde"],
        followUpQuestion: "El canto de forjado permite fijacion directa o hay restricciones de perforacion?"
      },
      {
        id: "cubierta-obra",
        label: "Cubierta en obra",
        description: "Proteccion temporal en cubierta, nave o zona superior durante ejecucion o mantenimiento.",
        keywords: ["cubierta", "nave", "tejado", "mantenimiento", "impermeabilizacion"],
        followUpQuestion: "La cubierta esta en fase de obra o ya se usa para mantenimiento?"
      },
      {
        id: "huecos-y-perimetros",
        label: "Huecos y perimetros",
        description: "Necesidad temporal alrededor de huecos, patios, zonas abiertas o pasos de obra.",
        keywords: ["hueco", "patio", "perimetro", "abertura", "paso"],
        followUpQuestion: "Se trata de un borde exterior, un hueco interior o una combinacion de ambos?"
      }
    ],
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
    subcategories: [
      {
        id: "cubierta-industrial",
        label: "Cubierta industrial",
        description: "Proteccion permanente para accesos de mantenimiento, instalaciones o recorridos en cubierta.",
        keywords: ["cubierta", "industrial", "nave", "mantenimiento", "instalacion"],
        followUpQuestion: "La cubierta se usa para mantenimiento recurrente o para accesos puntuales?"
      },
      {
        id: "terraza-tecnica",
        label: "Terraza tecnica",
        description: "Barandilla o proteccion definitiva en terrazas con equipos, instalaciones o uso tecnico.",
        keywords: ["terraza", "tecnica", "equipos", "climatizacion", "maquinaria"],
        followUpQuestion: "Hay equipos o instalaciones que condicionen el recorrido o la fijacion?"
      },
      {
        id: "pasillo-tecnico",
        label: "Pasillo tecnico",
        description: "Proteccion permanente para recorrido seguro en zona industrial o de mantenimiento.",
        keywords: ["pasillo", "recorrido", "mantenimiento", "transito", "acceso"],
        followUpQuestion: "El recorrido requiere continuidad perimetral o puntos concretos de proteccion?"
      },
      {
        id: "autoportante",
        label: "Solucion sin perforacion",
        description: "Consulta que puede requerir valorar alternativas cuando no se desea fijar al soporte.",
        keywords: ["autoportante", "sin perforar", "no se puede perforar", "sin fijacion", "lastre"],
        followUpQuestion: "La restriccion de no perforar afecta a toda la cubierta o solo a zonas concretas?"
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
      "Elementos de anclaje, fijacion y alojamiento para sistemas de proteccion de borde.",
    examples: ["bases atornillables", "casquillos", "anclajes", "fijaciones especiales"],
    subcategories: [
      {
        id: "base-atornillable",
        label: "Base atornillable",
        description: "Consulta de suministro o compatibilidad para bases fijadas mecanicamente.",
        keywords: ["base", "atornillable", "atornillada", "tornillo", "placa"],
        followUpQuestion: "La base ira sobre hormigon, estructura metalica u otro soporte?"
      },
      {
        id: "casquillo-recto",
        label: "Casquillo recto",
        description: "Elemento de alojamiento para poste o balaustre en configuraciones habituales.",
        keywords: ["casquillo recto", "recto", "poste", "balaustre"],
        followUpQuestion: "El casquillo debe alojar un poste existente o forma parte de un sistema nuevo?"
      },
      {
        id: "casquillo-acodado",
        label: "Casquillo acodado",
        description: "Consulta de alojamiento o fijacion con geometria condicionada por el soporte.",
        keywords: ["casquillo acodado", "acodado", "angulo", "lateral"],
        followUpQuestion: "La fijacion se realiza en lateral, canto, superficie horizontal u otro punto?"
      },
      {
        id: "fijacion-especial",
        label: "Fijacion especial",
        description: "Caso que puede requerir revision de compatibilidad, soporte o referencias.",
        keywords: ["especial", "anclaje", "fijacion", "compatible", "referencia"],
        followUpQuestion: "Dispone de referencia, plano o fotografia de la pieza o soporte?"
      }
    ],
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
    subcategories: [
      {
        id: "reposicion",
        label: "Reposicion",
        description: "Suministro de elementos para sustituir o completar material existente.",
        keywords: ["reposicion", "repuesto", "sustituir", "recambio", "falta"],
        followUpQuestion: "Tiene referencia del elemento existente o fotografias para identificarlo?"
      },
      {
        id: "montaje-apoyo",
        label: "Apoyo a instalacion",
        description: "Material auxiliar asociado a instalacion, montaje o mantenimiento.",
        keywords: ["montaje", "instalacion", "apoyo", "mantenimiento", "herramienta"],
        followUpQuestion: "El material auxiliar es para instalacion nueva, mantenimiento o adaptacion?"
      },
      {
        id: "suministro-obra",
        label: "Suministro de obra",
        description: "Consulta comercial de suministro puntual para obra o mantenimiento.",
        keywords: ["suministro", "obra", "pedido", "entrega", "stock"],
        followUpQuestion: "La entrega se necesita de forma urgente o puede programarse?"
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
        description: "Reposicion de consumible o elemento asociado a material ya identificado.",
        keywords: ["recambio", "repuesto", "sustitucion", "reposicion"],
        followUpQuestion: "Tiene referencia o descripcion del consumible que necesita reponer?"
      },
      {
        id: "compra-recurrente",
        label: "Compra recurrente",
        description: "Necesidad periodica de suministro para obra, mantenimiento o almacen.",
        keywords: ["recurrente", "periodico", "mensual", "stock", "almacen"],
        followUpQuestion: "La compra seria puntual o recurrente para varias obras?"
      },
      {
        id: "suministro-puntual",
        label: "Suministro puntual",
        description: "Pedido concreto con cantidad, ubicacion y urgencia de entrega.",
        keywords: ["pedido", "suministro", "entrega", "cantidad", "urgente"],
        followUpQuestion: "Que cantidad aproximada y plazo de entrega necesita?"
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
      "Consulta para obras singulares, soportes complejos o necesidades que requieren revision personalizada.",
    examples: ["obra singular", "soporte no habitual", "pieza especial", "adaptacion al cliente"],
    subcategories: [
      {
        id: "obra-singular",
        label: "Obra singular",
        description: "Entorno o geometria no estandar que requiere analisis tecnico-comercial.",
        keywords: ["singular", "especial", "no habitual", "complejo", "infraestructura"],
        followUpQuestion: "Dispone de planos, mediciones o fotografias para revisar el caso?"
      },
      {
        id: "soporte-complejo",
        label: "Soporte complejo",
        description: "Restricciones de fijacion, soporte o entorno que condicionan la solucion.",
        keywords: ["soporte", "restriccion", "sin perforar", "hormigon", "metal", "cubierta"],
        followUpQuestion: "Que restricciones principales tiene el soporte o la zona de instalacion?"
      },
      {
        id: "pieza-especial",
        label: "Pieza o adaptacion especial",
        description: "Necesidad de adaptacion, fabricacion o ajuste a un caso concreto.",
        keywords: ["pieza", "adaptacion", "fabricacion", "personalizada", "medida"],
        followUpQuestion: "La necesidad es adaptar un sistema existente o fabricar una pieza especifica?"
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
