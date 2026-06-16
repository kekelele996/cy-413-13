import React from 'react';
import { Alert, Button } from 'antd';

interface State {
  hasError: boolean;
  message: string;
}

export class GlobalErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <Alert
            type="error"
            showIcon
            message="页面加载失败"
            description={this.state.message || 'Global[request] failed: unexpected error'}
            action={<Button onClick={() => location.reload()}>重新加载</Button>}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

