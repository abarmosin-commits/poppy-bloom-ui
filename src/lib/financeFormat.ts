const money=new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0});
export const formatFinanceMoney=(n:number|null)=>n===null?'—':money.format(n);
export const formatFinancePercent=(n:number|null)=>n===null?'—':new Intl.NumberFormat('ru-RU',{style:'percent',maximumFractionDigits:1}).format(n);
