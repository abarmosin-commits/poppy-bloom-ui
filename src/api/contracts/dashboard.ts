export type MetricUnit='rub'|'events'|'percent'|'rub_per_event';
export type MetricAvailability='available'|'unavailable'|'undefined';
export type MetricBasis='stored_aggregate'|'calculated_estimate'|'not_supported';
export type EvidenceState='authoritative'|'preliminary'|'unavailable';
export interface MetricContract {value:number|null;unit:MetricUnit;definition:string;availability:MetricAvailability;basis:MetricBasis;coverage_state:'unknown';warning_codes:string[];evidence_state:EvidenceState;required_sources:string[];evidence_reason_codes:string[];comparison:ComparisonContract|null}
export interface ComparisonContract {previous_value:number|null;absolute_delta:number|null;relative_percent:number|null;percentage_points:number|null;status:string;reason_codes:string[]}
export interface PeriodContract {date_from:string;date_to:string;timezone:'UTC+03:00';inclusive_days:number}
export interface PeriodCoverageContract {resolved:{requested:PeriodContract;effective:PeriodContract|null;excluded:PeriodContract|null;business_start:string|null;policy_provenance:string};sources:Record<string,unknown>}
export interface SourceStatusContract {evidence_state:'present'|'no_rows';current_rows:number;previous_rows:number|null;coverage_state:'unknown';history_state:string;row_scope:string;history_scope:string;latest_runs:unknown[];warning_codes:string[]}
export interface DashboardResponseContract {schema_version:'dashboard.v1';seller_id:number;generated_at:string;period:PeriodContract;comparison_period:PeriodContract;data_status:Record<string,SourceStatusContract>;period_coverage:PeriodCoverageContract;comparison_period_coverage:PeriodCoverageContract;financial:Record<string,MetricContract>;operations:Record<string,MetricContract>;advertising:Record<string,MetricContract>;sku_economics:SkuContract[];fulfillment:{status:string;warning_codes:string[]};warnings:Array<{code:string;source:string;metric:string|null;period_scope:string;severity:string;nm_id:number|null}>}
export interface SkuContract {seller_id:number;nm_id:number;vendor_code:string|null;title:string|null;metadata_provenance:string;metrics:Record<string,MetricContract>;fulfillment:{status:string;warning_codes:string[]}}


