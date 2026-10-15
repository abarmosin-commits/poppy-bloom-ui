import type { ProductUi } from '../api/contracts/products';
import { getMockDashboard } from '../data/mock';
import { demoPeriod, formatAnalyticsPeriod } from './analyticsPeriod';
import type { AnalyticsDays } from './analyticsPeriod';

// A read-only projection: the catalogue's 14-day buyouts/returns cannot
// establish values for a selected 1/7/30-day period.
export function productsForPeriod(products: ProductUi[], days: AnalyticsDays): ProductUi[] {
  const dailyOrders = new Map(getMockDashboard(days).products.map(p => [p.id, p.units]));
  const period = formatAnalyticsPeriod(demoPeriod(days));
  return products.map(product => ({
    ...product,
    orders: dailyOrders.get(product.id) ?? null,
    buyouts: null,
    returns: null,
    note: 'Период: ' + period + '. ' +
      (dailyOrders.has(product.id) ? 'Заказы рассчитаны из дневных mock-записей. ' : 'Дневных mock-записей заказов этого товара нет. ') +
      'Выкупы и возвраты доступны только агрегатом за 14 дней. Продажи, выкуп, возвраты и выручка за выбранный период неизвестны.',
  }));
}
