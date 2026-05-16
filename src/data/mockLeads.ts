import type { CommercialLead } from "../types/commercialCopilot";

export const mockLeads: CommercialLead[] = [
  {
    id: "demo-001",
    createdAt: new Date("2026-05-15T09:20:00").toISOString(),
    status: "pendiente_revision_tecnica",
    priority: "alta",
    technicalRisk: true,
    technicalRiskFlags: ["documentacion_tecnica"],
    productFamilyId: "definitiva",
    productFamilyLabel: "Protección definitiva de borde",
    needType: "Protección definitiva de borde",
    source: "demo",
    summary: {
      name: "Laura Martinez",
      company: "Mantenimiento Industrial Toledo",
      email: "laura@example.com",
      phone: "No indicado",
      needType: "Protección definitiva de borde",
      productFamily: "Protección definitiva de borde",
      workType: "Cubierta técnica industrial",
      location: "Toledo",
      urgency: "Alta",
      observations:
        "Necesitan revisar una solución permanente para cubierta con mantenimiento recurrente.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Solicitar revisión técnica y propuesta comercial.",
      technicalWarnings: [
        "La solución definitiva debe validarse por personal competente.",
        "No se realizan cálculos estructurales automáticos."
      ]
    },
    summaryText:
      "Solicitud demo: protección definitiva de borde en cubierta técnica industrial. Requiere revisión técnica."
  },
  {
    id: "demo-002",
    createdAt: new Date("2026-05-15T10:05:00").toISOString(),
    status: "nueva",
    priority: "media",
    technicalRisk: false,
    technicalRiskFlags: [],
    productFamilyId: "bases-casquillos",
    productFamilyLabel: "Bases y casquillos",
    needType: "Bases, casquillos o elementos de fijación",
    source: "demo",
    summary: {
      name: "Carlos Ruiz",
      company: "Construcciones Demo SL",
      email: "carlos@example.com",
      phone: "No indicado",
      needType: "Bases, casquillos o elementos de fijación",
      productFamily: "Bases y casquillos",
      workType: "Edificación",
      location: "Madrid",
      urgency: "Media",
      observations: "Consulta sobre cantidades aproximadas de casquillos para proyecto asociado.",
      priority: "media",
      requiresTechnicalReview: false,
      nextAction: "Revisar compatibilidad y preparar respuesta comercial.",
      technicalWarnings: ["La compatibilidad debe confirmarse con referencias o documentación técnica."]
    },
    summaryText:
      "Solicitud demo: bases y casquillos para edificacion. Pendiente de contacto comercial."
  },
  {
    id: "demo-003",
    createdAt: new Date("2026-05-15T11:35:00").toISOString(),
    status: "nueva",
    priority: "media",
    technicalRisk: false,
    technicalRiskFlags: [],
    productFamilyId: "provisional",
    productFamilyLabel: "Protección provisional de borde",
    needType: "Protección provisional de borde",
    source: "demo",
    summary: {
      name: "Marta Garcia",
      company: "Obras Centro Demo",
      email: "marta.garcia@example.com",
      phone: "600 123 456",
      needType: "Protección provisional de borde",
      productFamily: "Protección provisional de borde",
      workType: "Forjado en edificacion",
      location: "Talavera de la Reina",
      urgency: "Media",
      observations:
        "Necesitan orientar una solución temporal para borde de forjado. Longitud aproximada: 85 metros. Fijación pendiente de confirmar.",
      priority: "media",
      requiresTechnicalReview: false,
      nextAction: "Derivar al equipo comercial con revisión técnica inicial.",
      technicalWarnings: [
        "La protección provisional debe revisarse según soporte, uso previsto y documentación técnica aplicable."
      ]
    },
    summaryText:
      "Solicitud demo: protección provisional de borde para forjado en edificacion. Pendiente confirmar soporte y fijación."
  },
  {
    id: "demo-004",
    createdAt: new Date("2026-05-15T12:10:00").toISOString(),
    status: "pendiente_contacto_comercial",
    priority: "baja",
    technicalRisk: false,
    technicalRiskFlags: [],
    productFamilyId: "auxiliares",
    productFamilyLabel: "Auxiliares para la construcción",
    needType: "Auxiliares para construcción",
    source: "demo",
    summary: {
      name: "Javier Lopez",
      company: "Suministros de Obra La Mancha",
      email: "javier.lopez@example.com",
      phone: "925 000 111",
      needType: "Auxiliares para construcción",
      productFamily: "Auxiliares para la construcción",
      workType: "Reposición de material auxiliar",
      location: "Ciudad Real",
      urgency: "Baja",
      observations:
        "Consulta de suministro puntual para material auxiliar asociado a obra. Cantidades pendientes de cerrar.",
      priority: "baja",
      requiresTechnicalReview: false,
      nextAction: "Preparar respuesta comercial de suministro.",
      technicalWarnings: ["Las referencias y compatibilidades deben confirmarse antes de suministro definitivo."]
    },
    summaryText:
      "Solicitud demo: auxiliares para construcción. Interés comercial de suministro puntual."
  },
  {
    id: "demo-005",
    createdAt: new Date("2026-05-15T13:25:00").toISOString(),
    status: "nueva",
    priority: "media",
    technicalRisk: false,
    technicalRiskFlags: [],
    productFamilyId: "consumibles",
    productFamilyLabel: "Consumibles",
    needType: "Consumibles o recambios",
    source: "demo",
    summary: {
      name: "Ana Serrano",
      company: "Mantenimientos Cubiertas Demo",
      email: "ana.serrano@example.com",
      phone: "610 222 333",
      needType: "Consumibles o recambios",
      productFamily: "Consumibles",
      workType: "Mantenimiento recurrente",
      location: "Guadalajara",
      urgency: "Media",
      observations:
        "Busca recambios y consumibles para mantenimiento. Solicita cantidades orientativas para reposición mensual.",
      priority: "media",
      requiresTechnicalReview: false,
      nextAction: "Preparar respuesta comercial de consumibles.",
      technicalWarnings: ["Las cantidades y referencias deben validarse antes de confirmar suministro."]
    },
    summaryText:
      "Solicitud demo: consumibles y recambios para mantenimiento recurrente."
  },
  {
    id: "demo-006",
    createdAt: new Date("2026-05-15T15:05:00").toISOString(),
    status: "pendiente_revision_tecnica",
    priority: "alta",
    technicalRisk: true,
    technicalRiskFlags: ["calculo", "anclaje", "documentacion_tecnica"],
    productFamilyId: "medida",
    productFamilyLabel: "Soluciones a medida",
    needType: "Solución a medida u obra singular",
    source: "demo",
    summary: {
      name: "Sergio Molina",
      company: "Ingeniería Industrial Demo",
      email: "sergio.molina@example.com",
      phone: "615 444 555",
      needType: "Solución a medida u obra singular",
      productFamily: "Soluciones a medida",
      workType: "Pasarela técnica en silo",
      location: "Albacete",
      urgency: "Alta",
      observations:
        "Necesidad singular en silo con restricciones de soporte. Indican que pueden aportar planos y fotografías. Requiere revisión técnica personalizada.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Derivar a revisión técnica personalizada y contacto comercial.",
      technicalWarnings: [
        "Las soluciones a medida requieren revisión técnica personalizada.",
        "El copiloto no propone cálculos, ensayos ni instrucciones definitivas."
      ]
    },
    summaryText:
      "Solicitud demo: solución a medida para pasarela técnica en silo. Alta prioridad y revisión técnica necesaria."
  },
  {
    id: "demo-007",
    createdAt: new Date("2026-05-16T08:45:00").toISOString(),
    status: "nueva",
    priority: "alta",
    technicalRisk: true,
    technicalRiskFlags: ["normativa", "certificacion", "documentacion_tecnica"],
    productFamilyId: "definitiva",
    productFamilyLabel: "Protección definitiva de borde",
    needType: "Documentación, normativa o consulta técnica sensible",
    source: "demo",
    summary: {
      name: "Raul Navarro",
      company: "Facility Services Demo",
      email: "raul.navarro@example.com",
      phone: "No indicado",
      needType: "Documentación, normativa o consulta técnica sensible",
      productFamily: "Protección definitiva de borde",
      workType: "Cubierta industrial",
      location: "Toledo",
      urgency: "Alta",
      observations:
        "Consulta sobre documentación técnica para barandilla definitiva en cubierta. No se confirma normativa desde el copiloto.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Derivar al equipo técnico para respuesta documentada.",
      technicalWarnings: [
        "No se confirma cumplimiento normativo desde el copiloto.",
        "La respuesta debe apoyarse en documentación técnica oficial y revisión del equipo competente."
      ]
    },
    summaryText:
      "Solicitud demo: consulta documental sobre protección definitiva. Requiere respuesta técnica documentada."
  }
];
