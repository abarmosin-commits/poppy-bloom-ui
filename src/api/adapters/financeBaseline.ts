import {apiBase, ApiError} from '../client';
import type {FinanceBaselineItem, FinanceBaselineResponse} from '../contracts/financeBaseline';

function isItem(value: unknown): value is FinanceBaselineItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  const status = item.baseline_status;
  return typeof item.seller_id === 'number' && typeof item.nm_id === 'number' && Number.isInteger(item.nm_id) && item.nm_id > 0
    && (typeof item.product_id === 'number' || item.product_id === null)
    && (status === 'confirmed' || status === 'needs_review' || status === 'unavailable' || status === 'unknown')
    && (typeof item.quantity === 'number' || typeof item.quantity === 'string')
    && (typeof item.unit_cost === 'number' || typeof item.unit_cost === 'string' || item.unit_cost === null)
    && (typeof item.total_value === 'number' || typeof item.total_value === 'string')
    && (typeof item.currency === 'string' || item.currency === null)
    && (typeof item.source_observed_at === 'string' || item.source_observed_at === null)
    && (typeof item.confirmed_at === 'string' || item.confirmed_at === null)
    && (typeof item.event_identity === 'string' || item.event_identity === null)
    && (typeof item.event_status === 'string' || item.event_status === null);
}

function isResponse(value: unknown): value is FinanceBaselineResponse {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;
  return typeof payload.seller_id === 'number' && Array.isArray(payload.items) && payload.items.every(isItem);
}

export async function loadFinanceBaseline(signal?: AbortSignal): Promise<FinanceBaselineResponse> {
  const response = await fetch(`${apiBase}/finance/inventory-cost/baseline`, {signal});
  let payload: unknown;
  try { payload = await response.json(); } catch { payload = null; }
  if (!response.ok) throw new ApiError(response.status, `finance_baseline_${response.status}`);
  if (!isResponse(payload)) throw new ApiError(502, 'invalid_finance_baseline_response');
  return payload;
}
