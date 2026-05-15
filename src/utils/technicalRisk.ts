import type { TechnicalRiskFlag } from "../types/commercialCopilot";

const riskMatchers: Array<{ flag: TechnicalRiskFlag; keywords: string[] }> = [
  {
    flag: "normativa",
    keywords: ["norma", "normativa", "une", "iso", "legal", "cumple", "cumplimiento"]
  },
  {
    flag: "certificacion",
    keywords: ["certificado", "certificacion", "homologado", "ensayo"]
  },
  {
    flag: "calculo",
    keywords: ["calculo", "calcular", "dimensionar", "carga", "seguridad estructural"]
  },
  { flag: "instalacion", keywords: ["instalar", "montaje", "fijar", "perforar"] },
  { flag: "anclaje", keywords: ["anclaje", "anclar", "atornillar", "fijacion"] },
  {
    flag: "resistencia",
    keywords: ["resistencia", "resiste", "peso", "viento", "empuje", "estructural"]
  },
  {
    flag: "documentacion_tecnica",
    keywords: ["ficha tecnica", "documentacion", "manual", "instrucciones"]
  }
];

export function detectTechnicalRisk(text: string): TechnicalRiskFlag[] {
  const normalized = normalize(text);

  return riskMatchers
    .filter((matcher) => matcher.keywords.some((keyword) => normalized.includes(normalize(keyword))))
    .map((matcher) => matcher.flag);
}

export function hasTechnicalRisk(text: string): boolean {
  return detectTechnicalRisk(text).length > 0;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
