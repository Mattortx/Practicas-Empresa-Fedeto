import type {
  CommercialLead,
  LeadPriority,
  LeadStatus,
  ProductFamilyId,
  TechnicalRiskFlag
} from "../types/commercialCopilot";

type ScenarioSeed = {
  productFamilyId: ProductFamilyId;
  needType: string;
  workType: string;
  observation: string;
  technicalRiskFlags: TechnicalRiskFlag[];
  defaultPriority: LeadPriority;
};

const familyLabels: Record<ProductFamilyId, string> = {
  provisional: "Protección provisional de borde",
  definitiva: "Protección definitiva de borde",
  "bases-casquillos": "Bases y casquillos atornillables",
  auxiliares: "Auxiliares para la construcción",
  consumibles: "Consumibles",
  medida: "Soluciones a medida"
};

const nextActions: Record<ProductFamilyId, string> = {
  provisional: "Derivar al equipo comercial con revisión técnica inicial.",
  definitiva: "Solicitar revisión técnica y propuesta comercial.",
  "bases-casquillos": "Revisar compatibilidad, soporte y preparar respuesta comercial.",
  auxiliares: "Preparar respuesta comercial de suministro.",
  consumibles: "Preparar respuesta comercial de consumibles.",
  medida: "Derivar a revisión técnica personalizada y contacto comercial."
};

const warningByFamily: Record<ProductFamilyId, string> = {
  provisional:
    "La protección provisional debe revisarse según soporte, uso previsto y documentación técnica aplicable.",
  definitiva: "La solución definitiva debe validarse por personal competente.",
  "bases-casquillos":
    "La compatibilidad debe confirmarse con referencias, soporte y documentación técnica.",
  auxiliares: "Las referencias y compatibilidades deben confirmarse antes de suministro definitivo.",
  consumibles: "Las cantidades y referencias deben validarse antes de confirmar suministro.",
  medida: "Las soluciones a medida requieren revisión técnica personalizada."
};

