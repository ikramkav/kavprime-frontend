export interface Asset {
  asset_id: number;
  asset_tag: string;
  brand: string;
  model_name: string;
  category: string;
  status: string;
  condition: string;
  total_quantity: number;
  available_quantity: number;
  quantity_issued: number;
  purchase_date: string;
  purchase_price: number;
  vendor_name: string;
  warranty_status: string;
  warranty_end: string;
  assigned_to: string;
  current_location: string;
}

export interface AssetListResponse {
  report: string;
  generated_at: string;
  filters: {
    category: string | null;
    status: string | null;
    condition: string | null;
  };
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  assets: Asset[];
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

// 1.1 Asset Summary
export interface StatusCount {
  status: string;
  count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface ConditionCount {
  condition: string;
  count: number;
}

export interface WarrantyCount {
  warranty_status: string | null;
  count: number;
}
export interface AssetSummaryResponse {
  report: string;
  generated_at: string;
  total_assets: number;
  total_purchase_value: number;
  by_status: StatusCount[];
  by_category: CategoryCount[];
  by_condition: ConditionCount[];
  by_warranty_status: WarrantyCount[];
}

export interface DashboardStatsResponse {
  report: string;
  generated_at: string;
  assets: {
    total: number;
    available: number;
    issued: number;
    low_or_out_of_stock: number;
  };
  tickets: {
    total: number;
    open: number;
    completed: number;
    rejected: number;
    sla_breached: number;
  };
  users: {
    total: number;
    active: number;
    onboarding: number;
    offboarding: number;
    exited: number;
  };
  purchases: {
    pending_approval: number;
  };
}

// 1.4 Currently issued assets
export interface CurrentlyIssuedRecord {
  record_id: number;
  asset_tag: string;
  category: string;
  brand: string;
  model_name: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  issued_date: string;
  days_held: number;
  issued_by: string;
}

export interface CurrentlyIssuedResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  records: CurrentlyIssuedRecord[];
}

// 5.1 Master Audit Log
export interface AuditEvent {
  event_type: string;
  action: string;
  timestamp: string;
  actor: string;
  actor_email: string;
  target_user: string;
  target_user_email: string;
  detail: string;
  remarks: string;
}

export interface AuditLogResponse {
  report: string;
  generated_at: string;
  date_range: {
    from: string | null;
    to: string | null;
  };
  total_events: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  events: AuditEvent[];
}

// 4.1 Purchase summary
export interface RequestTypeCount {
  request_type: string;
  count: number;
}

export interface TriggeredByCount {
  triggered_by: string;
  count: number;
}

export interface PurchaseSummaryResponse {
  report: string;
  generated_at: string;
  date_range: {
    from: string | null;
    to: string | null;
  };
  total_requests: number;
  by_status: StatusCount[];
  by_request_type: RequestTypeCount[];
  by_triggered_by: TriggeredByCount[];
}

export interface SlaTicket {
  ticket_id: number;
  title: string;
  ticket_type: string;
  status: string;
  priority: string;
  current_role: string;
  step_deadline: string;
  overdue_by_hours: number;
  employee_id: number;
  employee_name: string;
  assigned_to: string;
  created_at: string;
}

export interface SlaBreachResponse {
  report: string;
  generated_at: string;
  total_breached: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  tickets: SlaTicket[];
}

export interface ApprovalHistoryItem {
  history_id: number;
  ticket_id: number;
  ticket_title: string;
  ticket_type: string;
  role: string;
  action: string;
  remarks: string;
  actioned_by_id: number;
  actioned_by_name: string;
  actioned_by_email: string;
  action_date: string;
}

export interface ApprovalHistoryResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  history: ApprovalHistoryItem[];
}

export interface Ticket {
  ticket_id: number;
  title: string;
  ticket_type: string;
  status: string;
  priority: string;
  created_by_role: string;
  current_role: string;
  current_step: number;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  assigned_to: string;
  workflow_id: number;
  created_at: string;
  updated_at: string;
}

export interface TicketListResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  tickets: Ticket[];
}

export interface TicketTypeCount {
  ticket_type: string;
  count: number;
}

export interface CreatedByRoleCount {
  created_by_role: string;
  count: number;
}

