import {bidTypeLabels,paymentTypeLabels,getAdCampaignBreakdown,getAdDailyBreakdown,getMockAdRecommendations} from '../data/mockAdvertising';
import type {AdArticleRow} from '../data/mockAdvertising';
import {AdvertisingMetricGrid,AdvertisingMetricsTable} from './AdvertisingMetrics';
import type {RefObject} from 'react';
import {formatDate} from '../lib/format';
export function AdvertisingDetail({article,dates,headingRef}:{article:AdArticleRow|undefined;dates:string[];headingRef:RefObject<HTMLHeadingElement|null>}) {
 const range=formatDate(dates[0])+' — '+formatDate(dates.at(-1)!)+' 2026';
 if(!article) return <section id="ad-article-detail" className="empty-state"><h2 ref={headingRef} tabIndex={-1}>Выберите артикул</h2><p>Нажмите на товар в списке, чтобы увидеть кампании, дневные данные и пример рекомендаций.</p></section>;
 const campaigns=getAdCampaignBreakdown(article);const daily=getAdDailyBreakdown(article);
 const partial=Object.values(article.totals).some(value=>value===null);
 const recommendations=getMockAdRecommendations(article);
 return <section id="ad-article-detail" className="ad-detail" aria-labelledby="ad-detail-heading"><div className="section-heading"><div><h2 id="ad-detail-heading" ref={headingRef} tabIndex={-1}>Артикул WB {article.nmId}</h2><p>{article.name} · {range}</p></div><span className="demo-label">Детализация · демо</span></div>
 <p className="ad-note">Период действует на всю панель. Поиск фильтрует только список.</p>
 <AdvertisingMetricGrid metrics={article.metrics} />
 <p className="ad-note">В итогах артикула доля показов рассчитана от всей демо-выборки; в кампаниях и днях — от показов этого артикула.</p>
 {partial && <p className="ad-warning" role="status">Неполные демо-данные. Неизвестные показатели и зависимые коэффициенты не заменяются нулями.</p>}
 <div className="ad-subsection"><h3>Кампании и фактические типы в выборке</h3><p className="ad-note">Тип ставки и модель оплаты — разные измерения. Зоны указаны из метаданных кампании; статистика по зонам не выдумывается.</p>
 <AdvertisingMetricsTable identityLabel="Кампания / тип / оплата" label={'Кампании артикула '+article.nmId} rows={campaigns.map(campaign=>({id:String(campaign.id),title:campaign.name,subtitle:'Демо ID '+campaign.id+' · '+bidTypeLabels[campaign.bidType]+' · '+paymentTypeLabels[campaign.paymentType]+' · '+campaign.placements.join(', '),date:campaign.date,metrics:campaign.metrics}))} />
 </div>
 <details className="ad-disclosure ad-subsection"><summary>Дневная статистика · {daily.length} дней</summary><AdvertisingMetricsTable identityLabel="Дата" label={'Дневная статистика артикула '+article.nmId} showDate={false} rows={daily.map(day=>({id:day.date,title:formatDate(day.date),date:day.date,metrics:day.metrics}))} /></details>
 <section className="ad-subsection ad-recommendations" aria-labelledby="ad-ai-heading"><h3 id="ad-ai-heading">ИИ-рекомендации · демонстрация</h3><p className="ad-note">{range}. Это локальные примеры по правилам mock-набора; модель ИИ не подключена. Рекомендации не подтверждают полноту реальных данных WB и не меняют ставки.</p>
 {partial ? <p className="ad-warning">Рекомендации по эффективности недоступны: отсутствуют исходные данные. Сначала нужно проверить их полноту.</p>:recommendations.length===0 ? <p className="ad-note">Отклонений от условных демо-порогов не найдено. Это не оценка состояния реальной рекламы.</p>:<ol>{recommendations.map(item=><li key={item.title}><h4>{item.title}</h4><p><strong>Почему:</strong> {item.reason}</p><p><strong>Основание:</strong> показатели выбранного артикула за {range}, приведённые выше.</p><p><strong>Действие:</strong> {item.action}</p><p><strong>Ожидаемый эффект:</strong> {item.effect}</p></li>)}</ol>}
 </section></section>;
}
