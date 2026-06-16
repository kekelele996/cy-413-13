import { Avatar, Button, Input } from 'antd';
import { useState } from 'react';
import type { User } from '../../types';

interface Props {
  user: User;
  onChange: (avatar: string) => void;
}

export function AvatarUploader({ user, onChange }: Props) {
  const [value, setValue] = useState(user.avatar || '');

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Avatar src={value} size={96}>
        {user.nickname.slice(0, 1)}
      </Avatar>
      <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder="头像 URL" />
      <Button onClick={() => onChange(value)}>更新头像</Button>
    </div>
  );
}

