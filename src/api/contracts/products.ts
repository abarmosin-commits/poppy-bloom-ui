import type {MetricContract} from './dashboard';
export interface ProductItemContract {seller_id:string;nm_id:string;vendor_code:string|null;title:string|null;brand:string|null;subject:string|null}
export interface ProductsResponseContract {items:ProductItemContract[];total:number;limit:number;offset:number}
export interface ProductUi {id:string;name:string;article:string;wbArticle:string;status:'active'|'attention'|'archived'|'unavailable';category:string;price:number|null;orders:number|null;buyouts:number|null;returns:number|null;note:string;metrics:Record<string,MetricContract>;evidenceState:string;availability:string;basis:string;warningCodes:string[];source:'mock'|'real'}
