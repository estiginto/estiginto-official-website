import { useEffect, useMemo, useState } from "react";

const localeOptions = [
  ["zh", "\u4e2d\u6587"],
  ["en", "EN"],
  ["ja", "\u65e5\u672c\u8a9e"],
];

/* ============================================================
   Data
   ============================================================ */

const navItems = [
  { href: "#home",      num: "00", main: "Home",       sub: "首頁",     desc: "Live status" },
  { href: "#solutions", num: "01", main: "Solutions",  sub: "解決方案", desc: "6 programs" },
  { href: "#about",     num: "02", main: "Studio",     sub: "工坊主張", desc: "Manifesto" },
  { href: "#ai-lab",    num: "03", main: "AI Lab",     sub: "AI 整合",  desc: "12 agents in production" },
  { href: "#case",      num: "04", main: "Case",       sub: "精選案例", desc: "Anonymized · K/2025" },
  { href: "#process",   num: "05", main: "Process",    sub: "規劃流程", desc: "6 phases" },
  { href: "#stack",     num: "06", main: "Stack",      sub: "技術棧",   desc: "FE · BE · AI · Ops" },
  { href: "#contact",   num: "07", main: "Contact",    sub: "聯絡我們", desc: "Within 1 business day" },
];

const marqueeItems = [
  "14 yrs continuous operation",
  "200+ shipped projects",
  "12 AI agents in production",
  "ISO 27001 ready",
  "Taipei · Taiwan",
  "API-first by default",
  "99.9% SLA · monitored",
  "since 2012",
];

const numbers = [
  { idx: "N.01", val: "14",  unit: "yrs",   sup: "+", desc: "從 2012 年起，持續為客戶交付商業營運系統。" },
  { idx: "N.02", val: "200", unit: "ships", sup: "+", desc: "已交付電商、ERP、WMS、品牌官網與客製平台。" },
  { idx: "N.03", val: "99.9", unit: "% SLA",        desc: "近 36 個月維運專案的平均可用性。" },
  { idx: "N.04", val: "12",  unit: "Agents", sup: "*", desc: "已上線且實際處理工單／訂單／文件的 AI 代理。" },
];

const solutions = [
  {
    num: "01",
    eyebrow: "e-Commerce",
    titleHTML: <>電子商務 <span className="hl">方案</span></>,
    image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.jpg",
    label: "ESG-COM/2026",
    body: "規劃商品結構、客服／出貨流程與金物流串接，提供順暢購物體驗與會員成長。",
    points: [
      "金流／物流／發票／ERP 串接",
      "會員等級／點數／優惠券／再行銷",
      "跨境多語多幣，CDN 邊緣加速",
    ],
    meta: "≥ 8 wks",
  },
  {
    num: "02",
    eyebrow: "Brand Site",
    titleHTML: <>品牌形象 <span className="hl">方案</span></>,
    image: "/img/plan/laptop-coworking-space_53876-14515.webp",
    label: "ESG-BRD/2026",
    body: "在有限的注意力裡先被看見。以敘事與視覺建立差異化，兼顧速度與 SEO。",
    points: [
      "首頁敘事／關鍵頁腳本與版型",
      "RWD + Core Web Vitals 優化",
      "搜尋曝光與社群分享設定",
    ],
    meta: "≥ 4 wks",
  },
  {
    num: "03",
    eyebrow: "Enterprise Resource",
    titleHTML: <>企業資源管理 <span className="hl">方案</span></>,
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
    label: "ESG-ERP/2026",
    body: "從流程盤點到系統落地，打通商務、財務、人資、製造與供應鏈資料。",
    points: [
      "流程藍圖、權限／稽核制度",
      "報表／儀表板與 KPI 追蹤",
      "與既有系統雙向整合",
    ],
    meta: "≥ 12 wks",
  },
  {
    num: "04",
    eyebrow: "Warehouse Management",
    titleHTML: <>倉儲管理 <span className="hl">方案</span></>,
    image: "/img/plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg",
    label: "ESG-WMS/2026",
    body: "條碼／PDA／批號／效期／盤點／庫齡一站式導入，降錯誤、提周轉。",
    points: [
      "入出庫／調撥／庫存追蹤",
      "撿料策略與路徑最佳化",
      "與 ERP、電商、OMS 串接",
    ],
    meta: "≥ 10 wks",
  },
  {
    num: "05",
    eyebrow: "AI Integration",
    titleHTML: <>AI 整合 <span className="hl">方案</span></>,
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
    label: "ESG-AI/2026 · NEW",
    body: "把 LLM、RAG、Document AI 接進你的營運流程，不是 PoC，是真的會跑帳的 Agent。",
    points: [
      "AI Agent 工單／客服／業務工作流",
      "RAG 私有知識庫（含資料治理）",
      "私有部署 LLM／向量資料庫",
    ],
    meta: "≥ 6 wks",
    isNew: true,
  },
  {
    num: "06",
    eyebrow: "Bespoke",
    titleHTML: <>客製化 <span className="hl">解決方案</span></>,
    image: "/img/plan/close-up-elegant-decoration-house.jpg",
    label: "ESG-CST/2026",
    body: "平台服務、B2B 工具、APP 到資訊看板。以迭代方式，把你的構想穩定變成產品。",
    points: [
      "POC／MVP 快速驗證",
      "資料流與雲端架構設計",
      "安全／權限／稽核與維運",
    ],
    meta: "依範圍而定",
  },
];

