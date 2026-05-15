import type { LeadDraft, LeadPriority, ProductFamilyId } from "../types/commercialCopilot";

export function calculateLeadPriority(
  draft: LeadDraft,
  productFamilyId?: ProductFamilyId,
  technicalRisk = false
): LeadPriority {
  let score = 0;
  const urgency = normalize(draft.urgency ?? "");
  const quantityText = `${draft.quantity ?? ""} ${draft.approximateLength ?? ""}`;
  const amount = extractFirstNumber(quantityText);

  if (urgency.includes("alta") || urgency.includes("urgente") || urgency.includes("24")) {
    score += 3;
  } else if (urgency.includes("media") || urgency.includes("semana")) {
    score += 2;
  } else if (urgency.includes("baja")) {
    score += 1;
  }

  if (amount >= 100) {
    score += 2;
  } else if (amount >= 30) {
    score += 1;
  }

  if (productFamilyId === "definitiva" || productFamilyId === "medida") {
    score += 1;
  }

  if (technicalRisk) {
    score += 1;
  }

  if (score >= 4) {
    return "alta";
  }

  if (score >= 2) {
    return "media";
  }

  return "baja";
}

function extractFirstNumber(value: string) {
  const match = value.replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
