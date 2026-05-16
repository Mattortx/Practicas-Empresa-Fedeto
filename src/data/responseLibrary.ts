import type { AIProductFamily } from "../types/ai";
import type { FlowId, LeadFieldId, TechnicalRiskFlag } from "../types/commercialCopilot";

export const privacyNotice =
  "Los datos introducidos se utilizarán únicamente para preparar una solicitud comercial en esta demo. No introduzca información sensible. La solución definitiva deberá ser revisada por el equipo técnico de la empresa.";

export const technicalGuardrail =
  "Puedo orientar de forma general, pero no confirmo normativa, certificados, ensayos, resistencias, cálculos ni instrucciones de montaje. Para confirmar la solución adecuada, el equipo técnico debe revisar soporte, uso previsto y documentación oficial.";

const familyOrientationResponses: Record<AIProductFamily, string[]> = {
  proteccion_provisional: [
    "Por lo que indicas, la consulta encaja inicialmente con protección provisional de borde. Conviene concretar soporte, posibilidad de perforación, longitud aproximada y urgencia antes de derivarla.",
    "Esta necesidad parece temporal y vinculada a una fase de obra o mantenimiento. El siguiente paso es recoger datos de soporte, borde a proteger y alcance aproximado.",
    "La lectura comercial inicial apunta a protección provisional. No voy a definir una solución técnica cerrada, pero sí puedo estructurar la consulta para revisión comercial y técnica."
  ],
  proteccion_definitiva: [
    "La necesidad parece orientada a protección definitiva. Para avanzar de forma prudente hay que conocer entorno, tipo de soporte, si se puede fijar y si existe documentación de la zona.",
    "Esta consulta encaja con una solución permanente para mantenimiento o uso recurrente. La validación final debe apoyarse en soporte, uso previsto y documentación técnica.",
    "Inicialmente lo trataría como protección definitiva de borde. Conviene distinguir si hablamos de cubierta, terraza técnica, pasillo técnico o zona industrial."
  ],
  bases_casquillos: [
    "La consulta apunta a bases, casquillos o elementos de fijación. Para responder mejor conviene identificar tipo de pieza, soporte, cantidad aproximada y compatibilidad con el sistema existente.",
    "Parece una necesidad de fijación o alojamiento. Es importante saber si se busca base, casquillo recto, casquillo acodado, anclaje o una pieza especial.",
    "La orientación comercial inicial es elementos de fijación. Recogeré referencias, cantidades y soporte para que el equipo pueda revisar compatibilidad."
  ],
  auxiliares: [
    "Parece una consulta de auxiliares para construcción o mantenimiento. Puedo ayudar a concretar producto, uso previsto, cantidad y urgencia de suministro.",
    "La necesidad encaja con material auxiliar o reposición. Conviene identificar si es instalación nueva, mantenimiento, sustitución o suministro puntual.",
    "Lo trataría como consulta de auxiliares. Para preparar una respuesta útil necesito producto, cantidad, uso y ubicación aproximada."
  ],
  consumibles: [
    "La consulta encaja con consumibles o recambios. Para prepararla bien interesa recoger referencia, cantidad, uso previsto y ubicación aproximada.",
    "Parece una solicitud de suministro o reposición. Lo más útil es concretar artículo, cantidad, urgencia y si se trata de compra puntual o recurrente.",
    "La lectura comercial apunta a consumibles. El copiloto puede ordenar la solicitud sin confirmar referencias definitivas hasta que el equipo las revise."
  ],
  solucion_medida: [
    "La necesidad parece singular o adaptada. La cualificación debe recoger problema principal, restricciones del soporte, documentación disponible y plazo aproximado.",
    "Esta consulta puede requerir solución a medida. Conviene recopilar contexto de obra, restricciones, fotos o planos y objetivo de plazo.",
    "Lo trataría como caso singular. El copiloto solo prepara la ficha inicial; la propuesta debe revisarla el equipo técnico/comercial."
  ],
  documentacion_normativa: [
    "La consulta debe tratarse como documentación o normativa. Puedo recogerla y derivarla, pero no confirmar cumplimiento, ensayos, montaje ni cálculos desde el chat.",
    "Este tema requiere prudencia técnica. No puedo sustituir fichas, certificados ni revisión competente, pero puedo preparar una solicitud documentada.",
    "Para cuestiones normativas o técnicas, el copiloto solo orienta la entrada comercial y marca revisión técnica necesaria."
  ],
  desconocida: [
    "Todavía no hay datos suficientes para fijar una familia. Puedo hacer unas preguntas breves para distinguir si la solución es temporal, permanente, de suministro o a medida.",
    "La consulta es ambigua por ahora. La mejor opción es seguir un flujo de orientación para identificar riesgo, entorno, duración y objetivo comercial.",
    "No forzaré una clasificación con poca información. Primero conviene aclarar dónde está el riesgo y si se busca compra, presupuesto o asesoramiento."
  ]
};