const aiCards = [
  {
    span: "span-6 flagship",
    idx: "AI/01",
    tag: "Agent Workflow",
    titleHTML: <>會處理單據的 <span className="hl">AI 代理</span>，不只是 chatbot。</>,
    body: "把客服、補單、退換貨、發票勘誤、報價單核對等重複工作交給 Agent。Agent 能讀懂內部 SOP、操作 ERP 與 WMS、必要時轉接真人。",
    chips: ["LangGraph", "Claude / GPT-4o", "Function Calling", "Audit Log"],
  },
  {
    span: "span-6",
    idx: "AI/02",
    tag: "RAG Knowledge",
    titleHTML: <>讓員工不用再問<span className="hl">「文件在哪」</span>。</>,
    body: "把產品手冊、合約範本、SOP、過往工單向量化，內接 Slack / LINE / 內部系統，回答可追溯來源、可校稿、可保密。",
    chips: ["pgvector", "LlamaIndex", "Hybrid Search", "Permission-aware"],
  },
  {
    span: "span-4",
    idx: "AI/03",
    tag: "Document AI",
    titleHTML: <>OCR + LLM <span className="hl">智能擷取</span></>,
    body: "發票、報價單、提單、合約批量解析，欄位寫進 ERP 即可入帳。",
    chips: ["Vision", "Layout-aware", "Schema Validate"],
  },
  {
    span: "span-4",
    idx: "AI/04",
    tag: "Private LLM",
    titleHTML: <>地端／VPC <span className="hl">私有部署</span></>,
    body: "資料不出機房。Llama / Qwen / Mistral 模型微調與量化，內部 GPU 可跑。",
    chips: ["Ollama", "vLLM", "Fine-tune", "Quantize"],
  },
  {
    span: "span-4",
    idx: "AI/05",
    tag: "Dev Velocity",
    titleHTML: <>用 AI <span className="hl">加速交付</span></>,
    body: "我們內部以 Claude Code、Codex、Cursor 為日常引擎，同樣價碼可交付更多範圍。",
    chips: ["Claude Code", "Codex", "Spec-driven", "QA Auto"],
  },
];

const processSteps = [
  ["01", "初談 30–45 分", "釐清商業目標、預算範圍、時程限制與風險。", "Week 0"],
  ["02", "規劃提案",       "使用情境、資料流、里程碑、估算與 UAT 驗收指標。", "Week 1"],
  ["03", "MVP / 模組優先級", "先做能帶來效益的 20%，快速驗證商業假設。", "Week 2–4"],
  ["04", "開發與週更",      "每週迭代，提供可操作版本與透明的進度回報。", "Week 4–N"],
  ["05", "上線與培訓",      "文件、權限、備援上線，安排操作訓練與資料移轉。", "Go-live"],
  ["06", "維運與優化",      "事件回應、性能安全、功能優化與報表增補。", "持續"],
];

