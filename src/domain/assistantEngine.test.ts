import { describe, expect, it } from "vitest";
import { createAssistantEngine } from "./assistantEngine";

describe("assistantEngine", () => {
  const engine = createAssistantEngine();

  it("orienta una consulta de proteccion provisional", () => {
    const response = engine.respond("Necesito una barandilla provisional para borde de forjado");

    expect(response.text).toContain("Sistemas provisionales");
    expect(response.suggestedNeed).toContain("provisionales");
  });

  it("activa el flujo de presupuesto", () => {
    const response = engine.respond("Quiero pedir presupuesto para una obra");

    expect(response.startLead).toBe(true);
    expect(response.text.toLowerCase()).toContain("no se almacena");
  });

  it("responde con cautela ante normativa o certificaciones", () => {
    const response = engine.respond("Cumple UNE y tiene certificacion?");

    expect(response.text).toContain("no validar normativa");
    expect(response.text).toContain("equipo comercial/tecnico");
  });
});
