import type { AILeadSummary } from "../../types/ai";
import type { CommercialLead } from "../../types/commercialCopilot";
import { logDemoEvent } from "../../utils/demoEvents";
import { postAi } from "./aiClient";
import { localSummarizeLead } from "./aiFallbacks";
import { validateAILeadSummary } from "./validators";

export async function summarizeLeadWithAi(lead: CommercialLead) {
  const fallback = localSummarizeLead(lead);
  const result = await postAi<AILeadSummary>(
    "/api/ai/summarize-lead",
    { lead: minimizeLead(lead) },
    (payload) => payload.summary,
    validateAILeadSummary,
    fallback
  );

  logDemoEvent(result.available ? "resumen_generado" : "fallback_activado", {
    mode: result.mode,
    reason: result.reason,
    leadId: lead.id
  });

  return result;
}

function minimizeLead(lead: CommercialLead) {
  return {
    id: lead.id,
    priority: lead.priority,
    technicalRisk: lead.technicalRisk,
    technicalRiskFlags: lead.technicalRiskFlags,
    productFamilyLabel: lead.productFamilyLabel,
    needType: lead.needType,
    summary: {
      company: lead.summary.company,
      needType: lead.summary.needType,
      productFamily: lead.summary.productFamily,
      workType: lead.summary.workType,
      location: lead.summary.location,
      urgency: lead.summary.urgency,
      observations: lead.summary.observations,
      requiresTechnicalReview: lead.summary.requiresTechnicalReview,
      nextAction: lead.summary.nextAction,
      technicalWarnings: lead.summary.technicalWarnings
    },
    aiClassification: lead.aiClassification
  };
}
