import { productMetricLabels } from '../data/mockProducts';
import type { ProductMetric } from '../data/mockProducts';
import type { ProductUi } from '../api/contracts/products';
import { productMetricValue } from '../api/adapters/products';
import { formatMoney, formatNumber } from './format';

export const productMetricKeys = Object.keys(productMetricLabels) as ProductMetric[];
export { productMetricLabels };
const percent = new Intl.NumberFormat('ru-RU', { style: 'percent', maximumFractionDigits: 1 });

export function formatMetricValue(value: number | null, key: ProductMetric) {
  if (value === null) return 'Нет данных';
  return key === 'revenue' ? formatMoney(value) : key === 'buyoutRate' ? percent.format(value) : formatNumber(value);
}

export function formatCatalogueMetric(product: ProductUi, key: ProductMetric) {
  if (key === 'buyoutRate' && product.orders === 0) return 'Нет заказов';
  const value = productMetricValue(product, key);
  return value === null && product.source === 'real' ? 'Недоступно' : formatMetricValue(value, key);
}

export function productDataStatus(product: ProductUi) {
  const values = productMetricKeys
    .filter(key => !(key === 'buyoutRate' && product.orders === 0))
    .map(key => productMetricValue(product, key));
  if (values.every(value => value === null)) return 'Нет данных';
  if (values.some(value => value === null)) return 'Неполные данные';
  if (product.source === 'real') {
    return product.evidenceState === 'authoritative' && product.availability === 'available' && !product.warningCodes.length
      ? 'Доступны' : 'Требует сверки';
  }
  return values.every(value => value === 0) ? 'Известные нули' : 'Демо-выборка';
}

export function productSummary(products: ProductUi[]) {
  return productMetricKeys.map(key => {
    if (key === 'buyoutRate') {
      const known = products.filter(p => p.orders !== null && p.orders > 0 && p.buyouts !== null);
      const orders = known.reduce((sum, p) => sum + p.orders!, 0);
      const buyouts = known.reduce((sum, p) => sum + p.buyouts!, 0);
      return { key, value: orders ? buyouts / orders : null, known: known.length };
    }
    const known = products.map(p => productMetricValue(p, key)).filter((v): v is number => v !== null);
    return { key, value: known.length ? known.reduce((sum, v) => sum + v, 0) : null, known: known.length };
  });
}
