
# 美容院內部預約系統

## 项目概述
这是一个美容院内部预约系统，支持预约表单、预约日历、所有预约查看和Excel客户资料上传功能。

## 功能特性
- 预约表单：支持姓名自动联想和客人编号自动填入
- 预约日历：显示香港公共假期和预约信息
- 所有预约：按时间排序显示所有预约并提供删除功能
- Excel上传：支持客户资料上传
- 响应式设计：适配电脑端和手机端
- 美容院风格：使用粉色和金色主题颜色

## 数据同步说明
当前版本已集成 Supabase 数据库，实现电脑端和手机端的数据同步。

## 部署到 Vercel

### 1. 部署到 GitHub
1. 创建新的 GitHub 仓库
2. 将此项目代码推送到 GitHub 仓库

### 2. 部署到 Vercel
1. 访问 [Vercel](https://vercel.com)
2. 连接您的 GitHub 账户
3. 选择包含此项目的仓库
4. 在部署设置中添加以下环境变量：
   - `VITE_SUPABASE_URL`: https://ibrxhnojlhdnqgnzflch.supabase.co
   - `VITE_SUPABASE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlicnhobm9qbGhkbnFnbnpmbGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxOTcwMDMsImV4cCI6MjA3NTc3MzAwM30.46Z1ZrEK6AxTpEOaRwvVwulU0PzSGp5-PZSgIdrq4KU
5. 点击部署

### 3. 使用的构建工具
- Vite: 用于开发和构建
- React: 前端框架
- TypeScript: 类型检查
- Supabase: 数据库和实时功能

## 开发环境设置
1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 生产构建
运行以下命令生成生产版本：
```bash
npm run build
```

## 本地开发
要进行本地开发，请确保已创建 `.env` 文件并配置了正确的 Supabase 凭据。

## 注意事项
- 项目已集成 Supabase 数据库，实现真正的跨设备数据同步
- 所有预约和客户数据将存储在 Supabase 数据库中
- 实时功能确保多用户同时操作时数据同步