const techStack = [
  {
    title: "Frontend",
    code: "FE",
    chips: ["React 19", "Next.js 15", "TypeScript", "Vite", "Tailwind", "RWD", "a11y"],
  },
  {
    title: "Backend",
    code: "BE",
    chips: ["Node.js", "Bun", "REST", "GraphQL", "PostgreSQL", "MySQL", "Redis", "Directus"],
  },
  {
    title: "AI / ML",
    code: "AI",
    chips: ["Claude", "OpenAI", "Llama", "Ollama", "LangGraph", "LlamaIndex", "pgvector", "Whisper"],
    signal: true,
  },
  {
    title: "DevOps & Cloud",
    code: "OPS",
    chips: ["Docker", "Kubernetes", "GCP", "AWS", "Cloudflare", "CI/CD", "Grafana", "Sentry"],
  },
];

const faqs = [
  ["Q1", "預算怎麼抓？",
    "我們會在規劃時提供分階段估算，先落地最關鍵的 20–40%，再視成效追加，降低一次到位的風險。"],
  ["Q2", "時程怎麼排？",
    "以里程碑與 UAT 指標拆分，每週固定 Demo 與回報，避免後期才發現落差。"],
  ["Q3", "AI 真的能上 production？",
    "可以，但前提是「資料治理」與「保護機制」要同時做。我們已有實際運行的 Agent，會搭配 audit log、人工複核點、Fallback 流程。"],
  ["Q4", "上線後怎麼維護？",
    "提供事件回應、月度例行檢查、版本升級、安全修補與備份演練等維運方案。"],
  ["Q5", "可與現有系統整合嗎？",
    "可。我們採 API First，支援 ERP／金流／物流／CRM／電商等常見系統雙向串接。"],
];

const heroConsole = [
  { k: "Status",        v: <><span className="live" /> <span className="nb">Open for briefs</span> · <span className="nb">受理 2026 Q3 起</span></> },
  { k: "Pipeline",      v: <><span className="nb">4 lines in parallel</span> · <span className="ghost nb">200+ shipped</span></> },
  { k: "Latest deploy", v: <><span className="nb">v.2026.04.26</span> · <span className="nb">14:23 GMT+8</span></> },
  { k: "AI Agents",     v: <><span className="nb">12 in production</span> · <span className="ghost nb">3 staging</span></> },
  { k: "Locale",        v: <><span className="nb">Taipei · TW</span> · <span className="nb">zh-Hant / en</span></> },
];

/* ============================================================
   Components
   ============================================================ */

