---
name: memo-app-code-review
description: 审查 memo-app-desktop 项目代码质量。当需要检查代码规范、审查 pull request、提交前自查、或用户要求 review/审查/检查代码时使用。检查项包括：函数长度不超过 30 行、文件长度不超过 500 行、禁止遗留 console.log、组件 props 必须有 TypeScript 类型定义且禁止使用 any。
---

# 代码审查

对 `memo-app-desktop` 项目执行代码审查，确保代码符合以下四条强制规则。

## 审查规则

### 1. 函数长度 ≤ 30 行

每个函数（包括箭头函数、组件函数、hooks）的**有效代码行**不超过 30 行。空行和仅含注释的行不计入。

**检查方式：**
- 使用 `rg "^export (function|const) |^function |^  (const|function)"` 定位函数
- 统计函数体从 `{` 到 `}` 之间的有效行数
- 对组件内的辅助函数和 hooks 回调同样检查

**违规示例：**
```tsx
// 超过 30 行有效代码
export function MemoCard({ memo, onToggleDone, onDelete, onUpdate }: MemoCardProps): JSX.Element {
  // ... 40 行代码
}
```

**修复方式：** 提取子函数、拆分为独立组件、或将逻辑抽取到自定义 hook。

### 2. 文件长度 ≤ 500 行

每个 `.ts` / `.tsx` 源文件总行数不超过 500 行。

**检查方式：**
- 使用 `wc -l <file>` 检查每个源文件行数
- 排除 `node_modules/`、`out/`、`dist/` 目录

**修复方式：** 将大文件按功能拆分为多个模块，提取独立组件或工具函数到单独文件。

### 3. 禁止 console.log 遗留

代码中不允许存在 `console.log()` 调用。`console.error()` 和 `console.warn()` 允许。

**检查方式：**
- 使用 `rg "console\.log\("` 全局搜索
- 排除 `node_modules/`、`out/`、`dist/` 目录

**违规示例：**
```ts
console.log('memo updated:', data) // 不允许
```

**修复方式：** 直接删除调试用的 `console.log`，或替换为项目日志方案。

### 4. 组件 Props 必须有 TypeScript 类型定义，禁止 any

所有 React 组件的 props 必须有显式的 TypeScript 接口或类型别名，且**禁止使用 `any`**。

**检查方式：**
- 检查每个组件函数的参数是否有类型注解
- 检查类型定义中是否出现 `any`
- 使用 `rg ": any"` 在类型定义文件中搜索

**合规示例：**
```tsx
interface MemoCardProps {
  memo: Memo
  onToggleDone: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, content: string) => void
}

export function MemoCard({ memo, onToggleDone, onDelete, onUpdate }: MemoCardProps): JSX.Element {
```

**违规示例：**
```tsx
// 缺少类型定义
export function MyComponent(props) { ... }

// 使用了 any
interface MyProps {
  data: any
  onAction: (arg: any) => void
}
```

**修复方式：** 为 props 定义具体的接口，用 `unknown` 替代 `any`（仅在确实无法确定类型时），或使用泛型。

## 审查流程

执行审查时按以下步骤：

1. **扫描文件**：列出 `src/` 下所有 `.ts`/`.tsx` 文件（排除 `node_modules/`、`out/`、`dist/`）
2. **逐文件检查**：对每个文件执行四条规则检查
3. **汇总报告**：按严重程度输出违规列表，包含文件路径、行号和违规说明
4. **给出修复建议**：对每个违规项提供具体的修复方案

## 审查报告格式

```
## 代码审查报告

### 概览
- 检查文件数：X
- 违规总数：Y

### 违规列表

#### 🔴 严重（必须修复）
- `src/path/file.ts:42` — 函数 `xxx` 长度 58 行，超出限制 28 行
- `src/path/comp.tsx:15` — 组件 `MyComp` 的 props 缺少类型定义

#### 🟡 警告
- `src/path/util.ts:88` — `console.log` 遗留

### 修复建议
1. ...
2. ...
```
