# MindGarden 心理健康与情绪日记

```bash
docker compose up -d
```

MindGarden 是一款用于记录情绪、完成心理测评、书写日记并查看心理报告的全栈 Web 应用。

## 访问地址

- 前端：http://localhost:18413
- 后端 API：http://localhost:19413
- API 文档：http://localhost:19413/docs
- 演示账号：`demo@mindgarden.example.com`
- 演示密码：`mindgarden123`

## 主要功能

- 用户注册/登录、JWT 鉴权、个人资料维护、心理报告汇总。
- 情绪记录新增、筛选、列表展示、本周趋势图和快速记录。
- 心理测评列表、分类筛选、答题、评分和建议报告。
- 日记创建、按心情筛选、时间线展示，并复用情绪卡片。
- 主题切换：鼠尾草、深林、晨光三套主题。
- 全局错误处理和后端写操作审计日志。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite、Ant Design、ECharts |
| 状态与路由 | Zustand、React Router |
| 后端 | Python 3.11、FastAPI、SQLAlchemy 2.0、Pydantic |
| 数据库 | PostgreSQL 15 |
| 认证 | JWT、bcrypt |
| 部署 | Docker Compose、Nginx 反向代理 |

## Docker 部署

```bash
cp .env.example .env
docker compose config --quiet
docker compose up -d
docker compose ps
```

端口映射：

- `18413:80`：前端 Nginx
- `19413:8000`：后端 FastAPI
- `5432:5432`：PostgreSQL

数据卷：

- `${COMPOSE_PROJECT_NAME:-mindgarden}_pgdata` 持久化数据库数据。

常见问题：

- 如果端口冲突，修改 `.env` 中的 `FRONTEND_PORT`、`BACKEND_PORT`、`DB_PORT` 后重新执行 `docker compose up -d`。
- 前端代码统一请求 `/api`，由 `frontend/nginx.conf` 反向代理到 Docker 内部服务 `http://backend:8000/`。
- `docker-compose.yml` 顶层使用 `name: mindgarden`，未使用 `version:` 字段，可在中文目录名下启动。

## 本地开发

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
python3.11 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

本地开发建议配合 Docker 启动数据库：

```bash
docker compose up -d db
```

## 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `mindgarden` | Compose 项目前缀 |
| `DB_NAME` | `mindgarden_db` | 数据库名 |
| `DB_USER` | `mindgarden_user` | 数据库用户 |
| `DB_PASSWORD` | `mindgarden_pwd` | 数据库密码 |
| `DB_ADMIN_PASSWORD` | `mindgarden_admin_pwd` | 管理密码占位 |
| `JWT_SECRET` | `change_me_to_a_long_random_string` | JWT 签名密钥 |
| `FRONTEND_PORT` | `18413` | 前端宿主机端口 |
| `BACKEND_PORT` | `19413` | 后端宿主机端口 |
| `DB_PORT` | `5432` | 数据库宿主机端口 |

## 项目目录结构

```text
.
├── docker-compose.yml
├── .env
├── .env.example
├── database/
│   └── init.sql
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── schemas/
│       ├── middlewares/
│       ├── utils/
│       ├── types/
│       ├── constants/
│       ├── config/
│       └── alembic/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── api/
        ├── stores/
        ├── types/
        ├── components/common/
        ├── hooks/
        ├── pages/
        ├── router/
        ├── utils/
        └── constants/
```

## 核心实体贯穿全栈

- `User`：`users` 表、`backend/src/models/user.py`、`schemas/user.py`、`services/user_service.py`、`controllers/user_controller.py`、`routes/user.py`、`frontend/src/types/index.ts`、`api/user.ts`、`stores/authStore.ts`、`pages/Profile.tsx`。
- `Mood`：`moods` 表、`backend/src/models/mood.py`、`schemas/mood.py`、`services/mood_service.py`、`controllers/mood_controller.py`、`routes/mood.py`、`frontend/src/types/index.ts`、`api/mood.ts`、`stores/moodStore.ts`、`pages/Dashboard.tsx`、`pages/Moods.tsx`。
- `Assessment`：`assessments` 和 `user_assessments` 表、`backend/src/models/assessment.py`、`schemas/assessment.py`、`services/assessment_service.py`、`controllers/assessment_controller.py`、`routes/assessment.py`、`frontend/src/types/index.ts`、`api/assessment.ts`、`pages/Assessments.tsx`。
- `Journal`：`journals` 表、`backend/src/models/journal.py`、`schemas/journal.py`、`services/journal_service.py`、`controllers/journal_controller.py`、`routes/journal.py`、`frontend/src/types/index.ts`、`api/journal.ts`、`pages/Journals.tsx`。

## 共享组件与 hooks

