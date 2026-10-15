import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { productStatuses, productSortOptions } from '../data/mockProducts';
import type { ProductMetric } from '../data/mockProducts';
import { dataSource } from '../data/source';
import { getProducts, postDashboard, ApiError } from '../api/client';
import { adaptMockProducts, adaptRealProducts, productMetricValue } from '../api/adapters/products';
import type { ProductUi } from '../api/contracts/products';
import { periodScope } from '../api/adapters/dashboard';
import { ProductDetailPanel } from '../components/ProductDetailPanel';
import { formatCatalogueMetric, formatMetricValue, productDataStatus, productMetricKeys, productMetricLabels, productSummary } from '../lib/productPresentation';
import { ANALYTICS_PERIODS, DEFAULT_ANALYTICS_DAYS, demoPeriod, formatAnalyticsPeriod, parseAnalyticsDays } from '../lib/analyticsPeriod';
import { productsForPeriod } from '../lib/productPeriod';
import { useWorkspaceSource } from '../components/AppLayout';
import '../styles/products.css';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [rows, setRows] = useState<ProductUi[]>([]);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigationType = useNavigationType();
  const [query, setQuery] = useState(params.get('q') || '');
  useEffect(() => {
    if (navigationType === 'POP') setQuery(params.get('q') || '');
  }, [location.key, navigationType, params]);
  const status = params.get('status') || '';
  const sort = params.get('sort') || 'revenue_desc';
  const selectedId = params.get('product');
  const days = parseAnalyticsDays(params.get('days'));
  const period = dataSource === 'mock' ? demoPeriod(days) : periodScope(days);
  const periodLabel = formatAnalyticsPeriod(period);
  useWorkspaceSource(rows[0]?.source ?? dataSource);
  const remoteQuery = dataSource === 'real' ? query : '';
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setPhase('loading');
    setError('');
    if (dataSource === 'mock') {
      const timer = setTimeout(() => { if (active) { setRows(productsForPeriod(adaptMockProducts(), days)); setPhase('ready'); } }, 180);
      return () => { active = false; clearTimeout(timer); };
    }
    const scope = periodScope(days);
    Promise.all([getProducts(2, remoteQuery), postDashboard(scope.dateFrom, scope.dateTo, controller.signal)])
      .then(([catalog, dashboard]) => { if (active) { setRows(adaptRealProducts(catalog, dashboard)); setPhase('ready'); } })
      .catch(e => { if (active) { setError(e instanceof ApiError ? 'Backend вернул ошибку ' + e.status + ': ' + e.detail : 'Не удалось загрузить товары'); setPhase('error'); } });
    return () => { active = false; controller.abort(); };
  }, [remoteQuery, retry, days]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('ru-RU');
    const result = rows.filter(p => (!status || p.status === status) &&
      (p.name + ' ' + p.article + ' ' + p.wbArticle).toLocaleLowerCase('ru-RU').includes(needle));
    const [key, direction] = sort.split('_');
    return result.sort((a, b) => {
      if (key === 'name') return a.name.localeCompare(b.name, 'ru');
      const av = productMetricValue(a, key), bv = productMetricValue(b, key);
      if (av === null && bv === null) return a.id.localeCompare(b.id);
      if (av === null) return 1;
      if (bv === null) return -1;
      return (direction === 'asc' ? av - bv : bv - av) || a.id.localeCompare(b.id);
    });
  }, [rows, query, status, sort]);
  const summary = useMemo(() => productSummary(rows), [rows]);
  const selected = phase === 'ready' ? rows.find(p => p.id === selectedId) : undefined;
  const incomplete = rows.filter(p => ['Нет данных', 'Неполные данные', 'Требует сверки'].includes(productDataStatus(p))).length;
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };
  const closePanel = useCallback(() => {
    const next = new URLSearchParams(params); next.delete('product');
    setParams(next, { replace: true });
  }, [params, setParams]);
  const reset = () => {
    setQuery('');
    const next = new URLSearchParams();
    if (days !== DEFAULT_ANALYTICS_DAYS) next.set('days', String(days));
    setParams(next, { replace: true });
    input.current?.focus();
  };
  const select = (product: ProductUi) => update('product', product.id);
  const productStatus = (p: ProductUi) => p.status === 'unavailable' ? 'Недоступно' : productStatuses[p.status];
  const filtersChanged = !!query || !!status || sort !== 'revenue_desc';
  const sortedKey = sort.split('_')[0] as ProductMetric;
  return <>
    <div className="page-heading products-heading">
      <div><h1>Товары</h1><p>Сравните показатели и найдите артикулы, требующие внимания.</p></div>
      <div className="products-period-controls">
        <span className="products-period">{periodLabel} · {dataSource === 'mock' ? 'демо' : 'Backend · dashboard.v1'}</span>
        <div className="products-period-options" role="group" aria-label="Период товаров">
          {ANALYTICS_PERIODS.map(value => <button type="button" key={value} aria-pressed={days === value}
            onClick={() => update('days', String(value))}>{value} {value === 1 ? 'день' : 'дней'}</button>)}
        </div>
      </div>
    </div>
    <section className={'catalogue-summary' + (phase === 'ready' && !filtered.length ? ' catalogue-summary-empty' : '')} aria-label="Пять ключевых показателей">
      <p>По доступным данным · неполная выборка</p>
      <dl>{summary.map(m => <div key={m.key}>
        <dt>{productMetricLabels[m.key]}</dt>
        <dd>{phase === 'ready' ? formatMetricValue(m.value, m.key) : '—'}</dd>
        <dd className="catalogue-coverage">{m.key === 'buyoutRate' ? m.known + ' товара с заказами' : m.known + ' из ' + rows.length + ' товаров'}</dd>
      </div>)}</dl>
    </section>
    <form className="catalogue-controls" role="search" onSubmit={e => e.preventDefault()}>
      <label className="catalogue-search-label"><span>Поиск по товарам</span>
        <span className="search-field">
          <input ref={input} type="search" aria-label="Поиск по названию, артикулу продавца или WB" placeholder="Название, артикул продавца или WB"
            value={query} onChange={e => { setQuery(e.target.value); update('q', e.target.value); }} />
          {query && <button type="button" className="clear-search" aria-label="Очистить поиск товаров" onClick={() => { setQuery(''); update('q', ''); input.current?.focus(); }}><X size={16} /></button>}
        </span>
      </label>
      <label className="period-control">Статус<select value={status} onChange={e => update('status', e.target.value)}>
        <option value="">Все статусы</option><option value="active">В продаже</option><option value="attention">Требует внимания</option>
        <option value="archived">Архив</option><option value="unavailable">Недоступно</option>
      </select></label>
      <label className="period-control">Сортировка<select value={sort} onChange={e => update('sort', e.target.value)}>
        {Object.entries(productSortOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select></label>
    </form>
    {phase === 'loading' ? <div className="loading-state" role="status">Загружаем товары…</div>
      : phase === 'error' ? <section className="empty-state" role="alert"><h2>Не удалось загрузить товары</h2><p>{error}</p><button className="button" onClick={() => setRetry(n => n + 1)}>Повторить</button></section>
      : <>
        <section className="catalogue-surface" aria-label="Каталог товаров">
          <div className="catalogue-results"><p aria-live="polite">Найдено {filtered.length} из {rows.length} товаров</p>
            {filtersChanged && <button className="catalogue-reset" onClick={reset}>Сбросить фильтры</button>}
          </div>
          {filtered.length ? <>
            <div className="table-scroll catalogue-desktop" tabIndex={0} role="region" aria-label="Таблица товаров">
              <table className="catalogue-table"><colgroup><col className="catalogue-col-name" />{productMetricKeys.map(k => <col key={k} className={'catalogue-col-' + k} />)}<col className="catalogue-col-status" /><col /></colgroup>
                <thead><tr><th scope="col">Товар / артикул WB</th>{productMetricKeys.map(k => <th key={k} scope="col"
                  aria-sort={sortedKey === k ? sort.endsWith('_asc') ? 'ascending' : 'descending' : undefined}>{k === 'sales' ? 'Продажи' : k === 'returns' ? 'Возвраты' : productMetricLabels[k]}{sortedKey === k ? sort.endsWith('_asc') ? ' ↑' : ' ↓' : ''}</th>)}<th scope="col">Статус товара</th><th scope="col">Статус данных</th></tr></thead>
                <tbody>{filtered.map(p => <tr key={p.id} className={selectedId === p.id ? 'selected' : ''} onClick={() => select(p)} data-product-id={p.id}>
                  <th scope="row"><button className="catalogue-product-link" aria-label={'Открыть товар: ' + p.name} onClick={e => { e.stopPropagation(); select(p); }}>{p.name}</button>
                    <span className="product-article">{p.article} · WB {p.wbArticle}</span></th>
                  {productMetricKeys.map(k => <td key={k}>{formatCatalogueMetric(p, k)}</td>)}
                  <td className={p.status === 'attention' ? 'catalogue-warning-text' : ''}>{productStatus(p)}</td>
                  <td className={['Неполные данные', 'Нет данных', 'Требует сверки'].includes(productDataStatus(p)) ? 'catalogue-warning-text' : ''}>{productDataStatus(p)}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <ul className="catalogue-compact" aria-label="Список товаров">{filtered.map(p => <li key={p.id} className={selectedId === p.id ? 'selected' : ''}>
              <button className="catalogue-mobile-product" aria-label={'Открыть товар: ' + p.name} onClick={() => select(p)} data-product-id={p.id}>
                <span className="catalogue-mobile-name">{p.name}</span><span className="product-article">{p.article} · WB {p.wbArticle}</span>
                <span>Выручка: {formatCatalogueMetric(p, 'revenue')} · Заказы: {formatCatalogueMetric(p, 'orders')}</span>
                <span className={'catalogue-mobile-status' + (p.status === 'attention' || productDataStatus(p) === 'Нет данных' ? ' catalogue-warning-text' : '')}>{productStatus(p)} · {productDataStatus(p)}</span>
              </button>
            </li>)}</ul>
            <p className="catalogue-data-note">Нет данных ≠ 0. Выручка — по демо-формуле, без комиссий и логистики; это не прибыль.</p>
          </> : <div className="catalogue-empty"><h2>Товары не найдены</h2><p>Измените поиск или фильтр статуса.</p><button className="button catalogue-primary" onClick={reset}>Показать все товары</button></div>}
        </section>
        {!filtered.length && rows.length > 0 && <p className="catalogue-empty-note">Данные остаются в демо-каталоге. Сброс вернёт все {rows.length} товаров.</p>}
        {filtered.length > 0 && incomplete > 0 && <div className="catalogue-data-warning" role="note"><p>У {incomplete} товаров есть пропуски или ограничения в показателях. Сводка учитывает только известные значения.</p><p>Выберите строку товара, чтобы посмотреть детали и ограничения данных.</p></div>}
      </>}
    {selected && <ProductDetailPanel product={selected} periodLabel={periodLabel} onClose={closePanel} />}
  </>;
}
