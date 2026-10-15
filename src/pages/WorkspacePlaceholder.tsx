import { Link } from 'react-router-dom';
export function WorkspacePlaceholder({title,description}:{title:string;description:string}) {
  return <><div className="page-heading"><h1>{title}</h1><p>{description}</p></div><section className="empty-state"><h2>Раздел готов к следующему этапу</h2><p>Сейчас создана основа приложения. Функции этого раздела и подключение данных ещё не реализованы.</p><Link className="text-link" to="/dashboard">Посмотреть демонстрационный Dashboard</Link></section></>;
}
