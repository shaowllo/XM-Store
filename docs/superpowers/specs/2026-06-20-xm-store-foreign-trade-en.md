# XM Store 外贸独立站改造方案

> 日期：2026-06-20
> 目标市场：中东（MENA）
> 语言：英语（后续扩展阿拉伯语 RTL）

---

## 1. 概述

将现有 XM Store 中文科技数码电商网站改造为面向中东市场的英语外贸独立站。采用增量改造策略（方案 A），在保留现有架构和功能的基础上，完成国际化、货币切换、COD 支付和物流集成。

---

## 2. 改造范围

### 2.1 国际化与语言系统

- 引入 `next-intl` 管理英文 UI 文本
- 创建 `messages/en.json` 翻译文件，提取所有 UI 文本
- 当前路由结构不变（不添加 `/en` 前缀）
- 日期、数字格式使用 `en-US` locale
- 翻译覆盖范围：Navbar、Footer、产品页、结算页、订单页、用户中心、搜索、错误页、空状态等所有可见 UI 文本

### 2.2 产品数据与货币

- `src/lib/data.ts` 产品名称、描述、标签、分类改为英文
- 价格单位从 CNY（¥）切换为 USD（$）
- 全局价格格式化使用 USD 格式
- `src/lib/constants.ts` 分类名、特性列表改为英文
- 产品数据结构保持不变

### 2.3 COD 支付流程

订单状态扩展：

| 状态 | 说明 |
|------|------|
| `cod_confirmed` | COD 订单已确认 |
| `out_for_delivery` | 配送中 |
| `delivered` | 已送达 |
| `cod_paid` | 已收款（COD） |
| `cancelled` | 已取消 |

结算页改动：
- "Cash on Delivery" 为唯一支付选项
- 去除在线支付相关 UI
- 中东地址格式适配：省/城市/区/街道/地标
- 中东手机号格式验证
- 提交后显示 COD 金额和订单号

### 2.4 物流集成

新建 `src/lib/shipping/` 目录，定义统一物流适配器接口：

```typescript
interface ShippingAdapter {
  createShipment(order): ShipmentResult;
  trackOrder(trackingNumber): TrackingInfo;
  getRate(destination, items): RateInfo;
}
```

- 优先实现 **Aramex API** 集成（运单创建、标签生成、追踪）
- 订单详情页显示物流追踪状态
- 结算时根据地址和商品重量估算运费
- 后续可扩展 iMile 等物流商

---

## 3. 数据流

```
用户下单 (COD)
    ↓
订单创建 → 状态: cod_confirmed
    ↓
后台确认 → 调用 Aramex API 创建运单
    ↓
获取 trackingNumber → 更新订单
    ↓
配送中 → 状态: out_for_delivery
    ↓
用户签收付款 → 状态: delivered / cod_paid
```

---

## 4. 文件变更清单

| 文件 | 改动类型 | 说明 |
|------|---------|------|
| `messages/en.json` | 新增 | 英文翻译文件 |
| `next.config.mjs` | 修改 | 添加 next-intl 配置 |
| `src/app/layout.tsx` | 修改 | 集成 NextIntlProvider |
| `src/lib/data.ts` | 修改 | 产品英文 + USD 价格 |
| `src/lib/constants.ts` | 修改 | 分类/特性英文 |
| `src/lib/types.ts` | 修改 | 订单状态新增 COD 相关字段 |
| `src/components/order-provider.tsx` | 修改 | COD 订单状态流转 |
| `src/app/checkout/page.tsx` | 修改 | COD 支付选项 + 中东地址 |
| `src/app/orders/[id]/page.tsx` | 修改 | 物流追踪展示 |
| `src/app/orders/page.tsx` | 修改 | 状态显示英文 |
| `src/lib/shipping/adapter.ts` | 新增 | 物流适配器接口 |
| `src/lib/shipping/aramex.ts` | 新增 | Aramex 实现 |
| 所有 UI 组件 | 修改 | 中文文本替换为 `useTranslations` |

---

## 5. 非功能性需求

- 所有组件文本迁移过程保持组件原有逻辑不变
- 翻译键按组件/页面命名空间组织（如 `navbar.title`）
- 物流 API 调用走 Next.js API Route 避免暴露密钥
- 保持 PWA、主题切换、响应式设计等现有特性
