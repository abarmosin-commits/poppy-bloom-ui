import {useEffect,useRef,useState} from 'react';
import {Search,X} from 'lucide-react';
import {AD_PERIODS,adPeriodDates,adMetricKeys,adMetricLabels,getMockAdvertising,sortAdArticles} from '../data/mockAdvertising';
import type {AdPeriod,AdScenario,AdMetric} from '../data/mockAdvertising';
import {AdvertisingMetricsTable} from '../components/AdvertisingMetrics';
import {AdvertisingDetail} from '../components/AdvertisingDetail';
import {formatDate} from '../lib/format';
import '../styles/advertising.css';
type MockState={period:AdPeriod;scenario:AdScenario;phase:'loading'|'ready'|'empty'|'error'};
export default function Advertising(){
 const [period,setPeriod]=useState<AdPeriod>(7);
 const [query,setQuery]=useState('');const [sort,setSort]=useState('spend_desc');
 const [selectedId,setSelectedId]=useState<number|undefined>(900000001);
 const [focusDetail,setFocusDetail]=useState(false);const detailHeading=useRef<HTMLHeadingElement>(null);const searchInput=useRef<HTMLInputElement>(null);
 const [scenario,setScenario]=useState<AdScenario>('data');const [reload,setReload]=useState(0);
 const [state,setState]=useState<MockState>({period:7,scenario:'data',phase:'loading'});
 useEffect(()=>{setState({period,scenario,phase:'loading'});const timer=window.setTimeout(()=>setState({period,scenario,phase:scenario==='data' ? 'ready':scenario}),300);return ()=>window.clearTimeout(timer);},[period,scenario,reload]);
 // Never render old-period rows while a new fixture request is pending.
 const phase=state.period===period && state.scenario===scenario ? state.phase:'loading';
 const data=phase==='ready' ? getMockAdvertising(period):undefined;
 const dates=adPeriodDates(period);const range=formatDate(dates[0])+' — '+formatDate(dates.at(-1)!)+' 2026';
 const [sortMetric,direction]=sort.split('_') as [AdMetric,'asc'|'desc'];
 const rows=data ? sortAdArticles(data.articles.filter(article=>(article.name+' '+article.article+' '+article.nmId).toLocaleLowerCase('ru-RU').includes(query.trim().toLocaleLowerCase('ru-RU'))),sortMetric,direction):[];
 const selected=data?.articles.find(article=>article.nmId===selectedId);
 useEffect(()=>{if(focusDetail && phase==='ready'){detailHeading.current?.focus();setFocusDetail(false);}},[focusDetail,phase,selectedId]);
 function selectArticle(nmId:number){setSelectedId(nmId);setFocusDetail(true);}
 function resetSearch(){setQuery('');searchInput.current?.focus();}
 function restoreDemo(){setScenario('data');setReload(value=>value+1);searchInput.current?.focus();}
 return <>
 <div className="page-heading"><div><h1>Реклама</h1><p>Эффективность продвижения по артикулам Wildberries.</p></div><label className="period-control">Период аналитики<select value={period} onChange={event=>setPeriod(Number(event.target.value) as AdPeriod)}>{AD_PERIODS.map(value=><option key={value} value={value}>{value===1 ? '1 день':value+' дней'}</option>)}</select></label></div>
 <div className="ad-period-line"><span>{range}</span><span className="demo-label">Вымышленные данные · nm_id</span></div>
 <div className="ad-controls"><label className="ad-search-label">Поиск по товару или артикулу<span className="search-field"><Search size={17} aria-hidden="true" /><input ref={searchInput} type="search" aria-label="Поиск по товару, артикулу продавца или nm_id" placeholder="Название, артикул или nm_id" value={query} onChange={event=>setQuery(event.target.value)} />{query && <button className="clear-search" aria-label="Очистить поиск рекламы" onClick={resetSearch}><X size={16} aria-hidden="true" /></button>}</span></label>
 <label className="period-control">Сортировка<select value={sort} onChange={event=>setSort(event.target.value)}>{adMetricKeys.flatMap(key=>['desc','asc'].map(dir=><option key={key+'_'+dir} value={key+'_'+dir}>{adMetricLabels[key]}: {dir==='desc' ? 'по убыванию':'по возрастанию'}</option>))}</select></label></div>
 <p className="ad-note">Доля показов — доля внутри демо-выборки, не доля аукциона WB. «—» означает отсутствие базы или данных для расчёта.</p>
 <div className="ad-data-region" aria-busy={phase==='loading'}>
 {phase==='loading' ? <div className="ad-loading" role="status"><p>Загружаем демо-данные за {range}…</p><div className="ad-skeleton" aria-hidden="true" /><div className="ad-skeleton" aria-hidden="true" /><div className="ad-skeleton" aria-hidden="true" /></div>:phase==='error' ? <section className="empty-state" role="alert"><h2>Не удалось загрузить рекламные данные</h2><p>Это демонстрационная ошибка. Данные предыдущего периода не показываются. Повторная загрузка вернёт рабочий mock-пример.</p><button className="button" onClick={restoreDemo}>Повторить загрузку</button></section>:phase==='empty' ? <section className="empty-state"><h2>За этот период нет рекламных данных</h2><p>Это пустой демо-набор. Отсутствие строк не означает нулевые затраты или подтверждённую полноту данных.</p><button className="button" onClick={restoreDemo}>Показать демо-пример</button></section>:data && <>
 <p className="ad-result-count" aria-live="polite">Найдено {rows.length} из {data.articles.length} артикулов · дата данных {formatDate(dates.at(-1)!)}</p>
 {rows.length===0 ? <section className="empty-state" role="status"><h2>Артикулы не найдены</h2><p>Измените название или артикул. Поиск не меняет период аналитики.</p><button className="button" onClick={resetSearch}>Сбросить поиск</button></section>:<AdvertisingMetricsTable sortMetric={sortMetric} sortDirection={direction} identityLabel="Товар / nm_id" label="Рекламные показатели по артикулам" rows={rows.map(row=>({id:String(row.nmId),title:row.name,subtitle:'nm_id '+row.nmId+' · '+row.article,date:row.date,metrics:row.metrics,selected:row.nmId===selectedId,onSelect:()=>selectArticle(row.nmId)}))} />}
 {(rows.length>0 || selected) && <AdvertisingDetail article={selected} dates={dates} headingRef={detailHeading} />}
 </>}
 </div>
 <details className="ad-disclosure ad-definitions"><summary>Метрики и ограничения демо</summary><div><p>CTR = клики / показы; CR = заказы / клики; CPM = затраты / показы × 1000; CPC = затраты / клики; CPO = затраты / заказы; ДРР = затраты / сумма заказов. Проценты рассчитаны из сумм, а не усреднением дневных коэффициентов.</p><p>Корзины, заказы, штуки и отмены — отдельные счётчики. Сумма заказов включает отменённые заказы и не является оплатой или прибылью. CPM/CPC в метриках — эффективные затраты, модель оплаты кампании показана отдельно.</p><p>События mock-набора распределены между кампаниями без пересечений. Это не правило дедупликации или атрибуции реальных данных WB. Наличие строк и нулей не доказывает полноту реальной статистики. Последняя дата наблюдения указана отдельно от периода.</p><p>Числовые идентификаторы вымышлены. Рекомендации локальные и не используют ИИ-сервис.</p></div></details>
 <details className="ad-disclosure ad-demo-controls"><summary>Проверить состояния демо</summary><label className="period-control">Сценарий демо<select value={scenario} onChange={event=>setScenario(event.target.value as AdScenario)}><option value="data">Данные</option><option value="loading">Загрузка (пауза)</option><option value="empty">Пустой набор</option><option value="error">Ошибка</option></select></label><p className="ad-note">Локальная демонстрация состояний. Внешние запросы не отправляются.</p></details>
 </>;
}
