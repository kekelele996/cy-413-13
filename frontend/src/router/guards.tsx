import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../hooks/useAuth';

export function AuthGuard() {
  const { token, bootstrapped } = useAuth();
  if (!token && !bootstrapped) {
    return (
      <div className="page">
        <Spin tip="正在进入心情花园" />
      </div>
    );
  }
  if (!token && bootstrapped) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

