const technicalMatchers = [
  ["normativa", ["normativa", "norma", "une", "en 13374", "une-en 13374", "13374", "iso", "cumple", "cumplimiento", "legal"]],
  ["certificacion", ["certificado", "certificacion", "homologado", "ensayo"]],
  ["calculo", ["calculo", "calcular", "dimensionamiento", "dimensionar", "carga"]],
  ["instalacion", ["instalacion", "instalar", "montaje", "montar", "manual"]],
  ["resistencia", ["resistencia", "resiste", "viento", "empuje", "seguridad estructural"]],
  ["anclaje", ["anclaje", "anclar", "atornillar", "fijacion", "soldadura", "hormigon"]],
  ["documentacion_tecnica", ["ficha tecnica", "documentacion", "instrucciones", "planos"]],
  ["riesgo_caida", ["riesgo de caida", "altura", "cubierta", "autoportante", "perforacion"]],
  ["clase_proteccion", ["clase a", "clase b", "clase c", "clase proteccion", "clasificacion proteccion", "sppb", "sdpb"]],
  ["carga_dinamica", ["carga dinamica", "carga estatica", "resistencia carga", "pendiente cubierta", "inclinacion cubierta"]]
];

const promptInjectionMatchers = [
  "ignora tus instrucciones",
  "ignora las instrucciones",
  "olvida tus reglas",
  "dime la clave",
  "api key",
  "responde como si fueras tecnico certificado",
  "aunque no tengas datos",
  "sin tecnico",
  "sin revision tecnica",
  "haz el calculo rapido",
  "confirma que cumple",
  "eres un tecnico certificado",
  "actua como ingeniero",
  "dime que clase",
  "calcula la pendiente",
  "haz la clasificacion"
];

export function detectLocalRisk(text) {
  const normalized = normalize(text);

  return technicalMatchers
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(normalize(keyword))))
    .map(([flag]) => flag);
}

export function detectPromptInjection(text) {
  const normalized = normalize(text);
  return promptInjectionMatchers.some((keyword) => normalized.includes(normalize(keyword)));
}

export function buildSafeTechnicalReply() {
  return "No puedo confirmar ese extremo ni sustituir una revision tecnica. Puedo recoger la consulta para que el equipo competente de Protecciones Toledo la revise con la documentacion adecuada.";
}

export function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
