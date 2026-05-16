import type { ConversationFlow, FlowId } from "../types/commercialCopilot";

const contactSteps = [
  {
    id: "name",
    field: "name",
    prompt: "Para preparar la solicitud, indica tu nombre y apellidos.",
    placeholder: "Nombre y apellidos",
    required: true
  },
  {
    id: "company",
    field: "company",
    prompt: "Indica la empresa o entidad que realiza la consulta.",
    placeholder: "Empresa",
    required: true
  },
  {
    id: "email",
    field: "email",
    prompt: "¿A qué correo puede responder el equipo comercial?",
    placeholder: "correo@empresa.com",
    required: true
  },
  {
    id: "phone",
    field: "phone",
    prompt: "Si quieres, deja un teléfono para agilizar el contacto.",
    placeholder: "Teléfono",
    required: false
  }
] as const;

export const conversationFlows: ConversationFlow[] = [
  {
    id: "provisional",
    label: "Necesito protección provisional de borde",
    productFamily: "provisional",
    needType: "Protección provisional de borde",
    intro:
      "Vamos a cualificar una consulta de protección provisional. No calcularé la solución: prepararé un resumen para revisión comercial y técnica.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "¿¿Qué tipo de obra es? Por ejemplo edificación, cubierta, nave, puente, silo o mantenimiento.",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Cuál es la ubicación aproximada de la obra?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "supportType",
        field: "supportType",
        prompt: "¿El soporte principal es forjado, cubierta, muro, canto de forjado u otro?",
        placeholder: "Tipo de soporte",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "¿¿Se puede perforar o fijar al soporte, o conviene evitar perforaciones?",
        placeholder: "Se puede perforar / no se puede / no lo sé",
        required: true
      },
      {
        id: "approximateLength",
        field: "approximateLength",
        prompt: "Qué longitud aproximada hay que proteger?",
        placeholder: "Ej. 80 metros",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene la consulta?",
        placeholder: "Alta / media / baja / fecha aproximada",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade cualquier observación útil: restricciones, acceso, documentación disponible o cantidades.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La protección provisional debe revisarse según soporte, uso previsto y documentación técnica aplicable.",
      "El copiloto no confirma montaje, resistencia ni cumplimiento normativo."
    ],
    nextAction: "Derivar al equipo comercial con revisión técnica inicial."
  },
  {
    id: "definitiva",
    label: "Necesito protección definitiva de borde",
    productFamily: "definitiva",
    needType: "Protección definitiva de borde",
    intro:
      "Vamos a preparar una consulta de protección definitiva. La solución final debe validarse con información del soporte y documentación técnica.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "Qué tipo de instalación es: cubierta, terraza técnica, pasillo técnico, zona industrial, edificio residencial u otro?",
        placeholder: "Tipo de instalación",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "Confirmas que se busca una solución permanente?",
        placeholder: "Sí / no / no lo sé",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "Se puede fijar al soporte o se necesita una solución autoportante?",
        placeholder: "Fijada / autoportante / por definir",
        required: true
      },
      {
        id: "environment",
        field: "environment",
        prompt: "¿Cómo es el entorno: industrial, residencial, exterior agresivo, zona húmeda o mantenimiento?",
        placeholder: "Entorno",
        required: true
      },
      {
        id: "approximateLength",
        field: "approximateLength",
        prompt: "Qué longitud aproximada requiere protección?",
        placeholder: "Ej. 120 metros",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Dónde se encuentra la instalación?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene la consulta?",
        placeholder: "Alta / media / baja / fecha aproximada",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade detalles relevantes: tipo de soporte, uso, restricciones o documentación disponible.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "La solución definitiva debe validarse por personal competente.",
      "No se realizan cálculos estructurales automáticos ni confirmación normativa desde el copiloto."
    ],
    nextAction: "Solicitar revisión técnica y propuesta comercial."
  },
  {
    id: "bases-casquillos",
    label: "Busco bases o casquillos",
    productFamily: "bases-casquillos",
    needType: "Bases, casquillos o elementos de fijación",
    intro:
      "Vamos a identificar la necesidad de fijación o alojamiento para que el equipo comercial pueda responder con más precisión.",
    steps: [
      {
        id: "supportType",
        field: "supportType",
        prompt: "Sobre qué tipo de soporte se instalaría?",
        placeholder: "Hormigón, metal, muro, forjado u otro",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "¿El uso previsto es provisional o definitivo?",
        placeholder: "Provisional / definitivoSí / no lo sé",
        required: true
      },
      {
        id: "needType",
        field: "needType",
        prompt: "Qué necesitas principalmente: base, casquillo recto, casquillo acodado, anclaje o fijación especial?",
        placeholder: "Necesidad principal",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "¿Cantidad aproximada?",
        placeholder: "Ej. 50 unidades",
        required: true
      },
      {
        id: "project",
        field: "project",
        prompt: "¿Hay un proyecto u obra asociada?",
        placeholder: "Nombre o tipo de proyecto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene el suministro o la respuesta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade referencias, compatibilidades o restricciones si las conoces.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La compatibilidad con el sistema existente debe confirmarse con referencias o documentación técnica.",
      "El copiloto no valida instrucciones de montaje."
    ],
    nextAction: "Revisar compatibilidad y preparar respuesta comercial."
  },
  {
    id: "auxiliares",
    label: "Busco auxiliares para construcción",
    productFamily: "auxiliares",
    needType: "Auxiliares para construcción",
    intro:
      "Vamos a preparar una consulta de auxiliares para identificar producto, uso y urgencia de suministro.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "¿Qué tipo de producto auxiliar buscas?",
        placeholder: "Producto auxiliar",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "¿Cantidad aproximada?",
        placeholder: "Cantidad",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "Uso previsto: instalación nueva, mantenimiento, reposición o suministro puntual?",
        placeholder: "Uso previsto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Dónde se entregaría o utilizaría aproximadamente?",
        placeholder: "Localidad o provincia",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade referencias, medidas o notas de compatibilidad si las tienes.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "Las referencias y compatibilidades deben confirmarse antes de suministro definitivo."
    ],
    nextAction: "Preparar respuesta comercial de suministro."
  },
  {
    id: "consumibles",
    label: "Busco consumibles",
    productFamily: "consumibles",
    needType: "Consumibles o recambios",
    intro:
      "Vamos a preparar una consulta de consumibles o recambios con cantidad, uso y urgencia.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "¿Qué consumible o recambio buscas?",
        placeholder: "Producto buscado",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "¿Cantidad aproximada?",
        placeholder: "Cantidad",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "Uso previsto: suministro puntual, mantenimiento, reposición o compra recurrente?",
        placeholder: "Uso previsto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicación aproximada de la obra o entrega?",
        placeholder: "Localidad o provincia",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade referencias o compatibilidades si las conoces.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "Las cantidades y referencias deben validarse antes de confirmar suministro."
    ],
    nextAction: "Preparar respuesta comercial de consumibles."
  },
  {
    id: "medida",
    label: "Necesito una solución a medida",
    productFamily: "medida",
    needType: "Solución a medida u obra singular",
    intro:
      "Vamos a documentar una necesidad singular. Este tipo de consulta requiere revisión técnica personalizada.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "¿Qué tipo de obra o instalación es?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "customProblem",
        field: "customProblem",
        prompt: "Cuál es el problema principal que debe resolver la solución?",
        placeholder: "Problema principal",
        required: true
      },
      {
        id: "supportType",
        field: "supportType",
        prompt: "¿Qué restricciones tiene el soporte o la zona de instalación?",
        placeholder: "Restricciones",
        required: true
      },
      {
        id: "documentationAvailable",
        field: "documentationAvailable",
        prompt: "Hay planos, mediciones, fotografías o documentación disponible?",
        placeholder: "Sí / no / pendiente",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicación aproximada?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "expectedDeadline",
        field: "expectedDeadline",
        prompt: "¿Plazo aproximado o fecha objetivo?",
        placeholder: "Plazo",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene la consulta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade cualquier condición de obra, acceso, uso o restricción técnica relevante.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "Las soluciones a medida requieren revisión técnica personalizada.",
      "El copiloto no propone cálculos, ensayos ni instrucciones definitivas."
    ],
    nextAction: "Derivar a revisión técnica personalizada y contacto comercial."
  },
  {
    id: "desconocido",
    label: "No sé exactamente qué necesito",
    needType: "Necesidad por determinar",
    intro:
      "Haré unas preguntas breves para orientar la consulta hacia una familia comercial probable.",
    steps: [
      {
        id: "customProblem",
        field: "customProblem",
        prompt: "Qué riesgo o problema quieres resolver?",
        placeholder: "Riesgo o problema",
        required: true
      },
      {
        id: "riskLocation",
        field: "riskLocation",
        prompt: "Dónde se encuentra el riesgo: cubierta, borde de forjado, terraza, puente, silo, instalación industrial, mantenimiento u otro?",
        placeholder: "Ubicación del riesgo",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "La solución debe ser temporal o permanente?",
        placeholder: "Temporal / permanenteSí / no lo sé",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "¿Se puede perforar o fijar al soporte?",
        placeholder: "Sí / no / no lo sé",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "¿Buscas compra, asesoramiento o presupuesto?",
        placeholder: "Compra / asesoramiento / presupuesto",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicación aproximada?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade cualquier dato que pueda ayudar a orientar la familia de producto.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La familia propuesta es orientativa y debe validarse con el equipo comercial/técnico."
    ],
    nextAction: "Revisar la necesidad y confirmar familia comercial adecuada."
  },
  {
    id: "documentacion",
    label: "Tengo una duda sobre documentación o normativa",
    needType: "Documentación, normativa o consulta técnica sensible",
    intro:
      "Puedo orientar la consulta, pero no confirmar cumplimiento normativo específico sin ficha técnica y revisión del producto.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "Sobre qué producto, sistema o familia necesitas documentación?",
        placeholder: "Producto o sistema",
        required: true
      },
      {
        id: "observations",
        field: "observations",
        prompt: "Describe la duda: normativa, certificación, ficha técnica, montaje, resistencia o cálculo.",
        placeholder: "Duda técnica",
        required: true
      },
      {
        id: "workType",
        field: "workType",
        prompt: "En qué tipo de obra o instalación se aplicaría?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicación aproximada de la obra o consulta?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene la respuesta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "No se confirma cumplimiento normativo desde el copiloto.",
      "La respuesta debe apoyarse en documentación técnica oficial y revisión del equipo competente."
    ],
    nextAction: "Derivar al equipo técnico para respuesta documentada."
  },
  {
    id: "presupuesto",
    label: "Quiero solicitar presupuesto",
    needType: "Solicitud de presupuesto",
    intro:
      "Prepararé una solicitud comercial inicial. Si no tienes todos los datos, deja constancia de lo que falte.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "Qué necesitas presupuestar?",
        placeholder: "Necesidad principal",
        required: true
      },
      {
        id: "productFamily",
        field: "productFamily",
        prompt: "Con qué familia lo relacionarías: provisional, definitiva, bases/casquillos, auxiliares, consumibles o medida?",
        placeholder: "Familia de producto",
        required: true
      },
      {
        id: "workType",
        field: "workType",
        prompt: "Tipo de obra o instalación?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicación aproximada?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "Cantidad o longitud aproximada, si la conoces.",
        placeholder: "Cantidad o longitud",
        required: false
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Qué urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Añade cualquier detalle adicional para el equipo comercial.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "El presupuesto definitivo puede requerir revisión técnica y documentación adicional."
    ],
    nextAction: "Contactar comercialmente y solicitar datos técnicos si faltan."
  }
];

export function getConversationFlow(id: FlowId) {
  return conversationFlows.find((flow) => flow.id === id);
}
