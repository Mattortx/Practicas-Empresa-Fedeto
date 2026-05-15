import { answerWithLocalKnowledgeBase } from "../../data/knowledgeBase";
import type { AIFaqAnswer } from "../../types/ai";
import { postAi } from "./aiClient";
import { localAnswerFaq } from "./aiFallbacks";
import { validateAIFaq } from "./validators";

export async function answerWithKnowledgeBase(question: string) {
  const fallback: AIFaqAnswer = {
    ...localAnswerFaq(question),
    answer: answerWithLocalKnowledgeBase(question)
  };

  return postAi<AIFaqAnswer>(
    "/api/ai/answer-faq",
    { question },
    (payload) => payload.faq,
    validateAIFaq,
    fallback
  );
}