export interface PendingRoleCount {
  current_role: string;
  count: number;
}

export interface TicketSummaryResponse {
  report: string;
  generated_at: string;
  date_range: {
    from: string | null;
    to: string | null;
  };
  total_tickets: number;
  by_status: StatusCount[];
  by_ticket_type: TicketTypeCount[];
  by_created_by_role: CreatedByRoleCount[];
  pending_by_role: PendingRoleCount[];
}
export interface PendingByRoleResponse {
  report: string;
  generated_at: string;
  pending_by_role: PendingRoleCount[];
}
// 4.3 Vendor summary
export interface VendorSummaryItem {
  vendor_id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  gst_number: string;
  total_assets_purchased: number;
  total_spend: number;
}

export interface VendorSummaryResponse {
  report: string;
  generated_at: string;
  total_vendors: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  vendors: VendorSummaryItem[];
}

// 1.3 Issue / Return history
export interface IssueReturnRecord {
  record_id: number;
  asset_id: number;
  asset_tag: string;
  asset_category: string;
  brand: string;
  model_name: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  quantity_issued: number;
  status: string;
  issued_by: string;
  issued_date: string;
  return_date: string;
  remarks: string;
}

export interface IssueReturnResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  records: IssueReturnRecord[];
}

// 1.5 Low stock / out of stock
export interface LowStockAsset {
  asset_id: number;
  asset_tag: string;
  brand: string;
  model_name: string;
  category: string;
  status: string;
  total_quantity: number;
  available_quantity: number;
  minimum_stock_level: number;
  vendor_name: string;
}

export interface LowStockResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  assets: LowStockAsset[];
}

// 1.6 Warranty expiry
export interface WarrantyAsset {
  asset_id: number;
  asset_tag: string;
  brand: string;
  model_name: string;
  category: string;
  warranty_end: string;
  warranty_status: string | null;
  days_until_expiry: number;
  vendor_name: string;
}

export interface WarrantyExpiryResponse {
  report: string;
  generated_at: string;
  filter_days: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  assets: WarrantyAsset[];
}

// 3.1 User summary
export interface UserRoleCount {
  role: string;
  count: number;
}

export interface EmploymentCount {
  employment_status: string;
  count: number;
}

export interface UserSummaryResponse {
  report: string;
  generated_at: string;
  total_users: number;
  active_accounts: number;
  inactive_accounts: number;
  by_role: UserRoleCount[];
  by_employment_status: EmploymentCount[];
}

// 3.2 Employee asset history
export interface AssetHistoryRecord {
  type: string;
  record_id: number;
  asset_tag: string;
  category: string;
  brand: string;
  model_name: string;
  quantity_issued: number;
  status: string;
  issued_by: string;
  issued_date: string;
  return_date: string;
  remarks: string;
}

export interface AssetHistoryResponse {
  report: string;
  generated_at: string;
  employee_id: number;
  employee_name: string;
  employee_email: string;
  role: string;
  employment_status: string;
  join_date: string;
  exit_date: string | null;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  issue_return_history: AssetHistoryRecord[];
}

// 3.3 Offboarding checklist
export interface OffboardingAsset {
  type: string;
  id: number;
  asset_tag: string;
  category: string;
  quantity_issued: number | string;
  detail: string;
}

export interface OffboardingTicket {
  type: string;
  id: number;
  asset_tag: string;
  category: string;
  quantity_issued: string;
  detail: string;
}

export interface OffboardingResponse {
  report: string;
  generated_at: string;
  employee_id: number;
  employee_name: string;
  employment_status: string;
  offboarding_clear: boolean;
  unreturned_issued_assets: OffboardingAsset[];
  directly_assigned_assets: OffboardingAsset[];
  open_tickets: OffboardingTicket[];
  summary: {
    unreturned_asset_records: number;
    directly_assigned_assets: number;
    open_tickets: number;
  };
}

// 3.4 Exited employees
export interface ExitedEmployee {
  employee_id: number;
  name: string;
  email: string;
  role: string;
  join_date: string;
  exit_date: string;
  is_active: boolean;
}

export interface ExitedEmployeesResponse {
  report: string;
  generated_at: string;
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
  employees: ExitedEmployee[];
}
