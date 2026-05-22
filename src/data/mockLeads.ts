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

const scenarioSeeds: ScenarioSeed[] = [
  {
    productFamilyId: "provisional",
    needType: "Protección provisional de borde",
    workType: "Borde de forjado en edificación",
    observation: "Consulta para proteger canto de forjado durante fase de estructura.",
    technicalRiskFlags: [],
    defaultPriority: "media"
  },
  {
    productFamilyId: "provisional",
    needType: "Protección provisional de borde",
    workType: "Cubierta en rehabilitación",
    observation: "Protección temporal para intervención puntual en cubierta.",
    technicalRiskFlags: ["instalacion"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "definitiva",
    needType: "Protección definitiva de borde",
    workType: "Cubierta técnica industrial",
    observation: "Solución permanente para mantenimiento recurrente en cubierta.",
    technicalRiskFlags: ["documentacion_tecnica"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "definitiva",
    needType: "Protección definitiva de borde",
    workType: "Pasillo técnico en zona elevada",
    observation: "Recorrido seguro para mantenimiento de equipos e instalaciones.",
    technicalRiskFlags: ["normativa", "documentacion_tecnica"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "definitiva",
    needType: "Protección definitiva de borde",
    workType: "Cubierta donde no se puede perforar",
    observation: "Restricción de no perforación; requiere valorar sistema adecuado.",
    technicalRiskFlags: ["instalacion", "anclaje"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "bases-casquillos",
    needType: "Bases, casquillos o elementos de fijación",
    workType: "Suministro para sistema de barandilla",
    observation: "Solicitud de bases atornillables y casquillos para obra.",
    technicalRiskFlags: [],
    defaultPriority: "media"
  },
  {
    productFamilyId: "bases-casquillos",
    needType: "Bases, casquillos o elementos de fijación",
    workType: "Compatibilidad de casquillo recto",
    observation: "Consulta sobre alojamiento de balaustre y soporte disponible.",
    technicalRiskFlags: ["anclaje"],
    defaultPriority: "media"
  },
  {
    productFamilyId: "bases-casquillos",
    needType: "Bases, casquillos o elementos de fijación",
    workType: "Fijación especial en estructura metálica",
    observation: "Elemento de fijación con geometría condicionada por soporte.",
    technicalRiskFlags: ["anclaje", "documentacion_tecnica"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "auxiliares",
    needType: "Auxiliares para construcción",
    workType: "Reposición de material auxiliar",
    observation: "Suministro puntual para reposición en obra activa.",
    technicalRiskFlags: [],
    defaultPriority: "media"
  },
  {
    productFamilyId: "auxiliares",
    needType: "Auxiliares para construcción",
    workType: "Apoyo a instalación y mantenimiento",
    observation: "Material auxiliar asociado a instalación y revisiones posteriores.",
    technicalRiskFlags: [],
    defaultPriority: "baja"
  },
  {
    productFamilyId: "consumibles",
    needType: "Consumibles o recambios",
    workType: "Stock de mantenimiento",
    observation: "Pedido recurrente de consumibles para almacén técnico.",
    technicalRiskFlags: [],
    defaultPriority: "baja"
  },
  {
    productFamilyId: "consumibles",
    needType: "Consumibles o recambios",
    workType: "Recambio para obra",
    observation: "Consulta sobre referencias, cantidad y plazo de reposición.",
    technicalRiskFlags: [],
    defaultPriority: "media"
  },
  {
    productFamilyId: "medida",
    needType: "Solución a medida u obra singular",
    workType: "Pasarela o zona elevada en silo",
    observation: "Caso singular con restricciones de soporte y documentación pendiente.",
    technicalRiskFlags: ["calculo", "anclaje", "documentacion_tecnica"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "medida",
    needType: "Solución a medida u obra singular",
    workType: "Infraestructura con geometría especial",
    observation: "Necesidad de adaptar una solución a obra singular con planos.",
    technicalRiskFlags: ["calculo", "resistencia"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "medida",
    needType: "Solución a medida u obra singular",
    workType: "Instalación industrial exterior",
    observation: "Entorno exterior agresivo con restricciones de acceso y soporte.",
    technicalRiskFlags: ["instalacion", "resistencia"],
    defaultPriority: "alta"
  },
  {
    productFamilyId: "provisional",
    needType: "Protección provisional de huecos y perímetros",
    workType: "Huecos interiores en rehabilitación",
    observation: "Protección temporal de huecos interiores y pasos de obra.",
    technicalRiskFlags: [],
    defaultPriority: "media"
  }
];

const people = [
  "Laura Martínez",
  "Carlos Ruiz",
  "Marta García",
  "Javier López",
  "Ana Serrano",
  "Sergio Molina",
  "Raúl Navarro",
  "Elena Prieto",
  "Diego Herranz",
  "Patricia León",
  "Óscar Cano",
  "Silvia Campos",
  "Fernando Sanz",
  "Nuria Beltrán",
  "Miguel Pardo",
  "Teresa Ramos",
  "Iván Robles",
  "Lucía Torres",
  "Tomás Ortega",
  "Beatriz Fuentes"
];

const companies = [
  "Mantenimiento Industrial Toledo",
  "Construcciones Tajo",
  "Obras Centro",
  "Suministros de Obra La Mancha",
  "Mantenimientos Cubiertas",
  "Ingeniería Industrial",
  "Facility Services",
  "Servicios Generales",
  "Reformas Técnicas Centro",
  "Estructuras Norte",
  "Cubiertas Industriales Levante",
  "Montajes Seguros",
  "Infraestructuras Centro",
  "Almacenes Técnicos",
  "Promociones Centro",
  "Energía Solar",
  "Obra Civil",
  "Mantenimiento Portuario",
  "Rehabilitaciones Urbanas",
  "Construcción Modular"
];

const locations = [
  "Toledo",
  "Turleque",
  "Talavera de la Reina",
  "Madrid",
  "Ciudad Real",
  "Guadalajara",
  "Cuenca",
  "Albacete",
  "Ávila",
  "Burgos",
  "Valencia",
  "Segovia",
  "Valladolid",
  "Zaragoza",
  "Barcelona",
  "Sevilla",
  "Córdoba",
  "Murcia",
  "Alicante",
  "Bilbao"
];

const statuses: LeadStatus[] = [
  "nueva",
  "nueva",
  "pendiente_contacto_comercial",
  "pendiente_revision_tecnica",
  "cerrada_demo"
];

const quantities = [
  "35 metros",
  "60 metros",
  "85 metros",
  "120 metros",
  "180 metros",
  "25 unidades",
  "80 unidades",
  "150 unidades",
  "200 unidades",
  "cantidad pendiente"
];

const urgencyLabels = ["Baja", "Media", "Alta", "Esta semana", "Obra activa"];

export const mockLeads: CommercialLead[] = Array.from({ length: 100 }, (_, index) =>
  createMockLead(index)
);

function createMockLead(index: number): CommercialLead {
  const scenario = scenarioSeeds[index % scenarioSeeds.length];
  const technicalRisk = scenario.technicalRiskFlags.length > 0;
  const productFamilyLabel = familyLabels[scenario.productFamilyId];
  const status = technicalRisk ? chooseStatus(index, true) : statuses[index % statuses.length];
  const urgency = urgencyLabels[(index + scenario.productFamilyId.length) % urgencyLabels.length];
  const priority = scorePriority(scenario.defaultPriority, urgency, technicalRisk, quantities[index % quantities.length]);
  const createdAt = new Date(Date.UTC(2026, 4, 1 + Math.floor(index / 5), 7 + (index % 10), (index * 7) % 60));
  const name = people[index % people.length];
  const company = `${companies[(index * 3) % companies.length]} ${index + 1}`;
  const email = `${slug(name)}.${index + 1}@example.com`;
  const phone = index % 5 === 0 ? "No indicado" : `6${String(10000000 + index * 73121).slice(0, 8)}`;
  const location = locations[(index * 2 + scenario.productFamilyId.length) % locations.length];
  const quantity = quantities[index % quantities.length];
  const technicalWarnings = [
    warningByFamily[scenario.productFamilyId],
    ...(technicalRisk
      ? ["Consulta marcada para revisión técnica antes de confirmar solución, normativa o documentación."]
      : [])
  ];
  const detectedSignals = [
    `Tipo de obra: ${scenario.workType}`,
    `Ubicación: ${location}`,
    `Alcance: ${quantity}`,
    `Urgencia: ${urgency}`,
    technicalRisk ? `Riesgo técnico: ${scenario.technicalRiskFlags.join(", ")}` : "Consulta comercial inicial"
  ];
  const missingInformation = [
    index % 4 === 0 ? "documentación o fotografías" : "",
    index % 3 === 0 ? "confirmar soporte" : "",
    index % 6 === 0 ? "persona técnica de contacto" : ""
  ].filter(Boolean);
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
    detectedSignals,
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

function chooseStatus(index: number, technicalRisk: boolean): LeadStatus {
  if (technicalRisk) {
    return index % 7 === 0 ? "nueva" : "pendiente_revision_tecnica";
  }

  return statuses[index % statuses.length];
}

function scorePriority(
  basePriority: LeadPriority,
  urgency: string,
  technicalRisk: boolean,
  quantity: string
): LeadPriority {
  if (technicalRisk || urgency === "Alta" || urgency === "Obra activa" || quantity.includes("180") || quantity.includes("200")) {
    return "alta";
  }

  if (basePriority === "media" || urgency === "Esta semana" || quantity.includes("120")) {
    return "media";
  }

  return "baja";
}

function resolveSubcategory(family: ProductFamilyId, index: number) {
  const subcategories: Record<ProductFamilyId, string[]> = {
    provisional: ["Borde de forjado", "Cubierta en obra", "Huecos y perímetros"],
    definitiva: ["Cubierta industrial", "Pasillo técnico", "Autoportante / sin perforación"],
    "bases-casquillos": ["Base atornillable", "Casquillo recto", "Casquillo acodado", "Anclaje inox"],
    auxiliares: ["Reposición", "Apoyo a instalación", "Suministro de obra"],
    consumibles: ["Recambio", "Compra recurrente", "Suministro puntual"],
    medida: ["Obra singular", "Soporte complejo", "Pieza o adaptación especial"]
  };

  const options = subcategories[family];
  return options[index % options.length];
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
