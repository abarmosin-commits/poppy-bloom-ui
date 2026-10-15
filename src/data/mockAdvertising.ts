// MOCK ONLY. All article/campaign IDs, rows, dates and attribution are synthetic.
// Metadata vocabulary: https://dev.wildberries.ru/en/docs/openapi/promotion
// Bid type and payment model are separate dimensions; placements are campaign
// metadata, never invented per-placement attribution. No WB/Supabase calls.
export const AD_PERIODS = [1,7,30] as const;
export type AdPeriod = typeof AD_PERIODS[number];
export type AdScenario = 'data'|'empty'|'error'|'loading';
export const AD_END_DATE='2026-10-14';
const DAY=86400000;
export function adPeriodDates(period:AdPeriod) {
 const end=Date.parse(AD_END_DATE+'T00:00:00Z');
 return Array.from({length:period},(_,index)=>new Date(end-(period-1-index)*DAY).toISOString().slice(0,10));
}
export const adArticles=[
 {nmId:900000001,name:'Платье миди с длинным рукавом',article:'PB-DRESS-01',priceKopecks:300000},
 {nmId:900000002,name:'Кардиган свободного кроя',article:'PB-CARD-02',priceKopecks:350000},
 {nmId:900000003,name:'Футболка базовая, плотный хлопок',article:'PB-TEE-03',priceKopecks:120000},
 {nmId:900000004,name:'Брюки прямые с высокой посадкой',article:'PB-PANTS-04',priceKopecks:360000},
 {nmId:900000005,name:'Рубашка из хлопка, свободный силуэт',article:'PB-SHIRT-05',priceKopecks:290000},
];
export interface AdCampaign {id:number;name:string;bidType:'manual'|'unified';paymentType:'cpm'|'cpc';placements:string[];nmIds:number[]}
export const adCampaigns:AdCampaign[]=[
 {id:101,name:'Платья и кардиганы · демо',bidType:'unified',paymentType:'cpm',placements:['Поиск','Рекомендации'],nmIds:[900000001,900000002]},
 {id:102,name:'Одежда · поиск · демо',bidType:'manual',paymentType:'cpm',placements:['Поиск'],nmIds:[900000001,900000003]},
 {id:103,name:'Одежда · клики · демо',bidType:'manual',paymentType:'cpc',placements:['Поиск и каталог'],nmIds:[900000002,900000004]},
 {id:104,name:'Брюки · рекомендации · демо',bidType:'manual',paymentType:'cpm',placements:['Рекомендации'],nmIds:[900000004]},
 {id:105,name:'Рубашки · без активности · демо',bidType:'manual',paymentType:'cpm',placements:['Поиск'],nmIds:[900000005]},
];
export const bidTypeLabels={manual:'Ручная ставка',unified:'Единая ставка'};
export const paymentTypeLabels={cpm:'CPM · за показы',cpc:'CPC · за клики'};
export const additiveKeys=['views','clicks','spendKopecks','carts','orders','units','cancellations','orderAmountKopecks'] as const;
export type AdTotals=Record<typeof additiveKeys[number],number|null>;
export interface AdFact extends AdTotals {nmId:number;campaignId:number;date:string}
// Each fixture event belongs to one article/campaign/day, with no overlaps.
// This is NOT a deduplication or completeness guarantee for real WB data.
export const mockAdFacts:AdFact[]=adPeriodDates(30).flatMap((date,day)=>adCampaigns.flatMap((campaign,campaignIndex)=>campaign.nmIds.map(nmId=>{
 const article=adArticles.find(item=>item.nmId===nmId)!;
 if(nmId===900000005) return {nmId,campaignId:campaign.id,date,views:0,clicks:0,spendKopecks:0,carts:0,orders:0,units:0,cancellations:0,orderAmountKopecks:0};
 const views=800+((day+campaignIndex+nmId%10)%9)*130;
 const clicks=nmId===900000003 ? 8+day%4 : 25+(day+campaignIndex)%20;
 const orders=nmId===900000001 ? 2+day%2 : 3+(day+campaignIndex)%4;
 const units=orders+day%2;
 const spendKopecks=nmId===900000001 ? 150000+day%3*15000 : 45000+day%5*7000;
 return {nmId,campaignId:campaign.id,date,views,clicks:nmId===900000004 && day%7===1 ? null:clicks,spendKopecks,carts:orders+3+day%5,orders,units,cancellations:day%5===0 ? 1:0,orderAmountKopecks:units*article.priceKopecks};
})));
export function sumAdFacts(rows:AdFact[]):AdTotals {
 const result={} as AdTotals;
 for(const key of additiveKeys){let sum=0;let missing=rows.length===0;for(const row of rows){const value=row[key];if(value===null){missing=true;break;}sum+=value;}result[key]=missing ? null:sum;}
 return result;
}
export const adMetricLabels={share:'Доля показов',cpm:'CPM',views:'Показы',clicks:'Клики',ctr:'CTR',cpc:'CPC',cr:'CR',spend:'Затраты',carts:'Корзины',orders:'Заказы',units:'Штуки',cancellations:'Отмены',orderAmount:'Сумма заказов',drr:'ДРР',cpo:'CPO'} as const;
export type AdMetric=keyof typeof adMetricLabels;
export const adMetricKeys=Object.keys(adMetricLabels) as AdMetric[];
export type AdMetrics=Record<AdMetric,number|null>;
function ratio(n:number|null,d:number|null){return n===null || d===null || d===0 ? null:n/d;}
export function deriveAdMetrics(total:AdTotals,shareBase:number|null):AdMetrics {
 const spend=total.spendKopecks===null ? null:total.spendKopecks/100;
 const orderAmount=total.orderAmountKopecks===null ? null:total.orderAmountKopecks/100;
 const costPerView=ratio(spend,total.views);
 return {share:ratio(total.views,shareBase),cpm:costPerView===null ? null:costPerView*1000,views:total.views,clicks:total.clicks,ctr:ratio(total.clicks,total.views),cpc:ratio(spend,total.clicks),cr:ratio(total.orders,total.clicks),spend,carts:total.carts,orders:total.orders,units:total.units,cancellations:total.cancellations,orderAmount,drr:ratio(spend,orderAmount),cpo:ratio(spend,total.orders)};
}
export interface AdArticleRow {nmId:number;name:string;article:string;date:string;metrics:AdMetrics;totals:AdTotals;facts:AdFact[]}
export function getMockAdvertising(period:AdPeriod) {
 const dates=adPeriodDates(period);
 const facts=mockAdFacts.filter(row=>row.date>=dates[0] && row.date<=dates.at(-1)!);
 const all=sumAdFacts(facts);
 const articles:AdArticleRow[]=adArticles.map(article=>{
  const rows=facts.filter(row=>row.nmId===article.nmId);const totals=sumAdFacts(rows);
  return {...article,date:rows.map(row=>row.date).sort().at(-1)!,metrics:deriveAdMetrics(totals,all.views),totals,facts:rows};
 });
 return {period,dates,articles,synthetic:true as const};
}
export function getAdCampaignBreakdown(article:AdArticleRow) {
 return adCampaigns.filter(campaign=>article.facts.some(row=>row.campaignId===campaign.id)).map(campaign=>{
  const rows=article.facts.filter(row=>row.campaignId===campaign.id);
  return {...campaign,date:rows.map(row=>row.date).sort().at(-1)!,metrics:deriveAdMetrics(sumAdFacts(rows),article.totals.views)};
 });
}
export function getAdDailyBreakdown(article:AdArticleRow) {
 return [...new Set(article.facts.map(row=>row.date))].sort().map(date=>({date,metrics:deriveAdMetrics(sumAdFacts(article.facts.filter(row=>row.date===date)),article.totals.views)}));
}
export function sortAdArticles(rows:AdArticleRow[],metric:AdMetric,direction:'asc'|'desc') {
 return [...rows].sort((a,b)=>{const x=a.metrics[metric],y=b.metrics[metric];if(x===null&&y===null)return a.nmId-b.nmId;if(x===null)return 1;if(y===null)return -1;return (direction==='asc' ? x-y:y-x)||a.nmId-b.nmId;});
}
export interface MockAdRecommendation {title:string;reason:string;action:string;effect:string}
export function getMockAdRecommendations(article:AdArticleRow):MockAdRecommendation[] {
 if(Object.values(article.totals).some(value=>value===null)) return [];
 const recommendations:MockAdRecommendation[]=[];const m=article.metrics;
 const pct=(value:number)=>new Intl.NumberFormat('ru-RU',{style:'percent',maximumFractionDigits:2}).format(value);
 const rub=(value:number)=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:2}).format(value);
 if(m.spend!==null && m.spend>0 && m.orders===0) recommendations.push({title:'Проверить расходы без заказов',reason:'В выбранной демо-выборке есть затраты, но заказы равны нулю.',action:'Проверить кампании и достаточность периода до изменения ставок.',effect:'Проверка поможет определить, оправдано ли дальнейшее расходование бюджета; результат не гарантирован.'});
 if(m.drr!==null && m.drr>.15) recommendations.push({title:'Проверить эффективность затрат',reason:'ДРР '+pct(m.drr)+' выше условного демо-порога 15%: затраты '+rub(m.spend!)+' при сумме заказов '+rub(m.orderAmount!)+'. Это основание для проверки, а не установленная причина расходов.',action:'Сравнить кампании по затратам, сумме заказов и CPO; учесть отмены и задержки атрибуции.',effect:'Можно найти кампанию для дополнительной проверки. Экономия и прибыль не прогнозируются.'});
 if(m.ctr!==null && m.ctr<.02 && (m.views ?? 0)>0) recommendations.push({title:'Проверить соответствие показов товару',reason:'CTR '+pct(m.ctr)+' ниже условного демо-порога 2%: '+m.clicks+' кликов на '+m.views+' показов.',action:'Проверить релевантность карточки и зон показа; не делать вывод о причине по одному CTR.',effect:'Проверка может помочь сформулировать гипотезу для теста. Рост заказов не гарантирован.'});
 return recommendations;
}
