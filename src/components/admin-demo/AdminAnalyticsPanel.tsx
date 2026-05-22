import { BarChart3, LineChart, PieChart, Table2 } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { CommercialLead, LeadPriority, LeadStatus, ProductFamilyId } from "../../types/commercialCopilot";

interface AdminAnalyticsPanelProps {
  leads: CommercialLead[];
  filteredLeads: CommercialLead[];
  activeFilterLabel: string;
}

type ChartDatum = {
  id: string;
  label: string;
  value: number;
  tone: "red" | "blue" | "orange" | "green" | "slate";
};

type FamilyBucket = ProductFamilyId | "sin-clasificar";

type AnalyticsInsight = {
  label: string;
  value: string;
  detail: string;
  tone: ChartDatum["tone"];
};

const priorityLabels: Record<LeadPriority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja"
};

const statusLabels: Record<LeadStatus, string> = {
  nueva: "Nueva",
  calificada: "Calificada",
  pendiente_contacto_comercial: "Contacto comercial",
  pendiente_revision_tecnica: "Revisión técnica",
  cerrada_demo: "Cerrada demo",
  cerrada_no_oportunidad: "Cerrada"
};

const familyOrder: FamilyBucket[] = [
  "provisional",
  "definitiva",
  "bases-casquillos",
  "auxiliares",
  "consumibles",
  "medida",
  "sin-clasificar"
];

