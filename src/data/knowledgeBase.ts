export const knowledgeBase = [
  {
    id: "empresa",
    title: "Qué hace Protecciones Toledo",
    content:
      "Protecciones Toledo S.L. trabaja en fabricación, diseño y suministro de sistemas metálicos de protección colectiva e individual para trabajos en altura. Su web presenta aplicaciones en obras, mantenimiento, reparación, limpieza, construcción, edificios, puentes, silos e infraestructuras con riesgo de caída."
  },
  {
    id: "familias",
    title: "Familias de producto",
    content:
      "La demo contempla protección provisional de borde, protección definitiva de borde, bases y casquillos atornillables, auxiliares para la construcción, consumibles y soluciones a medida para obras singulares."
  },
  {
    id: "proteccion-provisional",
    title: "Protección provisional de borde",
    content:
      "Los sistemas provisionales se orientan a protección colectiva temporal durante ejecución de obras, trabajos de mantenimiento o intervenciones puntuales en altura. Para cualificar una consulta conviene preguntar por soporte, borde o hueco, posibilidad de fijación, longitud y urgencia."
  },
  {
    id: "proteccion-definitiva",
    title: "Protección definitiva de borde",
    content:
      "La protección definitiva se orienta a seguridad permanente en cubiertas, terrazas, pasillos técnicos y zonas con riesgo de caída. La web menciona soluciones como pasillo técnico, barandillas definitivas de acero, barandillas de aluminio autoportantes, fijación a suelo, soporte Z, cubierta de chapa, losa impermeabilizada y fijación a pared. Cualquier confirmación normativa o de instalación debe derivarse a revisión técnica."
  },
  {
    id: "bases-casquillos",
    title: "Bases y casquillos atornillables",
    content:
      "La categoría agrupa elementos de anclaje y fijación para sistemas de protección de borde. La web menciona perfiles PT, Base 2, casquillo recto, casquillo acodado corto, casquillo acodado largo y anclaje inox. Para orientar la consulta hay que pedir soporte, uso provisional o definitivo, cantidad, compatibilidad y documentación disponible."
  },
  {
    id: "servicio-tecnico",
    title: "Metodología y revisión",
    content:
      "La empresa destaca análisis técnico de obra, fabricación propia, adaptación al cliente, soluciones personalizadas y documentación técnica. El copiloto debe preparar una ficha comercial, no sustituir el análisis del equipo técnico."
  },
  {
    id: "contacto-real",
    title: "Contacto real",
    content:
      "La web pública muestra el correo info@proteccionestoledo.com, teléfono 925 32 80 08 y ubicación en Cam. de Mora, 70, 45789 Turleque, Toledo. En la demo no se envían correos reales automáticamente."
  },
  {
    id: "presupuesto",
    title: "Datos útiles para presupuesto",
    content:
      "Conviene aportar tipo de obra, ubicación, soporte, posibilidad de perforación o fijación, longitud o cantidad, urgencia, documentación disponible y datos de contacto."
  },
  {
    id: "revision-tecnica",
    title: "Casos con revisión técnica",
    content:
      "Las consultas sobre normativa, certificación, montaje, resistencia, cálculos, anclajes, fijación, ensayos, cumplimiento, instrucciones de instalación o documentación técnica deben derivarse a revisión técnica. El asistente no debe confirmar cumplimiento ni dar instrucciones de montaje."
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
