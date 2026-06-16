import { createBrowserRouter, NavLink, Navigate, Outlet } from 'react-router-dom';
import { Button, Select } from 'antd';
import { Flower2, NotebookPen, UserRound, Waves, ClipboardCheck } from 'lucide-react';
import { GlobalErrorBoundary } from '../components/common/GlobalErrorBoundary';
import { THEME_OPTIONS, type ThemeName } from '../constants/themes';
import { useTheme } from '../hooks/useTheme';
import { Assessments } from '../pages/Assessments';
import { Dashboard } from '../pages/Dashboard';
import { Journals } from '../pages/Journals';
import { Moods } from '../pages/Moods';
import { Profile } from '../pages/Profile';
import { AuthGuard } from './guards';

function Shell() {
  const { themeName, setTheme } = useTheme();
  return (
    <GlobalErrorBoundary>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <div className="brand-mark">
              <Flower2 size={20} />
            </div>
            <div>
              <div>MindGarden</div>
              <small className="muted">心理健康与情绪日记</small>
            </div>
          </div>
          <nav className="app-nav">
            <NavLink to="/dashboard"><Waves size={15} /> 心情花园</NavLink>
            <NavLink to="/moods">情绪记录</NavLink>
            <NavLink to="/assessments"><ClipboardCheck size={15} /> 心理测评</NavLink>
            <NavLink to="/journals"><NotebookPen size={15} /> 日记本</NavLink>
            <NavLink to="/profile"><UserRound size={15} /> 个人中心</NavLink>
          </nav>
          <Select
            value={themeName}
            style={{ width: 120 }}
            onChange={(value: ThemeName) => setTheme(value)}
            options={Object.entries(THEME_OPTIONS).map(([value, item]) => ({ value, label: item.label }))}
          />
        </header>
        <Outlet />
      </div>
    </GlobalErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        element: <AuthGuard />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'moods', element: <Moods /> },
          { path: 'assessments', element: <Assessments /> },
          { path: 'journals', element: <Journals /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
    ],
  },
]);

