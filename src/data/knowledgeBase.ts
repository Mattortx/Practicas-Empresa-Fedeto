export const knowledgeBase = [
  {
    id: "empresa",
    title: "Qué hace Protecciones Toledo",
    content:
      "Protecciones Toledo trabaja con sistemas metálicos de protección colectiva e individual para trabajos en altura, especialmente protección de borde, bases, casquillos, auxiliares, consumibles y soluciones adaptadas a obra."
  },
  {
    id: "familias",
    title: "Familias de producto",
    content:
      "La demo contempla protección provisional de borde, protección definitiva de borde, bases y casquillos, auxiliares para la construcción, consumibles y soluciones a medida."
  },
  {
    id: "presupuesto",
    title: "Datos útiles para presupuesto",
    content:
      "Conviene aportar tipo de obra, ubicación, soporte, posibilidad de perforación o fijación, longitud o cantidad, urgencia y datos de contacto."
  },
  {
    id: "revision-tecnica",
    title: "Casos con revisión técnica",
    content:
      "Las consultas sobre normativa, certificación, montaje, resistencia, cálculos, anclajes o cumplimiento deben derivarse a revisión técnica."
  },
  {
    id: "privacidad",
    title: "Privacidad en demo",
    content:
      "Las solicitudes se conservan localmente o como datos simulados. No se debe introducir información sensible."
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
