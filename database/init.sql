CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  birth_date DATE,
  gender VARCHAR(32),
  role VARCHAR(32) NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 10),
  mood_tags TEXT[] NOT NULL DEFAULT '{}',
  note TEXT,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  questions JSONB NOT NULL,
  scoring_rule JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_assessments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  result_level VARCHAR(64) NOT NULL,
  suggestion TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 10),
  weather VARCHAR(64),
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (email, password_hash, nickname, avatar, birth_date, gender, role)
VALUES (
  'demo@mindgarden.example.com',
  '$2b$12$KI.8UcWsVDHyuP77cQwJjuggXpY25wHfWLM12wQLD7Xq8F/Hv2FJC',
  'MindGarden Demo',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=mindgarden',
  '1995-06-15',
  'other',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO assessments (title, description, category, questions, scoring_rule)
VALUES
  (
    '7 日焦虑自查',
    '用 5 个问题快速感知最近一周的焦虑压力水平。',
    'anxiety',
    '[{"id":"q1","text":"最近一周我难以停止担心。"},{"id":"q2","text":"我经常感觉坐立不安。"},{"id":"q3","text":"睡前仍反复思考未完成事项。"},{"id":"q4","text":"我容易被小事惊扰。"},{"id":"q5","text":"我感觉身体紧绷。"}]',
    '{"low":{"max":8,"text":"低焦虑，继续保持稳定节律。"},"medium":{"max":15,"text":"中等焦虑，建议安排放松训练。"},"high":{"max":25,"text":"高焦虑，建议联系专业支持。"}}'
  ),
  (
    '睡眠恢复指数',
    '记录入睡、夜醒和晨间精力，评估睡眠恢复状况。',
    'sleep',
    '[{"id":"q1","text":"我能在 30 分钟内入睡。"},{"id":"q2","text":"夜间醒来后容易再次入睡。"},{"id":"q3","text":"醒来时感觉身体恢复。"},{"id":"q4","text":"白天不需要过量咖啡因支撑。"}]',
    '{"low":{"max":7,"text":"睡眠恢复不足，先降低睡前刺激。"},"medium":{"max":12,"text":"睡眠一般，可尝试固定起床时间。"},"high":{"max":20,"text":"睡眠恢复良好，保持节律。"}}'
  )
ON CONFLICT DO NOTHING;

INSERT INTO moods (user_id, mood_level, mood_tags, note, record_date)
SELECT id, 7, ARRAY['calm', 'happy'], '晨间冥想后状态稳定。', CURRENT_DATE - INTERVAL '6 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 5, ARRAY['tired'], '连续会议后有些疲惫。', CURRENT_DATE - INTERVAL '5 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 6, ARRAY['calm'], '晚饭后散步，情绪恢复。', CURRENT_DATE - INTERVAL '4 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 4, ARRAY['anxious'], '临近截止日期，担心进度。', CURRENT_DATE - INTERVAL '3 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 8, ARRAY['happy'], '完成了重要任务。', CURRENT_DATE - INTERVAL '2 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 6, ARRAY['calm', 'tired'], '整体平稳，需要早点休息。', CURRENT_DATE - INTERVAL '1 day' FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, 7, ARRAY['happy', 'calm'], '今天想继续保持呼吸练习。', CURRENT_DATE FROM users WHERE email = 'demo@mindgarden.example.com';

INSERT INTO journals (user_id, title, content, mood_level, weather, is_private)
SELECT id, '开始整理心情花园', '今天把近期压力写下来后，发现真正困扰我的其实是任务顺序，而不是任务数量。', 7, 'cloudy', true
FROM users WHERE email = 'demo@mindgarden.example.com'
UNION ALL
SELECT id, '一次十分钟冥想', '十分钟并没有改变所有事情，但它给了我一个暂停点。', 8, 'sunny', true
FROM users WHERE email = 'demo@mindgarden.example.com';
