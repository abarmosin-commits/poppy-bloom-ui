import { formatMoney, formatNumber } from '../lib/format';
import { getProductMetrics, productMetricLabels, productStatuses } from '../data/mockProducts';
import type { MockCatalogueProduct, ProductMetric, ProductStatus } from '../data/mockProducts';
export const productMetricKeys = Object.keys(productMetricLabels) as ProductMetric[];
export function formatProductMetric(product:MockCatalogueProduct,key:ProductMetric) {
 const value=getProductMetrics(product)[key];
 if(key==='buyoutRate' && product.orders===0) return 'Нет заказов';
 if(value===null) return 'Нет данных';
 if(key==='revenue') return formatMoney(value);
 if(key==='buyoutRate') return new Intl.NumberFormat('ru-RU',{style:'percent',maximumFractionDigits:1}).format(value);
 return formatNumber(value);
}
export function ProductStatusLabel({status}:{status:ProductStatus}) {
 return <span className={'product-status product-status-'+status}>{productStatuses[status]}</span>;
}
export function ProductMetricList({product}:{product:MockCatalogueProduct}) {
 return <dl className="product-metric-list">{productMetricKeys.map(key => <div key={key}><dt>{productMetricLabels[key]}</dt><dd>{formatProductMetric(product,key)}</dd></div>)}</dl>;
}
export function ProductMetricDefinitions() {
 return <details className="metric-definitions"><summary>Как считаются показатели в демо</summary><div><p>Это условная модель за 1–14 октября 2026. Один заказ содержит одну единицу товара; выкуп и возврат относятся к этой же демо-группе заказов.</p><ul><li>Заказы — количество заказанных единиц.</li><li>Выкуп — полученные единицы / заказы × 100%. Без заказов доля не рассчитывается.</li><li>Возвраты — количество возвращённых выкупленных единиц.</li><li>Продажи — выкупленные единицы за вычетом возвратов.</li><li>Выручка — продажи × демо-цена. Комиссии, логистика и другие расходы не учтены; это не прибыль.</li></ul><p>Нет данных означает неизвестное значение, а не ноль. Все артикулы WB и статусы вымышлены. Эти формулы не являются утверждённой методикой Wildberries.</p></div></details>;
}
