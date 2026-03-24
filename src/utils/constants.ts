export const STATUS_OPTIONS = [
  "AVAILABLE",
  "ISSUED",
  "DAMAGED",
  "LOST",
  "SCRAPPED",
  "LOW_STOCK",
  "OUT_OF_STOCK",
] as const;

export const CATEGORY_OPTIONS = [
  "LAPTOP",
  "DESKTOP",
  "MOUSE",
  "KEYBOARD",
  "MONITOR",
  "PRINTER",
  "OTHER",
] as const;

export const CONDITION_OPTIONS = ["NEW", "GOOD", "FAIR", "POOR"] as const;

// Status / type / role options from docs
export const TICKET_STATUS_OPTIONS = [
  "PENDING_TEAM_PMO",
  "PENDING_SENIOR_PMO",
  "PENDING_ADMIN",
  "REJECTED",
  "APPROVED",
  "COMPLETED",
] as const;

export const TICKET_TYPE_OPTIONS = ["repair", "new_item", "general"] as const;

export const APPROVAL_STATUS_OPTIONS = [
  "APPROVED",
  "REJECTED",
  "ASSIGNED",
  "ESCALATED",
  "COMPLETED",
  "AUTO_ESCALATED",
] as const;

export const ROLE_OPTIONS = [
  "TEAM_PMO",
  "SENIOR_PMO",
  "ADMIN",
  "HR",
  "FINANCE",
] as const;

export const PURCHASE_STATUS_OPTIONS = [
  "PENDING_FINANCE",
  "APPROVED_FINANCE",
  "APPROVED_HR",
  "ORDER_PLACED",
  "COMPLETED",
  "REJECTED",
] as const;
