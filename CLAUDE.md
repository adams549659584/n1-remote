# N1 遥控器（uni-app）

斐讯 N1 电视盒子（YYF 系统）的局域网遥控器，uni-app 双端（H5 + 微信小程序）。

## 技术栈

Vue3 + TypeScript + Vite + uni-app。**刻意保持最小化**：只装 `uni-h5` 与 `uni-mp-weixin` 两个平台包，
不引入 uview-plus / pinia / vue-i18n / sass。界面全部自绘，样式为纯 CSS + CSS 变量。

## 核心约束（改代码前必读）

### 1. H5 端必须用 `no-cors` + `text/plain` 发请求

N1 的 HTTP 服务不返回任何 CORS 响应头。若用 `Content-Type: application/json`，浏览器会先发
OPTIONS 预检 → 预检失败 → **真正的 POST 根本不会发出**。

所以 `src/utils/net.ts` 的 H5 分支用：

```ts
fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body })
```

走 CORS「简单请求」绕过预检。**不要"顺手规范化"成 `application/json`，那会让 H5 端彻底失效。**

副作用：no-cors 下响应不可读，因此只能用 resolve/reject 当作在线/离线判据。
遥控场景本来也不需要解析响应，可接受。

### 2. 平台分流靠条件编译

`net.ts` 用 `#ifdef H5` / `#ifndef H5` 在**模块顶层**给 `let transport` 赋值，而不是在函数体内写两段
`return`——后者会触发 vue-tsc 的 unreachable code 报错。

改动后务必验证条件编译真的生效：

```bash
grep -c "no-cors" dist/build/h5/assets/*.js      # H5 产物应有，小程序产物应为 0
grep -c "request" dist/build/mp-weixin/utils/net.js
```

### 3. 小程序请求局域网 IP 是官方支持的

微信官方文档（[局域网通信](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/mDNS.html)）明确：

> `wx.request` / `wx.connectSocket` / `wx.uploadFile` / `wx.downloadFile` 的 url 参数允许为
> `${IP}:${PORT}/${PATH}` 的格式，当且仅当 IP 与手机 IP 处在同一网段且不与本机 IP 相同
> （一般来说，就是同一局域网，如连接在同一个 wifi 下）时，请求/连接才会成功。
>
> **在这种情况下，不会进行安全域的校验，不要求必须使用 https/wss，也可以使用 http/ws。**

即：**局域网 IP 免安全域校验，不要求 HTTPS**。前提是手机与盒子同网段、目标非本机 IP。
所以小程序端**不需要**内网穿透或中转网关。

`manifest.json` 里 `mp-weixin.setting.urlCheck: false` 只影响开发者工具，与真机无关。

> ⚠️ 该结论来自官方文档，**尚未经真机实测确认**。首次发布前请用体验版真机验证一次。

### 4. H5 必须用 http 提供，不能用 https

页面若以 `https://` 提供，浏览器会拦截对局域网 `http://` 的请求（混合内容）。

### 5. rpx 封顶写在 pages.json，不是 manifest.json

`rpxCalcMaxDeviceWidth` 等三个键必须放在 `pages.json` 的 `globalStyle` 里——uni-h5 运行时读的是
`__uniConfig.globalStyle`，manifest 的 h5 段这几个键没有任何代码读取（实测过，不生效）。

## 目录结构

```
src/
├── config/keys.ts        按键码表 + D-pad / 功能键布局元数据
├── utils/net.ts          平台分流传输层（CORS 绕过，风险最高）
├── utils/storage.ts      IP 持久化 + normalize + IPv4 校验
├── api/n1.ts             sendKey / openSetting / ping，含 mock 开关
├── components/
│   ├── RemoteKey.vue     通用按键（circle / pill，纯 CSS chevron 箭头）
│   ├── KeyIcon.vue       线性图标（内联 SVG 转 data URI）
│   ├── IpDialog.vue      IP 设置弹窗
│   └── ConfirmDialog.vue 通用确认弹窗
└── pages/index/index.vue 唯一页面
```

## 设计规范

