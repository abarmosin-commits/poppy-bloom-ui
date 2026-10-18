import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AppErrorBoundary } from './components/AppErrorBoundary';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Advertising = lazy(() => import('./pages/Advertising'));
const Finance = lazy(() => import('./pages/Finance'));
const Sales = lazy(() => import('./pages/Sales'));
const ProductDesign = lazy(() => import('./pages/ProductDesign'));
const PrintLab = lazy(() => import('./pages/PrintLab'));
const ContentLab = lazy(() => import('./pages/ContentLab'));

export function App() {
  return <AppErrorBoundary><Routes><Route element={<AppLayout />}>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="product-design" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем Product Design…</div>}><ProductDesign /></Suspense>} />
    <Route path="print-lab" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем Print Lab…</div>}><PrintLab /></Suspense>} />
    <Route path="content" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем Content Lab…</div>}><ContentLab /></Suspense>} />
    <Route path="dashboard" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем обзор…</div>}><Dashboard /></Suspense>} />
    <Route path="products" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем товары…</div>}><Products /></Suspense>} />
    <Route path="products/:productId" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем товар…</div>}><ProductDetail /></Suspense>} />
    <Route path="advertising" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем рекламу…</div>}><Advertising /></Suspense>} />
    <Route path="finance" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем финансы…</div>}><Finance /></Suspense>} />
    <Route path="sales" element={<Suspense fallback={<div className="loading-state" role="status">Загружаем продажи…</div>}><Sales /></Suspense>} />
    <Route path="*" element={<section className="empty-state"><h1>Страница не найдена</h1><p>Проверьте адрес или вернитесь к обзору бизнеса.</p><Link className="text-link" to="/dashboard">Открыть Dashboard</Link></section>} />
  </Route></Routes></AppErrorBoundary>;
}
