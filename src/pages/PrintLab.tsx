import { useState } from 'react';
import { AlertTriangle, ClipboardList, FileText, Image, Printer } from 'lucide-react';
import '../styles/print-lab.css';

type PrintFormat = 'A4' | 'A5' | 'Этикетка';
const files = [
  { name: 'print-layout.pdf', label: 'Макет', icon: FileText, status: 'Draft' },
  { name: 'print-preview.png', label: 'Превью', icon: Image, status: 'Needs review' },
  { name: 'print-specification.txt', label: 'Спецификация', icon: ClipboardList, status: 'Draft' },
] as const;
export default function PrintLab() {
  const [format, setFormat] = useState<PrintFormat>('A4');
  return <div className="print-lab">
    <header className="page-heading"><div><h1>Print Lab</h1><p>Подготовка печатных материалов для проекта.</p></div><span className="demo-label">Mock-экран</span></header>
    <div className="print-lab-grid">
      <section className="print-project" aria-labelledby="print-project-title"><div className="print-section-title"><div><h2 id="print-project-title">Проект печати</h2><p className="print-muted">Весенняя коллекция · демонстрационный проект</p></div><span className="print-status print-status-draft">Draft</span></div>
        <dl className="print-details"><div><dt>Проект</dt><dd>PB Spring Insert</dd></div><div><dt>SKU</dt><dd>PB-TSHIRT-001</dd></div><div><dt>Формат</dt><dd>{format}</dd></div></dl>
        <label className="print-field">Формат<select value={format} onChange={event => setFormat(event.target.value as PrintFormat)}><option>A4</option><option>A5</option><option>Этикетка</option></select></label>
        <div className="print-warning"><AlertTriangle size={18} aria-hidden="true" /><p>Экспорт и печать пока недоступны. Проверьте макет перед передачей в production.</p></div>
      </section>
      <section className="print-preview-panel" aria-labelledby="print-preview-title"><div className="print-section-title"><div><h2 id="print-preview-title">Preview печатного макета</h2><p className="print-muted">Формат {format}, только демонстрация</p></div><Printer size={20} aria-hidden="true" /></div>
        <div className={`print-preview print-preview-${format === 'Этикетка' ? 'label' : format.toLowerCase()}`}><div className="print-preview-mark">Poppy Bloom<span>.</span></div><div className="print-preview-line" /><strong>Весенняя коллекция</strong><small>Макет будет доступен после проверки</small></div>
      </section>
    </div>
    <section className="print-files" aria-labelledby="print-files-title"><div className="print-section-title"><div><h2 id="print-files-title">Файлы проекта</h2><p className="print-muted">Версии и статусы подготовленных материалов</p></div></div><ul>{files.map(({ name, label, icon: Icon, status }) => <li key={name}><Icon size={21} aria-hidden="true" /><div><strong>{label}</strong><span>{name}</span></div><span className={`print-status ${status === 'Draft' ? 'print-status-draft' : 'print-status-review'}`}>{status}</span></li>)}</ul></section>
  </div>;
}
