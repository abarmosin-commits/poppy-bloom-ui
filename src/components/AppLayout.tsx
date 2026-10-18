import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { LayoutDashboard, Package, Megaphone, Wallet, ShoppingCart, Menu, X, Info, Palette, Printer, FileText } from 'lucide-react';
import { dataSource } from '../data/source';
import type { DataSource } from '../data/source';

interface WorkspaceSourceContext { reportSource: (source: DataSource) => void }
export function useWorkspaceSource(source: DataSource) {
  const context = useOutletContext<WorkspaceSourceContext | undefined>();
  const reportSource = context?.reportSource;
  useEffect(() => { reportSource?.(source); }, [reportSource, source]);
}

const navigation = [
  {to:'/product-design',label:'Product Design',detail:'Дизайн карточки',icon:Palette},
  {to:'/print-lab',label:'Print Lab',detail:'Печатные материалы',icon:Printer},
  {to:'/content',label:'Content Lab',detail:'Контент',icon:FileText},
  {to:'/dashboard',label:'Dashboard',detail:'Обзор бизнеса',icon:LayoutDashboard},
  {to:'/products',label:'Products',detail:'Товары',icon:Package},
  {to:'/advertising',label:'Advertising',detail:'Реклама',icon:Megaphone},
  {to:'/finance',label:'Finance',detail:'Финансы',icon:Wallet},
  {to:'/sales',label:'Sales',detail:'Продажи',icon:ShoppingCart},
];
export function AppLayout() {
  const [menuOpen,setMenuOpen] = useState(false);
  const location = useLocation();
  const menuButton = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  const [reportedSource, setReportedSource] = useState<{ path: string; source: DataSource }>();
  const reportSource = useCallback((source: DataSource) => {
    setReportedSource(previous => previous?.path === location.pathname && previous.source === source
      ? previous : { path: location.pathname, source });
  }, [location.pathname]);
  const alwaysMock = location.pathname === '/advertising' || location.pathname === '/finance' || location.pathname === '/product-design' || location.pathname === '/print-lab' || location.pathname === '/content';
  const actualSource = alwaysMock ? 'mock' : reportedSource?.path === location.pathname ? reportedSource.source : dataSource;
  const isMock = actualSource === 'mock';
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setMenuOpen(false); main.current?.focus(); previousPath.current = location.pathname;
    }
    document.title = (navigation.find(item => (item.to === location.pathname || location.pathname.startsWith(item.to+'/')))?.detail ?? 'Страница не найдена') + ' — Poppy Bloom UI';
  },[location.pathname]);
  useEffect(() => {
    function onKey(event:KeyboardEvent) { if(event.key === 'Escape' && menuOpen) { setMenuOpen(false);menuButton.current?.focus(); } }
    document.addEventListener('keydown',onKey); return () => document.removeEventListener('keydown',onKey);
  },[menuOpen]);
  const current = navigation.find(item => (item.to === location.pathname || location.pathname.startsWith(item.to+'/')));
  const isDashboard = location.pathname === '/dashboard';
  const isProducts = location.pathname === '/products';
  const hasApprovedShell = isDashboard || isProducts;
  return <div className={'app-shell' + (isDashboard ? ' dashboard-shell' : isProducts ? ' products-shell' : '')}>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand" aria-label="Poppy Bloom UI — обзор"><span className="brand-name">Poppy Bloom<span className="brand-dot">.</span></span><span className="brand-caption">{hasApprovedShell ? 'Аналитика Wildberries' : 'Аналитика бизнеса'}</span></NavLink>
      <nav id="desktop-navigation" aria-label="Рабочие пространства"><ul className="navigation">
        {navigation.map(({to,label,detail,icon:Icon}) => <li key={to}><NavLink to={to} className={({isActive}) => 'navigation-link'+(isActive ? ' active' : '')}>{!hasApprovedShell && <Icon size={19} aria-hidden="true" />}<span><span className="navigation-label">{hasApprovedShell ? detail : label}</span><span className="navigation-detail">{hasApprovedShell ? label : detail}</span></span></NavLink></li>)}
      </ul></nav>
      <div className="sidebar-footer"><span className="demo-label">{isMock ? 'Демо-пространство' : 'Данные backend'}</span><p>{isMock ? <>Знакомство с интерфейсом.<br />Без подключения магазина.</> : <>Полнота и актуальность данных<br />зависят от источников.</>}</p></div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="flex min-w-0 items-center gap-3"><button ref={menuButton} className="icon-button menu-toggle" aria-label={menuOpen ? 'Закрыть навигацию' : 'Открыть навигацию'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}</button><span className="topbar-title">{isDashboard ? 'Магазин / Обзор бизнеса' : isProducts ? 'Магазин / Товары' : current?.detail ?? 'Poppy Bloom UI'}</span></div>
        <span className="topbar-status"><span className="status-dot" aria-hidden="true" />{isMock ? 'Демонстрационный режим' : 'Источник: backend'}</span>
      </header>
      {<nav hidden={!menuOpen} id="mobile-navigation" className="mobile-navigation" aria-label="Рабочие пространства на мобильном"><ul className="navigation">{navigation.map(({to,label,detail,icon:Icon}) => <li key={to}><NavLink to={to} className={({isActive}) => 'navigation-link'+(isActive ? ' active' : '')} onClick={() => { setMenuOpen(false); main.current?.focus(); }}>{!hasApprovedShell && <Icon size={19} aria-hidden="true" />}<span><span className="navigation-label">{hasApprovedShell ? detail : label}</span><span className="navigation-detail">{hasApprovedShell ? label : detail}</span></span></NavLink></li>)}</ul></nav>}
      <main id="main" ref={main} tabIndex={-1} className="main-content">
        {isMock && <div className="demo-notice">{!hasApprovedShell && <Info size={17} aria-hidden="true" />}<p>{isProducts ? 'Все данные, статусы и артикулы WB вымышлены. Магазин не подключён.' : isDashboard ? 'Все данные вымышлены. Wildberries и Supabase не подключены.' : 'Вы смотрите пример. Все данные вымышлены, Wildberries и Supabase не подключены.'}</p></div>}
        <Outlet context={{ reportSource } satisfies WorkspaceSourceContext} />
        {!hasApprovedShell && <footer className="page-footer">Poppy Bloom UI<span>{isMock ? 'Только демонстрационные данные' : 'Данные backend'}</span></footer>}
      </main>
    </div>
  </div>;
}
