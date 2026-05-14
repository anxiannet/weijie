# 后端规范

本文件约束维界项目的后端、数据与存储实现。

## 技术栈

- Supabase
- PostgreSQL
- Supabase Auth
- Cloudflare R2
- Next.js Route Handlers
- Next.js Server Actions

## 基本原则

- 生产数据以 Supabase 为准。
- 不在前端暴露服务端密钥。
- 不提交任何密钥到 Git。
- `.env.local` 只用于本地。
- 数据结构要清晰，便于后续扩展。

## 环境变量

Supabase：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Cloudflare R2：

- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PUBLIC_BASE_URL`

注意：

- `NEXT_PUBLIC_` 开头的变量会暴露给浏览器。
- 服务端密钥不能加 `NEXT_PUBLIC_`。
- 修改 Vercel 环境变量后必须重新部署。

## Supabase

Supabase 负责：

- 用户认证
- 用户资料
- 房源数据
- 收藏
- 评论

数据库 schema 以 `supabase/migrations` 为准。

新增表或字段时，应同步更新 TypeScript 类型。

## 认证

认证相关逻辑应保持清晰：

- 登录
- 注册
- 退出
- 当前用户读取

涉及注册和邮箱确认时，要考虑 Supabase 后台配置。

不要把认证错误直接原样暴露给用户，应翻译成清晰中文。

## 房源数据

房源应支持：

- 标题
- 描述
- 位置
- 附近学校
- MRT
- 租金
- 户型
- 图片
- 设施
- 状态
- 收藏
- 评论

房源列表应只展示 `published` 状态。

## 图片存储

图片上传使用 Cloudflare R2。

上传流程：

1. 用户登录
2. 前端请求 `/api/uploads/presign`
3. 后端生成 R2 signed URL
4. 前端 PUT 上传图片
5. 前端保存公开图片 URL
6. 房源提交时写入 `image_urls`

R2 bucket 需要配置：

- 公开访问域名
- CORS
- 读写 API token

## API 规则

Route Handler 应返回清晰 JSON：

- 成功数据
- 中文错误消息
- 合理 HTTP status

不要在响应中泄露密钥、堆栈或内部配置。

## Server Actions

Server Actions 用于：

- 创建房源
- 收藏切换
- 评论
- 登出

操作成功后应按需：

- `revalidatePath`
- `redirect`

## 安全规则

禁止：

- 提交 `.env.local`
- 在客户端使用 service role key
- 在错误消息中暴露 secret
- 绕过用户登录创建用户数据
- 允许未校验文件类型上传

## 验证

后端或数据相关改动后优先执行：

- `npm run typecheck`

涉及上传时，还要验证：

- R2 环境变量完整
- bucket CORS 已配置
- 自定义域名可公开访问
- 上传后图片 URL 可访问
