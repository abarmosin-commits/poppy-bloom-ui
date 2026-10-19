export type BaselineStatus = 'confirmed' | 'needs_review' | 'unavailable' | 'unknown';

export interface FinanceBaselineItem {
  seller_id: number;
  nm_id: number;
  product_id: number | null;
  baseline_status: BaselineStatus;
  quantity: string | number;
  unit_cost: string | number | null;
  total_value: string | number;
  currency: string | null;
  source_observed_at: string | null;
  confirmed_at: string | null;
  event_identity: string | null;
  event_status: string | null;
}

export interface FinanceBaselineResponse {
  seller_id: number;
  items: FinanceBaselineItem[];
}
