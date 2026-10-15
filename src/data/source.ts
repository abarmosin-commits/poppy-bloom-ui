export type DataSource='mock'|'real';
export const dataSource:DataSource=import.meta.env.VITE_DATA_SOURCE==='real'?'real':'mock';