export function AdminAnalyticsPanel({ leads, filteredLeads, activeFilterLabel }: AdminAnalyticsPanelProps) {
  const familyData = buildFamilyData(leads);
  const priorityData = buildPriorityData(leads);
  const statusData = buildStatusData(leads);
  const trendData = buildTrendData(leads);
  const tableRows = buildFamilyTable(leads);
  const activeRatio = leads.length > 0 ? Math.round((filteredLeads.length / leads.length) * 100) : 0;
  const insights = buildAnalyticsInsights(leads, familyData);

  return (
    <section className="admin-analytics" aria-label="Analítica comercial de solicitudes">
      <div className="analytics-header">
        <div>
          <span>Lectura comercial</span>
          <h2>Estadística dinámica de solicitudes</h2>
          <p>
            Métricas generadas a partir de los datos de demo y de las solicitudes creadas por el copiloto.
          </p>
        </div>
        <div className="analytics-filter-note">
          <strong>{filteredLeads.length}</strong>
          <span>
            visibles de {leads.length} · filtro: {activeFilterLabel} · {activeRatio}%
          </span>
        </div>
      </div>

      <div className="analytics-insight-grid" aria-label="Indicadores comerciales destacados">
        {insights.map((insight) => (
          <article className={`analytics-insight insight-${insight.tone}`} key={insight.label}>
            <span>{insight.label}</span>
            <strong>{insight.value}</strong>
            <p>{insight.detail}</p>
          </article>
        ))}
      </div>

      <div className="analytics-grid">
        <article className="analytics-card analytics-card-wide">
          <CardTitle icon={<BarChart3 size={18} aria-hidden="true" />} title="Solicitudes por familia" />
          <BarChart data={familyData} />
        </article>

        <article className="analytics-card">
          <CardTitle icon={<PieChart size={18} aria-hidden="true" />} title="Prioridad comercial" />
          <DonutChart data={priorityData} total={leads.length} />
        </article>

        <article className="analytics-card analytics-card-wide">
          <CardTitle icon={<LineChart size={18} aria-hidden="true" />} title="Evolución temporal" />
          <LineTrend data={trendData} />
        </article>

        <article className="analytics-card">
          <CardTitle icon={<PieChart size={18} aria-hidden="true" />} title="Estado de seguimiento" />
          <DonutChart data={statusData} total={leads.length} compact />
        </article>
      </div>

      <article className="analytics-card analytics-table-card">
        <CardTitle icon={<Table2 size={18} aria-hidden="true" />} title="Tabla resumen por familia" />
        <div className="analytics-table" role="table" aria-label="Resumen estadístico por familia">
          <div className="analytics-table-row analytics-table-head" role="row">
            <span>Familia</span>
            <span>Solicitudes</span>
            <span>Alta prioridad</span>
            <span>Revisión técnica</span>
            <span>Nuevas</span>
            <span>Peso</span>
          </div>
          {tableRows.map((row) => (
            <div className="analytics-table-row" role="row" key={row.id}>
              <span>
                <strong>{row.label}</strong>
              </span>
              <span>{row.total}</span>
              <span>{row.highPriority}</span>
              <span>{row.technicalReview}</span>
              <span>{row.newLeads}</span>
              <span>{row.weight}%</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function CardTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="analytics-card-title">
      {icon}
      <strong>{title}</strong>
    </div>
  );
}

function BarChart({ data }: { data: ChartDatum[] }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bar-chart" role="list" aria-label="Gráfico de barras por familia">
      {data.map((item, index) => {
        const height = Math.max(8, Math.round((item.value / maxValue) * 100));
        const share = total > 0 ? Math.round((item.value / total) * 100) : 0;
        const barStyle = {
          "--bar-height": `${height}%`,
          "--bar-delay": `${index * 70}ms`
        } as CSSProperties;

        return (
          <div
            className="bar-item"
            role="listitem"
            key={item.id}
            title={`${item.label}: ${item.value} solicitudes (${share}%)`}
          >
            <div className="bar-track" aria-hidden="true">
              <span className={`bar-fill chart-tone-${item.tone}`} style={barStyle}>
                <i className="bar-shine" />
              </span>
            </div>
            <strong>{item.value}</strong>
            <em>{share}%</em>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ data, total, compact = false }: { data: ChartDatum[]; total: number; compact?: boolean }) {
  const gradient = buildConicGradient(data, total);
  const dominant = data.reduce(
    (best, item) => (item.value > best.value ? item : best),
    data[0] ?? { id: "none", label: "Sin datos", value: 0, tone: "slate" as const }
  );
  const dominantShare = percentage(dominant.value, total);

  return (
    <div className={`donut-layout ${compact ? "donut-layout-compact" : ""}`}>
      <div
        className={`donut-chart chart-tone-ring-${dominant.tone}`}
        style={{ background: gradient }}
        aria-hidden="true"
      >
        <span className="donut-orbit" />
        <span className="donut-sweep" />
        <div className="donut-center">
          <strong>{total}</strong>
          <span>{dominantShare}% {dominant.label}</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((item, index) => (
          <div
            className="chart-legend-row"
            key={item.id}
            style={{ "--legend-delay": `${index * 55}ms` } as CSSProperties}
          >
            <span>
              <i className={`chart-dot chart-tone-${item.tone}`} aria-hidden="true" />
              {item.label}
            </span>
            <strong>
              {item.value}
              <small>{percentage(item.value, total)}%</small>
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineTrend({ data }: { data: Array<{ label: string; value: number }> }) {
  const width = 320;
  const height = 148;
  const padding = 22;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);
    return { ...item, x, y };
  });
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`;
  const latestPoint = points[points.length - 1];
  const peak = points.reduce((best, item) => (item.value > best.value ? item : best), points[0] ?? {
    label: "-",
    value: 0,
    x: 0,
    y: 0
  });

  return (
    <div className="line-chart">
      <div className="line-kpis">
        <span>
          Pico <strong>{peak.value}</strong> <small>{peak.label}</small>
        </span>
        <span>
          Último día <strong>{latestPoint?.value ?? 0}</strong>
        </span>
      </div>
      <div className="line-stage">
        <span className="line-scan" aria-hidden="true" />
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de líneas de solicitudes por día">
          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const gridY = height - padding - ratio * (height - padding * 2);
            return (
              <line
                className="line-grid"
                key={ratio}
                x1={padding}
                x2={width - padding}
                y1={gridY}
                y2={gridY}
              />
            );
          })}
          <polygon points={areaPoints} className="line-area" />
          <polyline points={linePoints} className="line-stroke line-stroke-glow" />
          <polyline points={linePoints} className="line-stroke" />
          {points.map((point, index) => (
            <g key={point.label} style={{ "--point-delay": `${index * 70}ms` } as CSSProperties}>
              <circle cx={point.x} cy={point.y} r="4.5" className="line-point" />
              {index === points.length - 1 && (
                <circle cx={point.x} cy={point.y} r="8" className="line-current-pulse" />
              )}
              <text x={point.x} y={height - 4} textAnchor="middle" className="line-label">
                {point.label}
              </text>
              <text x={point.x} y={Math.max(14, point.y - 10)} textAnchor="middle" className="line-value">
                {point.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function buildAnalyticsInsights(leads: CommercialLead[], familyData: ChartDatum[]): AnalyticsInsight[] {
  const total = leads.length;
  const dominantFamily = familyData
    .filter((item) => item.id !== "sin-clasificar")
    .reduce((best, item) => (item.value > best.value ? item : best), familyData[0] ?? {
      id: "none",
      label: "Sin datos",
      value: 0,
      tone: "slate" as const
    });
  const technicalReviewCount = leads.filter((lead) => lead.technicalRisk).length;
  const highPriorityCount = leads.filter((lead) => lead.priority === "alta").length;
  const openCount = leads.filter((lead) => lead.status !== "cerrada_demo" && lead.status !== "cerrada_no_oportunidad").length;

  return [
    {
      label: "Familia dominante",
      value: dominantFamily.label,
      detail: `${dominantFamily.value} solicitudes · ${percentage(dominantFamily.value, total)}% del total`,
      tone: dominantFamily.tone
    },
    {
      label: "Carga técnica",
      value: `${percentage(technicalReviewCount, total)}%`,
      detail: `${technicalReviewCount} consultas requieren revisión técnica`,
      tone: technicalReviewCount > total / 3 ? "orange" : "blue"
    },
    {
      label: "Prioridad alta",
      value: String(highPriorityCount),
      detail: `${percentage(highPriorityCount, total)}% de oportunidades urgentes`,
      tone: highPriorityCount > 0 ? "red" : "green"
    },
    {
      label: "Seguimiento abierto",
      value: String(openCount),
      detail: `${total - openCount} solicitudes cerradas en demo`,
      tone: openCount > total * 0.7 ? "orange" : "green"
    }
  ];
}

function buildFamilyData(leads: CommercialLead[]): ChartDatum[] {
  return familyOrder.map((familyId) => {
    const familyLeads = leads.filter((lead) =>
      familyId === "sin-clasificar" ? !lead.productFamilyId : lead.productFamilyId === familyId
    );

    return {
      id: familyId,
      label: shortFamilyLabel(familyId),
      value: familyLeads.length,
      tone: familyTone(familyId)
    };
  });
}

function buildPriorityData(leads: CommercialLead[]): ChartDatum[] {
  return (["alta", "media", "baja"] as LeadPriority[]).map((priority) => ({
    id: priority,
    label: priorityLabels[priority],
    value: leads.filter((lead) => lead.priority === priority).length,
    tone: priority === "alta" ? "red" : priority === "media" ? "orange" : "blue"
  }));
}

function buildStatusData(leads: CommercialLead[]): ChartDatum[] {
  const statusOrder: LeadStatus[] = [
    "nueva",
    "calificada",
    "pendiente_contacto_comercial",
    "pendiente_revision_tecnica",
    "cerrada_no_oportunidad",
    "cerrada_demo"
  ];

  return statusOrder.map((status) => ({
    id: status,
    label: statusLabels[status],
    value: leads.filter((lead) => lead.status === status).length,
    tone:
      status === "pendiente_revision_tecnica"
        ? "orange"
        : status === "cerrada_demo" || status === "cerrada_no_oportunidad"
          ? "green"
          : status === "nueva"
            ? "blue"
            : "slate"
  }));
}

function buildTrendData(leads: CommercialLead[]) {
  const newestTime = Math.max(...leads.map((lead) => new Date(lead.createdAt).getTime()), Date.now());
  const newestDate = new Date(newestTime);
  newestDate.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(newestDate);
    date.setDate(newestDate.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      label: new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit" }).format(date),
      value: leads.filter((lead) => lead.createdAt.slice(0, 10) === key).length
    };
  });
}

function buildFamilyTable(leads: CommercialLead[]) {
  return familyOrder.map((familyId) => {
    const familyLeads = leads.filter((lead) =>
      familyId === "sin-clasificar" ? !lead.productFamilyId : lead.productFamilyId === familyId
    );
    const total = familyLeads.length;

    return {
      id: familyId,
      label: familyLabel(familyId),
      total,
      highPriority: familyLeads.filter((lead) => lead.priority === "alta").length,
      technicalReview: familyLeads.filter((lead) => lead.technicalRisk).length,
      newLeads: familyLeads.filter((lead) => lead.status === "nueva").length,
      weight: leads.length > 0 ? Math.round((total / leads.length) * 100) : 0
    };
  });
}

function buildConicGradient(data: ChartDatum[], total: number) {
  if (total === 0) {
    return "conic-gradient(#d8e0e7 0deg 360deg)";
  }

  let current = 0;
  const segments = data
    .filter((item) => item.value > 0)
    .map((item) => {
      const start = current;
      const end = current + (item.value / total) * 360;
      current = end;
      return `${toneColor(item.tone)} ${start}deg ${end}deg`;
    });

  return `conic-gradient(${segments.join(", ")})`;
}

function percentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function familyLabel(familyId: FamilyBucket) {
  const labels: Record<FamilyBucket, string> = {
    provisional: "Protección provisional de borde",
    definitiva: "Protección definitiva de borde",
    "bases-casquillos": "Bases y casquillos",
    auxiliares: "Auxiliares para la construcción",
    consumibles: "Consumibles",
    medida: "Soluciones a medida",
    "sin-clasificar": "Por determinar"
  };

  return labels[familyId];
}

function shortFamilyLabel(familyId: FamilyBucket) {
  const labels: Record<FamilyBucket, string> = {
    provisional: "Provisional",
    definitiva: "Definitiva",
    "bases-casquillos": "Bases",
    auxiliares: "Auxiliares",
    consumibles: "Consumibles",
    medida: "A medida",
    "sin-clasificar": "Pendiente"
  };

  return labels[familyId];
}

function familyTone(familyId: FamilyBucket): ChartDatum["tone"] {
  if (familyId === "provisional") {
    return "red";
  }

  if (familyId === "definitiva") {
    return "blue";
  }

  if (familyId === "bases-casquillos" || familyId === "medida") {
    return "orange";
  }

  return "slate";
}

function toneColor(tone: ChartDatum["tone"]) {
  const colors = {
    red: "#b64035",
    blue: "#1d4f7a",
    orange: "#c8752d",
    green: "#2b7a58",
    slate: "#697482"
  };

  return colors[tone];
}