深色玻璃拟态，参考 Apple / 小米 HyperOS。CSS 变量定义在 `App.vue` 的 `page` 选择器：

```
--bg-0 #0a0e17   --bg-glow #1a2338   --surface rgba(255,255,255,.055)
--surface-hi rgba(255,255,255,.14)   --border rgba(255,255,255,.1)
--text #e9edf5   --text-dim #7c879c
--accent #4c8dff  --accent-hi #6ba6ff  --danger #ff4d5e
```

材质系统（务必保持统一，否则页面观感割裂）：

- **顶光渐变**：光源从正上方来，表面由上到下由亮到暗
- **内高光**：顶边 1px `inset` 白色高光，模拟玻璃边缘折射
- **接触阴影**：近处紧贴小阴影 + 远处扩散大阴影，形成悬浮高度
- **按压物理感**：按下时阴影收缩 + 内阴影，视觉上"陷进去"，而非单纯缩小
- **语义色**：主操作 = 磨砂白玻璃（OK 键、保存按钮），危险操作 = 红（电源键、关机按钮）

单位约定：主用 `rpx`；**边框一律用 `1px` 而非 `1rpx`**（1rpx 在部分 DPR 下会被舍入成 0 而消失）。
根容器 `max-width: 480px`，桌面端居中显示为手机框。

## 常用命令

```bash
pnpm install
pnpm dev:h5            # 开发（默认走 mock，点键会 toast 出实际 payload）
pnpm dev:mp-weixin     # 导入 dist/dev/mp-weixin 到微信开发者工具
pnpm build:h5
pnpm build:mp-weixin
pnpm typecheck         # vue-tsc --noEmit

docker build -t n1-remote .            # 多阶段构建：Node 编译 + darkhttpd 运行
docker run -d -p 8080:8080 n1-remote
```

### 关于 pnpm-workspace.yaml

该文件是 pnpm 自动生成的，但**必须保留 `packages` 字段**。pnpm 9（Docker 构建用）缺少该字段会报
`packages field missing or empty` 而无法执行任何脚本；本地 pnpm 11 容忍这一点，所以本地跑得通不代表
Docker 里跑得通。改动后请实际跑一次 `docker build` 验证。

`.env.development` 的 `VITE_USE_MOCK=true` 会让 `api/n1.ts` 走 mock 分支、不真正发请求。
**真机验证网络链路前必须设为 `false`**，否则验证的是假链路。

## 验证方式

无真实 N1 盒子时，起一个本地回显服务器验证真实网络路径：

```bash
node -e "require('http').createServer((q,s)=>{let b='';q.on('data',d=>b+=d);q.on('end',()=>{console.log(q.method,q.url,q.headers['content-type'],b);s.end('ok')})}).listen(8080)"
```

IP 填开发机的局域网 IP，用手机浏览器打开 `vite dev --host` 暴露的地址。这一步能同时验证：
请求是否真的送达（看 node 日志）、Content-Type 是否被服务端接受、手机上 rpx 与安全区是否正常。

## 子代理使用规则

遵循全局 `~/.claude/rules/multi-agent-protocol.md`。本项目具体分工：

- **haiku**：文案调整、格式整理、单文件小改
- **sonnet**：默认执行代理。编码、样式调整、构建验证
- **opus**：规划、架构判断、高风险审阅（如 CORS 方案、条件编译正确性）

流程：复杂任务先 `EnterPlanMode` 探索并出方案 → opus 规划 → sonnet 执行 → opus 审阅。

**样式类任务必须实际截图验证。** 不要只看 computed style 就下结论——前几轮多次出现
"computed 值正确但视觉效果不对"的情况（如箭头方向偏转 90°、齿轮 path 是歪扭星形）。
用 Playwright 以 390×844 视口截图，并用 Read 工具实际查看图片。

**注意**：Playwright 截图只能写入工作区目录，验证完删除临时文件。

## 按键码表

上19 下20 左21 右22 返回4 音量+24 音量-25 主页3 菜单82 确认23 电源26

改动 `config/keys.ts` 时需与盒子实际协议核对。
