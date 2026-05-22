export const knowledgeBase = [
  {
    id: "empresa",
    title: "Qué hace Protecciones Toledo",
    content:
      "Protecciones Toledo S.L. — fundada en Turleque (Toledo) — cuenta con más de 29 años de experiencia en fabricación, diseño y suministro de sistemas metálicos de protección colectiva e individual para trabajos en altura. Fabrican con maquinaria industrial pesada y disponen de certificados UNE-EN 13374:2025 (SPPB) y UNE-EN ISO 14122 (SDPB). Su CNAE es 2512 (Fabricación de carpintería metálica). Han mejorado 280 posiciones en el ranking provincial en 2024. Su web cubre obras, mantenimiento, reparación, limpieza, construcción, edificios, puentes, silos e infraestructuras con riesgo de caída."
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
      "Los sistemas provisionales se orientan a protección colectiva temporal durante ejecución de obras, trabajos de mantenimiento o intervenciones puntuales en altura. Productos del catálogo: barandilla contrapesada (sin perforación), balaustre UNE 1200/1500, barandilla 1000/1200/1500/2500, sargento mordaza, mordaza peto, mordaza P4 metálica, mordaza P4 rígida y rodapié. Para cualificar una consulta conviene preguntar por soporte, borde o hueco, posibilidad de fijación, longitud y urgencia. Los sistemas se clasifican según UNE-EN 13374 en clases A, B y C según inclinación y carga."
  },
  {
    id: "proteccion-definitiva",
    title: "Protección definitiva de borde",
    content:
      "La protección definitiva se orienta a seguridad permanente en cubiertas, terrazas, pasillos técnicos y zonas con riesgo de caída. Productos del catálogo: barandillas de acero, barandillas de aluminio autoportante (sin perforación), soporte Z para cubierta de chapa, fijación a suelo, fijación a pared, y sistemas para cubierta de chapa y losa impermeabilizada. Cualquier confirmación normativa o de instalación debe derivarse a revisión técnica."
  },
  {
    id: "bases-casquillos",
    title: "Bases y casquillos atornillables",
    content:
      "La categoría agrupa elementos de anclaje y fijación para sistemas de protección de borde. Catálogo: Base 2, Base 60×40, Base 60×60, perfiles PT, casquillo recto, casquillo acodado corto, casquillo acodado largo y anclaje inox. Para orientar la consulta hay que pedir soporte, uso provisional o definitivo, cantidad, compatibilidad y documentación disponible."
  },
  {
    id: "servicio-tecnico",
    title: "Metodología y revisión",
    content:
      "Protecciones Toledo ofrece análisis técnico de obra, fabricación propia con maquinaria industrial, adaptación al cliente, soluciones personalizadas y documentación técnica. Destaca su política de calidad basada en 29 años de experiencia y metodología de análisis técnico. El copiloto debe preparar una ficha comercial, no sustituir el análisis del equipo técnico."
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
  },
  {
    id: "normativa-clases-une",
    title: "Clases UNE-EN 13374 (A, B, C)",
    content:
      "La norma UNE-EN 13374:2025 clasifica los sistemas de protección de borde en tres clases según inclinación y carga. Clase A: superficies con inclinación hasta 10°, diseñada para cargas estáticas. Clase B: superficies hasta 30° (sin límite de altura de caída) o hasta 60° si la altura de caída es inferior a 2 metros, diseñada para cargas dinámicas ligeras. Clase C: superficies inclinadas entre 30° y 45° (sin límite de altura de caída), o entre 45° y 60° si la altura de caída no supera los 5 metros, diseñada para cargas dinámicas completas."
  },
  {
    id: "auxiliares-especificos",
    title: "Auxiliares — productos específicos",
    content:
      "Dentro de la categoría de auxiliares para la construcción, el catálogo incluye escaleras plegables para trabajos en altura y marquesinas de entrada para protección de accesos. Estos productos complementan los sistemas de protección de borde y se orientan a seguridad integral en obra e instalaciones."
  },
  {
    id: "calidad-empresa",
    title: "Política de calidad y fabricación",
    content:
      "Protecciones Toledo S.L. cuenta con más de 29 años de experiencia en el sector metal. Fabrican con maquinaria industrial pesada en sus instalaciones de Turleque (Toledo). Están certificados bajo UNE-EN 13374:2025 (SPPB — Sistemas de Protección Provisional de Borde) y UNE-EN ISO 14122 (SDPB — Sistemas de Protección Definitiva de Borde). Su metodología combina análisis técnico de cada obra con fabricación propia, lo que permite adaptación al cliente y soluciones personalizadas con documentación técnica."
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