function LanguageSwitch({ locale, onSelect }) {
  return (
    <div className={`language-switch is-${locale}`} role="group" aria-label="Switch language">
      <span className="language-track" aria-hidden="true" />
      <span className="language-thumb" aria-hidden="true" />
      {localeOptions.map(([value, label]) => (
        <button
          key={value}
          className={`language-option ${value}`}
          type="button"
          aria-pressed={locale === value}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Header({ onToggleMenu, menuOpen, locale, onToggleLocale }) {
  return (
    <header className="page-header">
      <a className="brand-mark" href="/">
        <span className="logo">
          <img src="/img/Logo_ESTIGINTO.svg" alt="ESTIGINTO ????" />
        </span>
        <span className="ident">
          <span>System Craft Studio</span>
          <span>Est. 2012 繚 ????</span>
        </span>
      </a>

      <div className="header-actions">
        <LanguageSwitch locale={locale} onSelect={onToggleLocale} />
        <button
          className={`navbar-toggler ${menuOpen ? "open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <span>{menuOpen ? "Close" : "Index"}</span>
          <span className="bars" aria-hidden="true">
            <span /><span /><span />
          </span>
        </button>
      </div>
    </header>
  );
}

function Drawer({ open, onClose }) {
  return (
    <div className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="drawer-scrim" type="button" aria-label="Close menu" onClick={onClose} />
      <aside className="drawer-panel">
        <header className="drawer-head">
          <div className="drawer-meta">
            <span>Index · 目次</span>
            <span>{navItems.length} sections · v.2026.04</span>
          </div>
          <h2 className="drawer-title">
            Site<br /><em>Index</em>.
          </h2>
        </header>

        <nav className="drawer-nav">
          {navItems.map((item) => (
            <a className="drawer-link" href={item.href} key={item.href} onClick={onClose}>
              <span className="num">{item.num}</span>
              <span className="text">
                <span className="main">{item.main}</span>
                <span className="sub">
                  <span className="zh">{item.sub}</span>
                  <span className="desc">{item.desc}</span>
                </span>
              </span>
              <span className="arrow" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <footer className="drawer-foot">
          <div>
            <h6>Reach</h6>
            <a href="mailto:contact@estiginto.com">contact@estiginto.com</a>
            <a href="tel:+886224315362">+886 2 2431 5362</a>
          </div>
          <div>
            <h6>Hours</h6>
            <span>Mon – Fri · 10:00 – 18:00</span>
            <span>GMT+8 · Taipei</span>
          </div>
        </footer>
      </aside>
    </div>
  );
}

function SectionEyebrow({ index, label, meta }) {
  return (
    <div className="section-eyebrow">
      <span className="index">{index}</span>
      <span className="rule" aria-hidden="true" />
      <span className="meta">{meta}</span>
      <span style={{ gridColumn: "1 / -1", marginTop: 8, color: "inherit" }}>
        <span style={{ marginRight: 14, opacity: 0.5 }}>—</span>
        {label}
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap">
        <div>
          <div className="hero-meta">
            <b>ESTIGINTO</b>
            <span className="dot">/</span>
            <span>System Craft Studio</span>
            <span className="dot">·</span>
            <span>Est. 2012 — 14 yrs</span>
            <span className="dot">·</span>
            <span>Taipei, Taiwan</span>
          </div>

          <h1 className="hero-title">
            <span className="row1">
              {"\u8fce\u63a5\u6709\u53f2\u4ee5\u4f86"}
            </span>
            <span className="row2">
              {"\u6700\u597d\u7684"}
            </span>
            <span className="row3 accent">
              {"\u9ec3\u91d1\u6642\u4ee3"}
            </span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <p className="hero-lede">
            {"AI \u9769\u547d\uff0c\u8b93\u50f9\u503c\u805a\u7126\u5728\u771f\u6b63\u91cd\u8981\u7684\u4e8b\u7269\u4e0a"}
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">
              <span>預約 30 分鐘規劃對談</span>
              <span className="arrow" aria-hidden="true" />
            </a>
            <a className="btn" href="#ai-lab">
              <span>看 AI Lab 在做什麼</span>
              <span className="arrow" aria-hidden="true" />
            </a>
          </div>
        </div>

        <aside className="console" aria-label="ESTIGINTO live status console">
          <div className="console-body">
            {heroConsole.map((row) => (
              <div className="console-row" key={row.k}>
                <span className="k">{row.k}</span>
                <span className="v">{row.v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <a className="scrolldown" href="#marquee">Scroll · Index 01</a>
    </section>
  );
}

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee" id="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((text, i) => (
          <span className="marquee-item" key={`m-${i}`}>
            <span className="glyph">§</span>
            <span>{text}</span>
            <span className="dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Numbers() {
  return (
    <section className="section reveal" aria-label="Studio numbers">
      <div className="wrap">
        <SectionEyebrow
          index="§ Numbers"
          label="十四年的營運，是規模也是責任。"
          meta="updated · 2026.04"
        />
        <div className="numbers">
          {numbers.map((n) => (
            <div className="number-cell" key={n.idx}>
              <div className="key">
                <span>Metric</span>
                <span className="idx">{n.idx}</span>
              </div>
              <div className="val">
                <span>{n.val}</span>
                {n.sup && <sup>{n.sup}</sup>}
                <span className="unit">{n.unit}</span>
              </div>
              <div className="desc">{n.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="section bg-deep reveal" id="about" aria-label="Studio manifesto">
      <div className="wrap">
        <SectionEyebrow
          index="§ 02 / Studio"
          label="我們的工作哲學。"
          meta="manifesto · 2026"
        />
        <div className="manifesto">
          <h2 className="manifesto-quote">
            <span className="mq-line mq-prelude">
              我們<span className="hl">不寫</span>程式。
            </span>
            <span className="mq-line mq-headline">
              我們造能<span className="hl underline">撐十年</span>的系統。
            </span>
            <span className="mq-line mq-coda">
              並且，把 <em>AI</em> 變成可營運的資產。
            </span>
          </h2>
          <div className="manifesto-aside">
            <p>
              專案成功率取決於「規劃」與「驗收標準」。
              我們以使用情境拆解需求、定義可交付與里程碑，同步考量預算、期程與未來擴充。
              先讓 0→1 站穩，再用資料與流程把 1→100 做扎實。
            </p>
            <p>
              這也是為什麼 2012 年的客戶，2026 年仍與我們合作。
            </p>
            <span className="signoff">— 主理人 / Founders, ESTIGINTO</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  const [active, setActive] = useState(0);
  const item = solutions[active];

  return (
    <section className="section reveal" id="solutions" aria-label="Solutions">
      <div className="wrap">
        <SectionEyebrow
          index="§ 01 / Solutions"
          label="我們交付的方案範圍。"
          meta={`${solutions.length} programs`}
        />
        <div className="solutions">
          <ul className="sol-list">
            {solutions.map((s, i) => (
              <li
                key={s.num}
                className={`sol-row ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <span className="num">{s.num}</span>
                <div className="body">
                  <span className="tag">
                    <span>{s.eyebrow}</span>
                    {s.isNew && <span className="pill">NEW</span>}
                  </span>
                  <h3>{s.titleHTML}</h3>
                </div>
                <span className="meta">{s.meta}</span>
              </li>
            ))}
          </ul>

          <aside className="sol-preview" aria-live="polite">
            <div
              className="figure"
              style={{ backgroundImage: `url(${item.image})` }}
              role="img"
              aria-label={item.eyebrow}
            >
              <span className="frame" aria-hidden="true" />
              <span className="label">{item.label}</span>
            </div>
            <div className="info">
              <p>{item.body}</p>
              <ul>
                {item.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <a className="btn" href="#contact" style={{ marginTop: 8 }}>
                <span>討論這個方案</span>
                <span className="arrow" aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function AILab() {
  return (
    <section className="section bg-night reveal" id="ai-lab" aria-label="AI Lab">
      <div className="wrap">
        <SectionEyebrow
          index="§ 03 / AI Lab"
          label="把 AI 變成可營運的系統。"
          meta="12 agents · in production"
        />
        <div className="ai-headline">
          <h2>
            不是 <span className="strike">PoC</span>。<br />
            是會處理<span className="hl">單據</span>、回應<span className="hl">客戶</span>、跑<span className="hl">帳</span>的 AI。
          </h2>
          <p className="lede">
            2024–2025 我們把實驗室裡的 LLM 帶上 production。
            到 2026 年，我們已經有 12 個 Agent 在客戶營運線上每天工作。
            下面是我們做的東西。
          </p>
        </div>

        <div className="ai-grid">
          {aiCards.map((c) => (
            <article className={`ai-card ${c.span}`} key={c.idx}>
              <div className="head">
                <span>{c.tag}</span>
                <span className="idx">{c.idx}</span>
              </div>
              <h3>{c.titleHTML}</h3>
              <p>{c.body}</p>
              <div className="stack">
                {c.chips.map((chip) => <span className="chip" key={chip}>{chip}</span>)}
              </div>
            </article>
          ))}
        </div>

        <div className="ai-callout">
          <p>
            <b>不做的事 ☓</b>　包賺 ROI 的承諾、把資料丟進 ChatGPT、用 AI 寫敏感邏輯後就放生、把「裝個 chatbot」當作 AI 轉型。
          </p>
          <a className="btn btn-on-night" href="#contact">
            <span>討論你的 AI 場景</span>
            <span className="arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <section className="section reveal" id="case" aria-label="Selected case">
      <div className="wrap">
        <SectionEyebrow
          index="§ 04 / Selected"
          label="一個正在跑的案例。"
          meta="anonymized · cross-border beauty"
        />
        <div className="case">
          <div
            className="figure"
            style={{
              backgroundImage:
                "url(/img/plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg)",
            }}
          >
            <span className="stamp">Case · K/2025</span>
          </div>

          <div className="case-body">
            <div className="tag">Cross-border DTC · Beauty · 2024–在線</div>
            <h3>
              五個系統各自為政，<span className="hl">倉儲錯誤率 3.2%。</span><br />
              我們重做了流程，再做系統。
            </h3>
            <p className="summary">
              客戶原本電商、WMS、ERP、客服、會員五套系統各自更新，業務每天用 Excel 對單。
              我們重新設計商品主檔、訂單流與庫存事件，串成單一資料源，再把 AI 客服接上 SOP。
            </p>

            <div className="case-metrics">
              <div className="case-metric">
                <div className="label">出貨錯誤率</div>
                <div className="val"><span className="arrow">↓</span>0.4<span style={{fontSize: "0.5em", color: "var(--ink-mute)"}}>%</span></div>
                <div className="delta">原 3.2% · 8x 改善</div>
              </div>
              <div className="case-metric">
                <div className="label">出貨時效</div>
                <div className="val"><span className="arrow">↑</span>2.8<span style={{fontSize: "0.5em", color: "var(--ink-mute)"}}>x</span></div>
                <div className="delta">D+2 → D+0.7</div>
              </div>
              <div className="case-metric">
                <div className="label">客服自動化率</div>
                <div className="val"><span className="arrow">↑</span>68<span style={{fontSize: "0.5em", color: "var(--ink-mute)"}}>%</span></div>
                <div className="delta">Agent 接管 L1，真人處理 L2/L3</div>
              </div>
              <div className="case-metric">
                <div className="label">月對帳工時</div>
                <div className="val"><span className="arrow">↓</span>92<span style={{fontSize: "0.5em", color: "var(--ink-mute)"}}>%</span></div>
                <div className="delta">人工 28h → 自動 2h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section bg-deep reveal" id="process" aria-label="Engagement process">
      <div className="wrap">
        <SectionEyebrow
          index="§ 05 / Process"
          label="從第一封信到上線維運。"
          meta="6 phases · transparent"
        />
        <div className="process-grid">
          {processSteps.map(([num, title, body, week]) => (
            <article className="process-step" key={num}>
              <div className="num">
                <span>Phase {num}</span>
              </div>
              <h4>{title}</h4>
              <p>{body}</p>
              <div className="week">{week}</div>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="btn btn-primary" href="#contact">
            <span>預約初步規劃</span>
            <span className="arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="section reveal" id="stack" aria-label="Tech stack">
      <div className="wrap">
        <SectionEyebrow
          index="§ 06 / Stack"
          label="我們的工具與生產線。"
          meta="curated · battle-tested"
        />
        <div className="stack-grid">
          {techStack.map((col) => (
            <div className="stack-col" key={col.code}>
              <h4>
                <b>{col.title}</b>
                <span>{col.code}</span>
              </h4>
              <div className="stack-chips">
                {col.chips.map((c) => (
                  <span className={`stack-chip ${col.signal ? "signal" : ""}`} key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section bg-deep reveal" aria-label="FAQ">
      <div className="wrap">
        <SectionEyebrow
          index="§ 07 / FAQ"
          label="客戶最常問的事。"
          meta={`${faqs.length} questions`}
        />
        <div className="faq-list">
          {faqs.map(([num, q, a], i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item ${isOpen ? "open" : ""}`} key={num}>
                <button
                  className="faq-q"
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="num">{num}</span>
                  <span>{q}</span>
                  <span className="toggle" aria-hidden="true" />
                </button>
                <div className="faq-a">
                  <div>
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section reveal" id="contact" aria-label="Contact">
      <div className="wrap">
        <SectionEyebrow
          index="§ 08 / Contact"
          label="從一封信開始。"
          meta="response · within 1 business day"
        />
        <div className="contact">
          <div>
            <h2>
              開始之前，<br />
              我們會先<span className="hl">問你三個問題</span>。
            </h2>
            <p className="lede">
              第一：你想解決的核心問題是什麼？<br />
              第二：什麼時候必須上線、有沒有硬死線？<br />
              第三：預算有沒有上限或階段拆分的彈性？<br /><br />
              不需要規格書。先給我們大致方向，我們會在 30 分鐘內幫你想清楚。
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-row">
              <span className="k">Email</span>
              <span className="v"><a href="mailto:contact@estiginto.com">contact@estiginto.com</a></span>
            </div>
            <div className="contact-row">
              <span className="k">Phone</span>
              <span className="v"><a href="tel:+886224315362">+886 2 2431 5362</a></span>
            </div>
            <div className="contact-row">
              <span className="k">Sales</span>
              <span className="v"><a href="tel:+886972118427">+886 972 118 427</a></span>
            </div>
            <div className="contact-row">
              <span className="k">Office Hours</span>
              <span className="v">週一至週五 · 10:00 – 18:00 (GMT+8)</span>
            </div>
            <div className="contact-row">
              <span className="k">Locale</span>
              <span className="v">Taipei · TW · zh-Hant / en</span>
            </div>
            <div className="contact-cta">
              <a className="btn btn-primary" href="mailto:contact@estiginto.com?subject=Project%20Brief%20—%20ESTIGINTO">
                <span>寄信給我們</span>
                <span className="arrow" aria-hidden="true" />
              </a>
              <a className="btn" href="https://www.facebook.com/Estiginto/" target="_blank" rel="noopener noreferrer">
                <span>Facebook</span>
                <span className="arrow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="page-footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <h3 className="footer-mark">
              ESTIGINTO<em>.</em>
            </h3>
            <p>System Craft Studio · 造物者科技。十四年來，為認真經營的營運者打造系統。</p>
          </div>
          <div>
            <h5>Studio</h5>
            <a href="#about">工坊主張</a>
            <a href="#process">規劃流程</a>
            <a href="#stack">技術棧</a>
            <a href="#case">精選案例</a>
          </div>
          <div>
            <h5>Solutions</h5>
            <a href="#solutions">電子商務</a>
            <a href="#solutions">ERP / WMS</a>
            <a href="#ai-lab">AI 整合</a>
            <a href="#solutions">客製平台</a>
          </div>
          <div>
            <h5>Reach</h5>
            <a href="mailto:contact@estiginto.com">contact@estiginto.com</a>
            <a href="tel:+886224315362">+886 2 2431 5362</a>
            <a href="https://www.facebook.com/Estiginto/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2012 – 2026 ESTIGINTO Co., Ltd. — Taipei · TW</span>
          <span className="build">
            <span className="live" aria-hidden="true" />
            build · v.2026.04.26 · all systems nominal
          </span>
        </div>
      </div>
    </footer>
  );
}

function ConstructionScreen() {
  return (
    <main className="construction-screen" aria-labelledby="construction-title">
      <div className="construction-shell">
        <p className="construction-kicker">ESTIGINTO</p>
        <h1 id="construction-title">網站維護中</h1>
        <div className="construction-meta">
          <span>+886 2 2431 5362</span>
          <span>contact@estiginto.com</span>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   App
   ============================================================ */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConstructionPreview, setShowConstructionPreview] = useState(false);
  const [locale, setLocale] = useState(() => {
    if (typeof window === "undefined") {
      return "zh";
    }

    const savedLocale = window.localStorage.getItem("estiginto-locale");
    return ["zh", "en", "ja"].includes(savedLocale) ? savedLocale : "zh";
  });
  const isLocalPreview = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    return import.meta.env.DEV || localHosts.has(window.location.hostname);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!isLocalPreview) {
      document.body.style.overflow = "";
    }
  }, [isLocalPreview]);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : locale === "ja" ? "ja" : "zh-Hant";
    window.localStorage.setItem("estiginto-locale", locale);
  }, [locale]);

  // Reveal on scroll
  useEffect(() => {
    if (!isLocalPreview || showConstructionPreview) {
      return undefined;
    }

    const sections = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((s) => s.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        s.classList.add("is-visible");
      } else {
        observer.observe(s);
      }
    });
    return () => observer.disconnect();
  }, [isLocalPreview, showConstructionPreview]);

  if (!isLocalPreview || showConstructionPreview) {
    return (
      <>
        <ConstructionScreen />
        {isLocalPreview ? (
          <button
            className="preview-toggle"
            type="button"
            onClick={() => setShowConstructionPreview(false)}
          >
            返回完整頁面
          </button>
        ) : null}
      </>
    );
  }

  return (
    <>
      <button
        className="preview-toggle"
        type="button"
        onClick={() => setShowConstructionPreview(true)}
      >
        預覽建置中畫面
      </button>
      <Header
        onToggleMenu={() => setMenuOpen((v) => !v)}
        menuOpen={menuOpen}
        locale={locale}
        onToggleLocale={setLocale}
      />
      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="page-main" id="mainpage">
        <Hero />
        <Marquee />
        <Numbers />
        <Manifesto />
        <Solutions />
        <AILab />
        <CaseStudy />
        <Process />
        <TechStack />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
