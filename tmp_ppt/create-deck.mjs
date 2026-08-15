import { Presentation, PresentationFile } from "@oai/artifact-tool";
import fs from "node:fs/promises";
import path from "node:path";

const TMP_DIR = "/Users/hoshinochiri/Documents/Projects/memo-app-desktop/tmp_ppt";
const FINAL_PPTX = "/Users/hoshinochiri/Documents/Projects/memo-app-desktop/备忘录产品介绍.pptx";

const BLUE = "#4a90d9";
const BLUE_DARK = "#2c6fce";
const DARK = "#1a1a2e";
const GRAY = "#64748b";
const LIGHT_GRAY = "#f1f5f9";
const WHITE = "#FFFFFF";
const GREEN = "#27ae60";

const PAGE = { left: 72, top: 64, width: 1136, height: 592 };

function sectionTitle(slide, text, top) {
  const t = slide.shapes.add({
    geometry: "textbox",
    position: { left: PAGE.left, top: top || PAGE.top, width: PAGE.width, height: 56 },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  t.text = text;
  t.text.style = { fontSize: 36, bold: true, color: DARK };
  return t;
}

function bodyText(slide, text, top, opts = {}) {
  const t = slide.shapes.add({
    geometry: "textbox",
    position: {
      left: PAGE.left,
      top: top,
      width: opts.width || PAGE.width,
      height: opts.height || 200
    },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  t.text = text;
  t.text.style = { fontSize: opts.fontSize || 18, color: opts.color || GRAY, lineHeight: 1.6 };
  return t;
}

function accentBar(slide, top) {
  slide.shapes.add({
    geometry: "roundRect",
    position: { left: PAGE.left, top: top, width: 48, height: 4 },
    fill: BLUE,
    line: { style: "solid", fill: "none", width: 0 },
    borderRadius: "rounded-full",
  });
}

function card(slide, left, top, width, height, fill) {
  return slide.shapes.add({
    geometry: "roundRect",
    position: { left, top, width, height },
    fill: fill || WHITE,
    line: { style: "solid", fill: "#e2e8f0", width: 1 },
    borderRadius: "rounded-xl",
    shadow: "shadow-sm",
  });
}

function pageNumber(slide, num) {
  const p = slide.shapes.add({
    geometry: "textbox",
    position: { left: PAGE.left, top: 680, width: 100, height: 24 },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  p.text = `${num} / 9`;
  p.text.style = { fontSize: 11, color: "#94a3b8" };
}

async function main() {
  await fs.mkdir(TMP_DIR, { recursive: true });

  const presentation = Presentation.create({
    slideSize: { width: 1280, height: 720 },
  });

  // ===== Slide 1: 封面 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    // Top accent
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 0, top: 0, width: 1280, height: 6 },
      fill: BLUE,
      line: { style: "solid", fill: "none", width: 0 },
    });

    // Logo area
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 72, top: 100, width: 80, height: 80 },
      fill: BLUE,
      line: { style: "solid", fill: "none", width: 0 },
      borderRadius: "rounded-2xl",
    });

    const logoT = slide.shapes.add({
      geometry: "textbox",
      position: { left: 72 + 16, top: 100 + 18, width: 48, height: 48 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    logoT.text = "📝";
    logoT.text.style = { fontSize: 36, color: WHITE };

    // Title
    const title = slide.shapes.add({
      geometry: "textbox",
      position: { left: 72, top: 220, width: 800, height: 120 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    title.text = "备忘录";
    title.text.style = { fontSize: 72, bold: true, color: DARK };

    // Subtitle
    const subtitle = slide.shapes.add({
      geometry: "textbox",
      position: { left: 72, top: 340, width: 600, height: 60 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    subtitle.text = "极简桌面笔记应用 · 产品设计与技术架构";
    subtitle.text.style = { fontSize: 22, color: GRAY };

    // Decorative line
    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 72, top: 420, width: 80, height: 3 },
      fill: BLUE,
      line: { style: "solid", fill: "none", width: 0 },
      borderRadius: "rounded-full",
    });

    // Tech stack badges
    const badges = slide.shapes.add({
      geometry: "textbox",
      position: { left: 72, top: 460, width: 800, height: 40 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    badges.text = "Electron · React 18 · TypeScript · CodeMirror · Vitest";
    badges.text.style = { fontSize: 15, color: "#94a3b8" };

    pageNumber(slide, 1);
  }

  // ===== Slide 2: 产品概述 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "产品概述", 72);
    accentBar(slide, 136);

    bodyText(slide,
      "备忘录是一款基于 Electron 框架构建的跨平台桌面笔记应用，\n" +
      "旨在为用户提供简洁、高效、离线的笔记管理体验。",
      160, { fontSize: 20, color: DARK, width: 900 }
    );

    // Three feature cards
    const cardW = 340;
    const cardH = 220;
    const cardTop = 260;
    const gap = 38;

    const features = [
      { icon: "⚡", title: "即时响应", desc: "纯本地存储，零网络延迟\n所有数据存储在本地" },
      { icon: "🎨", title: "极简设计", desc: "清爽的界面设计\n减少认知负担" },
      { icon: "✍️", title: "Markdown", desc: "内置 Markdown 编辑\n实时预览渲染" },
    ];

    features.forEach((f, i) => {
      const left = PAGE.left + i * (cardW + gap);
      card(slide, left, cardTop, cardW, cardH, LIGHT_GRAY);

      const iconT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 24, top: cardTop + 24, width: 48, height: 48 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      iconT.text = f.icon;
      iconT.text.style = { fontSize: 32 };

      const titleT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 24, top: cardTop + 80, width: 280, height: 36 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      titleT.text = f.title;
      titleT.text.style = { fontSize: 20, bold: true, color: DARK };

      const descT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 24, top: cardTop + 124, width: 280, height: 80 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      descT.text = f.desc;
      descT.text.style = { fontSize: 15, color: GRAY, lineHeight: 1.5 };
    });

    // Bottom note
    bodyText(slide, "支持 macOS · Windows · Linux", 540, { fontSize: 14, color: "#94a3b8" });
    pageNumber(slide, 2);
  }

  // ===== Slide 3: 核心功能 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "核心功能", 72);
    accentBar(slide, 136);

    const funcs = [
      { title: "增删改查", desc: "快速创建、编辑、删除备忘，支持完成标记" },
      { title: "Markdown 编辑", desc: "CodeMirror 语法高亮 + react-markdown 实时预览" },
      { title: "搜索过滤", desc: "标题和内容全文搜索，大小写不敏感" },
      { title: "颜色背景", desc: "8 种背景色可选，视觉区分不同备忘" },
      { title: "编辑历史", desc: "完整记录每次编辑，支持查看历史版本摘要" },
      { title: "离线存储", desc: "localStorage 持久化，数据完全保存在本地" },
      { title: "字符计数", desc: "实时显示 500 字上限，超限警告" },
      { title: "响应式布局", desc: "窗口自适应，最小 600×400 像素" },
    ];

    const colW = 530;
    const colGap = 76;
    const startTop = 170;
    const rowH = 56;

    funcs.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const left = PAGE.left + col * (colW + colGap);
      const top = startTop + row * rowH;

      // Bullet dot
      slide.shapes.add({
        geometry: "ellipse",
        position: { left, top: top + 10, width: 8, height: 8 },
        fill: BLUE,
        line: { style: "solid", fill: "none", width: 0 },
      });

      const ft = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 20, top, width: colW - 20, height: rowH },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      ft.text = f.title + " — " + f.desc;
      ft.text.style = { fontSize: 17, color: DARK, lineHeight: 1.5 };
    });

    pageNumber(slide, 3);
  }

  // ===== Slide 4: 产品设计理念 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "产品设计理念", 72);
    accentBar(slide, 136);

    const principles = [
      {
        title: "零配置启动",
        desc: "无需注册、登录、联网。打开即用，数据完全本地化。"
      },
      {
        title: "渐进式复杂度",
        desc: "默认界面极简，Markdown 编辑和预览按需切换，\n不增加认知负担。"
      },
      {
        title: "可靠的数据持久化",
        desc: "localStorage 为主存储，每次修改自动保存。\n即使崩溃也不会丢失数据。"
      },
      {
        title: "统一的视觉语言",
        desc: "以 #4a90d9 蓝色为主色调，12px 圆角，\n一致的间距和排版系统。"
      },
    ];

    principles.forEach((p, i) => {
      const top = 180 + i * 120;
      const numT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left, top, width: 40, height: 40 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      numT.text = `0${i + 1}`;
      numT.text.style = { fontSize: 28, bold: true, color: BLUE };

      const titleT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 52, top, width: 500, height: 36 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      titleT.text = p.title;
      titleT.text.style = { fontSize: 22, bold: true, color: DARK };

      const descT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 52, top: top + 40, width: 600, height: 60 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      descT.text = p.desc;
      descT.text.style = { fontSize: 16, color: GRAY, lineHeight: 1.5 };
    });

    pageNumber(slide, 4);
  }

  // ===== Slide 5: 技术架构总览 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "技术架构总览", 72);
    accentBar(slide, 136);

    // Three-layer architecture diagram
    const layers = [
      { name: "渲染进程 (Renderer)", tech: "React 18 + TypeScript", color: BLUE, desc: "UI 组件 · Hooks · Context · CSS" },
      { name: "预加载脚本 (Preload)", tech: "Electron Preload", color: "#6366f1", desc: "安全的 IPC 桥接" },
      { name: "主进程 (Main)", tech: "Electron + Node.js", color: BLUE_DARK, desc: "窗口管理 · 生命周期 · 系统集成" },
    ];

    layers.forEach((l, i) => {
      const top = 180 + i * 130;
      const barW = 600;
      card(slide, PAGE.left, top, barW, 100, WHITE);

      slide.shapes.add({
        geometry: "roundRect",
        position: { left: PAGE.left, top, width: 6, height: 100 },
        fill: l.color,
        line: { style: "solid", fill: "none", width: 0 },
        borderRadius: "rounded-xl",
      });

      const nameT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 28, top: top + 16, width: 300, height: 32 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      nameT.text = l.name;
      nameT.text.style = { fontSize: 20, bold: true, color: DARK };

      const techT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 28, top: top + 48, width: 300, height: 28 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      techT.text = l.tech;
      techT.text.style = { fontSize: 14, color: l.color };

      const descT = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 340, top: top + 16, width: 250, height: 68 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      descT.text = l.desc;
      descT.text.style = { fontSize: 14, color: GRAY, lineHeight: 1.5 };
    });

    // Side note
    bodyText(slide, "构建工具：electron-vite + Vite 5\n打包工具：electron-vite build", 580, { fontSize: 14, color: "#94a3b8", width: 400 });

    pageNumber(slide, 5);
  }

  // ===== Slide 6: 数据层设计 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "数据层设计 — MemoStore", 72);
    accentBar(slide, 136);

    bodyText(slide,
      "MemoStore 是应用的核心数据层，采用观察者模式，\n" +
      "管理所有备忘数据的增删改查和持久化。",
      160, { fontSize: 18, color: DARK, width: 900 }
    );

    // Code block style
    const codeCard = card(slide, PAGE.left, 260, 540, 340, "#f8fafc");
    const codeLines = [
      "class MemoStore {",
      "  private memos: Memo[]",
      "  private listeners: MemoListener[]",
      "",
      "  add(title, content, color?) → Memo",
      "  update(id, partial) → Memo | null",
      "  remove(id) → boolean",
      "  toggleDone(id) → Memo | null",
      "  search(query) → Memo[]",
      "  getStats() → MemoStats",
      "",
      "  onChange(fn) → unsubscribe",
      "  // 每次变更自动: _save() → _notify()",
      "}",
    ];

    const codeT = slide.shapes.add({
      geometry: "textbox",
      position: { left: PAGE.left + 24, top: 276, width: 500, height: 300 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    codeT.text = codeLines.join("\n");
    codeT.text.style = { fontSize: 15, color: DARK, fontFamily: "SF Mono, Monaco, monospace", lineHeight: 1.55 };

    // Right side: design points
    const points = [
      "每次修改自动触发 _save()",
      "Observer 模式通知 UI 刷新",
      "localStorage 自动降级处理",
      "编辑历史自动记录",
      "数据副本返回，防止外部修改",
    ];

    const rightCard = card(slide, 640, 260, 480, 340, LIGHT_GRAY);
    points.forEach((p, i) => {
      const top = 280 + i * 50;
      slide.shapes.add({
        geometry: "ellipse",
        position: { left: 664, top: top + 10, width: 8, height: 8 },
        fill: GREEN,
        line: { style: "solid", fill: "none", width: 0 },
      });

      const pt = slide.shapes.add({
        geometry: "textbox",
        position: { left: 684, top, width: 400, height: 40 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      pt.text = p;
      pt.text.style = { fontSize: 16, color: DARK, lineHeight: 1.5 };
    });

    pageNumber(slide, 6);
  }

  // ===== Slide 7: Markdown 编辑体验 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "Markdown 编辑体验", 72);
    accentBar(slide, 136);

    bodyText(slide,
      "编辑 / 预览双模式切换，CodeMirror 提供语法高亮，\n" +
      "react-markdown 渲染完整的 Markdown 语法。",
      160, { fontSize: 18, color: DARK, width: 900 }
    );

    // Edit mode card
    card(slide, PAGE.left, 240, 520, 280, "#f8fafc");
    const editTitle = slide.shapes.add({
      geometry: "textbox",
      position: { left: PAGE.left + 24, top: 256, width: 200, height: 32 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    editTitle.text = "编辑模式";
    editTitle.text.style = { fontSize: 18, bold: true, color: BLUE };

    const editDesc = slide.shapes.add({
      geometry: "textbox",
      position: { left: PAGE.left + 24, top: 296, width: 460, height: 200 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    editDesc.text =
      "· CodeMirror 6 编辑器\n" +
      "· Markdown 语法高亮\n" +
      "· 实时字符计数 (500 上限)\n" +
      "· 超限警告样式\n" +
      "· Ctrl+Enter 保存 (卡片编辑)\n" +
      "· Esc 取消编辑";
    editDesc.text.style = { fontSize: 16, color: GRAY, lineHeight: 1.8 };

    // Preview mode card
    card(slide, 640, 240, 520, 280, LIGHT_GRAY);
    const prevTitle = slide.shapes.add({
      geometry: "textbox",
      position: { left: 664, top: 256, width: 200, height: 32 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    prevTitle.text = "预览模式";
    prevTitle.text.style = { fontSize: 18, bold: true, color: GREEN };

    const prevDesc = slide.shapes.add({
      geometry: "textbox",
      position: { left: 664, top: 296, width: 460, height: 200 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    prevDesc.text =
      "· react-markdown 渲染\n" +
      "· 支持标题 / 列表 / 表格\n" +
      "· 代码块语法高亮\n" +
      "· 引用块 / 链接 / 图片\n" +
      "· 分隔线 / 加粗 / 斜体\n" +
      "· 安全 XSS 防护";
    prevDesc.text.style = { fontSize: 16, color: GRAY, lineHeight: 1.8 };

    bodyText(slide, "一键切换 · 即时预览 · 流畅过渡", 560, { fontSize: 15, color: "#94a3b8" });
    pageNumber(slide, 7);
  }

  // ===== Slide 8: 测试与质量保障 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    sectionTitle(slide, "测试与质量保障", 72);
    accentBar(slide, 136);

    // Test stats cards
    const stats = [
      { label: "测试文件", value: "5", color: BLUE },
      { label: "测试用例", value: "59", color: GREEN },
      { label: "通过率", value: "100%", color: BLUE_DARK },
    ];

    stats.forEach((s, i) => {
      const left = PAGE.left + i * 260;
      card(slide, left, 180, 220, 120, WHITE);

      const valT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 24, top: 196, width: 180, height: 48 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      valT.text = s.value;
      valT.text.style = { fontSize: 40, bold: true, color: s.color };

      const labT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 24, top: 248, width: 180, height: 28 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      labT.text = s.label;
      labT.text.style = { fontSize: 16, color: GRAY };
    });

    // Test breakdown
    bodyText(slide, "测试覆盖范围", 340, { fontSize: 18, bold: true, color: DARK });

    const tests = [
      "MemoStore 数据层测试 — 32 个用例，覆盖增删改查、搜索、持久化、编辑历史、边界情况",
      "MemoCard 组件测试 — 11 个用例，覆盖渲染、编辑、保存、取消、快捷键、历史显示",
      "App 集成测试 — 7 个用例，覆盖完整用户流程：添加、删除、完成、搜索",
      "MemoForm 组件测试 — 6 个用例，覆盖表单提交、字符计数、清空重置",
      "MemoList 组件测试 — 3 个用例，覆盖空状态、列表渲染、条件显示",
    ];

    tests.forEach((t, i) => {
      const top = 390 + i * 46;
      slide.shapes.add({
        geometry: "ellipse",
        position: { left: PAGE.left, top: top + 10, width: 8, height: 8 },
        fill: BLUE,
        line: { style: "solid", fill: "none", width: 0 },
      });

      const tt = slide.shapes.add({
        geometry: "textbox",
        position: { left: PAGE.left + 20, top, width: 1000, height: 40 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      tt.text = t;
      tt.text.style = { fontSize: 15, color: GRAY, lineHeight: 1.5 };
    });

    pageNumber(slide, 8);
  }

  // ===== Slide 9: 总结与展望 =====
  {
    const slide = presentation.slides.add();
    slide.background.fill = WHITE;

    slide.shapes.add({
      geometry: "roundRect",
      position: { left: 0, top: 0, width: 1280, height: 6 },
      fill: BLUE,
      line: { style: "solid", fill: "none", width: 0 },
    });

    sectionTitle(slide, "总结", 72);
    accentBar(slide, 136);

    bodyText(slide,
      "备忘录是一个完整的 Electron 桌面应用，展示了\n" +
      "现代前端技术栈在实际产品中的落地实践。",
      170, { fontSize: 20, color: DARK, width: 900 }
    );

    // Tech stack summary
    const techs = [
      { name: "Electron 31", desc: "桌面容器" },
      { name: "React 18", desc: "UI 框架" },
      { name: "TypeScript 5", desc: "类型安全" },
      { name: "CodeMirror 6", desc: "编辑器" },
      { name: "react-markdown", desc: "Markdown" },
      { name: "Vitest 2", desc: "测试框架" },
      { name: "electron-vite", desc: "构建工具" },
      { name: "localStorage", desc: "数据持久化" },
    ];

    techs.forEach((t, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const left = PAGE.left + col * 270;
      const top = 280 + row * 80;

      card(slide, left, top, 240, 60, LIGHT_GRAY);

      const nameT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 20, top: top + 8, width: 200, height: 24 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      nameT.text = t.name;
      nameT.text.style = { fontSize: 16, bold: true, color: DARK };

      const descT = slide.shapes.add({
        geometry: "textbox",
        position: { left: left + 20, top: top + 32, width: 200, height: 20 },
        fill: "none",
        line: { style: "solid", fill: "none", width: 0 },
      });
      descT.text = t.desc;
      descT.text.style = { fontSize: 13, color: GRAY };
    });

    // Future
    bodyText(slide, "未来方向：云同步 · 暗色模式 · 插件系统 · 移动端", 510, { fontSize: 16, color: "#94a3b8" });

    // Thank you
    const thanks = slide.shapes.add({
      geometry: "textbox",
      position: { left: PAGE.left, top: 590, width: 400, height: 48 },
      fill: "none",
      line: { style: "solid", fill: "none", width: 0 },
    });
    thanks.text = "谢谢！";
    thanks.text.style = { fontSize: 36, bold: true, color: BLUE };

    pageNumber(slide, 9);
  }

  // Export
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
  console.log(`PPTX written to ${FINAL_PPTX}`);

  // Render slides
  const renderDir = path.join(TMP_DIR, "renders");
  await fs.mkdir(renderDir, { recursive: true });
  for (let i = 0; i < presentation.slides.count; i++) {
    const s = presentation.slides[i];
    const png = await presentation.export({ slide: s, format: "png", scale: 1 });
    await fs.writeFile(path.join(renderDir, `slide-${i + 1}.png`), new Uint8Array(await png.arrayBuffer()));
  }
  console.log(`Rendered ${presentation.slides.count} slides to ${renderDir}`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
