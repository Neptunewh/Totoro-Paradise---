# 🦫 Totoro Paradise - 龙猫乐园

> 基于 Nuxt 3 的龙猫校园体育 Web 端，通过逆向龙猫 app API，提供阳光跑、自由跑、早操签到等功能。

> **注意**：release 版本不稳定，建议本地部署。

## 🎯 主要功能

### 📱 登录
- 微信扫码登录，自动获取用户信息（学校、学院、学号、姓名）
- 代理转发请求至 `app.xtotoro.com`，模拟 TotoroSchool iOS 客户端

### 🏃‍♂️ 阳光跑 (Sun Run)
- 适用于学校固定路线的跑步要求
- 自动生成符合要求的跑步轨迹和数据
- 支持多种学校和路线配置
- 高德地图可视化展示路线（原始路线 + 模拟路线对比）

### 🆓 自由跑 (Free Run)
- **距离设置**：0.5-20 公里任意选择
- **速度控制**：3-25 公里/小时灵活配速
- **预设模板**：轻松跑 / 标准跑 / 挑战跑
- **批量执行**：支持 1-10 次连续提交，可自定义间隔时间
- **真实数据**：自动计算配速、卡路里、步数等
- **记录管理**：查看历史记录和详情

### 🌅 早操签到 (Morning Sign)
- 获取每日签到任务（签到次数、时间窗口、签到点信息）
- 一键签到，自动使用签到点坐标
- 签到成绩统计（签到率、完成/缺签次数、成绩）
- 签到历史记录表

### 🔧 开发者工具
- **解码工具** (`/decode`)：请求数据的加解密调试

## 💡 使用步骤
1. **启动程序**：双击启动文件，等待浏览器自动打开
2. **扫码登录**：使用微信扫码完成登录
3. **选择功能**：
   - **阳光跑**：选择路线，设置参数，执行跑步
   - **自由跑**：设置距离、速度或选择预设模板，支持单次/批量执行
   - **早操签到**：查看任务，一键签到，查看成绩
4. **查看记录**：在记录页面查看历史数据

## 🛠️ 开发者指南

### 环境要求
- Node.js 16+
- pnpm 8+

### 本地开发

```bash
git clone https://github.com/Mandingo1010/totoro-paradise.git
cd totoro-paradise
pnpm install
pnpm dev
```

### 构建与运行

```bash
pnpm build
pnpm start
```

### 测试

```bash
pnpm test
pnpm test:coverage
```

### 代码检查

```bash
pnpm lint
pnpm lint:fix
```

## 🐳 部署方式

项目支持多种部署方式：

| 方式 | 配置文件 |
|------|----------|
| **Vercel** | `vercel.json` |
| **Cloudflare Workers** | `wrangler.toml` |
| **Docker** | `Dockerfile` + `docker-compose.yml` |
| **PM2** | `ecosystem.config.cjs` |
| **GitHub Actions** | `.github/workflows/deploy.yml` |

Windows 用户可使用根目录下的 `.bat` / `.ps1` 脚本一键启动。

## � 项目结构

