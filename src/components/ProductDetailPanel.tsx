import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ProductUi } from '../api/contracts/products';
import { productStatuses } from '../data/mockProducts';
import { formatMoney } from '../lib/format';
import { formatCatalogueMetric, productDataStatus, productMetricKeys, productMetricLabels } from '../lib/productPresentation';

interface Props { product: ProductUi; periodLabel: string; onClose: () => void }
export function ProductDetailPanel({ product, periodLabel, onClose }: Props) {
  const panel = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  const quality = productDataStatus(product);
  const warning = quality === 'Неполные данные' || quality === 'Нет данных' || quality === 'Требует сверки';
  return createPortal(<>
    <div className="product-detail-backdrop" onClick={onClose} aria-hidden="true" />
    <aside ref={panel} className="product-detail-panel" role="dialog" aria-modal="true" aria-labelledby="selected-product-title"
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); onClose(); }
        if (event.key === 'Tab') {
          const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
            .filter(button => button.getClientRects().length > 0);
          if (!buttons.length) return;
          const first = buttons[0], last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }}>
      <div className="product-panel-navigation">
        <button className="product-panel-back" onClick={onClose}>К списку товаров</button>
        <span className="product-panel-caption">Детали товара</span>
        <button ref={close} className="product-panel-close" onClick={onClose}>Закрыть</button>
      </div>
      <h2 id="selected-product-title">{product.name}</h2>
      <p className="product-panel-article">{product.article} · WB {product.wbArticle}</p>
      <p className={'product-panel-status product-panel-status-' + product.status}>
        {product.status === 'unavailable' ? 'Статус недоступен' : productStatuses[product.status]}
      </p>
      <div className="product-panel-identity">
        <p>Категория: {product.category}</p>
        <p>{product.source === 'mock' ? 'Демо-цена' : 'Цена'}: {product.price === null ? 'Недоступно' : formatMoney(product.price)}</p>
      </div>
      <h3>Показатели · {periodLabel}</h3>
      <dl className="product-panel-metrics">{productMetricKeys.map(key => <div key={key}>
        <dt>{productMetricLabels[key]}</dt><dd>{formatCatalogueMetric(product, key)}</dd>
      </div>)}</dl>
      <section className={'product-panel-quality' + (warning ? ' product-panel-quality-warning' : '')} aria-label="Статус данных">
        <h3>{quality}</h3>
        <p>{product.note}{warning ? ' Неизвестные значения не заменяются нулём.' : ''}</p>
      </section>
      <p className="product-panel-disclaimer">{product.source === 'mock'
        ? 'Все показатели и артикулы вымышлены. Условная модель, не методика Wildberries.'
        : 'Показатели зависят от полноты источников и могут требовать сверки.'}</p>
    </aside>
  </>, document.body);
}
