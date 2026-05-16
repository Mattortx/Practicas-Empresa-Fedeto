import type { ChatAction } from "../../types/commercialCopilot";

const needActions: ChatAction[] = [
  { label: "Protección provisional de borde", value: "flow:provisional", variant: "secondary" },
  { label: "Protección definitiva de borde", value: "flow:definitiva", variant: "secondary" },
  { label: "Bases o casquillos", value: "flow:bases-casquillos", variant: "secondary" },
  { label: "Auxiliares para construcción", value: "flow:auxiliares", variant: "secondary" },
  { label: "Consumibles", value: "flow:consumibles", variant: "secondary" },
  { label: "Solución a medida", value: "flow:medida", variant: "warning" },
  { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
  { label: "No sé qué necesito", value: "flow:desconocido", variant: "secondary" },
  { label: "Documentación o normativa", value: "flow:documentacion", variant: "warning" }
];

interface NeedSelectorProps {
  onSelect: (action: ChatAction) => void;
}

export function NeedSelector({ onSelect }: NeedSelectorProps) {
  return (
    <div className="need-selector" aria-label="Menú inicial de necesidades">
      {needActions.map((action) => (
        <button
          className={`need-option need-option-${action.variant ?? "secondary"}`}
          key={action.value}
          type="button"
          onClick={() => onSelect(action)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

export { needActions };
