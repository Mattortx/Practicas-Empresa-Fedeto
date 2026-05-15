import type { AICommercialReply } from "../../types/ai";
import type { CommercialLead } from "../../types/commercialCopilot";
import { postAi } from "./aiClient";
import { localCommercialReply } from "./aiFallbacks";
import { validateAICommercialReply } from "./validators";

export async function generateCommercialReplyWithAi(lead: CommercialLead) {
  const fallback = localCommercialReply(lead);

  return postAi<AICommercialReply>(
    "/api/ai/generate-commercial-reply",
    { lead },
    (payload) => payload.commercialReply,
    validateAICommercialReply,
    fallback
  );
}
