// MOCK ONLY. Synthetic WB identifiers, statuses and cohort metrics.
// These formulas are a UI fixture, NOT Wildberries accounting definitions.
import { getMockDashboard } from './mock.ts';
export const PRODUCT_PERIOD = '1–14 октября 2026';
export const productStatuses = {active:'В продаже',attention:'Требует внимания',archived:'Архив'} as const;
export type ProductStatus = keyof typeof productStatuses;
export interface MockCatalogueProduct {
 id:string; name:string; article:string; wbArticle:string; status:ProductStatus;
 category:string; price:number; orders:number|null; buyouts:number|null; returns:number|null; note:string;
}
const buyouts = [84,65,89,76];
const returns = [4,7,2,null];
export const mockCatalogueProducts:MockCatalogueProduct[] = [
 ...getMockDashboard(14).products.map((product,index) => ({
  id:product.id,name:product.name,article:product.article,wbArticle:String(900000001+index),
  status: (index===1 || index===3 ? 'attention':'active') as ProductStatus,
  category:'Одежда',price:product.price,orders:product.units,buyouts:buyouts[index],returns:returns[index],
  note:index===3 ? 'В демо-выборке отсутствуют возвраты. Продажи и выручка не рассчитаны.' : index===1 ? 'Демонстрационный статус: обратите внимание на долю выкупа.' : 'Полная демонстрационная выборка за указанный период.',
 })),
 {id:'5',name:'Рубашка из хлопка, свободный силуэт',article:'PB-SHIRT-05',wbArticle:'900000005',status:'archived',category:'Одежда',price:2900,orders:0,buyouts:0,returns:0,note:'Архивный демо-товар: за этот период нет заказов. Нули известны, а доля выкупа не рассчитана.'},
 {id:'6',name:'Топ трикотажный с круглым вырезом',article:'PB-TOP-06',wbArticle:'900000006',status:'active',category:'Одежда',price:1800,orders:null,buyouts:null,returns:null,note:'Демо-пример отсутствия данных: неизвестные показатели не подменяются нулями.'},
];
export const productMetricLabels = {sales:'Продажи, шт.',orders:'Заказы',buyoutRate:'Выкуп',returns:'Возвраты, шт.',revenue:'Выручка'} as const;
export type ProductMetric = keyof typeof productMetricLabels;
export function getProductMetrics(product:MockCatalogueProduct):Record<ProductMetric,number|null> {
 const sales = product.buyouts===null || product.returns===null ? null : product.buyouts-product.returns;
 return {sales,orders:product.orders,buyoutRate:product.orders===null || product.buyouts===null || product.orders===0 ? null : product.buyouts/product.orders,returns:product.returns,revenue:sales===null ? null : sales*product.price};
}
export const productSortOptions = {
 revenue_desc:'Выручка: по убыванию',revenue_asc:'Выручка: по возрастанию',
 sales_desc:'Продажи: по убыванию',orders_desc:'Заказы: по убыванию',
 buyoutRate_desc:'Выкуп: по убыванию',returns_desc:'Возвраты: по убыванию',name_asc:'Название: А–Я',
} as const;
export type ProductSort = keyof typeof productSortOptions;
export function queryMockProducts(query:string,status:string,sort:ProductSort) {
 const needle=query.trim().toLocaleLowerCase('ru-RU');
 return mockCatalogueProducts.filter(p => (!status || p.status===status) && (p.name+' '+p.article+' '+p.wbArticle).toLocaleLowerCase('ru-RU').includes(needle)).sort((a,b) => {
  if(sort==='name_asc') return a.name.localeCompare(b.name,'ru');
  const metric=sort.split('_')[0] as ProductMetric;
  const left=getProductMetrics(a)[metric],right=getProductMetrics(b)[metric];
  // Unknown values sort last in BOTH directions. Known zero remains a real value.
  if(left===null && right===null) return a.id.localeCompare(b.id);
  if(left===null) return 1;
  if(right===null) return -1;
  return (sort.endsWith('_asc') ? left-right:right-left) || a.id.localeCompare(b.id);
 });
}