const familyNextQuestions: Record<AIProductFamily, string[]> = {
  proteccion_provisional: [
    "¿El borde a proteger es forjado, cubierta, muro, canto de forjado u otro soporte?",
    "¿Se puede perforar o fijar al soporte, o hay que evitarlo?",
    "Qué longitud aproximada hay que proteger y con qué urgencia?"
  ],
  proteccion_definitiva: [
    "Se puede fijar al soporte o necesita una solución sin perforación directa?",
    "La instalación es cubierta, terraza técnica, pasillo técnico, zona industrial u otro entorno?",
    "La protección será para mantenimiento recurrente o acceso puntual?"
  ],
  bases_casquillos: [
    "Busca base, casquillo recto, casquillo acodado, anclaje o fijación especial?",
    "Sobre qué soporte se instalaría la base, casquillo o fijación: hormigón, metal, muro, forjado u otro?",
    "¿Dispone de referencia, cantidad aproximada o sistema compatible?"
  ],
  auxiliares: [
    "Qué producto auxiliar necesita y en qué cantidad aproximada?",
    "El uso previsto es instalación nueva, mantenimiento, reposición o suministro puntual?",
    "¿La entrega se necesita de forma urgente o puede programarse?"
  ],
  consumibles: [
    "Qué consumible o recambio busca y con qué cantidad aproximada?",
    "Tiene referencia del producto o descripción del recambio?",
    "La compra sería puntual, recurrente o para reposición de obra?"
  ],
  solucion_medida: [
    "Dispone de planos, mediciones o fotografías para una revisión posterior?",
    "Cuál es la restricción principal del soporte o del entorno?",
    "La necesidad es adaptar un sistema existente o estudiar una solución específica?"
  ],
  documentacion_normativa: [
    "Puede indicar el producto o sistema sobre el que necesita documentación?",
    "La duda está relacionada con normativa, ficha técnica, montaje, anclaje, resistencia o certificación?",
    "Dispone de referencia de producto o documentación previa para que el equipo la revise?"
  ],
  desconocida: [
    "La solución debe ser temporal durante obra o permanente para mantenimiento?",
    "Dónde está el riesgo: cubierta, borde de forjado, terraza, nave, puente, silo u otro entorno?",
    "Busca compra, presupuesto, documentación o asesoramiento inicial?"
  ]
};

const commercialResponses = {
  requiredField: [
    "Necesito este dato para preparar un resumen comercial útil.",
    "Este dato ayuda a que la solicitud llegue al equipo con contexto suficiente.",
    "Para dejar la ficha bien preparada, conviene completar este punto."
  ],
  ambiguousLocal: [
    "Para orientar bien la consulta necesito clasificar la necesidad. El modo local está activo, así que continúo con los flujos controlados.",
    "La consulta necesita algo más de contexto. En modo local, lo más seguro es usar un flujo guiado.",
    "No voy a forzar una clasificación con poca información. Podemos seguir por presupuesto, orientación general o documentación técnica."
  ],
  copyError: [
    "No he podido copiar automáticamente. Puedes seleccionar el resumen manualmente.",
    "El navegador no ha permitido copiar el texto. El resumen queda visible para seleccionarlo manualmente.",
    "No se ha podido usar el portapapeles en este momento. La ficha sigue disponible en pantalla."
  ],
  summaryReady: [
    "Solicitud comercial preparada.",
    "Ficha comercial generada para revisión interna.",
    "Consulta cualificada y lista para revisar en el panel interno."
  ],
  localFallback: [
    "Fallback local aplicado: usando reglas de demo y flujos controlados.",
    "Modo local activo: continúo con respuestas controladas y sin depender de IA externa.",
    "IA no disponible o desactivada: el copiloto mantiene la cualificación mediante reglas locales."
  ],
  aiValidated: [
    "Clasificación automática generada con IA asistida y validación local.",
    "Análisis asistido por IA aplicado; las reglas de seguridad siguen activas.",
    "IA asistida utilizada para interpretar la consulta, manteniendo flujos controlados."
  ]
} satisfies Record<string, string[]>;

