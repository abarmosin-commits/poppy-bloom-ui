// MOCK ONLY: deterministic synthetic fixtures for UI development.
// Never use these records as Wildberries evidence or production data.
export const MOCK_PERIODS = [1, 7, 30] as const;
export type PeriodDays = 1|7|14|30;
const catalog = [
 {id:'1',name:'Платье миди с длинным рукавом',article:'PB-DRESS-01',price:3000,adRate:0.09},
 {id:'2',name:'Кардиган свободного кроя из смесовой пряжи',article:'PB-CARD-02',price:3500,adRate:0.2},
 {id:'3',name:'Футболка базовая, плотный хлопок',article:'PB-TEE-03',price:1200,adRate:0.08},
 {id:'4',name:'Брюки прямые с высокой посадкой',article:'PB-PANTS-04',price:3600,adRate:null},
];
export const mockDailyProducts = Array.from({length:30},(_,day) => catalog.map((product,index) => {
 const units = 3 + ((day * 3 + index * 2) % 7) + Math.floor(day / 5);
 const sales = units * product.price;
 return {...product,date:new Date(Date.UTC(2026,8,15+day)).toISOString().slice(0,10),units,sales,orders:units,adSpend:product.adRate === null ? null : Math.round(sales*product.adRate)};
})).flat();
export function getMockDashboard(days:PeriodDays) {
 const records = mockDailyProducts.filter(record => record.date >= new Date(Date.UTC(2026,8,15+30-days)).toISOString().slice(0,10));
 const daily = [...new Set(records.map(record => record.date))].map(date => {
  const rows = records.filter(record => record.date === date);
  return {date,sales:rows.reduce((sum,row) => sum+row.sales,0),orders:rows.reduce((sum,row) => sum+row.orders,0)};
 });
 const products = catalog.map(product => {
  const rows = records.filter(row => row.id === product.id);
  return {...product,units:rows.reduce((sum,row) => sum+row.units,0),sales:rows.reduce((sum,row) => sum+row.sales,0),adSpend:rows.some(row => row.adSpend === null) ? null : rows.reduce((sum,row) => sum+(row.adSpend ?? 0),0)};
 });
 return {daily,products,sales:daily.reduce((sum,row) => sum+row.sales,0),orders:daily.reduce((sum,row) => sum+row.orders,0)};
}
