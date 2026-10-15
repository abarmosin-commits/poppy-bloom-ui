export const FINANCE_PERIODS=[1,7,30] as const;
export type FinancePeriod=typeof FINANCE_PERIODS[number];
export type FinanceScenario='data'|'empty'|'error'|'loading';
export type FinanceType='income'|'expense';
export type FinanceCategory='Продажи'|'Реклама'|'Комиссии Wildberries'|'Логистика'|'Хранение'|'Возвраты'|'Прочие расходы';
export type FinanceOperation={id:string;date:string;type:FinanceType;category:FinanceCategory;description:string;amount:number;status:'Подтверждено'|'Ожидает сверки'};
const cats:FinanceCategory[]=['Реклама','Комиссии Wildberries','Логистика','Хранение','Возвраты','Прочие расходы'];
const baseDates=Array.from({length:30},(_,i)=>{const d=new Date(Date.UTC(2026,8,15+i));return d.toISOString().slice(0,10)});
export const financeOperations:FinanceOperation[]=baseDates.flatMap((date,i)=>[
 {id:`sale-${i}`,date,type:'income',category:'Продажи',description:`Продажи за ${date}`,amount:85000+(i%7)*4300,status:i===28?'Ожидает сверки':'Подтверждено'},
 {id:`ad-${i}`,date,type:'expense',category:'Реклама',description:'Продвижение товаров',amount:6200+(i%4)*400,status:'Подтверждено'},
 {id:`fee-${i}`,date,type:'expense',category:'Комиссии Wildberries',description:'Комиссия маркетплейса',amount:11800+(i%5)*300,status:'Подтверждено'},
 {id:`log-${i}`,date,type:'expense',category:'Логистика',description:'Логистика заказов',amount:5200+(i%3)*250,status:'Подтверждено'},
 ...(i%5===0?[{id:`return-${i}`,date,type:'expense',category:'Возвраты',description:'Корректировка возвратов',amount:2100,status:'Ожидает сверки'} as FinanceOperation]:[])
]);
export function periodDates(p:FinancePeriod){return baseDates.slice(-p)}
export function getFinance(period:FinancePeriod){const dates=periodDates(period);return financeOperations.filter(x=>dates.includes(x.date))}
export function sumOps(rows:FinanceOperation[],type?:FinanceType){return rows.filter(x=>!type||x.type===type).reduce((s,x)=>s+x.amount,0)}
export function categoryTotals(rows:FinanceOperation[]){return cats.map(category=>({category,amount:rows.filter(x=>x.category===category).reduce((s,x)=>s+x.amount,0)}))}
