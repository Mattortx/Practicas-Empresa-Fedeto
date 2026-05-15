import knowledgeBase from "../data/knowledgeBase.json";
import type {
  AssistantResponse,
  CategoryId,
  ChatAction,
  FaqItem,
  KnowledgeBase,
  ProductCategory
} from "./types";

const kb = knowledgeBase as KnowledgeBase;

const quoteKeywords = [
  "presupuesto",
  "oferta",
  "cotizacion",
  "cotización",
  "precio",
  "coste",
  "comprar",
  "pedido",
  "contactar",
  "solicitud"
];

const contactKeywords = ["telefono", "teléfono", "correo", "email", "direccion", "dirección", "contacto", "llamar"];

const normativeKeywords = [
  "norma",
  "normativa",
  "une",
  "en 13374",
  "iso",
  "certificado",
  "certificacion",
  "certificación",
  "homologado",
  "legal",
  "cumple",
  "documentacion",
  "documentación",
  "ficha tecnica",
  "ficha técnica"
];

const categoryActions: ChatAction[] = kb.categories.map((category) => ({
  label: category.shortLabel,
  value: `categoria:${category.id}`,
  variant: "secondary"
}));

export function createAssistantEngine() {
  return {
    getWelcome(): AssistantResponse {
      return {
        text: kb.assistant.welcome,
        actions: [
          { label: "Orientar necesidad", value: "no se que producto necesito", variant: "primary" },
          { label: "Pedir presupuesto", value: "quiero pedir presupuesto", variant: "primary" },
          { label: "Normativa o fichas", value: "tengo una duda de normativa", variant: "warning" }
        ]
      };
    },

    respond(message: string): AssistantResponse {
      const normalizedMessage = normalize(message);

      if (startsWithCategoryCommand(normalizedMessage)) {
        const category = getCategoryFromCommand(normalizedMessage);
        return category ? categoryResponse(category) : unknownResponse();
      }

      if (containsAny(normalizedMessage, quoteKeywords)) {
        return {
          text: `${kb.dataPolicy.personalDataNotice}\n\nPuedo preparar un resumen comercial con los datos minimos de la obra y la necesidad principal.`,
          startLead: true
        };
      }

      if (containsAny(normalizedMessage, normativeKeywords)) {
        return normativeResponse();
      }

      if (containsAny(normalizedMessage, contactKeywords)) {
        return contactResponse();
      }

      const faq = bestFaqMatch(normalizedMessage);
      if (faq) {
        return {
          text: `${faq.answer}\n\nFuente: contenido ${faq.source === "real" ? "real de la web/documentacion publica" : "simulado para demo"}.`,
          actions: [
            { label: "Pedir presupuesto", value: "quiero pedir presupuesto", variant: "primary" },
            { label: "Ver contacto", value: "contacto", variant: "secondary" }
          ]
        };
      }

      const category = bestCategoryMatch(normalizedMessage);
      if (category) {
        return categoryResponse(category);
      }

      return unknownResponse();
    },

    getKnowledgeBase(): KnowledgeBase {
      return kb;
    }
  };
}

function categoryResponse(category: ProductCategory): AssistantResponse {
  const questions = category.discoveryQuestions.map((question) => `- ${question}`).join("\n");
  const useCases = category.useCases.slice(0, 3).join(", ");

  return {
    text: `Por lo que indicas, encaja inicialmente con ${category.label}.\n\n${category.description}\n\nCasos habituales: ${useCases}.\n\nPara orientar la consulta sin entrar en calculos tecnicos, conviene confirmar:\n${questions}\n\nSi quieres, preparo un resumen para que el equipo comercial/tecnico lo revise.`,
    suggestedNeed: category.label,
    actions: [
      { label: "Preparar presupuesto", value: "lead:start", variant: "primary" },
      { label: "Otra categoria", value: "no se que producto necesito", variant: "secondary" },
      { label: "Contacto", value: "contacto", variant: "secondary" }
    ]
  };
}

function normativeResponse(): AssistantResponse {
  return {
    text: `${kb.assistant.normativeGuardrail}\n\nPuedo ayudarte a dejar preparada una consulta tecnica con el contexto de la obra para que la revise Protecciones Toledo.`,
    actions: [
      { label: "Preparar consulta tecnica", value: "lead:start", variant: "primary" },
      { label: "Ver contacto", value: "contacto", variant: "secondary" }
    ]
  };
}

function contactResponse(): AssistantResponse {
  const { company } = kb;

  return {
    text: `Puedes contactar con ${company.name} en ${company.contactEmail}, en el telefono ${company.phone} o desde el formulario de contacto de la web.\n\nDireccion indicada en la web: ${company.address}.`,
    actions: [
      { label: "Abrir formulario", value: company.contactUrl, variant: "primary" },
      { label: "Pedir presupuesto", value: "quiero pedir presupuesto", variant: "secondary" }
    ]
  };
}

function unknownResponse(): AssistantResponse {
  return {
    text: `${kb.assistant.fallback}\n\nPara orientarte, dime si buscas una proteccion temporal de obra, una solucion permanente para cubierta/terraza, una base o casquillo, auxiliares de instalacion o consumibles.`,
    actions: [
      ...categoryActions,
      { label: "Presupuesto", value: "quiero pedir presupuesto", variant: "primary" }
    ]
  };
}

function bestCategoryMatch(message: string): ProductCategory | undefined {
  const ranked = kb.categories
    .map((category) => ({
      category,
      score: category.keywords.reduce((total, keyword) => {
        return message.includes(normalize(keyword)) ? total + 1 : total;
      }, 0)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0].category : undefined;
}

function bestFaqMatch(message: string): FaqItem | undefined {
  const ranked = kb.faqs
    .map((faq) => ({
      faq,
      score: faq.keywords.reduce((total, keyword) => {
        return message.includes(normalize(keyword)) ? total + 1 : total;
      }, 0)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 1 ? ranked[0].faq : undefined;
}

function startsWithCategoryCommand(message: string): boolean {
  return message.startsWith("categoria:");
}

function getCategoryFromCommand(message: string): ProductCategory | undefined {
  const categoryId = message.replace("categoria:", "") as CategoryId;
  return kb.categories.find((category) => category.id === categoryId);
}

function containsAny(message: string, keywords: string[]): boolean {
  return keywords.some((keyword) => message.includes(normalize(keyword)));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}
