export const knowledgeBase = [
  {
    id: "empresa",
    title: "Que hace Protecciones Toledo",
    content:
      "Protecciones Toledo trabaja con sistemas metalicos de proteccion colectiva e individual para trabajos en altura, especialmente proteccion de borde, bases, casquillos, auxiliares, consumibles y soluciones adaptadas a obra."
  },
  {
    id: "familias",
    title: "Familias de producto",
    content:
      "La demo contempla proteccion provisional de borde, proteccion definitiva de borde, bases y casquillos, auxiliares para la construccion, consumibles y soluciones a medida."
  },
  {
    id: "presupuesto",
    title: "Datos utiles para presupuesto",
    content:
      "Conviene aportar tipo de obra, ubicacion, soporte, posibilidad de perforacion o fijacion, longitud o cantidad, urgencia y datos de contacto."
  },
  {
    id: "revision-tecnica",
    title: "Casos con revision tecnica",
    content:
      "Las consultas sobre normativa, certificacion, montaje, resistencia, calculos, anclajes o cumplimiento deben derivarse a revision tecnica."
  },
  {
    id: "privacidad",
    title: "Privacidad en demo",
    content:
      "Las solicitudes se conservan localmente o como datos simulados. No se debe introducir informacion sensible."
  }
];

export function answerWithLocalKnowledgeBase(question: string) {
  const normalized = normalize(question);
  const matched = knowledgeBase.find((item) =>
    normalize(`${item.title} ${item.content}`).includes(normalized.slice(0, 18))
  );

  if (matched) {
    return matched.content;
  }

  return knowledgeBase.map((item) => `${item.title}: ${item.content}`).join("\n");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
