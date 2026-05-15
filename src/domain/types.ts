export type KnowledgeSource = "real" | "demo";

export type CategoryId =
  | "provisional"
  | "definitiva"
  | "bases"
  | "auxiliares"
  | "consumibles";

export interface CompanyInfo {
  name: string;
  summary: string;
  contactEmail: string;
  phone: string;
  address: string;
  website: string;
  contactUrl: string;
  privacyUrl: string;
}

export interface ProductCategory {
  id: CategoryId;
  label: string;
  shortLabel: string;
  description: string;
  useCases: string[];
  discoveryQuestions: string[];
  keywords: string[];
  source: KnowledgeSource;
  link?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  source: KnowledgeSource;
}

export interface KnowledgeBase {
  company: CompanyInfo;
  dataPolicy: {
    demoNotice: string;
    personalDataNotice: string;
    simulatedDataNotice: string;
  };
  assistant: {
    welcome: string;
    fallback: string;
    normativeGuardrail: string;
    technicalLimit: string;
  };
  categories: ProductCategory[];
  faqs: FaqItem[];
  sources: Array<{
    title: string;
    url: string;
    source: KnowledgeSource;
  }>;
}

export interface ChatAction {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "warning";
}

export interface AssistantResponse {
  text: string;
  actions?: ChatAction[];
  suggestedNeed?: string;
  startLead?: boolean;
}
