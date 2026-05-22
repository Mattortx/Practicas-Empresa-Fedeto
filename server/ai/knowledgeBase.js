export const knowledgeBase = [
  {
    id: "empresa",
    title: "Actividad de Protecciones Toledo",
    content:
      "Protecciones Toledo S.L. fundada en Turleque (Toledo) cuenta con mas de 29 anos de experiencia en fabricacion, diseno y suministro de sistemas metalicos de proteccion colectiva e individual para trabajos en altura. Fabrican con maquinaria industrial pesada y disponen de certificados UNE-EN 13374:2025 (SPPB) y UNE-EN ISO 14122 (SDPB). Su CNAE es 2512 (Fabricacion de carpinteria metalica). Han mejorado 280 posiciones en el ranking provincial en 2024. Su web cubre obras, mantenimiento, reparacion, limpieza, construccion, edificios, puentes, silos e infraestructuras con riesgo de caida."
  },
  {
    id: "familias",
    title: "Familias comerciales",
    content:
      "Familias de la demo: proteccion provisional de borde, proteccion definitiva de borde, bases y casquillos atornillables, auxiliares para la construccion, consumibles y soluciones a medida para obras singulares."
  },
  {
    id: "proteccion-provisional",
    title: "Proteccion provisional de borde",
    content:
      "Los sistemas provisionales se orientan a proteccion colectiva temporal durante ejecucion de obras, trabajos de mantenimiento o intervenciones puntuales en altura. Productos del catalogo: barandilla contrapesada (sin perforacion), balaustre UNE 1200/1500, barandilla 1000/1200/1500/2500, sargento mordaza, mordaza peto, mordaza P4 metalica, mordaza P4 rigida y rodapie. Para cualificar una consulta conviene preguntar por soporte, borde o hueco, posibilidad de fijacion, longitud y urgencia. Los sistemas se clasifican segun UNE-EN 13374 en clases A, B y C segun inclinacion y carga."
  },
  {
    id: "proteccion-definitiva",
    title: "Proteccion definitiva de borde",
    content:
      "La proteccion definitiva se orienta a seguridad permanente en cubiertas, terrazas, pasillos tecnicos y zonas con riesgo de caida. Productos del catalogo: barandillas de acero, barandillas de aluminio autoportante (sin perforacion), soporte Z para cubierta de chapa, fijacion a suelo, fijacion a pared, y sistemas para cubierta de chapa y losa impermeabilizada. Cualquier confirmacion normativa o de instalacion debe derivarse a revision tecnica."
  },
  {
    id: "bases-casquillos",
    title: "Bases y casquillos atornillables",
    content:
      "La categoria agrupa elementos de anclaje y fijacion para sistemas de proteccion de borde. Catalogo: Base 2, Base 60x40, Base 60x60, perfiles PT, casquillo recto, casquillo acodado corto, casquillo acodado largo y anclaje inox. Para orientar la consulta hay que pedir soporte, uso provisional o definitivo, cantidad, compatibilidad y documentacion disponible."
  },
  {
    id: "metodologia",
    title: "Metodologia y revision",
    content:
      "Protecciones Toledo ofrece analisis tecnico de obra, fabricacion propia con maquinaria industrial, adaptacion al cliente, soluciones personalizadas y documentacion tecnica. Destaca su politica de calidad basada en 29 anos de experiencia y metodologia de analisis tecnico. El copiloto debe preparar una ficha comercial, no sustituir el analisis del equipo tecnico."
  },
  {
    id: "contacto-real",
    title: "Contacto real",
    content:
      "La web publica muestra el correo info@proteccionestoledo.com, telefono 925 32 80 08 y ubicacion en Cam. de Mora, 70, 45789 Turleque, Toledo. En la demo no se envian correos reales automaticamente."
  },
  {
    id: "presupuesto",
    title: "Informacion util para presupuesto",
    content:
      "Para preparar una consulta comercial conviene indicar tipo de obra, ubicacion aproximada, soporte, posibilidad de fijacion o perforacion, longitud o cantidad, urgencia, documentacion disponible y datos de contacto."
  },
  {
    id: "limitaciones",
    title: "Limitaciones tecnicas",
    content:
      "El copiloto no realiza calculos estructurales, no confirma normativa ni certificaciones, no da instrucciones de montaje y no sustituye la revision del equipo tecnico de la empresa."
  },
  {
    id: "privacidad",
    title: "Privacidad de la demo",
    content:
      "En esta prueba de concepto las solicitudes se guardan localmente o de forma simulada. No debe introducirse informacion sensible."
  },
  {
    id: "normativa-clases-une",
    title: "Clases UNE-EN 13374 (A, B, C)",
    content:
      "La norma UNE-EN 13374:2025 clasifica los sistemas de proteccion de borde en tres clases. Clase A: superficies con inclinacion hasta 10°, para cargas estaticas. Clase B: superficies hasta 30° (sin limite de altura de caida) o hasta 60° si la altura de caida es inferior a 2 metros, para cargas dinamicas ligeras. Clase C: superficies entre 30° y 45° (sin limite de altura de caida), o entre 45° y 60° si la altura de caida no supera los 5 metros, para cargas dinamicas completas."
  },
  {
    id: "auxiliares-especificos",
    title: "Auxiliares — productos especificos",
    content:
      "Dentro de la categoria de auxiliares para la construccion, el catalogo incluye escaleras plegables para trabajos en altura y marquesinas de entrada para proteccion de accesos. Complementan los sistemas de proteccion de borde para seguridad integral en obra e instalaciones."
  },
  {
    id: "calidad-empresa",
    title: "Politica de calidad y fabricacion",
    content:
      "Protecciones Toledo S.L. cuenta con mas de 29 anos de experiencia en el sector metal. Fabrican con maquinaria industrial pesada en sus instalaciones de Turleque (Toledo). Estan certificados bajo UNE-EN 13374:2025 (SPPB) y UNE-EN ISO 14122 (SDPB). Su metodologia combina analisis tecnico de cada obra con fabricacion propia, permitiendo adaptacion al cliente y soluciones personalizadas con documentacion tecnica."
  }
];

export function compactKnowledgeBase() {
  return knowledgeBase.map((item) => `- ${item.title}: ${item.content}`).join("\n");
}
