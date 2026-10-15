import { getMockDashboard, MOCK_PERIODS } from '../data/mock';
import { formatDate } from './format';

export const ANALYTICS_PERIODS = MOCK_PERIODS;
export type AnalyticsDays = typeof ANALYTICS_PERIODS[number];
export const DEFAULT_ANALYTICS_DAYS: AnalyticsDays = 7;

export function parseAnalyticsDays(value: string | null): AnalyticsDays {
  const days = Number(value);
  return ANALYTICS_PERIODS.find(period => period === days) ?? DEFAULT_ANALYTICS_DAYS;
}

export function demoPeriod(days: AnalyticsDays) {
  const dateTo = getMockDashboard(1).daily.at(-1)!.date;
  const start = new Date(dateTo + 'T00:00:00Z');
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { dateFrom: start.toISOString().slice(0, 10), dateTo, days };
}

export function formatAnalyticsPeriod(period: { dateFrom: string; dateTo: string }) {
  return formatDate(period.dateFrom) + ' — ' + formatDate(period.dateTo) + ' ' + period.dateTo.slice(0, 4);
}