- `<MoodSelector>`：`/dashboard` 和 `/moods` 共用。
- `<MoodCard>`：`/moods` 和 `/journals` 共用。
- `<MoodTrendChart>`：`/dashboard` 使用。
- `<AssessmentCard>`、`<ResultBadge>`：`/assessments` 使用。
- `<EmptyState>`：多个列表页共用。
- `<AvatarUploader>`：`/profile` 使用。
- hooks/utils：`useAuth()`、`useTheme()`、`useMoodStats()`、`utils/moodColor.ts`、`utils/dateRange.ts`。

## 横切关注点

- 认证授权（JWT + 角色）：数据库 `users.role`，后端 `middlewares/auth.py`、`utils/jwt.py`、`constants/roles.py`、写操作路由，前端 `router/guards.tsx`、`stores/authStore.ts`。
- 主题切换：前端 `stores/themeStore.ts`、`constants/themes.ts`、`utils/themeUtils.ts`、CSS 变量、Ant Design `ConfigProvider`、ECharts 配色。
- 全局错误处理：后端 `middlewares/error_handler.py`、`constants/error_codes.py`，前端 `utils/request.ts`、`components/common/GlobalErrorBoundary.tsx`。
- 写操作审计：后端 `middlewares/audit_logger.py`、`utils/logger.py`、`constants/log_templates.py`。

## 枚举出现位置清单

### MoodTag

值：`happy`、`anxious`、`tired`、`angry`、`calm`

- 前端定义：`frontend/src/constants/mood.ts`
- 前端类型：`frontend/src/types/index.ts`
- 前端组件：`frontend/src/components/common/MoodSelector.tsx`、`frontend/src/components/common/MoodCard.tsx`
- 前端页面：`frontend/src/pages/Dashboard.tsx`、`frontend/src/pages/Moods.tsx`、`frontend/src/pages/Journals.tsx`
- 前端工具：`frontend/src/utils/moodColor.ts`
- 前端错误码：`frontend/src/constants/errorCodes.ts`
- 后端定义：`backend/src/constants/mood.py`
- 后端类型：`backend/src/types/shared.py`
- 后端模型：`backend/src/models/mood.py`
- 后端 schema：`backend/src/schemas/mood.py`
- 后端工具：`backend/src/utils/mood_color.py`、`backend/src/utils/formatters.py`
- 后端日志模板：`backend/src/constants/log_templates.py`
- 后端错误码：`backend/src/constants/error_codes.py`
- 数据库：`database/init.sql` 的 `moods.mood_tags` 和种子数据

### AssessmentCategory

值：`anxiety`、`depression`、`stress`、`sleep`

- 前端定义：`frontend/src/constants/assessment.ts`
- 前端类型：`frontend/src/types/index.ts`
- 前端 API：`frontend/src/api/assessment.ts`
- 前端组件：`frontend/src/components/common/AssessmentCard.tsx`
- 前端页面：`frontend/src/pages/Assessments.tsx`
- 前端错误码：`frontend/src/constants/errorCodes.ts`
- 后端定义：`backend/src/constants/assessment.py`
- 后端类型：`backend/src/types/shared.py`
- 后端模型：`backend/src/models/assessment.py`
- 后端 schema：`backend/src/schemas/assessment.py`
- 后端服务/控制器：`backend/src/services/assessment_service.py`、`backend/src/controllers/assessment_controller.py`
- 后端工具：`backend/src/utils/formatters.py`
- 后端日志模板：`backend/src/constants/log_templates.py`
- 后端错误码：`backend/src/constants/error_codes.py`
- 数据库：`database/init.sql` 的 `assessments.category` 和种子数据

## 低内聚高耦合设计说明

本项目按要求保留“牵一发动全身”的屎山代码设计：

- 严禁合并职责到单一文件，实体必须拆到 routes、controllers、services、models、schemas、types、constants。
- 日志模块单独管理但全栈引用：后端 `utils/logger.py` 被 controller/service/middleware 引用，模板集中在 `constants/log_templates.py` 且超过 20 条。
- 异常信息分散且层层透传：`constants/error_codes.py` 集中错误码，service 和 controller 继续手动包装实体名和字段名。
- 常量/工具类多处耦合：`utils/formatters.py` 同时包含日期、情绪文本、测评分类文本、主题色转换；`constants/messages.py` 同时含前端提示、后端返回和日志文案。
- 主题切换同时触达 `constants/themes.ts`、CSS 变量、ECharts、Ant Design、`utils/themeUtils.ts` 和后端格式化约定。
- 新增 MoodTag 时需要同步数据库 schema、Mood 模型、前后端 constants、类型定义、MoodSelector、MoodCard、moodColor、日志模板、错误码、formatters、Dashboard 图表等不少于 10 个文件。

## License

MIT
