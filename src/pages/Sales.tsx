import { useEffect, useMemo, useState } from 'react';
import { getSalesAnalytics, getSalesFunnel } from '../api/adapters/sales';
import type { SalesFunnelResponse, SalesResponse } from '../api/contracts/sales';
import { ApiError } from '../api/client';
import { dataSource } from '../data/source';
import { useWorkspaceSource } from '../components/AppLayout';

const iso = (d: Date) => d.toISOString().slice(0, 10);
function scope(days: number) { const to = new Date(); const from = new Date(to); from.setUTCDate(to.getUTCDate() - days + 1); return { from: iso(from), to: iso(to) }; }
const money = (v: string | null) => v === null ? 'Недоступно' : new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(Number(v));
const count = (v: number | null | undefined) => v === null || v === undefined ? 'Недоступно' : new Intl.NumberFormat('ru-RU').format(v);

export default function Sales() {
  const [days, setDays] = useState(15); const [phase, setPhase] = useState<'loading'|'ready'|'error'>('loading');
  const [data, setData] = useState<SalesResponse>(); const [funnel, setFunnel] = useState<SalesFunnelResponse>(); const [funnelError, setFunnelError] = useState(''); const [error, setError] = useState('');
  useWorkspaceSource(dataSource);
  useEffect(() => { const controller = new AbortController(); const { from, to } = scope(days); setPhase('loading'); setError(''); setFunnel(undefined); setFunnelError('');
    if (dataSource !== 'real') { setPhase('ready'); return () => controller.abort(); }
    Promise.all([getSalesAnalytics(2, from, to, controller.signal), getSalesFunnel(2, from, to, controller.signal).catch(e => { setFunnelError(e instanceof ApiError && e.status === 503 ? 'Воронка недоступна. Требуется проверка данных.' : 'Воронка недоступна. Требуется проверка данных.'); return undefined; })])
      .then(([sales, funnelResult]) => { if (!controller.signal.aborted) { setData(sales); setFunnel(funnelResult); setPhase('ready'); } })
      .catch(e => { if (!controller.signal.aborted) { setError(e instanceof ApiError ? `Backend вернул ошибку ${e.status}: ${e.detail}` : 'Не удалось загрузить Sales API'); setPhase('error'); } });
    return () => controller.abort();
  }, [days]);
  const event = data?.summary.event_date; const cohort = data?.summary.order_cohort;
  const period = useMemo(() => data ? `${data.scope.date_from} — ${data.scope.date_to}` : 'Выбранный период', [data]);
  return <>
    <div className="page-heading"><div><h1>Продажи</h1><p>Наблюдаемые события, возвраты и cohort-данные из существующих Sales API.</p></div><label className="period-control">Период<select value={days} onChange={e => setDays(Number(e.target.value))}><option value={7}>7 дней</option><option value={15}>15 дней</option><option value={30}>30 дней</option></select></label></div>
    {dataSource !== 'real' && <div className="demo-notice"><p>Sales API доступен только в real-mode. Искусственные Sales-цифры не подставляются.</p></div>}
    {phase === 'loading' && <div className="loading-state" role="status">Загружаем Sales API…</div>}
    {phase === 'error' && <section className="empty-state" role="alert"><h2>Sales API недоступен</h2><p>{error}</p><p>Требуется проверка данных.</p></section>}
    {phase === 'ready' && dataSource === 'real' && data && <>
      <p className="finance-muted">{period} · schema {data.schema_version}</p>
      <section className="catalogue-summary" aria-label="Наблюдаемые показатели продаж"><p>Observed facts · coverage не подтверждает полноту источника</p><dl>
        <div><dt>События продаж</dt><dd>{count(event?.sales_events)}</dd></div><div><dt>Возвраты</dt><dd>{count(event?.return_events)}</dd></div><div><dt>Чистая выручка</dt><dd>{money(event?.net_revenue ?? null)}</dd></div><div><dt>Заказы cohort</dt><dd>{count(cohort?.orders)}</dd></div><div><dt>Наблюдаемый выкуп</dt><dd>{count(cohort?.observed_buyouts)}</dd></div>
      </dl></section>
      <section className="finance-panel" aria-label="Покрытие и freshness"><h2>Покрытие и качество данных</h2><p>Events: {String((data.coverage.current as any)?.event_date?.coverage_state ?? 'unknown')} · Orders cohort: {String((data.coverage.current as any)?.order_cohort?.coverage_state ?? 'unknown')}</p><p>Sales freshness: {String((data.freshness.sales as any)?.operational_state ?? 'unavailable')} · Orders freshness: unavailable</p><p>True buyout rate не рассчитывается и не показывается как подтверждённая метрика.</p>{data.warnings.length > 0 && <ul>{data.warnings.map(w => <li key={w}>{w}</li>)}</ul>}</section>
      <section className="finance-panel" aria-label="Динамика продаж"><h2>Динамика</h2><div className="finance-table-wrap"><table><thead><tr><th>Дата</th><th>События</th><th>Возвраты</th><th>Net revenue</th></tr></thead><tbody>{data.timeseries.map(row => <tr key={row.date}><td>{row.date}</td><td>{count(row.sales_events)}</td><td>{count(row.return_events)}</td><td>{money(row.net_revenue)}</td></tr>)}</tbody></table></div></section>
      <section className="finance-panel" aria-label="SKU продажи"><h2>SKU-аналитика</h2><div className="finance-table-wrap"><table><thead><tr><th>nm_id</th><th>События</th><th>Возвраты</th><th>Net revenue</th><th>Cohort orders</th><th>Evidence</th></tr></thead><tbody>{data.skus.map(row => <tr key={row.nm_id}><td>{row.nm_id}</td><td>{count((row.event_date as any).sales_events)}</td><td>{count((row.event_date as any).return_events)}</td><td>{money((row.event_date as any).net_revenue ?? null)}</td><td>{count(row.order_cohort.orders)}</td><td>{row.order_cohort_status}</td></tr>)}</tbody></table></div></section>
      <section className="finance-panel" aria-label="Воронка продаж"><h2>Воронка</h2>{funnel ? <p>Ответ funnel получен, но coverage остаётся unknown; conversion не считается подтверждённой.</p> : <p role="status">{funnelError || 'Воронка недоступна. Требуется проверка данных.'}</p>}</section>
    </>}
  </>;
}
