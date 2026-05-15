export type LeadFieldId =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "workType"
  | "location"
  | "need"
  | "message"
  | "consent";

export type LeadDraft = Partial<Record<LeadFieldId, string>>;

export interface LeadField {
  id: LeadFieldId;
  label: string;
  prompt: string;
  placeholder: string;
  required: boolean;
}

export const leadFields: LeadField[] = [
  {
    id: "name",
    label: "Nombre",
    prompt: "Perfecto. Para preparar la consulta, dime tu nombre y apellidos.",
    placeholder: "Nombre y apellidos",
    required: true
  },
  {
    id: "company",
    label: "Empresa",
    prompt: "Indica la empresa o entidad que realiza la consulta.",
    placeholder: "Empresa",
    required: true
  },
  {
    id: "email",
    label: "Correo",
    prompt: "¿A que correo puede responder el equipo comercial?",
    placeholder: "correo@empresa.com",
    required: true
  },
  {
    id: "phone",
    label: "Telefono",
    prompt: "Si quieres, deja un telefono de contacto para agilizar la respuesta.",
    placeholder: "Telefono",
    required: false
  },
  {
    id: "workType",
    label: "Tipo de obra",
    prompt: "¿Que tipo de obra o instalacion es? Por ejemplo: edificacion, cubierta, nave industrial, puente, silo o mantenimiento.",
    placeholder: "Tipo de obra",
    required: true
  },
  {
    id: "location",
    label: "Ubicacion",
    prompt: "¿Donde se encuentra la obra o instalacion?",
    placeholder: "Provincia o localidad",
    required: true
  },
  {
    id: "need",
    label: "Necesidad principal",
    prompt: "Resume la necesidad principal: proteccion provisional, definitiva, fijaciones, auxiliares, consumibles o una solucion a medida.",
    placeholder: "Necesidad principal",
    required: true
  },
  {
    id: "message",
    label: "Mensaje",
    prompt: "Añade cualquier detalle util: superficie, soporte, si se puede perforar, cantidades aproximadas, urgencia o documentacion que necesitas.",
    placeholder: "Detalles de la consulta",
    required: true
  },
  {
    id: "consent",
    label: "Consentimiento",
    prompt: "Para cerrar el resumen, confirma con 'acepto' que estos datos se usan solo para preparar esta consulta comercial de demo y que no se almacenan en el MVP.",
    placeholder: "acepto",
    required: true
  }
];

export function getFirstIncompleteField(draft: LeadDraft): LeadField | undefined {
  return leadFields.find((field) => {
    const value = draft[field.id]?.trim();
    return field.required ? !value : value === undefined;
  });
}

export function validateLeadField(
  field: LeadField,
  value: string
): { valid: true; normalizedValue: string } | { valid: false; error: string } {
  const normalizedValue = value.trim();

  if (field.required && !normalizedValue) {
    return {
      valid: false,
      error: `Necesito completar el campo "${field.label}" para generar el resumen.`
    };
  }

  if (!normalizedValue && !field.required) {
    return { valid: true, normalizedValue: "No indicado" };
  }

  if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
    return {
      valid: false,
      error: "El correo no parece valido. Puedes escribirlo de nuevo con formato nombre@empresa.com."
    };
  }

  if (field.id === "consent") {
    const accepted = ["acepto", "si", "sí", "ok", "de acuerdo"].includes(
      normalizedValue.toLowerCase()
    );

    if (!accepted) {
      return {
        valid: false,
        error: "Para generar el resumen necesito que confirmes con 'acepto'."
      };
    }
  }

  return { valid: true, normalizedValue };
}

export function buildLeadSummary(draft: LeadDraft): string {
  const value = (field: LeadFieldId) => draft[field]?.trim() || "No indicado";

  return [
    "Solicitud comercial generada por el asistente de Protecciones Toledo",
    "",
    `Nombre: ${value("name")}`,
    `Empresa: ${value("company")}`,
    `Correo: ${value("email")}`,
    `Telefono: ${value("phone")}`,
    `Tipo de obra: ${value("workType")}`,
    `Ubicacion: ${value("location")}`,
    `Necesidad principal: ${value("need")}`,
    "",
    "Mensaje:",
    value("message"),
    "",
    "Nota: el asistente no ha calculado soluciones tecnicas, precios, plazos ni cumplimiento normativo. La consulta debe revisarla el equipo comercial/tecnico."
  ].join("\n");
}