const fieldSupportResponses: Partial<Record<LeadFieldId, string[]>> = {
  location: [
    "La ubicación ayuda a ordenar la consulta comercial y valorar proximidad, obra o posible gestión de suministro.",
    "No hace falta una dirección exacta para la demo; con localidad o provincia es suficiente."
  ],
  canDrill: [
    "Este dato es clave para no orientar la consulta hacia una solución que después no encaje con el soporte.",
    "La posibilidad de fijación o perforación condiciona la revisión técnica posterior."
  ],
  approximateLength: [
    "La longitud no se usa aquí para calcular una solución, sino para dimensionar comercialmente la consulta y valorar su alcance.",
    "Una longitud aproximada permite estimar el volumen de la oportunidad sin hacer cálculos técnicos."
  ],
  quantity: [
    "La cantidad ayuda a priorizar la respuesta comercial y preparar una estimación de suministro.",
    "No hace falta que sea exacta; una cantidad orientativa mejora mucho la ficha comercial."
  ],
  documentationAvailable: [
    "Planos, fotografías o mediciones ayudan al equipo a revisar el caso sin que el copiloto tenga que inventar detalles.",
    "Si hay documentación, conviene indicarlo para que la solicitud quede marcada como revisable técnicamente."
  ],
  observations: [
    "Las observaciones sirven para añadir restricciones, accesos, referencias o documentación disponible.",
    "Incluye solo contexto útil de obra o suministro; no introduzcas información sensible en la demo."
  ]
};

const situationalResponses = [
  {
    id: "sin-perforacion",
    keywords: ["no se puede perforar", "sin perforar", "autoportante", "sin fijación"],
    response:
      "Detecto una restricción de perforación o fijación. Lo trataré con prudencia y lo marcaré como dato relevante para revisión técnica."
  },
  {
    id: "cubierta",
    keywords: ["cubierta", "tejado", "terraza técnica", "terraza"],
    response:
      "Al mencionar cubierta o terraza, conviene revisar entorno, acceso, uso previsto y documentación antes de confirmar cualquier solución."
  },
  {
    id: "urgencia",
    keywords: ["urgente", "esta semana", "lo antes posible", "obra activa", "ya en obra"],
    response:
      "La urgencia puede elevar la prioridad comercial, especialmente si la obra ya está activa o hay una necesidad inmediata."
  },
  {
    id: "volumen",
    keywords: ["metros", "unidades", "200", "100", "gran cantidad", "varias obras"],
    response:
      "Hay indicios de volumen o alcance. Recogeré cantidad o longitud para que el equipo valore prioridad y respuesta comercial."
  },
  {
    id: "no-sabe",
    keywords: ["no sé qué necesito", "no lo tengo claro", "no sé exactamente", "orientar"],
    response:
      "La consulta parece de orientación inicial. Empezare por distinguir duración, zona de riesgo, fijación posible y objetivo comercial."
  }
];

export function getFamilyOrientationResponse(family: AIProductFamily, seed = "") {
  return pickControlledResponse(familyOrientationResponses[family], seed);
}

export function getFamilyNextQuestion(family: AIProductFamily, seed = "") {
  return pickControlledResponse(familyNextQuestions[family], seed);
}

export function getCommercialResponse(key: keyof typeof commercialResponses, seed = "") {
  return pickControlledResponse(commercialResponses[key], seed);
}

export function getTechnicalSensitiveReply(flags: TechnicalRiskFlag[] = []) {
  const suffix = flags.length > 0 ? ` Señales detectadas: ${flags.join(", ")}.` : "";

  return `No puedo confirmar ese extremo ni sustituir una revisión técnica. Puedo recoger la consulta para que el equipo competente la revise.${suffix}`;
}

export function getContextualPromptNotes(
  flowId: FlowId,
  field: LeadFieldId,
  draftText: string,
  flags: TechnicalRiskFlag[]
) {
  const notes = [...(fieldSupportResponses[field] ? [pickControlledResponse(fieldSupportResponses[field], draftText)] : [])];
  const normalized = normalize(draftText);

  if (field === "canDrill" && (normalized.includes("cubierta") || normalized.includes("terraza"))) {
    notes.push(
      "Cómo se ha mencionado una cubierta o terraza, este dato es importante para no proponer una orientación técnica cerrada sin revisar el soporte."
    );
  }

  if (field === "observations" && flags.length > 0) {
    notes.push(
      "La consulta incluye elementos técnicos sensibles; añade solo contexto de obra, referencias o documentación disponible, sin datos sensibles."
    );
  }

  if (field === "documentationAvailable" && flowId === "medida") {
    notes.push(
      "En soluciones a medida, la documentación disponible suele ser determinante para que el equipo revise la viabilidad."
    );
  }

  return Array.from(new Set(notes)).slice(0, 2);
}

export function getSituationalResponses(text: string) {
  const normalized = normalize(text);

  return situationalResponses
    .filter((item) => item.keywords.some((keyword) => normalized.includes(normalize(keyword))))
    .map((item) => item.response);
}

function pickControlledResponse(options: string[], seed = "") {
  if (options.length === 0) {
    return "";
  }

  const hash = Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0);
  return options[hash % options.length];
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
