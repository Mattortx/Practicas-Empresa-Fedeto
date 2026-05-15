import { describe, expect, it } from "vitest";
import { conversationFlows, getConversationFlow } from "../data/conversationFlows";
import { buildCommercialLead } from "./leadSummary";
import { calculateLeadPriority } from "./leadScoring";
import { detectTechnicalRisk } from "./technicalRisk";

describe("commercial copilot utilities", () => {
  it("detecta consultas tecnicas sensibles", () => {
    expect(
      detectTechnicalRisk("Necesito certificado UNE, ficha tecnica para anclaje y seguridad estructural")
    ).toEqual([
      "normativa",
      "certificacion",
      "calculo",
      "anclaje",
      "resistencia",
      "documentacion_tecnica"
    ]);
  });

  it("asigna prioridad alta por urgencia y volumen", () => {
    const priority = calculateLeadPriority(
      { urgency: "urgente esta semana", approximateLength: "120 metros" },
      "definitiva",
      true
    );

    expect(priority).toBe("alta");
  });

  it("genera resumen comercial estructurado", () => {
    const flow = getConversationFlow("provisional");

    if (!flow) {
      throw new Error("Flow not found");
    }

    const lead = buildCommercialLead(
      {
        name: "Cliente Demo",
        company: "Empresa Demo",
        email: "demo@example.com",
        phone: "No indicado",
        workType: "Edificacion",
        location: "Toledo",
        urgency: "Media",
        observations: "Borde de forjado",
        approximateLength: "40 metros"
      },
      flow,
      []
    );

    expect(lead.summaryText).toContain("- Nombre: Cliente Demo");
    expect(lead.summaryText).toContain("- Requiere revision tecnica: No");
    expect(lead.status).toBe("nueva");
    expect(lead.summary.requiresTechnicalReview).toBe(false);
    expect(lead.productFamilyLabel).toBe("Proteccion provisional de borde");
  });

  it("todos los flujos principales generan una solicitud comercial", () => {
    for (const flow of conversationFlows) {
      const lead = buildCommercialLead(
        {
          name: "Cliente Demo",
          company: "Empresa Demo",
          email: "demo@example.com",
          phone: "No indicado",
          needType: flow.needType,
          productFamily: flow.productFamily,
          workType: "Obra demo",
          location: "Toledo",
          urgency: "Media",
          observations: "Datos de prueba para auditoria final",
          supportType: "Soporte demo",
          canDrill: "Por definir",
          approximateLength: "40 metros",
          quantity: "20 unidades",
          environment: "Industrial",
          project: "Proyecto demo",
          customProblem: "Riesgo de caida",
          documentationAvailable: "Pendiente",
          expectedDeadline: "2 semanas",
          riskLocation: "Cubierta",
          solutionDuration: "Temporal",
          commercialGoal: "Presupuesto"
        },
        flow,
        []
      );

      expect(lead.summaryText).toContain("- Nombre: Cliente Demo");
      expect(lead.summaryText).toContain("- Recomendacion de siguiente accion:");
      expect(lead.needType).toBeTruthy();
      expect(lead.status).toBe("nueva");
    }
  });
});
