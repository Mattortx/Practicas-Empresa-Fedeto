import type { ProductFamilyId } from "../../types/commercialCopilot";
import { Badge } from "../ui/Badge";

interface LeadFamilyBadgeProps {
  familyId?: ProductFamilyId;
  label: string;
}

export function LeadFamilyBadge({ familyId, label }: LeadFamilyBadgeProps) {
  const tone =
    familyId === "provisional"
      ? "red"
      : familyId === "definitiva"
        ? "blue"
        : familyId === "medida"
          ? "orange"
          : "neutral";

  return <Badge tone={tone}>{label}</Badge>;
}
