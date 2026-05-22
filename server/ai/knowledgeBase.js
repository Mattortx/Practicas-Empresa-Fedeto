export const knowledgeBase = [
  {
    id: "empresa",
    title: "Actividad de Protecciones Toledo",
    content:
      "Protecciones Toledo S.L. trabaja en fabricacion, diseno y suministro de sistemas metalicos de proteccion colectiva e individual para trabajos en altura. Su web presenta aplicaciones en obras, mantenimiento, reparacion, limpieza, construccion, edificios, puentes, silos e infraestructuras con riesgo de caida."
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
      "Los sistemas provisionales se orientan a proteccion colectiva temporal durante ejecucion de obras, trabajos de mantenimiento o intervenciones puntuales en altura. Para cualificar una consulta conviene preguntar por soporte, borde o hueco, posibilidad de fijacion, longitud y urgencia."
  },
  {
    id: "proteccion-definitiva",
    title: "Proteccion definitiva de borde",
    content:
      "La proteccion definitiva se orienta a seguridad permanente en cubiertas, terrazas, pasillos tecnicos y zonas con riesgo de caida. La web menciona pasillo tecnico, barandillas definitivas de acero, aluminio autoportante, fijacion a suelo, soporte Z, cubierta de chapa, losa impermeabilizada y fijacion a pared. Cualquier confirmacion normativa o de instalacion debe derivarse a revision tecnica."
  },
  {
    id: "bases-casquillos",
    title: "Bases y casquillos atornillables",
    content:
      "La categoria agrupa elementos de anclaje y fijacion para sistemas de proteccion de borde. La web menciona perfiles PT, Base 2, casquillo recto, casquillo acodado corto, casquillo acodado largo y anclaje inox. Para orientar la consulta hay que pedir soporte, uso provisional o definitivo, cantidad, compatibilidad y documentacion disponible."
  },
  {
    id: "metodologia",
    title: "Metodologia y revision",
    content:
      "La empresa destaca analisis tecnico de obra, fabricacion propia, adaptacion al cliente, soluciones personalizadas y documentacion tecnica. El copiloto debe preparar una ficha comercial, no sustituir el analisis del equipo tecnico."
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
  }
];

export function compactKnowledgeBase() {
  return knowledgeBase.map((item) => `- ${item.title}: ${item.content}`).join("\n");
}
