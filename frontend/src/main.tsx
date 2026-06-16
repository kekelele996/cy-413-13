import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import { themeToAntdConfig, syncThemeClassName } from './utils/themeUtils';
import './styles.css';

const Root = () => {
  const themeName = useThemeStore((state) => state.themeName);
  syncThemeClassName(themeName);

  return (
    <ConfigProvider locale={zhCN} theme={themeToAntdConfig(themeName)}>
      <AntApp>
        <RouterProvider router={router} />
      </AntApp>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);

