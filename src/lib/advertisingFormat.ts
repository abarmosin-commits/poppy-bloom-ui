import type {AdMetric} from '../data/mockAdvertising';
const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:2});
const percent=new Intl.NumberFormat('ru-RU',{style:'percent',maximumFractionDigits:2});
const integer=new Intl.NumberFormat('ru-RU');
const ratioMetrics=new Set<AdMetric>(['share','ctr','cr','drr']);
const moneyMetrics=new Set<AdMetric>(['cpm','cpc','spend','orderAmount','cpo']);
export function formatAdMetric(key:AdMetric,value:number|null){if(value===null)return '—';return ratioMetrics.has(key) ? percent.format(value):moneyMetrics.has(key) ? money.format(value):integer.format(value);}
