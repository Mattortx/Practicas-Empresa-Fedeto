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
  }
];
