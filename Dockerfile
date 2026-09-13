# ==========================================
# 阶段 1: 前端编译打包 (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 先复制包管理清单，充分利用 Docker 缓存层（依赖不变更时不重复下载）
COPY package.json pnpm-lock.yaml ./

# lockfileVersion 9 需要 pnpm 9+
RUN corepack enable && corepack prepare pnpm@9 --activate && pnpm install --frozen-lockfile

# 复制其余源代码并打包
COPY . .
RUN pnpm build:h5

# ==========================================
# 阶段 2: 极致轻量运行时 (Runtime)
# ==========================================
FROM alpine:3.20

# 安装 darkhttpd 并清理 apk 缓存
RUN apk add --no-cache darkhttpd

# 创建非 root 用户以增强容器安全性
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /var/www/htdocs

# uni-app 的 H5 产物在 dist/build/h5
COPY --from=builder --chown=appuser:appgroup /app/dist/build/h5 .

# 切换为普通用户运行
USER appuser

# 暴露服务端口（非 root 用户使用大于 1024 端口）
EXPOSE 8080

# 启动 darkhttpd
# --port 8080: 监听端口
# --log /dev/stdout: 日志直通 stdout，方便 docker logs 查看
# --no-listing: 禁止目录列表，防止未授权文件遍历
CMD ["darkhttpd", "/var/www/htdocs", "--port", "8080", "--log", "/dev/stdout", "--no-listing"]
