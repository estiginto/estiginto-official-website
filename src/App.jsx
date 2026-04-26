import { useEffect, useMemo, useRef, useState } from "react";

const localeOptions = [
  ["zh", "中文"],
  ["en", "EN"],
  ["ja", "日本語"],
];

const menuLabels = {
  zh: {
    about: "關於我們",
    solutions: "解決方案",
    case: "參考案例",
    contact: "聯繫我們",
  },
  en: {
    about: "About",
    solutions: "Solutions",
    case: "Case Studies",
    contact: "Contact",
  },
  ja: {
    about: "私たちについて",
    solutions: "ソリューション",
    case: "事例紹介",
    contact: "お問い合わせ",
  },
};

const menuTargets = [
  { key: "about", href: "/about.html", section: "about", position: "top" },
  { key: "solutions", href: "/solutions.html", section: "solutions", position: "left" },
  { key: "case", href: "/case.html", section: "case", position: "right" },
  { key: "contact", href: "/contact.html", section: "contact", position: "bottom" },
];

const numbers = [
  {
    idx: "永續性",
    keyLabel: "Sustainability",
    val: "12",
    sup: "+",
    unit: " 年",
    desc: "最久的系統已持續穩定運作 12 年以上",
  },
  {
    idx: "穩定性",
    keyLabel: "Stability",
    val: "99.9",
    sup: "%",
    unit: "",
    desc: "關鍵系統長期維持高可用性與穩定運行",
  },
  {
    idx: "實戰成績",
    keyLabel: "Expertise",
    val: "325",
    sup: "+",
    unit: "",
    desc: (
      <>
        <span>已交付系統、設計物</span>
        <br />
        <span>與整體解決方案等</span>
      </>
    ),
  },
  {
    idx: "合作夥伴",
    keyLabel: "Partners",
    val: "70",
    sup: "+",
    unit: "",
    desc: "全球策略聯盟夥伴，持續共享資源與協同成長",
  },
];

