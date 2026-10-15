import { Component } from 'react';
import type { ReactNode } from 'react';
export class AppErrorBoundary extends Component<{children: ReactNode}, {failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() {
    if (this.state.failed) return <main className="empty-state"><h1>Не удалось открыть приложение</h1><p>Попробуйте загрузить страницу ещё раз. Это локальное демо, ваши данные не изменены.</p><button className="button" onClick={() => window.location.reload()}>Перезагрузить страницу</button></main>;
    return this.props.children;
  }
}
