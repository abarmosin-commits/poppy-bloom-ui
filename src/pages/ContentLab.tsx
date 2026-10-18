import { useRef, useState } from 'react';
import { CheckCircle2, CircleDashed, FileText, Plus, TriangleAlert } from 'lucide-react';
import '../styles/content-lab.css';

type ProjectStatus = 'draft' | 'review' | 'ready';
interface Project {
  id: number;
  title: string;
  product: string;
  format: string;
  description: string;
  status: ProjectStatus;
}

const statuses = {
  draft: { label: 'Черновик', icon: CircleDashed },
  review: { label: 'Требуется проверка данных', icon: TriangleAlert },
  ready: { label: 'Готово к генерации', icon: CheckCircle2 },
};

const mockProjects: Project[] = [
  { id: 1, title: 'Льняная коллекция', product: 'Скатерть «Тёплый лён»', format: 'Описание карточки', description: 'Собрать структуру описания: материал, уход и варианты сервировки.', status: 'draft' },
  { id: 2, title: 'Детали, которые важны', product: 'Комплект наволочек «Тихое утро»', format: 'Инфографика · 5 слайдов', description: 'Перед подготовкой контента проверить состав ткани и размеры изделия.', status: 'review' },
  { id: 3, title: 'Дом к новому сезону', product: 'Плед «Мягкий вечер»', format: 'Сценарий съёмки', description: 'Brief заполнен: аудитория, ключевые акценты и список кадров.', status: 'ready' },
];

export default function ContentLab() {
  const [projects, setProjects] = useState(mockProjects);
  const [notice, setNotice] = useState('');
  const nextId = useRef(4);

  function createBrief() {
    const id = nextId.current++;
    setProjects(previous => [{ id, title: `Новый brief ${id - 3}`, product: 'Товар ещё не выбран', format: 'Формат не выбран', description: 'Локальный демонстрационный черновик. Данные доступны до перезагрузки страницы.', status: 'draft' }, ...previous]);
    setNotice('Черновик добавлен. Он хранится только на этой странице до перезагрузки.');
  }

  return <div className="content-lab">
    <div className="page-heading">
      <div><h1>Content Lab</h1><p>Проекты контента для товаров: от первого brief до подготовки к генерации.</p></div>
      <button type="button" className="button content-lab-new" onClick={createBrief}><Plus size={18} aria-hidden="true" />Новый brief</button>
    </div>

    <section className="content-lab-demo" aria-label="О демонстрации">
      <FileText size={20} aria-hidden="true" />
      <div><h2>Рабочее пространство контента</h2><p>Все проекты и статусы вымышлены. Здесь можно добавить mock-черновик; сохранение и генерация не подключены.</p></div>
    </section>

    <section aria-labelledby="content-projects-title">
      <div className="section-heading content-lab-heading"><div><h2 id="content-projects-title">Проекты</h2><p>Brief, формат и готовность данных — в одном месте.</p></div><span className="muted">Всего: {projects.length}</span></div>
      <p className="content-lab-notice" role="status">{notice}</p>
      <ul className="content-lab-projects">
        {projects.map(project => {
          const { label, icon: StatusIcon } = statuses[project.status];
          return <li key={project.id} className="content-lab-project">
            <span className={`content-lab-status content-lab-status--${project.status}`}><StatusIcon size={15} aria-hidden="true" />{label}</span>
            <h3>{project.title}</h3>
            <p className="content-lab-product">{project.product}</p>
            <p className="content-lab-description">{project.description}</p>
            <dl><div><dt>Формат</dt><dd>{project.format}</dd></div><div><dt>Источник</dt><dd>Mock-данные</dd></div></dl>
          </li>;
        })}
      </ul>
    </section>
  </div>;
}
