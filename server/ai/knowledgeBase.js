export const knowledgeBase = [
  {
    id: "empresa",
    title: "Actividad de Protecciones Toledo",
    content:
      "Protecciones Toledo trabaja con sistemas metalicos de proteccion colectiva e individual para trabajos en altura, incluyendo proteccion de borde, bases, casquillos, auxiliares, consumibles y soluciones adaptadas a obra."
  },
  {
    id: "familias",
    title: "Familias comerciales",
    content:
      "Familias de la demo: proteccion provisional de borde, proteccion definitiva de borde, bases y casquillos, auxiliares para la construccion, consumibles y soluciones a medida."
  },
  {
    id: "presupuesto",
    title: "Informacion util para presupuesto",
    content:
      "Para preparar una consulta comercial conviene indicar tipo de obra, ubicacion aproximada, soporte, posibilidad de fijacion o perforacion, longitud o cantidad, urgencia y datos de contacto."
  },
  {
    id: "limitaciones",
    title: "Limitaciones tecnicas",
    content:
      "El copiloto no realiza calculos estructurales, no confirma normativa ni certificaciones y no sustituye la revision del equipo tecnico de la empresa."
  },
  {
    id: "privacidad",
    title: "Privacidad de la demo",
    content:
      "En esta prueba de concepto las solicitudes se guardan localmente o de forma simulada. No debe introducirse informacion sensible."
  }
];

export function compactKnowledgeBase() {
  return knowledgeBase.map((item) => `- ${item.title}: ${item.content}`).join("\n");
}
