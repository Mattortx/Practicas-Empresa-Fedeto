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
    prompt: "A que correo puede responder el equipo comercial?",
    placeholder: "correo@empresa.com",
    required: true
  },
  {
    id: "phone",
    field: "phone",
    prompt: "Si quieres, deja un telefono para agilizar el contacto.",
    placeholder: "Telefono",
    required: false
  }
] as const;

export const conversationFlows: ConversationFlow[] = [
  {
    id: "provisional",
    label: "Necesito proteccion provisional de borde",
    productFamily: "provisional",
    needType: "Proteccion provisional de borde",
    intro:
      "Vamos a cualificar una consulta de proteccion provisional. No calculare la solucion: preparare un resumen para revision comercial y tecnica.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "Que tipo de obra es? Por ejemplo edificacion, cubierta, nave, puente, silo o mantenimiento.",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Cual es la ubicacion aproximada de la obra?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "supportType",
        field: "supportType",
        prompt: "El soporte principal es forjado, cubierta, muro, canto de forjado u otro?",
        placeholder: "Tipo de soporte",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "Se puede perforar o fijar al soporte, o conviene evitar perforaciones?",
        placeholder: "Se puede perforar / no se puede / no lo se",
        required: true
      },
      {
        id: "approximateLength",
        field: "approximateLength",
        prompt: "Que longitud aproximada hay que proteger?",
        placeholder: "Ej. 80 metros",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene la consulta?",
        placeholder: "Alta / media / baja / fecha aproximada",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade cualquier observacion util: restricciones, acceso, documentacion disponible o cantidades.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La proteccion provisional debe revisarse segun soporte, uso previsto y documentacion tecnica aplicable.",
      "El copiloto no confirma montaje, resistencia ni cumplimiento normativo."
    ],
    nextAction: "Derivar al equipo comercial con revision tecnica inicial."
  },
  {
    id: "definitiva",
    label: "Necesito proteccion definitiva de borde",
    productFamily: "definitiva",
    needType: "Proteccion definitiva de borde",
    intro:
      "Vamos a preparar una consulta de proteccion definitiva. La solucion final debe validarse con informacion del soporte y documentacion tecnica.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "Que tipo de instalacion es: cubierta, terraza tecnica, pasillo tecnico, zona industrial, edificio residencial u otro?",
        placeholder: "Tipo de instalacion",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "Confirmas que se busca una solucion permanente?",
        placeholder: "Si / no / no lo se",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "Se puede fijar al soporte o se necesita una solucion autoportante?",
        placeholder: "Fijada / autoportante / por definir",
        required: true
      },
      {
        id: "environment",
        field: "environment",
        prompt: "Como es el entorno: industrial, residencial, exterior agresivo, zona humeda o mantenimiento?",
        placeholder: "Entorno",
        required: true
      },
      {
        id: "approximateLength",
        field: "approximateLength",
        prompt: "Que longitud aproximada requiere proteccion?",
        placeholder: "Ej. 120 metros",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Donde se encuentra la instalacion?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene la consulta?",
        placeholder: "Alta / media / baja / fecha aproximada",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade detalles relevantes: tipo de soporte, uso, restricciones o documentacion disponible.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "La solucion definitiva debe validarse por personal competente.",
      "No se realizan calculos estructurales automaticos ni confirmacion normativa desde el copiloto."
    ],
    nextAction: "Solicitar revision tecnica y propuesta comercial."
  },
  {
    id: "bases-casquillos",
    label: "Busco bases o casquillos",
    productFamily: "bases-casquillos",
    needType: "Bases, casquillos o elementos de fijacion",
    intro:
      "Vamos a identificar la necesidad de fijacion o alojamiento para que el equipo comercial pueda responder con mas precision.",
    steps: [
      {
        id: "supportType",
        field: "supportType",
        prompt: "Sobre que tipo de soporte se instalaria?",
        placeholder: "Hormigon, metal, muro, forjado u otro",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "El uso previsto es provisional o definitivo?",
        placeholder: "Provisional / definitivo / no lo se",
        required: true
      },
      {
        id: "needType",
        field: "needType",
        prompt: "Que necesitas principalmente: base, casquillo recto, casquillo acodado, anclaje o fijacion especial?",
        placeholder: "Necesidad principal",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "Cantidad aproximada?",
        placeholder: "Ej. 50 unidades",
        required: true
      },
      {
        id: "project",
        field: "project",
        prompt: "Hay un proyecto u obra asociada?",
        placeholder: "Nombre o tipo de proyecto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene el suministro o la respuesta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade referencias, compatibilidades o restricciones si las conoces.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La compatibilidad con el sistema existente debe confirmarse con referencias o documentacion tecnica.",
      "El copiloto no valida instrucciones de montaje."
    ],
    nextAction: "Revisar compatibilidad y preparar respuesta comercial."
  },
  {
    id: "auxiliares",
    label: "Busco auxiliares para construccion",
    productFamily: "auxiliares",
    needType: "Auxiliares para construccion",
    intro:
      "Vamos a preparar una consulta de auxiliares para identificar producto, uso y urgencia de suministro.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "Que tipo de producto auxiliar buscas?",
        placeholder: "Producto auxiliar",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "Cantidad aproximada?",
        placeholder: "Cantidad",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "Uso previsto: instalacion nueva, mantenimiento, reposicion o suministro puntual?",
        placeholder: "Uso previsto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Donde se entregaria o utilizaria aproximadamente?",
        placeholder: "Localidad o provincia",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade referencias, medidas o notas de compatibilidad si las tienes.",
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
        prompt: "Que consumible o recambio buscas?",
        placeholder: "Producto buscado",
        required: true
      },
      {
        id: "quantity",
        field: "quantity",
        prompt: "Cantidad aproximada?",
        placeholder: "Cantidad",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "Uso previsto: suministro puntual, mantenimiento, reposicion o compra recurrente?",
        placeholder: "Uso previsto",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicacion aproximada de la obra o entrega?",
        placeholder: "Localidad o provincia",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade referencias o compatibilidades si las conoces.",
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
    label: "Necesito una solucion a medida",
    productFamily: "medida",
    needType: "Solucion a medida u obra singular",
    intro:
      "Vamos a documentar una necesidad singular. Este tipo de consulta requiere revision tecnica personalizada.",
    steps: [
      {
        id: "workType",
        field: "workType",
        prompt: "Que tipo de obra o instalacion es?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "customProblem",
        field: "customProblem",
        prompt: "Cual es el problema principal que debe resolver la solucion?",
        placeholder: "Problema principal",
        required: true
      },
      {
        id: "supportType",
        field: "supportType",
        prompt: "Que restricciones tiene el soporte o la zona de instalacion?",
        placeholder: "Restricciones",
        required: true
      },
      {
        id: "documentationAvailable",
        field: "documentationAvailable",
        prompt: "Hay planos, mediciones, fotografias o documentacion disponible?",
        placeholder: "Si / no / pendiente",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicacion aproximada?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "expectedDeadline",
        field: "expectedDeadline",
        prompt: "Plazo aproximado o fecha objetivo?",
        placeholder: "Plazo",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene la consulta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade cualquier condicion de obra, acceso, uso o restriccion tecnica relevante.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "Las soluciones a medida requieren revision tecnica personalizada.",
      "El copiloto no propone calculos, ensayos ni instrucciones definitivas."
    ],
    nextAction: "Derivar a revision tecnica personalizada y contacto comercial."
  },
  {
    id: "desconocido",
    label: "No se exactamente que necesito",
    needType: "Necesidad por determinar",
    intro:
      "Hare unas preguntas breves para orientar la consulta hacia una familia comercial probable.",
    steps: [
      {
        id: "customProblem",
        field: "customProblem",
        prompt: "Que riesgo o problema quieres resolver?",
        placeholder: "Riesgo o problema",
        required: true
      },
      {
        id: "riskLocation",
        field: "riskLocation",
        prompt: "Donde se encuentra el riesgo: cubierta, borde de forjado, terraza, puente, silo, instalacion industrial, mantenimiento u otro?",
        placeholder: "Ubicacion del riesgo",
        required: true
      },
      {
        id: "solutionDuration",
        field: "solutionDuration",
        prompt: "La solucion debe ser temporal o permanente?",
        placeholder: "Temporal / permanente / no lo se",
        required: true
      },
      {
        id: "canDrill",
        field: "canDrill",
        prompt: "Se puede perforar o fijar al soporte?",
        placeholder: "Si / no / no lo se",
        required: true
      },
      {
        id: "commercialGoal",
        field: "commercialGoal",
        prompt: "Buscas compra, asesoramiento o presupuesto?",
        placeholder: "Compra / asesoramiento / presupuesto",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicacion aproximada?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade cualquier dato que pueda ayudar a orientar la familia de producto.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "La familia propuesta es orientativa y debe validarse con el equipo comercial/tecnico."
    ],
    nextAction: "Revisar la necesidad y confirmar familia comercial adecuada."
  },
  {
    id: "documentacion",
    label: "Tengo una duda sobre documentacion o normativa",
    needType: "Documentacion, normativa o consulta tecnica sensible",
    intro:
      "Puedo orientar la consulta, pero no confirmar cumplimiento normativo especifico sin ficha tecnica y revision del producto.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "Sobre que producto, sistema o familia necesitas documentacion?",
        placeholder: "Producto o sistema",
        required: true
      },
      {
        id: "observations",
        field: "observations",
        prompt: "Describe la duda: normativa, certificacion, ficha tecnica, montaje, resistencia o calculo.",
        placeholder: "Duda tecnica",
        required: true
      },
      {
        id: "workType",
        field: "workType",
        prompt: "En que tipo de obra o instalacion se aplicaria?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicacion aproximada de la obra o consulta?",
        placeholder: "Localidad o provincia",
        required: true
      },
      {
        id: "urgency",
        field: "urgency",
        prompt: "Que urgencia tiene la respuesta?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps
    ],
    technicalReviewRequired: true,
    defaultWarnings: [
      "No se confirma cumplimiento normativo desde el copiloto.",
      "La respuesta debe apoyarse en documentacion tecnica oficial y revision del equipo competente."
    ],
    nextAction: "Derivar al equipo tecnico para respuesta documentada."
  },
  {
    id: "presupuesto",
    label: "Quiero solicitar presupuesto",
    needType: "Solicitud de presupuesto",
    intro:
      "Preparare una solicitud comercial inicial. Si no tienes todos los datos, deja constancia de lo que falte.",
    steps: [
      {
        id: "needType",
        field: "needType",
        prompt: "Que necesitas presupuestar?",
        placeholder: "Necesidad principal",
        required: true
      },
      {
        id: "productFamily",
        field: "productFamily",
        prompt: "Con que familia lo relacionarias: provisional, definitiva, bases/casquillos, auxiliares, consumibles o medida?",
        placeholder: "Familia de producto",
        required: true
      },
      {
        id: "workType",
        field: "workType",
        prompt: "Tipo de obra o instalacion?",
        placeholder: "Tipo de obra",
        required: true
      },
      {
        id: "location",
        field: "location",
        prompt: "Ubicacion aproximada?",
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
        prompt: "Que urgencia tiene?",
        placeholder: "Alta / media / baja",
        required: true
      },
      ...contactSteps,
      {
        id: "observations",
        field: "observations",
        prompt: "Anade cualquier detalle adicional para el equipo comercial.",
        placeholder: "Observaciones",
        required: true
      }
    ],
    defaultWarnings: [
      "El presupuesto definitivo puede requerir revision tecnica y documentacion adicional."
    ],
    nextAction: "Contactar comercialmente y solicitar datos tecnicos si faltan."
  }
];

export function getConversationFlow(id: FlowId) {
  return conversationFlows.find((flow) => flow.id === id);
}
