# N1 遥控器

斐讯 N1 电视盒子的局域网遥控器，基于 uni-app 开发，一套代码同时构建 **H5** 与 **微信小程序**。

## 使用前必读

- **首次使用先设置盒子的 IP 地址**。点击界面左上角的状态胶囊（显示当前 IP 的那个），输入盒子的 IP
  （例如 `192.168.168.113`），点「保存」。可以点「测试连接」先确认能连通。
- **手机必须和盒子在同一个局域网内**，否则遥控器不生效。
- 盒子 IP 变化后需要重新设置。清除浏览器缓存 / 小程序缓存后也需要重新设置。
- 本遥控器**无法实现 N1 开机**，但可以关机。需要开机的话建议配一个智能插座。

### 关于平台可用性

| 平台 | 真机可用性 | 说明 |
|---|---|---|
| **H5** | ✅ 可用 | 手机浏览器直接打开即可访问局域网盒子 |
| 微信小程序 | ⚠️ 待实测 | 基础库 ≥ 2.4.0 时官方允许请求局域网 IP 且免安全域校验，但需真机验证 |

H5 页面**必须用 http 提供**（不能用 https），否则浏览器会拦截对局域网 http 的请求。

## 开发

```bash
pnpm install

pnpm dev:h5            # H5 开发服务器
pnpm dev:mp-weixin     # 小程序开发（导入 dist/dev/mp-weixin 到微信开发者工具）
pnpm build:h5          # 构建 H5
pnpm build:mp-weixin   # 构建小程序
pnpm typecheck         # 类型检查
```

### 本地调试

`.env.development` 默认 `VITE_USE_MOCK=true`，此时点击按键不会真正发请求，而是用 toast 显示将要发送的
payload，方便逐键核对按键码。

**要验证真实网络链路，把 `VITE_USE_MOCK` 改成 `false`。**

没有真实盒子时，可以起一个本地回显服务器来验证：

```bash
node -e "require('http').createServer((q,s)=>{let b='';q.on('data',d=>b+=d);q.on('end',()=>{console.log(q.method,q.url,q.headers['content-type'],b);s.end('ok')})}).listen(8080)"
```

然后把 IP 填成开发机的局域网 IP，用手机浏览器访问 `vite dev --host` 暴露的地址。

## 部署

### Docker（推荐）

```bash
# 构建镜像（内含前端编译 + 静态服务器）
docker build -t n1-remote .

# 运行
docker run -d --name n1-remote -p 8080:8080 n1-remote
```

然后手机浏览器访问 `http://<服务器局域网IP>:8080`。

镜像使用多阶段构建：Node 阶段编译前端，Alpine 阶段用 darkhttpd 提供静态服务，以非 root 用户运行。

也可以直接拉取 GitHub Actions 构建好的镜像：

```bash
docker run -d --name n1-remote -p 8080:8080 ghcr.io/<owner>/n1-remote:main
```

推送到 `main` 会构建 `main` 与 `sha-xxxxxxx` 标签；打 `v*` 标签会额外构建语义化版本标签。

### 手动部署

```bash
pnpm build:h5
cd dist/build/h5 && python3 -m http.server 8080
```

然后用手机浏览器访问 `http://<开发机局域网IP>:8080`。

## 接口说明

盒子在 8080 端口提供 HTTP 服务，无鉴权、无握手，直接 POST 即可。

### 发送按键

```
URL:  http://<盒子IP>:8080/v1/keyevent
方式: POST
Body: {"keycode": <按键代码>, "longclick": false}
```

### 打开设置界面

```
URL:  http://<盒子IP>:8080/v1/action
方式: POST
Body: {"action": "setting"}
```

### 按键代码列表

| 按键 | 代码 | 按键 | 代码 |
|---|---|---|---|
| 上 | 19 | 音量加 | 24 |
| 下 | 20 | 音量减 | 25 |
| 左 | 21 | 主界面 | 3 |
| 右 | 22 | 菜单 | 82 |
| 返回 | 4 | 确认键 | 23 |
| 电源 | 26 | | |

按键码定义在 [`src/config/keys.ts`](src/config/keys.ts)。

## 项目结构

```
src/
├── config/keys.ts        按键码表与布局元数据
├── utils/net.ts          请求传输层（H5 端 CORS 绕过）
├── utils/storage.ts      IP 持久化与校验
├── api/n1.ts             接口封装
├── components/           按键、图标、弹窗组件
└── pages/index/index.vue 主页面
```

## 技术说明

### H5 端的 CORS 处理

盒子的 HTTP 服务不返回 CORS 响应头。如果用常规的 `Content-Type: application/json`，浏览器会先发
OPTIONS 预检请求，预检失败后真正的 POST 根本不会发出。

因此 H5 端改用 `fetch(mode: 'no-cors')` + `Content-Type: text/plain` 走 CORS「简单请求」，
绕过预检直接发送。代价是响应内容不可读，但遥控场景本来也不需要解析响应。

### 技术栈

Vue3 + TypeScript + Vite + uni-app。刻意保持最小化，只装 H5 和小程序两个平台包，
不引入 UI 库和状态管理库，界面全部自绘。
