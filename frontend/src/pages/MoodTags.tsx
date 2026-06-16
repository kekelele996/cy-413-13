import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Popconfirm, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { MoodTagMeta } from '../types';
import { useMoodStore } from '../stores/moodStore';
import { DEFAULT_COLOR_PALETTE, pickColorByIndex } from '../utils/moodColor';

function sanitizeTagKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 64);
}

interface EditableTag extends MoodTagMeta {
  editing?: boolean;
}

export function MoodTags() {
  const { token } = useAuth();
  const {
    allTags,
    systemTags,
    customTags,
    loadAllTags,
    createCustomTag,
    updateCustomTag,
    deleteCustomTag,
    tagsLoading,
  } = useMoodStore();

  const [form] = Form.useForm();
  const [showAdd, setShowAdd] = useState(false);
  const [editingRows, setEditingRows] = useState<Record<number, EditableTag>>({});

  useEffect(() => {
    if (token) loadAllTags();
  }, [token, loadAllTags]);

  const combined: EditableTag[] = [
    ...systemTags.map((t) => ({ ...t })),
    ...customTags.map((t) => ({ ...t, editing: !!editingRows[t.id!] })),
  ].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));

  const handleCreate = async (values: { label: string; tag_key?: string }) => {
    const rawLabel = values.label.trim();
    if (!rawLabel) {
      message.warning('请输入标签名称');
      return;
    }
    const tagKey = values.tag_key ? sanitizeTagKey(values.tag_key) : sanitizeTagKey(rawLabel);
    if (!tagKey) {
      message.warning('标签名无效，请包含字母或数字');
      return;
    }
    const exists = allTags.some((t) => t.tag_key === tagKey);
    if (exists) {
      message.warning('该标签已存在');
      return;
    }
    try {
      await createCustomTag({ tag_key: tagKey, label: rawLabel });
      message.success('标签已添加');
      form.resetFields();
      setShowAdd(false);
    } catch (e) {
      message.error('添加标签失败');
    }
  };

  const startEdit = (tag: MoodTagMeta) => {
    if (!tag.id || tag.is_system) return;
    setEditingRows((prev) => ({ ...prev, [tag.id!]: { ...tag, editing: true } }));
  };

  const saveEdit = async (id: number) => {
    const row = editingRows[id];
    if (!row) return;
    const label = row.label.trim();
    if (!label) {
      message.warning('标签名称不能为空');
      return;
    }
    try {
      await updateCustomTag(id, { label, color: row.color });
      message.success('标签已更新');
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      message.error('更新失败');
    }
  };

  const cancelEdit = (id: number) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomTag(id);
      message.success('标签已删除');
    } catch (e) {
      message.error('删除失败');
    }
  };

  const columns: ColumnsType<EditableTag> = [
    {
      title: '标签',
      dataIndex: 'tag_key',
      key: 'tag_key',
      width: 260,
      render: (_v, record) => {
        if (record.editing && record.id && editingRows[record.id]) {
          return (
            <Input
              value={editingRows[record.id].label}
              onChange={(e) =>
                setEditingRows((prev) => ({
                  ...prev,
                  [record.id!]: { ...prev[record.id!], label: e.target.value },
                }))
              }
              maxLength={64}
            />
          );
        }
        return (
          <Tag color={record.color} style={{ padding: '4px 10px', fontSize: 14 }}>
            {record.label}
          </Tag>
        );
      },
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 320,
      render: (_v, record) => {
        if (record.editing && record.id && editingRows[record.id]) {
          const editRow = editingRows[record.id];
          return (
            <Space wrap>
              {DEFAULT_COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() =>
                    setEditingRows((prev) => ({
                      ...prev,
                      [record.id!]: { ...prev[record.id!], color: c },
                    }))
                  }
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: editRow.color === c ? '2px solid #222' : '1px solid #ddd',
                    background: c,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  aria-label={`选择颜色 ${c}`}
                />
              ))}
            </Space>
          );
        }
        return (
          <Space>
            <span
              style={{
                display: 'inline-block',
                width: 20,
                height: 20,
                borderRadius: 4,
                background: record.color,
                border: '1px solid #eee',
              }}
            />
            <code className="muted">{record.color}</code>
          </Space>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'is_system',
      key: 'is_system',
      width: 120,
      render: (v: boolean) => (
        <Tag color={v ? 'blue' : 'purple'}>{v ? '系统预设' : '自定义'}</Tag>
      ),
    },
    {
      title: '使用频次',
      dataIndex: 'usage_count',
      key: 'usage_count',
      width: 120,
      sorter: (a, b) => (a.usage_count || 0) - (b.usage_count || 0),
      render: (v: number) => <strong>{v || 0} 次</strong>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_v, record) => {
        if (record.is_system) return <span className="muted">预设，不可修改</span>;
        if (record.editing && record.id) {
          return (
            <Space>
              <Button size="small" type="primary" icon={<SaveOutlined />} onClick={() => saveEdit(record.id!)}>
                保存
              </Button>
              <Button size="small" onClick={() => cancelEdit(record.id!)}>
                取消
              </Button>
            </Space>
          );
        }
        return (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => startEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除这个标签吗？"
              description="已使用该标签的情绪记录会保留，但不再显示为自定义标签。"
              onConfirm={() => handleDelete(record.id!)}
              okText="删除"
              cancelText="取消"
            >
              <Button size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <main className="page">
      <h1 className="page-title">标签管理</h1>
      <p className="page-kicker">整理你的情绪标签，查看使用频次，调整颜色和名称，让记录更贴合你的生活。</p>

      <section className="panel" style={{ marginBottom: 18 }}>
        <div className="toolbar">
          <h2>常用标签一览</h2>
          {!showAdd && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>
              新增自定义标签
            </Button>
          )}
        </div>

        {showAdd && (
          <Form
            form={form}
            layout="inline"
            onFinish={handleCreate}
            style={{ marginBottom: 16, padding: 12, background: 'rgba(99,102,241,0.06)', borderRadius: 8 }}
          >
            <Form.Item name="label" label="标签名称" rules={[{ required: true, message: '请输入标签名称' }]}>
              <Input placeholder="例如：加班、健身、独处" maxLength={64} style={{ width: 240 }} />
            </Form.Item>
            <Form.Item name="tag_key" label="英文标识（可选）">
              <Input placeholder="留空将自动生成" maxLength={64} style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  确认添加
                </Button>
                <Button
                  onClick={() => {
                    setShowAdd(false);
                    form.resetFields();
                  }}
                >
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {combined.length ? (
          <Table
            rowKey={(r) => (r.is_system ? `sys_${r.tag_key}` : `custom_${r.id}`)}
            loading={tagsLoading}
            columns={columns}
            dataSource={combined}
            pagination={{ pageSize: 20, showSizeChanger: false }}
          />
        ) : (
          <Empty description="暂无标签数据，点击右上角新增你的第一个自定义标签。" />
        )}
      </section>
    </main>
  );
}
