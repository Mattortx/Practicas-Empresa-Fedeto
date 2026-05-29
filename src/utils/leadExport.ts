import type { CommercialLead } from "../types/commercialCopilot";

const csvHeaders = [
  "Fecha",
  "Cliente",
  "Empresa",
  "Correo",
  "Telefono",
  "Familia",
  "Tipo de necesidad",
  "Ubicacion",
  "Urgencia",
  "Prioridad",
  "Estado",
  "Revision tecnica",
  "Datos pendientes",
  "Siguiente accion",
  "Observaciones"
];

export function exportLeadsToCsv(leads: CommercialLead[]) {
  const rows = leads.map((lead) => [
    formatDate(lead.createdAt),
    lead.summary.name,
    lead.summary.company,
    lead.summary.email,
    lead.summary.phone,
    lead.summary.productFamily,
    lead.summary.needType,
    lead.summary.location,
    lead.summary.urgency,
    lead.priority,
    lead.status,
    lead.technicalRisk ? "si" : "no",
    lead.summary.missingInformation?.join(" | ") ?? "",
    lead.summary.nextAction,
    lead.summary.observations
  ]);

  const csv = [csvHeaders, ...rows]
    .map((row) => row.map(escapeCsvCell).join(";"))
    .join("\n");

  downloadTextFile(
    `solicitudes-protecciones-toledo-${new Date().toISOString().slice(0, 10)}.csv`,
    `\uFEFF${csv}`,
    "text/csv;charset=utf-8"
  );
}

export function exportLeadsToJson(leads: CommercialLead[]) {
  const payload = {
    generatedAt: new Date().toISOString(),
    demoNotice:
      "Exportacion de demostracion. Revisar datos, consentimiento y base legal antes de uso productivo.",
    total: leads.length,
    leads
  };

  downloadTextFile(
    `solicitudes-protecciones-toledo-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(payload, null, 2),
    "application/json;charset=utf-8"
  );
}

function escapeCsvCell(value: string | number | boolean | undefined | null) {
  const normalized = String(value ?? "").replace(/\r?\n/g, " ").trim();
  return `"${normalized.replace(/"/g, '""')}"`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function downloadTextFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