```
totoro-paradise/
├── pages/                    # Nuxt 页面路由
│   ├── index.vue                 # 首页（微信扫码登录）
│   ├── scanned.vue               # 登录后（选择模式）
│   ├── freerun.vue               # 自由跑
│   ├── morningsign.vue           # 早操签到
│   ├── records.vue               # 跑步记录
│   ├── records/free/[id].vue     # 记录详情
│   ├── run/[route].vue           # 跑步执行
│   └── decode.vue                # 解码工具
├── components/               # Vue 组件
│   ├── FreeRunSetup.vue          # 自由跑参数设置
│   ├── FreeRunExecution.vue      # 跑步执行
│   ├── FreeRunRecords.vue        # 记录列表
│   ├── FreeRunDetail.vue         # 记录详情
│   ├── BatchRunSetup.vue         # 批量设置
│   ├── BatchRunExecution.vue     # 批量执行
│   └── AMap.client.vue           # 高德地图
├── composables/              # Vue Composables
│   ├── useSession.ts             # 用户会话管理
│   ├── useFreeRun.ts             # 自由跑状态管理
│   ├── useFreeRunConfig.ts       # 自由跑配置
│   ├── useMorningSign.ts         # 早操签到状态
│   └── useSunRunPaper.ts         # 阳光跑路线
├── server/api/               # 服务端 API
│   ├── totoro/[...slug].ts       # 代理转发到 app.xtotoro.com
│   ├── scanQr/                   # 扫码 API
│   ├── run/                      # 跑步相关 API
│   └── sunRunPaper.post.ts       # 阳光跑路线
├── src/
│   ├── classes/              # 核心类（均含单元测试）
│   │   ├── FreeRunConfig.ts          # 配置管理（单例）
│   │   ├── FreeRunDataGenerator.ts   # 跑步数据生成
│   │   ├── BatchDataGenerator.ts     # 批量数据生成
│   │   ├── RunCalculator.ts          # 跑步数据计算
│   │   ├── ParameterValidator.ts     # 参数校验
│   │   ├── RecordManager.ts          # 记录管理
│   │   ├── TemplateManager.ts        # 模板管理
│   │   ├── FreeRunErrorHandler.ts    # 错误处理
│   │   ├── EncryptionVerifier.ts     # 加密验证
│   │   ├── NetworkTrafficAnalyzer.ts # 网络分析
│   │   ├── RequestFormatAnalyzer.ts  # 请求格式分析
│   │   ├── ResponseFormatAnalyzer.ts # 响应格式分析
│   │   ├── ApiEndpointDiscovery.ts   # API 端点发现
│   │   ├── ApiSpecGenerator.ts       # API 规范生成
│   │   ├── UserSession.ts            # 用户会话
│   │   └── Vector.ts                 # 向量运算
│   ├── utils/                # 工具函数
│   │   ├── generateRoute.ts          # GPS 路线模拟
│   │   ├── distanceCalculator.ts     # 距离计算
│   │   ├── encryptRequestContent.ts  # 请求加密
│   │   ├── decryptRequestContent.ts  # 请求解密
│   │   ├── nodeRSA.ts                # RSA 加密
│   │   └── ...
│   ├── types/                # TypeScript 类型定义
│   │   ├── requestTypes/         # 请求类型（14 个）
│   │   ├── responseTypes/        # 响应类型（21 个）
│   │   └── reverseEngineering/   # 逆向工程类型
│   ├── wrappers/             # API 封装层
│   │   └── TotoroApiWrapper.ts       # 统一封装龙猫 API
│   ├── controllers/          # 控制器
│   ├── data/                 # 数据（RSA 密钥）
│   └── middlewares/          # 中间件
└── tests/                    # 测试
    ├── setup.ts                  # 测试初始化
    └── integration/              # 集成测试（5 个）
```

## � 配置说明

### 环境变量

参考 `.env.example` 和 `.env.production` 配置。

### 自由跑配置

配置通过 `FreeRunConfigManager`（单例）管理，支持 API 超时/重试、数据校验规则、UI 默认参数等。

## 🔒 技术细节

- **请求加密**：所有 API 请求通过 `encryptRequestContent` 加密，使用 RSA + 自定义加密算法
- **GPS 路线模拟**：基于向量数学和正态分布，从标准路线插值生成模拟轨迹，添加随机偏移模拟真实 GPS 漂移
- **API 代理**：服务端将 `/api/totoro/*` 请求代理转发到 `app.xtotoro.com/app/*`，伪装为 TotoroSchool iOS 客户端
- **设备伪装**：请求携带模拟设备信息（iPhone/Android），MAC 地址等

## ⚠️ 免责声明

本项目仅供学习和研究目的，请勿用于任何违反学校规定或法律法规的行为。使用本项目产生的任何后果由使用者自行承担。

## 🙏 致谢

- 原作者：[@BeiyanYunyi](https://github.com/BeiyanYunyi) & Clansty
- 源码：https://github.com/BeiyanYunyi/totoro-paradise

## 📝 License

[AGPL-3.0](LICENSE)
