import { useState } from 'react';
import { Package, Info } from 'lucide-react';
import '../styles/product-design.css';

const statuses = ['Черновик', 'Требуется проверка данных', 'Готово к макету'] as const;
type DesignStatus = typeof statuses[number];

export default function ProductDesign() {
  const [status, setStatus] = useState<DesignStatus>('Черновик');
  const [style, setStyle] = useState('Минималистичный, с акцентом на товар');
  const [palette, setPalette] = useState('Молочный, лавандовый, графитовый');
  const [composition, setComposition] = useState('Товар по центру, свободный фон');
  const [accents, setAccents] = useState('Название товара\nСостав и размеры — после проверки');

  return <div className="product-design">
    <header className="page-heading"><div><h1>Product Design</h1><p>Подготовьте задание на дизайн карточки товара.</p></div><span className="demo-label">Mock-экран</span></header>
    <div className="pd-layout">
      <section className="pd-sku" aria-labelledby="pd-sku-heading">
        <h2 id="pd-sku-heading">Выбранный SKU</h2>
        <div className="pd-product-placeholder"><Package size={40} strokeWidth={1.5} aria-hidden="true" /><span>Фото не добавлено</span></div>
        <h3>Футболка базовая</h3><p className="pd-muted">Poppy Bloom · демонстрационный товар</p>
        <dl className="pd-details"><div><dt>SKU</dt><dd>PB-TSHIRT-001</dd></div><div><dt>Цвет</dt><dd>Молочный</dd></div><div><dt>Категория</dt><dd>Одежда / Футболки</dd></div></dl>
        <p className="pd-sku-note">SKU и характеристики вымышлены. Перед подготовкой макета сверьте данные товара.</p>
      </section>
      <section className="pd-editor" aria-labelledby="pd-design-heading">
        <div className="pd-section-heading"><div><h2 id="pd-design-heading">Дизайн карточки</h2><p className="pd-muted">Визуальное направление и текстовые акценты</p></div><span className={`pd-status pd-status-${statuses.indexOf(status)}`} role="status">{status}</span></div>
        <div className="pd-fields">
          <label className="pd-field">Визуальный стиль<select value={style} onChange={event => setStyle(event.target.value)}><option>Минималистичный, с акцентом на товар</option><option>Мягкий lifestyle</option><option>Контрастная предметная съёмка</option></select></label>
          <label className="pd-field">Цветовая палитра<select value={palette} onChange={event => setPalette(event.target.value)}><option>Молочный, лавандовый, графитовый</option><option>Белый, бежевый, тёмно-коричневый</option><option>Белый, чёрный, акцентный сиреневый</option></select></label>
          <label className="pd-field pd-field-wide">Композиция<select value={composition} onChange={event => setComposition(event.target.value)}><option>Товар по центру, свободный фон</option><option>Товар слева, текст справа</option><option>Крупный план и детали</option></select></label>
          <label className="pd-field pd-field-wide">Текстовые акценты<textarea rows={4} maxLength={600} value={accents} onChange={event => setAccents(event.target.value)} aria-describedby="pd-text-hint" /><span id="pd-text-hint" className="pd-hint">Укажите, что важно показать на карточке. До 600 символов.</span></label>
        </div>
        <div className="pd-status-control"><label className="pd-field">Статус задания<select value={status} onChange={event => setStatus(event.target.value as DesignStatus)}>{statuses.map(item => <option key={item}>{item}</option>)}</select></label><p className="pd-muted">Статус выбирается вручную для демонстрации и не подтверждает проверку характеристик.</p></div>
        <div className="pd-notice"><Info size={18} aria-hidden="true" /><p>Изменения доступны только на этой странице и сбросятся после её закрытия или перезагрузки. Макет не создаётся.</p></div>
      </section>
    </div>
  </div>;
}
