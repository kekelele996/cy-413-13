import { Button, Form, Input, Statistic } from 'antd';
import { useEffect } from 'react';
import { AvatarUploader } from '../components/common/AvatarUploader';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { useUserStore } from '../stores/userStore';

export function Profile() {
  const { token, user, logout } = useAuth();
  const { report, loadReport, updateProfile } = useUserStore();

  useEffect(() => {
    if (token) loadReport();
  }, [token, loadReport]);

  const profile = report?.user || user;

  return (
    <main className="page">
      <h1 className="page-title">个人中心</h1>
      <p className="page-kicker">维护个人资料，并查看情绪、测评和日记的心理报告汇总。</p>

      {profile ? (
        <section className="grid two">
          <div className="panel profile-band">
            <AvatarUploader user={profile} onChange={(avatar) => updateProfile({ avatar })} />
            <Form
              layout="vertical"
              initialValues={profile}
              onFinish={(values) => updateProfile(values)}
            >
              <Form.Item name="nickname" label="昵称">
                <Input />
              </Form.Item>
              <Form.Item name="gender" label="性别">
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">保存资料</Button>
              <Button style={{ marginLeft: 8 }} onClick={logout}>退出</Button>
            </Form>
          </div>
          <div className="panel">
            <h2>心理报告汇总</h2>
            <div className="grid three">
              <Statistic title="平均情绪" value={report?.avg_mood || 0} />
              <Statistic title="测评次数" value={report?.assessment_count || 0} />
              <Statistic title="日记篇数" value={report?.journal_count || 0} />
            </div>
          </div>
        </section>
      ) : (
        <EmptyState title="未获取到用户资料" description="请确认后端认证接口可用。" />
      )}
    </main>
  );
}

