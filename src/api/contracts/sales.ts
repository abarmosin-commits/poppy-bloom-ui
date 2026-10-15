export type SalesStatus = 'observed' | 'unavailable' | 'authoritative';
export type SalesCoverageState = 'unknown' | 'verified_zero';

export interface SalesResponse {
  schema_version: 'sales.v1';
  scope: { seller_id: string; date_from: string; date_to: string };
  summary: { event_date: { sales_events: number; return_events: number; net_revenue: string | null }; order_cohort: Record<string, number | null> };
  comparison: { event_date: Record<string, unknown>; order_cohort: Record<string, unknown> };
  timeseries: Array<{ date: string; sales_events: number; return_events: number; net_revenue: string | null }>;
  skus: Array<{ nm_id: number; event_date: Record<string, unknown>; order_cohort: Record<string, number | null>; order_cohort_status: SalesStatus }>;
  coverage: { current: Record<string, unknown>; previous: Record<string, unknown> };
  freshness: { sales: Record<string, unknown>; orders: { status: 'unavailable'; finished_at: null } };
  warnings: string[];
}

export interface SalesFunnelResponse {
  schema_version: 'sales.funnel.v1';
  current: { impressions: { value: number | null }; card_opens: { value: number | null }; cart_additions: { value: number | null }; source_orders: { value: number | null }; source_buyouts: { value: number | null }; transitions: Record<string, unknown> };
  previous: Record<string, unknown>;
  comparison: Record<string, unknown>;
  skus: Array<Record<string, unknown>>;
  coverage: { status: 'unavailable'; coverage_state: 'unknown'; authoritative: false };
  freshness: Record<string, unknown>;
  warnings: string[];
}
