import { useEffect, useMemo, useRef, useState } from "react";

const localeOptions = [
  ["zh", "中文"],
  ["en", "EN"],
  ["ja", "日本語"],
];

const menuLabels = {
  zh: {
    about: "關於我們",
    solutions: "參考案例",
    case: "常見問題",
    contact: "聯繫我們",
  },
  en: {
    about: "About",
    solutions: "Case Studies",
    case: "FAQ",
    contact: "Contact",
  },
  ja: {
    about: "私たちについて",
    solutions: "事例紹介",
    case: "よくある質問",
    contact: "お問い合わせ",
  },
};

const menuTargets = [
  { key: "about", href: "/about.html", section: "about", position: "top" },
  { key: "solutions", href: "/case.html", section: "case", position: "left" },
  { key: "case", href: "/faq.html", section: "faq", position: "right" },
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

const faqGroups = [
  {
    title: "A. 入門與價格認知",
    subtitle: "常見議題",
    items: [
      ["1", "做一個網站多少錢？ *", "依功能與複雜度不同，製作總價從 5 萬～500 萬皆有可能，就像建築及裝潢，從套房到豪宅飯店皆有懸殊之差異。"],
      ["2", "為什麼報價差異這麼大？ *", "差異來自：功能、設計、客製程度、穩定性與擴展性。就像車子，有代步車也有跑車，即便都是輪子也有懸殊差異，最終還是取決於總預算。此外若是涉及商業模式，亦不建議總預算放置過多於系統部位，因為需考量保留行銷、行政、規劃等執行預算。"],
      ["3", "為什麼評估起來比較貴？ *", "儘管我們已相較業界優惠許多，但仍有許多隱性成本往往是決定系統成敗的關鍵，若有實際預算考量應先如實告知，我方亦擅長在有限預算內達到客戶的核心需求目標。"],
      ["4", "可以做便宜一點嗎？ *", "可以，只要如實告知實際預算，可以根據重要性減少功能、改變機制，或降低客製程度。"],
      ["5", "為什麼不能直接報價？或者報價很久？ *", "所有系統皆須經過詳細規劃過程，才能評估越趨近於實際施作情境所需要的成本；當需求尚不明朗或細節不足時，報價容易以超出安全的粗估範圍來提供。"],
      ["6", "MVP 是什麼？ *", "最小可行產品，先做核心功能驗證，確保商業邏輯正確，且避免一次性投入過多成本卻走錯路，可以階段性試錯後調整。"],
      ["7", "為什麼建議分階段？ *", "過往近乎所有專案失敗都是始於評估規劃的階段不充分，造成雙輸局面，理應降低風險，避免一次投入過大。"],
      ["8", "開發時間多久？ *", "根據需求，約 2 週～6 個月以上，大型專案可能涉及更長時間。"],
      ["9", "維護費是什麼？", "包含主機、更新、安全與維運。包含查找隱性未知的錯誤以及維持環境更新至安全版本。"],
    ],
  },
  {
    title: "B. 系統觀念與基本理解",
    subtitle: "基礎名詞",
    items: [
      ["11", "網址（URL）是什麼？", "使用者進入網站的地址。（像門牌號碼）"],
      ["12", "網域（Domain）是什麼？", "網站名稱，需要每年續費。（像你的品牌名稱）"],
      ["13", "主機（Hosting）是什麼？", "放網站資料的伺服器。（像房子本體）"],
      ["14", "網域 vs 主機差在哪？", "網域是地址，主機是內容所在。（像地址 vs 房子）"],
      ["15", "API 是什麼？", "系統與系統之間的溝通方式。（像服務生幫你點餐）"],
      ["16", "什麼叫「串接」？", "將不同系統連接。（像把不同電器接到同一個電源）"],
      ["17", "為什麼串接會增加費用？ *", "需要整合第三方系統與處理例外。（像接不同品牌設備要轉接）"],
      ["18", "前端 vs 後端？", "前端是畫面，後端是邏輯。（像店面 vs 廚房）"],
      ["19", "資料庫是什麼？", "用來儲存資料。（像倉庫）"],
      ["20", "SaaS 是什麼？", "雲端軟體服務。（像租用現成店面）"],
    ],
  },
  {
    title: "C. 功能與開發決策",
    subtitle: "範圍選擇",
    items: [
      ["21", "可以之後再加功能嗎？ *", "可以，但前期架構需設計好。（像預留管線）"],
      ["22", "可以只做部分功能嗎？", "可以，建議先做核心。（像先開主店）"],
      ["23", "是否一定要做 App？", "不一定，很多情況 Web 即可。（像不一定要開分店）"],
      ["24", "Web App 跟網站差在哪？", "Web App 偏功能，網站偏展示。（像工具 vs 展示間）"],
      ["25", "是否需要後台？", "大部分系統都需要。（像控制室）"],
      ["26", "是否需要權限控管？", "幾乎一定需要。（像門禁系統）"],
      ["27", "是否需要報表？", "視營運需求而定。（像財報）"],
      ["28", "是否需要即時系統？", "例如聊天才需要。（像即時通訊）"],
      ["29", "是否可以用現成工具？", "可以，但彈性有限。（像租現成店面）"],
      ["30", "客製 vs 套版怎麼選？ *", "看是否需要差異化。（像訂製西裝 vs 成衣）"],
    ],
  },
  {
    title: "D. 設計與使用體驗",
    subtitle: "介面與流程",
    items: [
      ["31", "為什麼設計也要錢？ *", "影響轉換率與效率。（像店面動線設計）"],
      ["32", "UI vs UX 差在哪？", "UI 是畫面，UX 是體驗。（像裝潢 vs 動線）"],
      ["33", "是否一定要做 RWD？", "建議要。（像一個空間適合不同人使用）"],
      ["34", "可以照參考網站做嗎？", "可以參考但不能複製。（像參考風格）"],
      ["35", "為什麼要先做設計？", "避免開發後錯誤。（像先畫藍圖）"],
      ["36", "是否需要 Dashboard？", "依需求而定。（像儀表板）"],
      ["37", "是否需要動畫？", "不一定。（像裝飾）"],
      ["38", "可以自己提供設計嗎？", "可以但需可實作。（像自己帶設計圖）"],
      ["39", "品牌風格重要嗎？", "影響信任感。（像門面）"],
      ["40", "為什麼有些網站比較順？", "因為流程有設計。（像動線順暢）"],
    ],
  },
  {
    title: "E. AI 與技術現實",
    subtitle: "工具與限制",
    items: [
      ["41", "你們會用 AI 做嗎？ *", "會，但 AI 是工具。（像自動化機器）"],
      ["42", "用 AI 為什麼還這麼貴？ *", "AI 解決速度，不解決決策。（像有工具但還要設計師）"],
      ["43", "AI 可以直接做完整系統嗎？", "目前不行。（像自動化但還需要規劃）"],
      ["44", "為什麼還需要工程團隊？", "需要整合與設計。（像工程師蓋房）"],
      ["45", "AI 會偷我的資料嗎？", "公開 AI 有風險。（像把機密講給外人）"],
      ["46", "可以做私有 AI 嗎？", "可以。（像內部系統）"],
      ["47", "AI 做出來可靠嗎？", "需要驗證。（像實習生）"],
      ["48", "AI 會取代工程師嗎？", "目前不會。（像工具不會取代設計）"],
      ["49", "可以用 AI 降成本嗎？", "部分可以。（像自動化降低工時）"],
      ["50", "AI 最大限制是什麼？", "缺乏整體決策。（像沒有全局視角）"],
    ],
  },
  {
    title: "F. 合約、權利與控制權",
    subtitle: "交付與授權",
    items: [
      ["51", "程式碼會給我嗎？ *", "依合約。（像房子的產權）"],
      ["52", "設計稿可以給原始檔嗎？ *", "可以但需約定。（像設計藍圖）"],
      ["53", "著作權是誰的？", "依合約。（像設計權）"],
      ["54", "我可以拿去給別人用嗎？", "需確認授權。（像轉讓設計）"],
      ["55", "可以只買設計嗎？", "可以。（像只買設計圖）"],
      ["56", "我可以自己架主機嗎？", "可以。（像自己管理房子）"],
      ["57", "可以轉給別人維護嗎？", "可以。（像換管理公司）"],
      ["58", "如果你們不在了怎麼辦？", "需有文件。（像有施工圖）"],
      ["59", "我可以改程式嗎？", "可以。（像改裝）"],
      ["60", "是否需要合約？", "一定需要。（像法律保障）"],
    ],
  },
  {
    title: "G. 風險、品質與現實",
    subtitle: "交付管理",
    items: [
      ["61", "可以保證成功嗎？ *", "不能。（像工具不能保證賺錢）"],
      ["62", "可以保證排名（SEO）嗎？ *", "不能。（像廣告不能保證成交）"],
      ["63", "為什麼專案會失敗？ *", "方向錯誤。（像走錯路）"],
      ["64", "為什麼需求要寫很細？", "避免做錯。（像施工圖）"],
      ["65", "可以很快做完嗎？", "可以但有代價。（像趕工）"],
      ["66", "可以邊做邊改嗎？", "可以但成本高。（像邊蓋邊改）"],
      ["67", "為什麼修改要收費？", "因為影響工時。（像改設計）"],
      ["68", "可以無限修改嗎？", "通常不行。（像工程變更）"],
      ["69", "為什麼要驗收？", "確保品質。（像驗屋）"],
      ["70", "為什麼要文件？", "確保可維護。（像施工圖）"],
    ],
  },
  {
    title: "H. 付款相關",
    subtitle: "最關鍵",
    items: [
      ["71", "別人比較便宜？ *", "品質與架構不同。（像不同等級產品）"],
      ["72", "我只要很簡單功能 *", "表面簡單但邏輯不簡單。（像看起來簡單的機器）"],
      ["73", "可以用模板嗎？", "可以但有限。（像現成方案）"],
      ["74", "為什麼這功能這麼貴？", "成本在邏輯。（像機械設計）"],
      ["75", "可以免費試做嗎？", "通常不行。（像免費設計）"],
      ["76", "可以成功再付錢嗎？", "可分階段。（像工程付款）"],
      ["77", "為什麼要簽約？", "保障雙方。（像契約）"],
      ["78", "為什麼要分階段付款？", "降低風險。（像工程款）"],
      ["79", "為什麼要這麼多討論？", "避免錯誤。（像設計會議）"],
      ["80", "為什麼系統這麼複雜？", "因為反映商業流程。（像一整套運作系統）"],
    ],
  },
];

const faqCount = faqGroups.reduce((count, group) => count + group.items.length, 0);

const pageTitles = {
  about: {
    kicker: "About",
    title: "關於我們",
    lede: "理解我們如何規劃系統、設計流程，並把長期可維護性放進每一次交付。",
  },
  case: {
    kicker: "Showcase",
    title: "參考案例",
    lede: "從真實應用情境出發，看系統如何解決流程、資料與營運效率問題。",
  },
  solutions: {
    kicker: "Showcase",
    title: "參考案例",
    lede: "依產業與情境整理常見系統應用方向，協助你對照自己的需求。",
  },
  faq: {
    kicker: "FAQ",
    title: "常見問題",
    lede: "整理入門、系統、功能、設計、AI、合約、風險與付款相關等合作前最常遇到的問題。",
  },
  contact: {
    kicker: "Contact",
    title: "聯繫我們",
    lede: "告訴我們你的現況、目標與卡住的地方，我們會先協助釐清方向。",
  },
};

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

function PageTitle({ page }) {
  if (!page) {
    return null;
  }

  return (
    <section className="page-title reveal" aria-labelledby="page-title">
      <div className="wrap">
        <p className="page-title-kicker">{page.kicker}</p>
        <h1 id="page-title">{page.title}</h1>
        <p>{page.lede}</p>
      </div>
    </section>
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
              難用的系統，多半不是技術或預算問題
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
              「規劃與機制構思的深度，決定系統的產品壽命。」
            </p>
            <p>
              使用敏捷開發及靈活應用的彈性架構<br />
              如同建築師的設計圖<br />
              在<b>施工前</b>就要把結構、動線、使用者體驗都反覆驗證。
            </p>
            <p>
              設計出來的系統規劃，即便交由任何人執行<br />
              都能確保與設計初衷及目標相合<br />
              不單為交付而做，而是為真正服務使用者而設計。
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
        <SectionEyebrow index="§ 參考其他人的應用情境" label="根據產業分類" meta={`${solutions.length} programs`} />
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

function ApplicationScenarioTeaser() {
  return (
    <section className="section bg-deep reveal" aria-label="Application scenario reference">
      <div className="wrap">
        <div className="scenario-teaser">
          <p className="scenario-teaser-kicker">Showcase</p>
          <h2>如果你需要參考其他人的應用情境</h2>
          <a className="btn btn-primary" href="/case.html">
            <span>了解更多</span>
            <span className="arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQTeaser() {
  return (
    <section className="section bg-deep reveal" aria-label="FAQ reference">
      <div className="wrap">
        <div className="scenario-teaser">
          <p className="scenario-teaser-kicker">FAQ</p>
          <h2>常見問題已整理成獨立頁面</h2>
          <a className="btn btn-primary" href="/faq.html">
            <span>前往常見問題</span>
            <span className="arrow" aria-hidden="true" />
          </a>
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
  const [openGroup, setOpenGroup] = useState(0);
  const [open, setOpen] = useState("0-0");

  return (
    <section className="section bg-deep reveal" id="faq" aria-label="FAQ">
      <div className="wrap">
        <div className="faq-groups">
          {faqGroups.map((group, groupIndex) => (
            <section
              className={`faq-group ${openGroup === groupIndex ? "open" : ""}`}
              key={group.title}
              aria-labelledby={`faq-group-${groupIndex}`}
            >
              <button
                className="faq-group-head"
                type="button"
                id={`faq-group-${groupIndex}`}
                aria-expanded={openGroup === groupIndex}
                onClick={() => {
                  setOpenGroup((current) => {
                    const next = current === groupIndex ? -1 : groupIndex;
                    if (next !== -1) {
                      setOpen(`${next}-0`);
                    }
                    return next;
                  });
                }}
              >
                <span className="faq-group-title">{group.title}</span>
                <span className="faq-group-subtitle">{group.subtitle}</span>
                <span className="faq-group-toggle" aria-hidden="true" />
              </button>
              <div className="faq-group-body">
                <div>
                  <div className="faq-list">
                    {group.items.map(([num, q, a], itemIndex) => {
                      const itemId = `${groupIndex}-${itemIndex}`;
                      const isOpen = open === itemId;
                      return (
                        <div className={`faq-item ${isOpen ? "open" : ""}`} key={num}>
                          <button
                            className="faq-q"
                            type="button"
                            onClick={() => setOpen(isOpen ? "" : itemId)}
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
                  {group.note ? (
                    <p className="faq-note">
                      <span>關鍵回答邏輯</span>
                      {group.note}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
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
            <a href="/case.html">參考案例</a>
            <a href="/faq.html">常見問題</a>
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
  const pageTitle = pageTitles[initialSection];
  const isStandalonePage = Boolean(pageTitle);
  const isFAQPage = initialSection === "faq";
  const shouldShowApplicationScenarios = initialSection === "case" || initialSection === "solutions";

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : locale === "ja" ? "ja" : "zh-Hant";
    window.localStorage.setItem("estiginto-locale", locale);
  }, [locale]);

  useEffect(() => {
    if (!initialSection || isStandalonePage) {
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
  }, [initialSection, isStandalonePage]);

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
        {isStandalonePage ? (
          <>
            <PageTitle page={pageTitle} />
            {initialSection === "about" ? (
              <>
                <Numbers />
                <Manifesto />
              </>
            ) : null}
            {initialSection === "case" ? (
              <>
                <CaseStudy />
                <Solutions />
              </>
            ) : null}
            {initialSection === "solutions" ? <Solutions /> : null}
            {isFAQPage ? <FAQ /> : null}
            {initialSection === "contact" ? <Contact /> : null}
          </>
        ) : (
          <>
            <Hero />
            <Marquee />
            <Numbers />
            <Manifesto />
            {initialSection === "solutions" ? <Solutions /> : null}
            {shouldShowApplicationScenarios ? null : <ApplicationScenarioTeaser />}
            <AILab />
            <CaseStudy />
            {initialSection === "case" ? <Solutions /> : null}
            <Process />
            <TechStack />
            <FAQTeaser />
            <Contact />
          </>
        )}
      </main>
      {isFAQPage ? null : <Footer />}
      <GoToTop />
    </>
  );
}
