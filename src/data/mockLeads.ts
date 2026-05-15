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
    productFamilyLabel: "Proteccion definitiva de borde",
    needType: "Proteccion definitiva de borde",
    source: "demo",
    summary: {
      name: "Laura Martinez",
      company: "Mantenimiento Industrial Toledo",
      email: "laura@example.com",
      phone: "No indicado",
      needType: "Proteccion definitiva de borde",
      productFamily: "Proteccion definitiva de borde",
      workType: "Cubierta tecnica industrial",
      location: "Toledo",
      urgency: "Alta",
      observations:
        "Necesitan revisar una solucion permanente para cubierta con mantenimiento recurrente.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Solicitar revision tecnica y propuesta comercial.",
      technicalWarnings: [
        "La solucion definitiva debe validarse por personal competente.",
        "No se realizan calculos estructurales automaticos."
      ]
    },
    summaryText:
      "Solicitud demo: proteccion definitiva de borde en cubierta tecnica industrial. Requiere revision tecnica."
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
    needType: "Bases, casquillos o elementos de fijacion",
    source: "demo",
    summary: {
      name: "Carlos Ruiz",
      company: "Construcciones Demo SL",
      email: "carlos@example.com",
      phone: "No indicado",
      needType: "Bases, casquillos o elementos de fijacion",
      productFamily: "Bases y casquillos",
      workType: "Edificacion",
      location: "Madrid",
      urgency: "Media",
      observations: "Consulta sobre cantidades aproximadas de casquillos para proyecto asociado.",
      priority: "media",
      requiresTechnicalReview: false,
      nextAction: "Revisar compatibilidad y preparar respuesta comercial.",
      technicalWarnings: ["La compatibilidad debe confirmarse con referencias o documentacion tecnica."]
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
    productFamilyLabel: "Proteccion provisional de borde",
    needType: "Proteccion provisional de borde",
    source: "demo",
    summary: {
      name: "Marta Garcia",
      company: "Obras Centro Demo",
      email: "marta.garcia@example.com",
      phone: "600 123 456",
      needType: "Proteccion provisional de borde",
      productFamily: "Proteccion provisional de borde",
      workType: "Forjado en edificacion",
      location: "Talavera de la Reina",
      urgency: "Media",
      observations:
        "Necesitan orientar una solucion temporal para borde de forjado. Longitud aproximada: 85 metros. Fijacion pendiente de confirmar.",
      priority: "media",
      requiresTechnicalReview: false,
      nextAction: "Derivar al equipo comercial con revision tecnica inicial.",
      technicalWarnings: [
        "La proteccion provisional debe revisarse segun soporte, uso previsto y documentacion tecnica aplicable."
      ]
    },
    summaryText:
      "Solicitud demo: proteccion provisional de borde para forjado en edificacion. Pendiente confirmar soporte y fijacion."
  },
  {
    id: "demo-004",
    createdAt: new Date("2026-05-15T12:10:00").toISOString(),
    status: "pendiente_contacto_comercial",
    priority: "baja",
    technicalRisk: false,
    technicalRiskFlags: [],
    productFamilyId: "auxiliares",
    productFamilyLabel: "Auxiliares para la construccion",
    needType: "Auxiliares para construccion",
    source: "demo",
    summary: {
      name: "Javier Lopez",
      company: "Suministros de Obra La Mancha",
      email: "javier.lopez@example.com",
      phone: "925 000 111",
      needType: "Auxiliares para construccion",
      productFamily: "Auxiliares para la construccion",
      workType: "Reposicion de material auxiliar",
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
      "Solicitud demo: auxiliares para construccion. Interes comercial de suministro puntual."
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
        "Busca recambios y consumibles para mantenimiento. Solicita cantidades orientativas para reposicion mensual.",
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
    needType: "Solucion a medida u obra singular",
    source: "demo",
    summary: {
      name: "Sergio Molina",
      company: "Ingenieria Industrial Demo",
      email: "sergio.molina@example.com",
      phone: "615 444 555",
      needType: "Solucion a medida u obra singular",
      productFamily: "Soluciones a medida",
      workType: "Pasarela tecnica en silo",
      location: "Albacete",
      urgency: "Alta",
      observations:
        "Necesidad singular en silo con restricciones de soporte. Indican que pueden aportar planos y fotografias. Requiere revision tecnica personalizada.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Derivar a revision tecnica personalizada y contacto comercial.",
      technicalWarnings: [
        "Las soluciones a medida requieren revision tecnica personalizada.",
        "El copiloto no propone calculos, ensayos ni instrucciones definitivas."
      ]
    },
    summaryText:
      "Solicitud demo: solucion a medida para pasarela tecnica en silo. Alta prioridad y revision tecnica necesaria."
  },
  {
    id: "demo-007",
    createdAt: new Date("2026-05-16T08:45:00").toISOString(),
    status: "nueva",
    priority: "alta",
    technicalRisk: true,
    technicalRiskFlags: ["normativa", "certificacion", "documentacion_tecnica"],
    productFamilyId: "definitiva",
    productFamilyLabel: "Proteccion definitiva de borde",
    needType: "Documentacion, normativa o consulta tecnica sensible",
    source: "demo",
    summary: {
      name: "Raul Navarro",
      company: "Facility Services Demo",
      email: "raul.navarro@example.com",
      phone: "No indicado",
      needType: "Documentacion, normativa o consulta tecnica sensible",
      productFamily: "Proteccion definitiva de borde",
      workType: "Cubierta industrial",
      location: "Toledo",
      urgency: "Alta",
      observations:
        "Consulta sobre documentacion tecnica para barandilla definitiva en cubierta. No se confirma normativa desde el copiloto.",
      priority: "alta",
      requiresTechnicalReview: true,
      nextAction: "Derivar al equipo tecnico para respuesta documentada.",
      technicalWarnings: [
        "No se confirma cumplimiento normativo desde el copiloto.",
        "La respuesta debe apoyarse en documentacion tecnica oficial y revision del equipo competente."
      ]
    },
    summaryText:
      "Solicitud demo: consulta documental sobre proteccion definitiva. Requiere respuesta tecnica documentada."
  }
];
