import { describe, expect, it } from "vitest";
import { getConversationFlow } from "../data/conversationFlows";
import { buildCommercialLead } from "./leadSummary";
import { calculateLeadPriority } from "./leadScoring";
import { detectTechnicalRisk } from "./technicalRisk";

describe("commercial copilot utilities", () => {
  it("detecta consultas tecnicas sensibles", () => {
    expect(detectTechnicalRisk("Necesito certificado UNE y ficha tecnica")).toEqual([
      "normativa",
      "certificacion",
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
    expect(lead.productFamilyLabel).toBe("Proteccion provisional de borde");
  });
});
