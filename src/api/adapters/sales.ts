import type { SalesFunnelResponse, SalesResponse } from '../contracts/sales';
import { ApiError } from '../client';

const base = import.meta.env.VITE_API_BASE_URL || '/api';
const isRecord = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object';
const validSales = (v: unknown): v is SalesResponse => {
  if (!isRecord(v) || v.schema_version !== 'sales.v1' || !isRecord(v.scope) || !isRecord(v.summary)) return false;
  if (!isRecord(v.summary.event_date) || !isRecord(v.summary.order_cohort) || !Array.isArray(v.timeseries) || !Array.isArray(v.skus)) return false;
  return isRecord(v.coverage) && isRecord(v.freshness) && Array.isArray(v.warnings);
};
const validFunnel = (v: unknown): v is SalesFunnelResponse => isRecord(v) && v.schema_version === 'sales.funnel.v1' && isRecord(v.current) && isRecord(v.coverage) && Array.isArray(v.warnings);

async function getJson<T>(path: string, validate: (v: unknown) => v is T, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${base}${path}`, { signal });
  let payload: unknown;
  try { payload = await response.json(); } catch { payload = { detail: 'invalid_json' }; }
  if (!response.ok) throw new ApiError(response.status, isRecord(payload) && typeof payload.detail === 'string' ? payload.detail : 'request_failed');
  if (!validate(payload)) throw new ApiError(502, 'invalid_sales_response');
  return payload;
}

export function getSalesAnalytics(sellerId: number, dateFrom: string, dateTo: string, signal?: AbortSignal) {
  return getJson<SalesResponse>(`/sales/analytics?seller_id=${sellerId}&date_from=${dateFrom}&date_to=${dateTo}`, validSales, signal);
}
export function getSalesFunnel(sellerId: number, dateFrom: string, dateTo: string, signal?: AbortSignal) {
  return getJson<SalesFunnelResponse>(`/sales/funnel?seller_id=${sellerId}&date_from=${dateFrom}&date_to=${dateTo}`, validFunnel, signal);
}