const solutions = [
  {
    num: "01",
    eyebrow: "e-Commerce",
    titleHTML: <>電子商務 <span className="hl">方案</span></>,
    image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.jpg",
    label: "ESG-COM/2026",
    body: "規劃商品結構、客服／出貨流程與金物流串接，提供順暢購物體驗與會員成長。",
    points: ["金流／物流／發票／ERP 串接", "會員等級／點數／優惠券／再行銷", "跨境多語多幣，CDN 邊緣加速"],
    meta: "≥ 8 wks",
  },
  {
    num: "02",
    eyebrow: "Brand Site",
    titleHTML: <>品牌形象 <span className="hl">方案</span></>,
    image: "/img/plan/laptop-coworking-space_53876-14515.webp",
    label: "ESG-BRD/2026",
    body: "在有限的注意力裡先被看見。以敘事與視覺建立差異化，兼顧速度與 SEO。",
    points: ["首頁敘事／關鍵頁腳本與版型", "RWD + Core Web Vitals 優化", "搜尋曝光與社群分享設定"],
    meta: "≥ 4 wks",
  },
  {
    num: "03",
    eyebrow: "Enterprise Resource",
    titleHTML: <>企業資源管理 <span className="hl">方案</span></>,
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
    label: "ESG-ERP/2026",
    body: "從流程盤點到系統落地，打通商務、財務、人資、製造與供應鏈資料。",
    points: ["流程藍圖、權限／稽核制度", "報表／儀表板與 KPI 追蹤", "與既有系統雙向整合"],
    meta: "≥ 12 wks",
  },
  {
    num: "04",
    eyebrow: "Warehouse Management",
    titleHTML: <>倉儲管理 <span className="hl">方案</span></>,
    image: "/img/plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg",
    label: "ESG-WMS/2026",
    body: "條碼／PDA／批號／效期／盤點／庫齡一站式導入，降錯誤、提周轉。",
    points: ["入出庫／調撥／庫存追蹤", "撿料策略與路徑最佳化", "與 ERP、電商、OMS 串接"],
    meta: "≥ 10 wks",
  },
  {
    num: "05",
    eyebrow: "AI Integration",
    titleHTML: <>AI 整合 <span className="hl">方案</span></>,
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
    label: "ESG-AI/2026 · NEW",
    body: "把 LLM、RAG、Document AI 接進你的營運流程，不是 PoC，是真的會跑帳的 Agent。",
    points: ["AI Agent 工單／客服／業務工作流", "RAG 私有知識庫（含資料治理）", "私有部署 LLM／向量資料庫"],
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
    points: ["POC／MVP 快速驗證", "資料流與雲端架構設計", "安全／權限／稽核與維運"],
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
  ["02", "規劃提案", "使用情境、資料流、里程碑、估算與 UAT 驗收指標。", "Week 1"],
  ["03", "MVP / 模組優先級", "先做能帶來效益的 20%，快速驗證商業假設。", "Week 2–4"],
  ["04", "開發與週更", "每週迭代，提供可操作版本與透明的進度回報。", "Week 4–N"],
  ["05", "上線與培訓", "文件、權限、備援上線，安排操作訓練與資料移轉。", "Go-live"],
  ["06", "維運與優化", "事件回應、性能安全、功能優化與報表增補。", "持續"],
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
  ["Q1", "預算怎麼抓？", "我們會在規劃時提供分階段估算，先落地最關鍵的 20–40%，再視成效追加，降低一次到位的風險。"],
  ["Q2", "時程怎麼排？", "以里程碑與 UAT 指標拆分，每週固定 Demo 與回報，避免後期才發現落差。"],
  ["Q3", "AI 真的能上 production？", "可以，但前提是資料治理與保護機制要同時做。我們已有實際運行的 Agent，會搭配 audit log、人工複核點與 fallback 流程。"],
  ["Q4", "上線後怎麼維護？", "提供事件回應、月度例行檢查、版本升級、安全修補與備份演練等維運方案。"],
  ["Q5", "可與現有系統整合嗎？", "可。我們採 API First，支援 ERP、金流、物流、CRM、電商等常見系統雙向串接。"],
];

function getMenuItems(locale) {
  const labels = menuLabels[locale] || menuLabels.zh;
  return menuTargets.map((item) => ({
    ...item,
    label: labels[item.key],
  }));
}

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

function Header({ locale, onToggleLocale }) {
  return (
    <header className="page-header">
      <a className="brand-mark" href="/">
        <span className="logo">
          <img src="/img/logo_estiginto.png" alt="ESTIGINTO logo" />
        </span>
        <span className="ident">
          <img src="/img/Logo_ESTIGINTO.svg" alt="ESTIGINTO" />
        </span>
      </a>

      <div className="header-actions">
        <LanguageSwitch locale={locale} onSelect={onToggleLocale} />
      </div>
    </header>
  );
}

function SectionEyebrow({ index, label, meta }) {
  return (
    <div className="section-eyebrow">
      <span className="index">{index}</span>
      <span className="rule" aria-hidden="true" />
      <span className="meta">{meta}</span>
      <span style={{ gridColumn: "1 / -1", marginTop: 8, color: "inherit" }}>
        <span style={{ marginRight: 14, opacity: 0.5 }}></span>
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

          <p className="hero-kicker">AI 革命，讓價值聚焦在真正重要的事物上</p>

          <h1 className="hero-title">
            <span className="row1">迎接有史以來</span>
            <span className="row2">最好的</span>
            <span className="row3 accent">黃金時代</span>
          </h1>

          <p className="hero-lede">
            透過深度技術核心
            <br />
            致力於提供永續、高效的解決方案
            <br />
            持續成為企業成長的推手
          </p>
        </div>
      </div>

      <a className="scrolldown" href="#marquee">往下滾動</a>
    </section>
  );
}

function Marquee() {
  const items = [
    "主動式應變決策系統",
    "軟體系統規劃及建置",
    "軟硬體 IOT 整合",
    "ERP / WMS / CRM",
    "商務網站應用 / 電子商務 / 金流 / 發票",
    "客製化應用 APP",
    "戰情室儀表板",
    "自動化執行輔助系統",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="marquee" id="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((text, i) => (
          <span className="marquee-item" key={`m-${i}`}>
            <span className="dot" />
            <span>{text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Numbers() {
  return (
    <section className="section reveal" aria-label="Studio achievements">
      <div className="wrap">
        <SectionEyebrow
          index="§ Achievements"
          label="致力於打造有靈魂的設計 — 讓系統成為品牌成長的推手，並持續產生影響力"
          meta="從 2012 開始"
        />
        <div className="numbers">
          {numbers.map((n) => (
            <div className="number-cell" key={n.idx}>
              <div className="key">
                <span>{n.keyLabel}</span>
                <span className="idx">{n.idx}</span>
              </div>
              <div className="val">
                <span>{n.val}</span>
                {n.sup ? <sup>{n.sup}</sup> : null}
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
        <SectionEyebrow index="§ Industry-first" label="獨家競爭力" meta="manifesto · 2026" />
        <div className="manifesto">
          <h2 className="manifesto-quote">
            <span className="mq-line mq-prelude">
              難用的系統，多半不是技術問題，
            </span>
            <span className="mq-line mq-headline">
              而是<span className="hl underline">設計方向錯了</span>。
            </span>
            <span className="mq-line mq-coda">
              1. 用工程邏輯在設計人類行為<br />
              2. 用流程取代決策，而不是輔助決策<br />
              3. 用標準化套版，套用在非標準的業務場景
            </span>
          </h2>
          <div className="manifesto-aside">
            <p>
              規劃與設計的深度，
              決定系統的壽命。
            </p>
            <p>
              我們不為交付而做，
              只為真正服務使用者而設計。
            </p>
            <span className="signoff">— 這，就是系統永續的關鍵。</span>
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
        <SectionEyebrow index="§ 01 / Solutions" label="我們交付的方案範圍。" meta={`${solutions.length} programs`} />
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
                    {s.isNew ? <span className="pill">NEW</span> : null}
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
                {item.points.map((p, pointIndex) => (
                  <li key={`${item.label}-${pointIndex}`}>{p}</li>
                ))}
              </ul>
              <a className="btn" href="/contact.html" style={{ marginTop: 8 }}>
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
        <SectionEyebrow index="§ 03 / AI Lab" label="把 AI 變成可營運的系統。" meta="12 agents · in production" />
        <div className="ai-headline">
          <h2>
            不是 <span className="strike">PoC</span>。
            <br />
            是會處理<span className="hl">單據</span>、回應<span className="hl">客戶</span>、跑<span className="hl">帳</span>的 AI。
          </h2>
          <p className="lede">
            2024–2025 我們把實驗室裡的 LLM 帶上 production。到 2026 年，已經有 12 個 Agent 在客戶營運線上每天工作。
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
                {c.chips.map((chip, chipIndex) => (
                  <span className="chip" key={`${c.idx}-${chipIndex}`}>{chip}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <section className="section reveal" id="case" aria-label="Selected case">
      <div className="wrap">
        <SectionEyebrow index="§ 04 / Selected" label="一個正在跑的案例。" meta="anonymized · cross-border beauty" />
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
              五個系統各自為政，<span className="hl">倉儲錯誤率 3.2%。</span>
              <br />
              我們重做了流程，再做系統。
            </h3>
            <p className="summary">
              客戶原本電商、WMS、ERP、客服、會員五套系統各自更新，業務每天用 Excel 對單。我們重新設計商品主檔、
              訂單流與庫存事件，串成單一資料源，再把 AI 客服接上 SOP。
            </p>

            <div className="case-metrics">
              <div className="case-metric">
                <div className="label">出貨錯誤率</div>
                <div className="val"><span className="arrow">↓</span>0.4<span style={{ fontSize: "0.5em", color: "var(--ink-mute)" }}>%</span></div>
                <div className="delta">原 3.2% · 8x 改善</div>
              </div>
              <div className="case-metric">
                <div className="label">出貨時效</div>
                <div className="val"><span className="arrow">↑</span>2.8<span style={{ fontSize: "0.5em", color: "var(--ink-mute)" }}>x</span></div>
                <div className="delta">D+2 → D+0.7</div>
              </div>
              <div className="case-metric">
                <div className="label">客服自動化率</div>
                <div className="val"><span className="arrow">↑</span>68<span style={{ fontSize: "0.5em", color: "var(--ink-mute)" }}>%</span></div>
                <div className="delta">Agent 接管 L1，真人處理 L2/L3</div>
              </div>
              <div className="case-metric">
                <div className="label">月對帳工時</div>
                <div className="val"><span className="arrow">↓</span>92<span style={{ fontSize: "0.5em", color: "var(--ink-mute)" }}>%</span></div>
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
        <SectionEyebrow index="§ 05 / Process" label="從第一封信到上線維運。" meta="6 phases · transparent" />
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
      </div>
    </section>
  );
}

function TechStack() {
  return (
    <section className="section reveal" id="stack" aria-label="Tech stack">
      <div className="wrap">
        <SectionEyebrow index="§ 06 / Stack" label="我們的工具與生產線。" meta="curated · battle-tested" />
        <div className="stack-grid">
          {techStack.map((col) => (
            <div className="stack-col" key={col.code}>
              <h4>
                <b>{col.title}</b>
                <span>{col.code}</span>
              </h4>
              <div className="stack-chips">
                {col.chips.map((c, chipIndex) => (
                  <span className={`stack-chip ${col.signal ? "signal" : ""}`} key={`${col.code}-${chipIndex}`}>
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
        <SectionEyebrow index="§ 07 / FAQ" label="客戶最常問的事。" meta={`${faqs.length} questions`} />
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
        <SectionEyebrow index="§ 08 / Contact" label="準備開始合作了嗎" meta="response · within 1 business day" />
        <div className="contact">
          <div>
            <h2>
              告訴我們你的需求，
              <br />
              我們會一起<span className="hl">定義最合適的解法</span>。
            </h2>
            <p className="lede">
              先告訴我們你目前的營運情境與主要問題。
              <br />
              不論是網站、系統、流程整合，或 AI 導入，我們都會先幫你梳理脈絡。
              <br />
              接著再用合適的技術與執行方式，做出能真正落地的方案。
              <br />
              <br />
              你也可以直接預約一次 30 分鐘的初步討論。
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
              <span className="v">Taipei · TW · zh-Hant / en / ja</span>
            </div>
            <div className="contact-cta">
              <a className="btn btn-primary" href="mailto:contact@estiginto.com?subject=Project%20Brief%20%7C%20ESTIGINTO">
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
            <img className="footer-logo" src="/img/logo_estiginto_text.png" alt="ESTIGINTO" />
          </div>
          <div>
            <a href="/about.html">關於我們</a>
            <a href="/solutions.html">解決方案</a>
            <a href="/case.html">參考案例</a>
            <a href="/contact.html">聯繫我們</a>
          </div>
          <div>
            <h5>造物者科技</h5>
            <a href="mailto:contact@estiginto.com">contact@estiginto.com</a>
            <a href="tel:+886224315362">+886 2 2431 5362</a>
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

function MobileNav({ locale }) {
  const items = getMenuItems(locale);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`mobile-nav ${open ? "open" : ""}`}>
      <button className="mobile-nav-scrim" type="button" aria-label="Close mobile menu" onClick={() => setOpen(false)} />
      <div className="mobile-nav-dialog" aria-hidden={!open}>
        <button
          className="mobile-nav-trigger"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="mobile-nav-trigger-shape" aria-hidden="true" />
          <span className="mobile-nav-trigger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="mobile-nav-diamond">
          <div className="mobile-nav-diamond-core">
            {items.map((item) => (
              <a key={item.key} className={`mobile-nav-link ${item.position}`} href={item.href}>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopCursorMenu({ locale }) {
  const items = getMenuItems(locale);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveringTrigger, setHoveringTrigger] = useState(false);
  const [position, setPosition] = useState({ x: 160, y: 160 });
  const positionRef = useRef(position);
  const lastMouseRef = useRef({ x: 160, y: 160 });
  const prevClientRef = useRef({ x: 160, y: 160 });
  const lastMotionTimeRef = useRef(Date.now());
  const freezeRef = useRef(false);
  const hideTimerRef = useRef(null);
  const rejoinTimerRef = useRef(null);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const clearTimers = () => {
      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(rejoinTimerRef.current);
    };

    const scheduleHide = () => {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        if (!freezeRef.current && !hoveringTrigger && !open) {
          setVisible(false);
        }
      }, 2000);
    };

    const onMove = (event) => {
      if (open) {
        return;
      }

      const next = { x: event.clientX + 48, y: event.clientY + 48 };
      const current = positionRef.current;
      const distance = Math.hypot(next.x - current.x, next.y - current.y);

      // movement delta since last mouse event
      const moveDelta = Math.hypot(event.clientX - prevClientRef.current.x, event.clientY - prevClientRef.current.y);
      prevClientRef.current = { x: event.clientX, y: event.clientY };

      lastMouseRef.current = next;

      // Prevent showing the trigger for tiny accidental movements, but be more permissive so it is easier to catch
      if (!visible && distance < 12 && moveDelta < 2) {
        // still ignore extremely small accidental movement
        return;
      }

      if (hoveringTrigger) {
        console.log('[menu] hoveringTrigger is true - skipping follow');
        return;
      }

      const now = performance.now();

      // update last motion time only when movement exceeds a small threshold
      const motionThreshold = 2; // px
      if (moveDelta > motionThreshold) {
        lastMotionTimeRef.current = now;
      }

      const stationaryMs = now - lastMotionTimeRef.current;
      console.log('[menu] onMove', { clientX: event.clientX, clientY: event.clientY, open, hoveringTrigger, freeze: freezeRef.current, moveDelta, stationaryMs });
      console.log('[menu] computed', { next, distance });

      // large move -> immediately follow (lowered threshold to be more responsive)
      if (distance > 120) {
        console.log('[menu] large distance - immediate follow');
        freezeRef.current = false;
        clearTimers();
        setVisible(true);
        setPosition(next);
        scheduleHide();
        return;
      }

      // if mouse has been effectively stationary for >= 500ms, freeze
      const freezeAfter = 100; // ms
      if (stationaryMs >= freezeAfter) {
        if (!freezeRef.current) {
          console.log('[menu] stationary threshold reached - freezing follow');
        }
        freezeRef.current = true;
        // do not update position while frozen
        return;
      }

      // if we were frozen and user moves beyond rejoin distance, unfreeze
      if (freezeRef.current) {
        const movedFromPos = Math.hypot(next.x - positionRef.current.x, next.y - positionRef.current.y);
        console.log('[menu] was frozen, movedFromPos=', movedFromPos);
        const rejoinDistance = 40; // px
        if (movedFromPos > rejoinDistance) {
          console.log('[menu] moved beyond rejoin distance - unfreezing');
          freezeRef.current = false;
          clearTimers();
          setVisible(true);
          setPosition(next);
          scheduleHide();
        }
        // otherwise remain frozen
        return;
      }

      // default: update position
      clearTimers();
      setVisible(true);
      setPosition(next);
      console.log('[menu] updated position', next);
      scheduleHide();
    };

    const onLeave = () => {
      clearTimers();
      if (open) {
        return;
      }
      rejoinTimerRef.current = window.setTimeout(() => {
        freezeRef.current = false;
        setVisible(false);
      }, 1500);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimers();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [hoveringTrigger, open]);

  useEffect(() => {
    if (!hoveringTrigger || open) {
      return undefined;
    }

    window.clearTimeout(hideTimerRef.current);
    window.clearTimeout(rejoinTimerRef.current);
    console.log('[menu] hoveringTrigger effect — setting freezeRef = true');
    freezeRef.current = true;
    setVisible(true);

    return undefined;
  }, [hoveringTrigger, open]);

  const handleTriggerLeave = () => {
    setHoveringTrigger(false);
    if (open) {
      return;
    }
    window.clearTimeout(rejoinTimerRef.current);
    console.log('[menu] handleTriggerLeave — scheduling rejoin timer to unfreeze in 1500ms');
    rejoinTimerRef.current = window.setTimeout(() => {
      console.log('[menu] rejoin timer fired — unfreezing and restoring position', lastMouseRef.current);
      freezeRef.current = false;
      setPosition(lastMouseRef.current);
      setVisible(true);
    }, 1500);
  };

  return (
    <div className={`desktop-cursor-menu ${open ? "open" : ""} ${hoveringTrigger ? "hovering" : ""}`}>
      <button className="desktop-menu-scrim" type="button" aria-label="Close desktop menu" onClick={() => setOpen(false)} />

      <button
        className={`desktop-menu-trigger ${visible ? "visible" : ""}`}
        type="button"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        aria-label="Open desktop menu"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHoveringTrigger(true)}
        onMouseLeave={handleTriggerLeave}
        onFocus={() => setHoveringTrigger(true)}
        onBlur={handleTriggerLeave}
      >
        <span className="desktop-menu-trigger-shape" aria-hidden="true" />
        <span className="desktop-menu-trigger-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className="desktop-menu-diamond"
        aria-hidden={!open}
        onMouseEnter={() => setHoveringTrigger(true)}
        onMouseLeave={handleTriggerLeave}
      >
        <div className="desktop-menu-diamond-core">
          {items.map((item) => (
            <a key={item.key} className={`desktop-menu-link ${item.position}`} href={item.href}>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 480);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      className={`go-to-top ${visible ? "is-visible" : ""}`}
      type="button"
      aria-label="Go to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span aria-hidden="true" />
    </button>
  );
}

export default function App() {
  const [showConstructionPreview, setShowConstructionPreview] = useState(false);
  const initialSection = useMemo(() => {
    if (typeof document === "undefined") {
      return "";
    }
    return document.body.dataset.targetSection || "";
  }, []);

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

  const shouldUseMobileNav = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : locale === "ja" ? "ja" : "zh-Hant";
    window.localStorage.setItem("estiginto-locale", locale);
  }, [locale]);

  useEffect(() => {
    if (!initialSection) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const target = document.getElementById(initialSection);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [initialSection]);

  useEffect(() => {
    if (!isLocalPreview || showConstructionPreview) {
      return undefined;
    }

    const sections = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
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

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        section.classList.add("is-visible");
      } else {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isLocalPreview, showConstructionPreview]);

  if (!isLocalPreview || showConstructionPreview) {
    return (
      <>
        <ConstructionScreen />
        {isLocalPreview ? (
          <button className="preview-toggle" type="button" onClick={() => setShowConstructionPreview(false)}>
            返回完整頁面
          </button>
        ) : null}
      </>
    );
  }

  return (
    <>
      <button className="preview-toggle" type="button" onClick={() => setShowConstructionPreview(true)}>
        預覽建置中畫面
      </button>
      <Header locale={locale} onToggleLocale={setLocale} />
      {shouldUseMobileNav ? <MobileNav locale={locale} /> : <DesktopCursorMenu locale={locale} />}
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
      <GoToTop />
    </>
  );
}
