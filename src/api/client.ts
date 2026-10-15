import type {DashboardResponseContract} from './contracts/dashboard';
const base=import.meta.env.VITE_API_BASE_URL||'/api';
export class ApiError extends Error {constructor(public status:number,public detail:string){super(detail)}}
function isDashboardResponse(value:unknown):value is DashboardResponseContract {if(!value||typeof value!=='object')return false;const p=value as Record<string,unknown>;const period=p.period;return p.schema_version==='dashboard.v1'&&typeof p.seller_id==='number'&&typeof p.generated_at==='string'&&!!period&&typeof period==='object'&&typeof (period as Record<string,unknown>).date_from==='string'&&typeof (period as Record<string,unknown>).date_to==='string'&&Array.isArray(p.sku_economics)&&!!p.financial&&typeof p.financial==='object'&&!!p.operations&&typeof p.operations==='object'&&!!p.advertising&&typeof p.advertising==='object'&&!!p.data_status&&typeof p.data_status==='object'&&Array.isArray(p.warnings)}
export async function postDashboard(dateFrom:string,dateTo:string,signal?:AbortSignal):Promise<DashboardResponseContract>{const response=await fetch(`${base}/analytics/period/v2`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({date_from:dateFrom,date_to:dateTo}),signal});let payload:unknown;try{payload=await response.json()}catch{payload={detail:'invalid_json'}}if(!response.ok){const detail=typeof payload==='object'&&payload&&'detail' in payload?String((payload as {detail?:unknown}).detail):'request_failed';throw new ApiError(response.status,detail)}if(!isDashboardResponse(payload))throw new ApiError(502,'invalid_dashboard_response');return payload}

export async function getProducts(sellerId:number, search:string, signal?:AbortSignal):Promise<import('./contracts/products').ProductsResponseContract>{
 const url=`${base}/products?seller_id=${sellerId}&search=${encodeURIComponent(search)}&limit=100&offset=0`;
 const response=await fetch(url,{signal}); let payload:unknown; try{payload=await response.json()}catch{payload={detail:'invalid_json'}}
 if(!response.ok) throw new ApiError(response.status,typeof payload==='object'&&payload&&'detail' in payload?String((payload as {detail?:unknown}).detail):'request_failed');
 return payload as import('./contracts/products').ProductsResponseContract;
}