/* ── Deterministic seeded random for reproducible mock data ── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function pickRange<T>(arr: readonly T[], seed: number, min: number, max: number): T[] {
  const count = min + Math.floor(seededRandom(seed + 999) * (max - min + 1));
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[Math.floor(seededRandom(seed + i * 37 + 777) * arr.length)]);
  }
  return [...new Set(result)];
}

/* ── Scenario seeds: 30 unique scenarios, weighted toward provisional/definitiva ── */
const scenarioSeeds: ScenarioSeed[] = [
  // provisional (×8)
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Borde de forjado en edificación", observation: "Necesito proteger el canto del forjado durante toda la fase de estructura, aproximadamente 45 metros lineales.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Cubierta en rehabilitación", observation: "Vamos a intervenir en una cubierta inclinada y necesitamos protección perimetral temporal mientras retiramos la teja antigua.", technicalRiskFlags: ["instalacion"], defaultPriority: "alta" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Losas de escalera", observation: "Protección de borde en losas de escalera de hormigón para evitar caídas durante el vertido.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Forjado sanitario", observation: "Consulta para proteger un forjado sanitario en obra nueva. El cliente quiere saber si hay solución estándar o hay que adaptarla.", technicalRiskFlags: ["documentacion_tecnica"], defaultPriority: "media" },
  { productFamilyId: "provisional", needType: "Protección provisional de huecos y perímetros", workType: "Huecos interiores en rehabilitación", observation: "Necesitamos proteger varios huecos de ascensor y pasos de obra en un edificio en rehabilitación en Toledo capital.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Planta de hormigón prefabricado", observation: "Protección de borde en zona de producción con riesgo de caída a distinto nivel. Zona extensa, prefiero visita técnica.", technicalRiskFlags: ["instalacion", "anclaje"], defaultPriority: "alta" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Nave en construcción", observation: "Nave industrial en construcción, necesito protección de borde en todo el perímetro de la cubierta mientras se monta la estructura.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "provisional", needType: "Protección provisional de borde", workType: "Puente u obra civil lineal", observation: "Obra lineal para paso peatonal provisional. No sé exactamente qué sistema encaja, agradecería asesoramiento.", technicalRiskFlags: ["normativa", "calculo"], defaultPriority: "alta" },

  // definitiva (×7)
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Cubierta técnica industrial", observation: "Buscamos una solución permanente para mantenimiento recurrente en cubierta de nave industrial en Toledo.", technicalRiskFlags: ["documentacion_tecnica"], defaultPriority: "alta" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Pasillo técnico en zona elevada", observation: "Necesito un pasillo de servicio elevado para acceso a mantenimiento de equipos de climatización.", technicalRiskFlags: ["normativa", "documentacion_tecnica"], defaultPriority: "alta" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Cubierta donde no se puede perforar", observation: "La cubierta es tipo sándwich metálico y no está permitido perforar. Necesito una solución autoportante.", technicalRiskFlags: ["instalacion", "anclaje"], defaultPriority: "alta" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Azotea transitable", observation: "Queremos instalar barandilla perimetral en azotea de un edificio de oficinas, unos 30 metros lineales.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Terrazas técnicas comunitarias", observation: "Comunidad de vecinos necesita proteger las terrazas técnicas de acceso a cubierta. Presupuesto para comunidad.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Plataforma de descarga", observation: "Zona de carga y descarga con desnivel importante. Busco barandilla fija de unos 15 metros.", technicalRiskFlags: ["normativa"], defaultPriority: "alta" },
  { productFamilyId: "definitiva", needType: "Protección definitiva de borde", workType: "Cubierta con paneles solares", observation: "Se van a instalar placas solares en cubierta plana y necesito protección perimetral alrededor de toda la instalación.", technicalRiskFlags: ["documentacion_tecnica"], defaultPriority: "media" },

  // bases-casquillos (×5)
  { productFamilyId: "bases-casquillos", needType: "Bases, casquillos o elementos de fijación", workType: "Suministro para sistema de barandilla", observation: "Solicito presupuesto para bases atornillables y casquillos rectos para una barandilla de 60 metros.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "bases-casquillos", needType: "Bases, casquillos o elementos de fijación", workType: "Compatibilidad de casquillo recto", observation: "Tengo balaustres de 42 mm y necesito saber qué casquillo es compatible con la base disponible.", technicalRiskFlags: ["anclaje"], defaultPriority: "media" },
  { productFamilyId: "bases-casquillos", needType: "Bases, casquillos o elementos de fijación", workType: "Fijación especial en estructura metálica", observation: "Necesito una solución de fijación para barandilla sobre estructura metálica existente, geometría compleja.", technicalRiskFlags: ["anclaje", "documentacion_tecnica"], defaultPriority: "alta" },
  { productFamilyId: "bases-casquillos", needType: "Bases, casquillos o elementos de fijación", workType: "Anclaje para suelo técnico", observation: "Busco bases de anclaje para suelo técnico elevado, para instalar barandilla en sala de servidores.", technicalRiskFlags: [], defaultPriority: "baja" },
  { productFamilyId: "bases-casquillos", needType: "Bases, casquillos o elementos de fijación", workType: "Reposición de anclajes inox", observation: "Necesito reponer anclajes inoxidables en una instalación exterior existente que ha sufrido corrosión.", technicalRiskFlags: ["anclaje"], defaultPriority: "media" },

  // auxiliares (×3)
  { productFamilyId: "auxiliares", needType: "Auxiliares para construcción", workType: "Reposición de material auxiliar", observation: "Obra activa, se nos ha gastado el material auxiliar y necesitamos reponer con urgencia.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "auxiliares", needType: "Auxiliares para construcción", workType: "Apoyo a instalación y mantenimiento", observation: "Consulta sobre material auxiliar para instalación de barandilla en obra nueva.", technicalRiskFlags: [], defaultPriority: "baja" },
  { productFamilyId: "auxiliares", needType: "Auxiliares para construcción", workType: "Suministro de mordazas y soportes", observation: "Necesito mordazas y soportes auxiliares para fijación temporal de protecciones durante el montaje.", technicalRiskFlags: [], defaultPriority: "baja" },

  // consumibles (×3)
  { productFamilyId: "consumibles", needType: "Consumibles o recambios", workType: "Stock de mantenimiento", observation: "Pedido trimestral de consumibles para nuestro almacén técnico. Necesito confirmar referencias habituales.", technicalRiskFlags: [], defaultPriority: "baja" },
  { productFamilyId: "consumibles", needType: "Consumibles o recambios", workType: "Recambio para instalación existente", observation: "Se ha roto una pieza de una instalación existente. Necesito el recambio concreto, tengo la referencia.", technicalRiskFlags: [], defaultPriority: "media" },
  { productFamilyId: "consumibles", needType: "Consumibles o recambios", workType: "Kit de fijación para reposición", observation: "Buscamos kits de tornillería y fijación para reponer en varias obras activas.", technicalRiskFlags: [], defaultPriority: "baja" },

  // medida (×4)
  { productFamilyId: "medida", needType: "Solución a medida u obra singular", workType: "Pasarela o zona elevada en silo", observation: "Necesito una pasarela de acceso a un silo industrial. La geometría es irregular y requiere solución a medida.", technicalRiskFlags: ["calculo", "anclaje", "documentacion_tecnica"], defaultPriority: "alta" },
  { productFamilyId: "medida", needType: "Solución a medida u obra singular", workType: "Infraestructura con geometría especial", observation: "Obra singular con planos. El cliente quiere una solución adaptada a una geometría compleja en una nave.", technicalRiskFlags: ["calculo", "resistencia"], defaultPriority: "alta" },
  { productFamilyId: "medida", needType: "Solución a medida u obra singular", workType: "Instalación industrial exterior", observation: "Entorno exterior agresivo junto a un río. Necesito una solución en acero inoxidable con resistencia a la corrosión.", technicalRiskFlags: ["instalacion", "resistencia"], defaultPriority: "alta" },
  { productFamilyId: "medida", needType: "Solución a medida u obra singular", workType: "Barandilla curva para mirador", observation: "Proyecto de mirador turístico con barandilla curva de diseño. Necesito saber si fabricáis a medida con planos.", technicalRiskFlags: ["calculo", "normativa", "documentacion_tecnica"], defaultPriority: "alta" }
];

/* ── Pool of realistic names (50) ── */
const people = [
  "Laura Martínez", "Carlos Ruiz", "Marta García", "Javier López", "Ana Serrano",
  "Sergio Molina", "Raúl Navarro", "Elena Prieto", "Diego Herranz", "Patricia León",
  "Óscar Cano", "Silvia Campos", "Fernando Sanz", "Nuria Beltrán", "Miguel Pardo",
  "Teresa Ramos", "Iván Robles", "Lucía Torres", "Tomás Ortega", "Beatriz Fuentes",
  "Alberto Delgado", "Rocío Jiménez", "Vicente Mora", "Cristina Vázquez", "Emilio Redondo",
  "Mónica Marín", "Jorge Hidalgo", "Ruth Castillo", "Adrián Domínguez", "Lorena Ibáñez",
  "David Castillo", "Marina Soria", "José Luis Moreno", "Ángela Pascual", "Francisco Vera",
  "Natalia Gil", "Rafael Crespo", "Eva Soler", "Ignacio Peña", "Carmen Arenas",
  "Alejandro Ríos", "Paula Vega", "Héctor Montero", "Sara Ferrer", "Manuel Caballero",
  "Lidia Guzmán", "Andrés Pastor", "Clara Córdoba", "Joaquín Moya", "Raquel Lozano"
];

/* ── Companies that sound like real Spanish construction/industrial firms ── */
const companies = [
  "Construcciones y Reformas Tajo", "Mantenimiento Industrial Toledo SL",
  "Cubiertas y Estructuras Levante", "Obras y Rehabilitaciones Centro",
  "Infraestructuras Técnicas Castellanas", "Montajes Metálicos del Centro",
  "Protecciones Industriales La Mancha", "Ingeniería y Obras Alcázar",
  "Almacenes y Suministros Técnicos", "Reformas Técnicas Toledo",
  "Estructuras Metálicas Manchegas", "Facility Services del Sur",
  "Servicios Industriales Tagus", "Instalaciones Técnicas del Centro",
  "Promociones y Obras La Mancha", "Mantenimiento de Cubiertas Industriales",
  "Suministros Industriales Cervantes", "Obra Civil y Rehabilitación Vega",
  "Construcción Metálica Garcerán", "Montajes y Fijaciones Seguras",
  "Instalaciones Industriales Zocodover", "Mantenimiento Técnico Tagus",
  "Rehabilitación y Obra Nueva Toledo", "Cubiertas y Fachadas Centro",
  "Proyectos y Ejecución de Obras", "Soluciones Metálicas Industriales",
  "Construcciones Modernas del Tajo", "Infraestructuras y Vías SL",
  "Montajes Especiales Toledo", "Obras y Servicios Industriales"
];

/* ── Spanish locations, weighted toward Castilla-La Mancha ── */
const locations = [
  "Toledo", "Turleque", "Talavera de la Reina", "Madrid", "Ciudad Real",
  "Guadalajara", "Cuenca", "Albacete", "Ávila", "Burgos",
  "Valencia", "Segovia", "Valladolid", "Zaragoza", "Barcelona",
  "Sevilla", "Córdoba", "Murcia", "Alicante", "Bilbao",
  "Illescas", "Mora", "Ocaña", "Torrijos", "Quintanar de la Orden",
  "Almansa", "Puertollano", "Alcalá de Henares", "Móstoles", "Getafe",
  "Logroño", "Pamplona", "Oviedo", "Salamanca", "Badajoz"
];

/* ── Realistic email domains ── */
const emailDomains = [
  "gmail.com", "hotmail.com", "outlook.es", "yahoo.es", "telefonica.net",
  "movistar.es", "gmail.com", "hotmail.com", "outlook.com", "yahoo.com"
];

function companyDomain(companyName: string): string {
  const s = slug(companyName.split(" ").slice(0, 2).join(" "));
  const domains = [`.com`, `.es`, `.net`];
  return `${s}${domains[Math.abs(hashStr(companyName)) % domains.length]}`;
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const quantities = [
  "45 metros lineales", "60 metros de barandilla", "80 metros lineales",
  "120 metros de protección", "180 metros de borde", "25 unidades",
  "42 unidades", "80 unidades", "150 casquillos", "200 piezas",
  "suministro completo", "pendiente de medir", "por definir en visita",
  "300 m lineales aprox", "35 metros"
];

const urgencyLabels = ["Baja", "Media", "Alta", "Urgente", "Obra activa", "Planificada"];

/* ── Date distribution helper: 100 leads across Mar–May 2026 with natural clustering ── */
/**
 * Generate a natural-looking date for a given lead index.
 * Distribution: ~15% late March, ~50% April, ~35% early-mid May.
 * Weekdays get more leads. Hours vary 8:00–18:00.
 */
function naturalDate(index: number): Date {
  const bucket = seededRandom(index * 7 + 13);
  let dayOfYear: number;
  if (bucket < 0.15) {
    // Late March: Mar 20–31 (days 79–90)
    dayOfYear = 79 + Math.floor(seededRandom(index * 3 + 1) * 12);
  } else if (bucket < 0.65) {
    // April: Apr 1–30 (days 91–120)
    dayOfYear = 91 + Math.floor(seededRandom(index * 5 + 7) * 30);
  } else if (bucket < 0.88) {
    // Early-mid May: May 1–20 (days 121–140)
    dayOfYear = 121 + Math.floor(seededRandom(index * 11 + 3) * 20);
  } else {
    // Late May: May 21–31 (days 141–151)
    dayOfYear = 141 + Math.floor(seededRandom(index * 13 + 9) * 11);
  }
  // Prefer weekdays: if weekend, shift to Friday/Monday
  const date = new Date(Date.UTC(2026, 0, dayOfYear));
  const dow = date.getUTCDay();
  if (dow === 0) date.setUTCDate(date.getUTCDate() + 1);    // Sun → Mon
  else if (dow === 6) date.setUTCDate(date.getUTCDate() - 1); // Sat → Fri
  const hour = 8 + Math.floor(seededRandom(index * 17 + 5) * 10);  // 8:00–17:00
  const minute = Math.floor(seededRandom(index * 23 + 11) * 60);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

/* ── Phone number generator ── */
function generatePhone(index: number): string {
  const r = seededRandom(index * 31 + 7);
  if (r < 0.08) return "No indicado";
  // 70% mobile (6xx), 22% landline (9xx)
  const prefix = r < 0.70
    ? `6${Math.floor(10 + seededRandom(index * 41 + 3) * 90)}`
    : `9${Math.floor(10 + seededRandom(index * 53 + 17) * 90)}`;
  const suffix = String(Math.floor(100000 + seededRandom(index * 67 + 23) * 800000)).slice(0, 6);
  const spaced = seededRandom(index * 73 + 29) > 0.5;
  return spaced
    ? `${prefix} ${suffix.slice(0, 3)} ${suffix.slice(3)}`
    : `${prefix}${suffix}`;
}

export const mockLeads: CommercialLead[] = Array.from({ length: 100 }, (_, index) =>
  createMockLead(index)
);

function createMockLead(index: number): CommercialLead {
  const scenario = scenarioSeeds[index % scenarioSeeds.length];
  const technicalRisk = scenario.technicalRiskFlags.length > 0;
  const productFamilyLabel = familyLabels[scenario.productFamilyId];
  const status = resolveStatus(index, technicalRisk);
  const urgency = urgencyLabels[Math.floor(seededRandom(index * 19 + 5) * urgencyLabels.length)];
  const quantity = quantities[Math.floor(seededRandom(index * 29 + 11) * quantities.length)];
  const priority = scorePriority(scenario.defaultPriority, urgency, technicalRisk, quantity);
  const createdAt = naturalDate(index);
  const name = people[index % people.length];
  const company = companies[Math.floor(seededRandom(index * 37 + 73) * companies.length)];
  const domainRoll = seededRandom(index * 43 + 17);
  const domain = domainRoll < 0.55
    ? pick(emailDomains, index * 59 + 3)
    : companyDomain(company);
  const email = `${slug(name)}@${domain}`;
  const phone = generatePhone(index);
  const location = locations[Math.floor(seededRandom(index * 61 + 47) * locations.length)];
  const techWarn = warningByFamily[scenario.productFamilyId];
  const technicalWarnings = [
    techWarn,
    ...(technicalRisk
      ? ["Consulta marcada para revisión técnica antes de confirmar solución, normativa o documentación."]
      : [])
  ];

  // Build detected signals
  const signals = [
    `Tipo de obra: ${scenario.workType}`,
    `Ubicación: ${location}`,
    `Alcance: ${quantity}`,
    `Urgencia: ${urgency}`,
    technicalRisk ? `Riesgo técnico: ${scenario.technicalRiskFlags.join(", ")}` : "Consulta comercial inicial"
  ];

  // Organic missing information
  const missingPool: string[] = [];
  if (seededRandom(index * 83 + 5) < 0.60) missingPool.push("documentación o fotografías del soporte");
  if (seededRandom(index * 97 + 13) < 0.45) missingPool.push("confirmar tipo de soporte y anclaje");
  if (seededRandom(index * 101 + 21) < 0.30) missingPool.push("persona técnica de contacto");
  if (seededRandom(index * 109 + 29) < 0.20) missingPool.push("planos o croquis de la zona");
  if (seededRandom(index * 113 + 37) < 0.15) missingPool.push("medición exacta del perímetro");
  const missingInformation = missingPool;

  const summary = {
    name,
    company,
    email,
    phone,
    needType: scenario.needType,
    productFamily: productFamilyLabel,
    subcategory: resolveSubcategory(scenario.productFamilyId, index),
    workType: scenario.workType,
    location,
    urgency,
    observations: `${scenario.observation} Alcance orientativo: ${quantity}.`,
    classificationReason: resolveClassificationReason(scenario.productFamilyId, technicalRisk),
    detectedSignals: signals,
    missingInformation,
    priority,
    requiresTechnicalReview: technicalRisk,
    nextAction: nextActions[scenario.productFamilyId],
    technicalWarnings
  };

  return {
    id: `demo-${String(index + 1).padStart(3, "0")}`,
    createdAt: createdAt.toISOString(),
    status,
    priority,
    technicalRisk,
    technicalRiskFlags: scenario.technicalRiskFlags,
    productFamilyId: scenario.productFamilyId,
    productFamilyLabel,
    needType: scenario.needType,
    source: "demo",
    summary,
    summaryText: [
      `- Nombre: ${summary.name}`,
      `- Empresa: ${summary.company}`,
      `- Correo: ${summary.email}`,
      `- Teléfono: ${summary.phone}`,
      `- Tipo de necesidad: ${summary.needType}`,
      `- Familia de producto: ${summary.productFamily}`,
      `- Subcategoría o enfoque probable: ${summary.subcategory}`,
      `- Tipo de obra: ${summary.workType}`,
      `- Ubicación aproximada: ${summary.location}`,
      `- Urgencia: ${summary.urgency}`,
      `- Observaciones: ${summary.observations}`,
      `- Motivo de clasificación: ${summary.classificationReason}`,
      `- Señales detectadas: ${summary.detectedSignals.join(" | ")}`,
      `- Información pendiente: ${summary.missingInformation.length > 0 ? summary.missingInformation.join(", ") : "No indicada"}`,
      `- Nivel de prioridad: ${summary.priority}`,
      `- Requiere revisión técnica: ${summary.requiresTechnicalReview ? "Sí" : "No"}`,
      `- Recomendación de siguiente acción: ${summary.nextAction}`,
      `- Advertencias técnicas: ${summary.technicalWarnings.join(" ")}`
    ].join("\n")
  };
}

function resolveStatus(index: number, technicalRisk: boolean): LeadStatus {
  const r = seededRandom(index * 127 + 3);
  if (technicalRisk) {
    // Technical-risk leads go to revision or stay nueva
    if (r < 0.15) return "nueva";
    if (r < 0.70) return "pendiente_revision_tecnica";
    if (r < 0.90) return "calificada";
    return "pendiente_contacto_comercial";
  }
  // Non-technical: natural distribution
  if (r < 0.28) return "nueva";
  if (r < 0.50) return "calificada";
  if (r < 0.72) return "pendiente_contacto_comercial";
  if (r < 0.90) return "pendiente_revision_tecnica";
  return "cerrada_no_oportunidad";
}

function scorePriority(
  basePriority: LeadPriority,
  urgency: string,
  technicalRisk: boolean,
  quantity: string
): LeadPriority {
  if (technicalRisk || urgency === "Urgente" || urgency === "Obra activa") return "alta";
  if (urgency === "Alta") return "alta";
  if (basePriority === "alta" && urgency !== "Baja") return "alta";
  if (basePriority === "media" || urgency === "Planificada" || quantity.includes("120") || quantity.includes("180")) return "media";
  if (basePriority === "baja" && urgency === "Baja") return "baja";
  return "media";
}

function resolveSubcategory(family: ProductFamilyId, index: number) {
  const subcategories: Record<ProductFamilyId, string[]> = {
    provisional: ["Borde de forjado", "Cubierta en obra", "Huecos y perímetros", "Nave industrial"],
    definitiva: ["Cubierta industrial", "Pasillo técnico", "Autoportante / sin perforación", "Azotea y terraza"],
    "bases-casquillos": ["Base atornillable", "Casquillo recto", "Casquillo acodado", "Anclaje inox", "Fijación especial"],
    auxiliares: ["Reposición", "Apoyo a instalación", "Suministro de obra", "Mordazas y soportes"],
    consumibles: ["Recambio", "Compra recurrente", "Suministro puntual", "Kit de fijación"],
    medida: ["Obra singular", "Soporte complejo", "Pieza o adaptación especial", "Geometría especial"]
  };
  const options = subcategories[family];
  return options[Math.floor(seededRandom(index * 139 + 17) * options.length)];
}

function resolveClassificationReason(family: ProductFamilyId, technicalRisk: boolean) {
  const baseReasons: Record<ProductFamilyId, string> = {
    provisional: "La consulta apunta a una protección temporal durante obra o mantenimiento.",
    definitiva: "La consulta parece orientada a una solución permanente para mantenimiento o acceso seguro.",
    "bases-casquillos": "El foco está en elementos de fijación, alojamiento o compatibilidad con postes.",
    auxiliares: "La necesidad se centra en material auxiliar, reposición o suministro de apoyo.",
    consumibles: "La consulta encaja con suministro, recambio o consumo recurrente.",
    medida: "El caso presenta condiciones singulares o restricciones que requieren revisión personalizada."
  };
  return technicalRisk
    ? `${baseReasons[family]} Además, queda marcada para revisión técnica por los términos detectados.`
    : baseReasons[family];
}

function slug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}
