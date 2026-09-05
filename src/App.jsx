import { useEffect, useMemo, useRef, useState } from "react";
import { faqContentByLocale } from "./faqContent.js";
import "./pageCompletion.css";
import {
  aboutIntroductionsByLocale,
  caseStudyGroupsByLocale,
  caseStudiesByLocale,
  companyStatsByLocale,
  serviceFamiliesByLocale,
  teamMembersByLocale,
  teamSectionCopyByLocale,
} from "./content2026.js";
import {
  getInitialLocale,
  readLanguageCookie,
  serializeLanguageCookie,
  shouldShowMobileHomeLanguagePrompt,
} from "./mobileLanguagePrompt.js";
import { advanceMobileNavScrollState } from "./mobileNavScroll.js";
import { getServiceMenuGroups } from "./navigationMenu.js";
import {
  LANGUAGE_TRANSITION_DURATION,
  LANGUAGE_TRANSITION_SWAP_DELAY,
  shouldAnimateLanguageChange,
} from "./languageTransition.js";
import {
  INITIAL_PAGE_ENTER_DURATION,
  PAGE_ENTER_DURATION,
  PAGE_LEAVE_DURATION,
  REDUCED_PAGE_TRANSITION_DURATION,
  getInitialPageTransitionVariant,
  getPageTransitionBrand,
  getPageTransitionVariant,
  getTransitionDestination,
} from "./pageTransition.js";
import { createHeroSoulRibbon } from "./heroSoulRibbon.js";
import OrbitalMark from "./OrbitalMark.jsx";
import { createPageVortexTransition } from "./pageVortexTransition.js";
import { buildClientLogoLanes, clientLogos } from "./clientLogoMarquee.js";
import {
  cancelCursorMenuFrame,
  resolveCursorMenuApproach,
} from "./desktopCursorMenuMotion.js";

const localeOptions = [
  ["zh", "中文"],
  ["en", "EN"],
  ["ja", "日本語"],
];

const languagePromptCopy = {
  zh: { eyebrow: "LANGUAGE", title: "選擇您的語言" },
  en: { eyebrow: "LANGUAGE", title: "Choose your language" },
  ja: { eyebrow: "LANGUAGE", title: "言語を選択してください" },
};

const languageTransitionCopy = {
  zh: "語言切換／正在解碼",
  en: "LANGUAGE SHIFT / DECODING",
  ja: "言語切替／デコード中",
};

const menuLabels = {
  zh: {
    home: "首頁",
    about: "關於我們",
    solutions: "解決方案",
    case: "參考案例",
    contact: "聯絡我們",
    servicesMenu: "服務導覽",
  },
  en: {
    home: "Home",
    about: "About",
    solutions: "Solutions",
    case: "Case Studies",
    contact: "Contact",
    servicesMenu: "Service navigation",
  },
  ja: {
    home: "ホーム",
    about: "私たちについて",
    solutions: "ソリューション",
    case: "事例紹介",
    contact: "お問い合わせ",
    servicesMenu: "サービスナビゲーション",
  },
};

const desktopPrimaryMenuCopy = {
  zh: { faq: "合作說明", articles: "文章", siteMenu: "探索 ESTIGINTO" },
  en: { faq: "Working with us", articles: "Articles", siteMenu: "Explore ESTIGINTO" },
  ja: { faq: "ご依頼について", articles: "記事", siteMenu: "ESTIGINTOを知る" },
};

const consultingServicesByLocale = {
  zh: {
    sectionLabel: "商業顧問服務",
    sectionMeta: "四個專業方向",
    intro: "評估既有品牌規範、營運流程與技術環境，釐清各階段的目標、協作分工及執行優先順序。",
    labels: { situations: "適用需求", scope: "服務範圍", deliverables: "規劃成果", execution: "後續執行", consult: "聯絡我們" },
    processTitle: "顧問合作流程",
    process: ["現況盤點", "目標確認", "策略規劃", "執行協作", "成效檢視"],
    services: [
      { id: "systems-consulting", shortLabel: "系統顧問", title: "系統顧問服務", summary: "評估營運流程、使用權限與資料需求，規劃系統架構及導入順序。", situations: ["準備導入或汰換 ERP、CRM、WMS", "既有系統分散，流程與資料難以串接"], scope: ["需求與流程盤點", "功能、權限與資料架構", "導入順序與專案風險"], deliverables: ["需求分析", "系統架構圖", "導入藍圖"], execution: "可依規劃執行客製系統開發、既有系統整合與專案協作。" },
      { id: "digital-integration", shortLabel: "數位整合", title: "數位整合顧問", summary: "規劃網站、電商、會員與第三方服務的資料串接，減少重複作業。", situations: ["不同工具之間需要重複輸入或人工彙整資料", "網站、金流、物流與內部系統各自運作"], scope: ["數位服務盤點", "資料流與 API 串接", "自動化與階段建置"], deliverables: ["整合架構圖", "串接清單", "執行優先序"], execution: "可依規劃建置網站、電商、會員功能，以及金流、物流與自動化串接。" },
      { id: "visual-design", shortLabel: "視覺設計", title: "視覺設計顧問", summary: "讓品牌、介面與行銷素材使用同一套清楚且可延續的視覺語言。", situations: ["品牌視覺缺乏一致性", "數位介面資訊層級不清楚"], scope: ["品牌視覺檢視", "UI 與資訊層級", "設計規範與素材管理"], deliverables: ["視覺方向", "設計規範", "改善清單"], execution: "可依規劃製作品牌識別、介面、網站視覺與行銷素材。" },
      { id: "international-marketing", shortLabel: "國際行銷", title: "國際行銷顧問", summary: "依目標市場與客戶需求，規劃多語內容、行銷通路及在地化方式。", situations: ["準備進入海外市場", "已有多語內容，希望改善海外客戶的洽詢與購買流程"], scope: ["市場與受眾定位", "多語內容與國際 SEO", "廣告、通路與在地化"], deliverables: ["市場進入策略", "內容方向", "執行計畫"], execution: "可依規劃製作多語網站與廣告素材，並執行 SEO 及海外行銷。" },
    ],
  },
  en: {
    sectionLabel: "Business Consulting", sectionMeta: "Four advisory practices", intro: "We review brand standards, operating processes, and technical environments to define priorities, responsibilities, and a practical implementation plan.",
    labels: { situations: "Best for", scope: "Advisory scope", deliverables: "Deliverables", execution: "Execution support", consult: "Discuss a project" }, processTitle: "How we work", process: ["Current state", "Goals", "Strategy", "Execution", "Review"],
    services: [
      { id: "systems-consulting", shortLabel: "Systems", title: "Systems Consulting", summary: "Turn workflows, permissions, and data relationships into an implementable system blueprint.", situations: ["Planning an ERP, CRM, or WMS rollout", "Disconnected systems and manual handoffs"], scope: ["Workflow discovery", "Functional and data architecture", "Implementation sequence and risk"], deliverables: ["Requirements analysis", "Architecture map", "Adoption roadmap"], execution: "Connects to custom development, integration, and delivery support." },
      { id: "digital-integration", shortLabel: "Integration", title: "Digital Integration Consulting", summary: "Connect websites, commerce, membership, and third-party services into one operating flow.", situations: ["Teams manually move data between tools", "Web, payment, logistics, and internal systems operate separately"], scope: ["Digital service audit", "Data flow and API integration", "Automation roadmap"], deliverables: ["Integration map", "Connection inventory", "Prioritized plan"], execution: "Connects to web, commerce, membership, payments, logistics, and automation." },
      { id: "visual-design", shortLabel: "Visual", title: "Visual Design Consulting", summary: "Create a consistent visual language across brand, interface, and marketing materials.", situations: ["Brand applications feel inconsistent", "Digital interfaces lack visual hierarchy"], scope: ["Brand review", "UI and information hierarchy", "Design governance"], deliverables: ["Visual direction", "Design guidelines", "Improvement list"], execution: "Connects to identity, UI, web visuals, and campaign assets." },
      { id: "international-marketing", shortLabel: "Global", title: "International Marketing Consulting", summary: "Plan multilingual communication, channels, and localization around the target market and its customers.", situations: ["Preparing to enter overseas markets", "Multilingual content exists without a conversion path"], scope: ["Market and audience position", "Multilingual content and SEO", "Ads, channels, and localization"], deliverables: ["Market-entry strategy", "Content direction", "Execution plan"], execution: "Connects to multilingual websites, SEO, advertising, and market execution." },
    ],
  },
  ja: {
    sectionLabel: "ビジネスコンサルティング", sectionMeta: "4つの専門領域", intro: "ブランド基準、業務フロー、技術環境を確認し、各段階の目標、役割分担、実施の優先順位を整理します。",
    labels: { situations: "適した状況", scope: "支援範囲", deliverables: "成果物", execution: "実行支援", consult: "お問い合わせ" }, processTitle: "支援の流れ", process: ["現状整理", "目標確認", "戦略設計", "実行連携", "効果検証"],
    services: [
      { id: "systems-consulting", shortLabel: "システム", title: "システムコンサルティング", summary: "業務、権限、データを導入可能なシステム設計へ整理します。", situations: ["ERP・CRM・WMS の導入や刷新", "システムと業務が分断している"], scope: ["業務と要件の整理", "機能・権限・データ設計", "導入順序とリスク"], deliverables: ["要件分析", "構成図", "導入ロードマップ"], execution: "カスタム開発、既存連携、プロジェクト支援へ接続できます。" },
      { id: "digital-integration", shortLabel: "デジタル統合", title: "デジタル統合コンサルティング", summary: "Web、EC、会員、外部サービスを一つの運用フローへ統合します。", situations: ["ツール間の手作業が多い", "決済・物流・社内システムが分断している"], scope: ["サービス棚卸し", "データと API 連携", "自動化計画"], deliverables: ["統合構成図", "連携一覧", "優先順位"], execution: "Web、EC、会員、決済、物流、自動化の構築へ接続できます。" },
      { id: "visual-design", shortLabel: "ビジュアル", title: "ビジュアルデザインコンサルティング", summary: "ブランド、UI、販促物に一貫した視覚言語を設計します。", situations: ["ブランド表現が統一されていない", "画面の情報階層が分かりにくい"], scope: ["ブランド診断", "UI と情報階層", "デザイン運用"], deliverables: ["ビジュアル方針", "デザイン規定", "改善一覧"], execution: "ブランド、UI、Web、マーケティング素材制作へ接続できます。" },
      { id: "international-marketing", shortLabel: "海外展開", title: "国際マーケティングコンサルティング", summary: "対象市場と顧客のニーズに応じて、多言語のコミュニケーション、販路、現地化を計画します。", situations: ["海外市場への進出を検討している", "多言語コンテンツに成果導線がない"], scope: ["市場・顧客定位", "多言語コンテンツと SEO", "広告・チャネル・現地化"], deliverables: ["市場参入戦略", "コンテンツ方針", "実行計画"], execution: "多言語サイト、SEO、広告、海外施策へ接続できます。" },
    ],
  },
};

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
    val: "12",
    sup: "",
    unit: " 年",
    desc: "最久的系統已持續穩定運作 12 年",
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
];

const solutions = [
  {
    num: "01",
    eyebrow: "e-Commerce",
    titleHTML: <>電子商務 <span className="hl">方案</span></>,
    image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.webp",
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
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
    label: "ESG-ERP/2026",
    body: "從流程盤點到系統落地，打通商務、財務、人資、製造與供應鏈資料。",
    points: ["流程藍圖、權限／稽核制度", "報表／儀表板與 KPI 追蹤", "與既有系統雙向整合"],
    meta: "≥ 12 wks",
  },
  {
    num: "04",
    eyebrow: "Warehouse Management",
    titleHTML: <>倉儲管理 <span className="hl">方案</span></>,
    image: "/img/plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.webp",
    label: "ESG-WMS/2026",
    body: "條碼／PDA／批號／效期／盤點／庫齡一站式導入，降錯誤、提周轉。",
    points: ["入出庫／調撥／庫存追蹤", "撿料策略與路徑最佳化", "與 ERP、電商、OMS 串接"],
    meta: "≥ 10 wks",
  },
  {
    num: "05",
    eyebrow: "AI Integration",
    titleHTML: <>AI 整合 <span className="hl">方案</span></>,
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
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
    image: "/img/plan/close-up-elegant-decoration-house.webp",
    label: "ESG-CST/2026",
    body: "平台服務、B2B 工具、APP 到資訊看板。以迭代方式，把你的構想穩定變成產品。",
    points: ["POC／MVP 快速驗證", "資料流與雲端架構設計", "安全／權限／稽核與維運"],
    meta: "依範圍而定",
  },
];

const aiCards = [
  {
    span: "span-6 flagship",
    idx: "01",
    tag: "客製化企業營運系統",
    titleHTML: <>企業成長的 <span className="hl">加速器</span></>,
    body: "將實際業務流程、情境、核心競爭力系統化、自動作業，將注意力放在最有價值的地方。",
    chips: ["APP", "ERP", "CRM", "BDM", "HRM", "WMS", "SCM"],
  },
  {
    span: "span-6",
    idx: "02",
    tag: "Website APP",
    titleHTML: <>商務網站<span className="hl">應用</span></>,
    body: "商務官方網站、品牌形象、電子商務網站、線上預約、客製化應用等",
    chips: ["靜態網站", "動態網站", "中型網站", "大型網站"],
  },
  {
    span: "span-4",
    idx: "03",
    tag: "Global Growth",
    titleHTML: <><span className="hl">國際</span>行銷</>,
    body: "從市場策略、SEO 到業務開發與經銷代理，我們協助企業建立完整的成長與成交路徑，而不只是曝光。",
    chips: [
      "Business Development",
      "SEO Strategy",
      "Channel Partner",
      "Sales Funnel",
      "Go-to-Market",
      "Consulting"
    ],
  },
  {
    span: "span-4",
    idx: "04",
    tag: "Graphic Design",
    titleHTML: <><span className="hl">視覺</span>設計</>,
    body: "UI、UX、品牌視覺設計、海報、商務簡報、印刷品、行銷素材 等。",
    chips: ["簡報", "海報", "DM", "社群宣傳", "活動策展", "印刷品", "CIS", "Logo"],
  },
  {
    span: "span-4",
    idx: "05",
    tag: "Documents",
    titleHTML: <>整合<span className="hl">資訊</span>服務 </>,
    body: "系統維運、雲端架構、私有模型、資料分析、自動化、資料處理。",
    chips: ["VPS", "CI/CD", "LLM", "Workflow"],
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

const faqGroups = faqContentByLocale.zh;

const pageTitles = {
  about: {
    kicker: "About",
    title: "關於我們",
    lede: aboutIntroductionsByLocale.zh,
  },
  case: {
    kicker: "Selected Work",
    title: "精選實績",
    lede: "精選企業管理、設備監控、電商服務與品牌網站專案，呈現不同產業的需求與建置成果。",
  },
  solutions: {
    kicker: "Solutions",
    title: "解決方案",
    lede: "以品牌標準與營運需求為基礎，整合網站、企業系統、視覺設計與數位行銷。",
  },
  consulting: {
    kicker: "Business Consulting",
    title: "商業顧問服務",
    lede: "從品牌、服務流程與資訊系統評估需求，提供企業在規劃、整合與執行階段所需的專業建議。",
  },
  faq: {
    kicker: "FAQ",
    title: "合作說明",
    lede: "關於專案規劃、品牌與系統整合、交付及維護，了解我們的合作方式與責任分工。",
  },
  contact: {
    kicker: "Contact",
    title: "聯絡我們",
    lede: "關於品牌、數位服務或企業系統專案，歡迎與我們聯繫，討論專案方向與合作需求。",
  },
};

const localizedCopy = {
  zh: {
    pageTitles,
    numbers,
    solutions,
    aiCards,
    processSteps,
    faqGroups,
    hero: {
      kicker: "將你的願景，建構在磐石上",
      title: ["致力於打造", "有靈魂的設計"],
      lede: [
        "結合品牌策略、體驗設計與技術整合，",
        "為企業建立一致的服務體驗與營運系統。",
      ],
      scrolldown: "往下滾動",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "服務經驗",
      status: "CLIENT ARCHIVE / 03 STREAMS",
    },
    marquee: [
      "主動式應變決策系統",
      "軟體系統規劃及建置",
      "軟硬體 IOT 整合",
      "ERP / WMS / CRM",
      "商務網站應用 / 電子商務 / 金流 / 發票",
      "客製化應用 APP",
      "戰情室儀表板",
      "自動化執行輔助系統",
    ],
    achievements: {
      label: "致力於打造有靈魂的設計 — 讓系統成為品牌成長的推手，並持續產生影響力",
      meta: "從 2011 開始",
    },
    manifesto: {
      label: "我們的方法",
      prelude: "讓系統貼合工作",
      headlinePrefix: "而不是讓工作",
      headlineHighlight: "遷就系統",
      points: ["1. 操作方式貼近真實的工作習慣", "2. 資訊在需要時清楚出現", "3. 架構保留調整與延伸的空間"],
      quote: "「先理解產業環境，再設計系統。」",
      paragraphs: [
        ["我們從使用角色、作業流程與資訊流開始", "釐清每一個重要的操作與決策節點", "再將需求整理成可以驗證、逐步實現的系統規劃。"],
        ["讓系統自然融入團隊的日常", "減少重複確認與不必要的操作", "也為未來的調整與延伸保留空間。"],
      ],
      signoff: "— 讓工具回到支援工作的角色。",
    },
    solutionsUi: {
      index: "§ 專業服務",
      label: "服務內容",
      button: "洽詢服務",
    },
    aiLab: {
      label: "以客戶為本",
      title: "核心服務項目",
      lede: "自 2011 開始，深度結合台灣產業鏈資源，逐步走向國際",
    },
    faqNoteLabel: "關鍵回答邏輯",
    contact: {
      label: "如果您準備好了",
      meta: "立即預約",
      titleA: "抓住您",
      titleHighlight: "改變未來的契機",
      lede: ["立即預約線上諮詢", "協助您打造自己的商業版圖。"],
      emailButton: "寄信給我們",
    },
    footer: {
      company: "造物者科技",
      navLabel: "頁尾網站導覽",
      line: "LINE@ 官方帳號",
      faqLabel: "合作說明",
    },
    construction: "網站內容更新中 敬請期待",
    font: {
      label: "字體大小",
      increase: "放大字體",
      reset: "標準字體",
      decrease: "縮小字體",
    },
    preview: {
      show: "預覽建置中畫面",
      back: "返回完整頁面",
    },
  },
  en: {
    pageTitles: {
      about: { kicker: "About", title: "About Us", lede: aboutIntroductionsByLocale.en },
      case: { kicker: "Selected Work", title: "Selected Work", lede: "Explore our work in business operations, equipment monitoring, e-commerce, and brand websites." },
      solutions: { kicker: "Solutions", title: "Solutions", lede: "Websites, custom systems, brand design, and digital marketing - connected from planning through long-term operation." },
      consulting: { kicker: "Business Consulting", title: "Business Consulting", lede: "Advice on software adoption, digital integration, visual identity, and international marketing, with a plan for implementation." },
      faq: { kicker: "FAQ", title: "Working with Us", lede: "Our approach to project planning, brand and systems integration, delivery, and ongoing support." },
      contact: { kicker: "Contact", title: "Contact Us", lede: "For brand, digital service, or enterprise system projects, contact us to discuss your requirements and the scope of collaboration." },
    },
    numbers: [
      { idx: "Sustainability", keyLabel: "Sustainability", val: "12", sup: "+", unit: " yrs", desc: "Our longest-running system has operated reliably for more than 12 years." },
      { idx: "Longevity", keyLabel: "Longevity", val: "12", sup: "", unit: " yrs", desc: "Our longest-running system has operated for 12 years." },
      { idx: "Delivery", keyLabel: "Expertise", val: "325", sup: "+", unit: "", desc: <>Delivered systems, design assets,<br />and complete solution packages.</> },
      { idx: "Founded", keyLabel: "Founded", val: "2011", sup: "", unit: "", desc: "Formed by national software competition representatives." },
    ],
    solutions: [
      { ...solutions[0], titleHTML: <>E-commerce <span className="hl">Solutions</span></>, body: "We plan product structures, service and fulfillment flows, payment, logistics, and member growth.", points: ["Payment, logistics, invoice, and ERP integration", "Membership tiers, points, coupons, and remarketing", "Cross-border multilingual and multicurrency setup with CDN acceleration"] },
      { ...solutions[1], titleHTML: <>Brand Website <span className="hl">Solutions</span></>, body: "Be seen within limited attention. We build differentiation through narrative and visual systems while preserving speed and SEO.", points: ["Homepage narrative, key page scripts, and layout", "RWD and Core Web Vitals optimization", "Search visibility and social sharing setup"] },
      { ...solutions[2], titleHTML: <>Enterprise Resource <span className="hl">Solutions</span></>, body: "From process discovery to implementation, we connect commerce, finance, HR, manufacturing, and supply-chain data.", points: ["Process blueprint, permissions, and audit model", "Reports, dashboards, and KPI tracking", "Two-way integration with existing systems"] },
      { ...solutions[3], titleHTML: <>Warehouse Management <span className="hl">Solutions</span></>, body: "Barcode, PDA, lot number, expiry date, inventory count, and stock aging workflows in one implementation.", points: ["Inbound, outbound, transfer, and inventory tracking", "Picking strategy and route optimization", "Integration with ERP, e-commerce, and OMS"] },
      { ...solutions[4], titleHTML: <>AI Integration <span className="hl">Solutions</span></>, body: "We connect LLMs, RAG, and Document AI into real operational workflows, not just PoCs.", points: ["AI Agent workflows for tickets, service, and sales", "Private RAG knowledge bases with data governance", "Private LLM and vector database deployment"] },
      { ...solutions[5], titleHTML: <>Bespoke <span className="hl">Solutions</span></>, body: "Platforms, B2B tools, apps, and dashboards. We turn ideas into stable products through iteration.", points: ["POC and MVP validation", "Data-flow and cloud architecture design", "Security, permissions, audit, and operations"] },
    ],
    aiCards: [
      { ...aiCards[0], tag: "Bespoke enterprise operating systems", titleHTML: <>A growth <span className="hl">accelerator</span> for business</>, body: "We systematize real workflows, operating contexts, and core capabilities so teams can focus on the work that creates value." },
      { ...aiCards[1], tag: "Website APP", titleHTML: <>Business website <span className="hl">applications</span></>, body: "Official sites, brand websites, e-commerce, booking flows, and custom web applications.", chips: ["Static sites", "Dynamic sites", "Mid-sized sites", "Large sites"] },
      { ...aiCards[2], titleHTML: <><span className="hl">International</span> growth</>, body: "From market strategy and SEO to business development and channel partners, we build paths to growth and conversion, not just exposure." },
      { ...aiCards[3], titleHTML: <><span className="hl">Visual</span> design</>, body: "UI, UX, brand identity, posters, business decks, printed materials, and marketing assets.", chips: ["Decks", "Posters", "DM", "Social campaigns", "Event curation", "Print", "CIS", "Logo"] },
      { ...aiCards[4], titleHTML: <>Integrated <span className="hl">information</span> services</>, body: "System operations, cloud architecture, private models, data analysis, automation, and data processing." },
    ],
    processSteps: [
      ["01", "30-45 min discovery", "Clarify business goals, budget range, timeline constraints, and risks.", "Week 0"],
      ["02", "Planning proposal", "Use cases, data flow, milestones, estimates, and UAT acceptance metrics.", "Week 1"],
      ["03", "MVP / module priority", "Build the 20% that creates value first and validate business assumptions quickly.", "Week 2-4"],
      ["04", "Development and weekly updates", "Iterate weekly with usable builds and transparent progress reports.", "Week 4-N"],
      ["05", "Launch and training", "Documentation, permissions, backup launch, training, and data migration.", "Go-live"],
      ["06", "Operations and optimization", "Incident response, performance, security, feature optimization, and reporting additions.", "Ongoing"],
    ],
    faqGroups,
    hero: {
      kicker: "Build your vision on solid ground",
      title: ["Driven to create", "design with soul"],
      lede: [
        "Brand strategy, experience design, and technology.",
        "Connecting customer experiences with business operations.",
      ],
      scrolldown: "Scroll down",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "Service Experience",
      status: "CLIENT ARCHIVE / 03 STREAMS",
    },
    marquee: ["Adaptive decision systems", "Software system planning and implementation", "Software, hardware, and IoT integration", "ERP / WMS / CRM", "Business websites / e-commerce / payments / invoices", "Custom app development", "War-room dashboards", "Automation execution support systems"],
    achievements: { label: "We build designs with a soul, turning systems into engines for brand growth and lasting impact.", meta: "Since 2011" },
    manifesto: { label: "Our Approach", prelude: "Let systems fit the way work gets done", headlinePrefix: "instead of making work", headlineHighlight: "adapt to the system", points: ["1. Interactions reflect real working habits", "2. Information appears clearly when it is needed", "3. The architecture leaves room to adapt and grow"], quote: "\"Understand the work before designing the system.\"", paragraphs: [["We begin with users, workflows, and information flows", "clarifying the interactions and decisions that matter", "then shaping the needs into a system plan we can validate and build step by step."], ["The system becomes a natural part of the team's day-to-day work", "reducing repeated checks and unnecessary steps", "while leaving room for future changes and growth."]], signoff: "- Let tools return to their role of supporting the work." },
    solutionsUi: { index: "§ Services", label: "Services", button: "Contact us" },
    aiLab: { label: "Customer-centered", title: "Core Services", lede: "Since 2011, we have connected deeply with Taiwan's industry chain and gradually expanded internationally." },
    faqNoteLabel: "Key answer logic",
    contact: { label: "When you are ready", meta: "Discuss a project", titleA: "Seize your", titleHighlight: "chance to shape the future", lede: ["Book an online consultation now", "and let us help build your business landscape."], emailButton: "Email us" },
    footer: { company: "ESTIGINTO Co., Ltd.", navLabel: "Footer navigation", line: "LINE@ Official Account", faqLabel: "Working with us" },
    construction: "Website content is being updated. Please stay tuned.",
    font: { label: "Font size", increase: "Increase font size", reset: "Default font size", decrease: "Decrease font size" },
    preview: { show: "Preview construction page", back: "Back to full page" },
  },
  ja: {
    pageTitles: {
      about: { kicker: "About", title: "私たちについて", lede: aboutIntroductionsByLocale.ja },
      case: { kicker: "Selected Work", title: "実績紹介", lede: "複雑な業務要件を整理し、現場で長く使える仕組みへ。" },
      solutions: { kicker: "Solutions", title: "ソリューション", lede: "Webサイト、業務システム、ブランドデザイン、デジタルマーケティングを企画から長期運用まで一貫して支援します。" },
      consulting: { kicker: "Business Consulting", title: "ビジネスコンサルティング", lede: "システム、デジタル統合、ビジュアル、国際マーケティングを実行可能な計画へ整理します。" },
      faq: { kicker: "Working Together", title: "ご依頼について", lede: "プロジェクトの計画、ブランドとシステムの連携、納品・保守における進め方と役割分担をご案内します。" },
      contact: { kicker: "Contact", title: "お問い合わせ", lede: "ブランド、デジタルサービス、業務システムのプロジェクトについて、方針やご要望をお聞かせください。" },
    },
    numbers: [
      { idx: "持続性", keyLabel: "Sustainability", val: "12", sup: "+", unit: " 年", desc: "最も長く稼働しているシステムは 12 年以上安定運用されています。" },
      { idx: "長期運用", keyLabel: "Longevity", val: "12", sup: "", unit: " 年", desc: "最も長く稼働しているシステムは12年間運用されています。" },
      { idx: "実績", keyLabel: "Expertise", val: "325", sup: "+", unit: "", desc: <>システム、デザイン成果物、<br />総合ソリューションを納品。</> },
      { idx: "創業", keyLabel: "Founded", val: "2011", sup: "", unit: "", desc: "ソフトウェア全国大会の代表選手を中心に結成しました。" },
    ],
    solutions: [
      { ...solutions[0], titleHTML: <>Eコマース <span className="hl">ソリューション</span></>, body: "商品構成、カスタマーサポート、出荷、決済、物流、会員成長まで一貫して設計します。", points: ["決済、物流、請求書、ERP 連携", "会員ランク、ポイント、クーポン、リマーケティング", "越境向け多言語・多通貨と CDN 高速化"] },
      { ...solutions[1], titleHTML: <>ブランドサイト <span className="hl">ソリューション</span></>, body: "限られた注目の中で選ばれるために、ストーリーとビジュアルで差別化し、速度と SEO も両立します。", points: ["トップページのストーリー、主要ページ構成", "RWD と Core Web Vitals 最適化", "検索露出と SNS 共有設定"] },
      { ...solutions[2], titleHTML: <>企業資源管理 <span className="hl">ソリューション</span></>, body: "業務整理から導入まで、商流、財務、人事、製造、サプライチェーンのデータを接続します。", points: ["業務フロー、権限、監査設計", "レポート、ダッシュボード、KPI 追跡", "既存システムとの双方向連携"] },
      { ...solutions[3], titleHTML: <>倉庫管理 <span className="hl">ソリューション</span></>, body: "バーコード、PDA、ロット、期限、棚卸、在庫年齢を一括導入し、ミスを減らして回転率を上げます。", points: ["入出庫、移動、在庫追跡", "ピッキング戦略と動線最適化", "ERP、EC、OMS 連携"] },
      { ...solutions[4], titleHTML: <>AI 統合 <span className="hl">ソリューション</span></>, body: "LLM、RAG、Document AI を実際の運用フローへ接続し、PoC で終わらない仕組みにします。", points: ["チケット、サポート、営業向け AI Agent", "データガバナンス込みの非公開 RAG 知識ベース", "プライベート LLM とベクトルDB導入"] },
      { ...solutions[5], titleHTML: <>カスタム <span className="hl">ソリューション</span></>, body: "プラットフォーム、B2B ツール、アプリ、ダッシュボードまで、反復開発で構想を安定した製品にします。", points: ["POC / MVP の迅速な検証", "データフローとクラウド設計", "セキュリティ、権限、監査、運用"] },
    ],
    aiCards: [
      { ...aiCards[0], tag: "カスタム企業運用システム", titleHTML: <>企業成長の <span className="hl">加速装置</span></>, body: "実際の業務、現場状況、競争力をシステム化し、価値の高い仕事に集中できる環境を作ります。" },
      { ...aiCards[1], tag: "Website APP", titleHTML: <>ビジネスサイト<span className="hl">活用</span></>, body: "公式サイト、ブランドサイト、EC、予約導線、カスタム Web アプリケーション。", chips: ["静的サイト", "動的サイト", "中規模サイト", "大規模サイト"] },
      { ...aiCards[2], titleHTML: <><span className="hl">国際</span>展開</>, body: "市場戦略、SEO、事業開発、販売代理まで、露出だけでなく成長と成約の導線を設計します。" },
      { ...aiCards[3], titleHTML: <><span className="hl">ビジュアル</span>デザイン</>, body: "UI、UX、ブランドビジュアル、ポスター、ビジネス資料、印刷物、マーケティング素材など。", chips: ["資料", "ポスター", "DM", "SNS", "イベント", "印刷", "CIS", "Logo"] },
      { ...aiCards[4], titleHTML: <>統合<span className="hl">情報</span>サービス</>, body: "システム運用、クラウド構成、プライベートモデル、データ分析、自動化、データ処理。" },
    ],
    processSteps: [
      ["01", "初回相談 30-45 分", "事業目標、予算範囲、期間制約、リスクを整理します。", "Week 0"],
      ["02", "計画提案", "利用シーン、データフロー、マイルストーン、見積、UAT 指標を整理します。", "Week 1"],
      ["03", "MVP / 優先順位", "価値を生む 20% から作り、仮説を素早く検証します。", "Week 2-4"],
      ["04", "開発と週次更新", "毎週利用可能な版と進捗を共有しながら反復します。", "Week 4-N"],
      ["05", "公開とトレーニング", "文書、権限、バックアップ、操作説明、データ移行を行います。", "Go-live"],
      ["06", "運用と改善", "障害対応、性能、セキュリティ、機能改善、レポート追加を継続します。", "継続"],
    ],
    faqGroups,
    hero: {
      kicker: "ビジョンを、揺るぎない基盤の上に",
      title: ["私たちが目指すのは", "魂のあるデザイン"],
      lede: [
        "ブランド戦略、体験設計、技術の統合。",
        "顧客体験と企業の業務を、一貫した設計でつなぎます。",
      ],
      scrolldown: "下へスクロール",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "サービス実績",
      status: "CLIENT ARCHIVE / 03 STREAMS",
    },
    marquee: ["能動型意思決定システム", "ソフトウェアシステムの設計と構築", "ソフト・ハード・IoT 統合", "ERP / WMS / CRM", "ビジネスサイト / EC / 決済 / 請求書", "カスタム APP", "戦情室ダッシュボード", "自動化実行支援システム"],
    achievements: { label: "魂のあるデザインを作り、システムをブランド成長と持続的な影響力の推進力にします。", meta: "2011 年から" },
    manifesto: { label: "私たちのアプローチ", prelude: "システムを仕事に合わせる", headlinePrefix: "仕事をシステムに", headlineHighlight: "合わせるのではなく", points: ["1. 実際の働き方に沿った操作", "2. 必要なときに、必要な情報が明確に届く", "3. 変化や拡張に対応できる余地を残す"], quote: "「仕事を理解してから、システムを設計する。」", paragraphs: [["利用者、業務プロセス、情報の流れから始め", "重要な操作と意思決定のポイントを整理し", "検証しながら段階的に実現できるシステム計画へ落とし込みます。"], ["システムをチームの日常に自然になじませ", "繰り返しの確認や不要な操作を減らし", "将来の変更や拡張にも余地を残します。"]], signoff: "- ツールを、仕事を支える本来の役割へ。" },
    solutionsUi: { index: "§ サービス", label: "サービス内容", button: "サービスについて相談" },
    aiLab: { label: "顧客中心", title: "主要サービス", lede: "2011 年から台湾の産業チェーン資源と深く連携し、国際展開を進めています。" },
    faqNoteLabel: "回答の要点",
    contact: { label: "準備ができたら", meta: "お問い合わせ", titleA: "未来を変える", titleHighlight: "チャンスをつかむ", lede: ["オンライン相談をご予約ください", "あなたのビジネス構想を形にするお手伝いをします。"], emailButton: "メールする" },
    footer: { company: "造物者科技", navLabel: "フッターナビゲーション", line: "LINE@ 公式アカウント", faqLabel: "ご依頼について" },
    construction: "サイト内容を更新中です。しばらくお待ちください。",
    font: { label: "文字サイズ", increase: "文字を大きく", reset: "標準サイズ", decrease: "文字を小さく" },
    preview: { show: "工事中画面をプレビュー", back: "完全ページへ戻る" },
  },
};

function getCopy(locale) {
  const copy = localizedCopy[locale] || localizedCopy.zh;
  return { ...copy, faqGroups: faqContentByLocale[locale] || faqContentByLocale.zh };
}

function LanguageSwitch({ locale, onSelect, switchRef, activeOptionRef, className = "" }) {
  return (
    <div
      ref={switchRef}
      className={`language-switch is-${locale} ${className}`.trim()}
      role="group"
      aria-label="Switch language"
    >
      <span className="language-track" aria-hidden="true" />
      <span className="language-thumb" aria-hidden="true" />
      {localeOptions.map(([value, label]) => (
        <button
          key={value}
          ref={value === locale ? activeOptionRef : undefined}
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

function MobileHomeLanguagePrompt({ locale, onSelect, destinationRef, onComplete }) {
  const [phase, setPhase] = useState("idle");
  const [flight, setFlight] = useState(null);
  const [flightLocale, setFlightLocale] = useState(locale);
  const sourceRef = useRef(null);
  const activeOptionRef = useRef(null);
  const completionTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const copy = languagePromptCopy[locale] || languagePromptCopy.zh;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const pageMain = document.getElementById("mainpage");
    const pageHeader = document.querySelector(".page-header");

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("language-prompt-open");
    pageMain?.setAttribute("inert", "");
    pageHeader?.setAttribute("inert", "");
    activeOptionRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.documentElement.classList.remove("language-prompt-open");
      pageMain?.removeAttribute("inert");
      pageHeader?.removeAttribute("inert");
      window.clearTimeout(completionTimerRef.current);
      window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const finishPrompt = (delay) => {
    completionTimerRef.current = window.setTimeout(onComplete, delay);
  };

  const selectLanguage = (nextLocale) => {
    if (phase !== "idle") {
      return;
    }

    onSelect(nextLocale);
    setFlightLocale(nextLocale);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sourceRect = sourceRef.current?.getBoundingClientRect();
    const destinationRect = destinationRef.current?.getBoundingClientRect();

    if (prefersReducedMotion || !sourceRect || !destinationRect) {
      setPhase("fading");
      finishPrompt(180);
      return;
    }

    setFlight({
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      x: destinationRect.left - sourceRect.left,
      y: destinationRect.top - sourceRect.top,
      scaleX: destinationRect.width / sourceRect.width,
      scaleY: destinationRect.height / sourceRect.height,
    });
    setPhase("preparing");

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setPhase("flying");
      });
    });
    finishPrompt(960);
  };

  const isTransitioning = phase !== "idle";

  return (
    <div
      className={`mobile-language-prompt phase-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-language-prompt-title"
    >
      <div className="mobile-language-prompt-backdrop" aria-hidden="true" />
      <div className="mobile-language-prompt-panel">
        <p className="mobile-language-prompt-eyebrow">{copy.eyebrow}</p>
        <h2 id="mobile-language-prompt-title">{copy.title}</h2>
        <LanguageSwitch
          locale={locale}
          onSelect={selectLanguage}
          switchRef={sourceRef}
          activeOptionRef={activeOptionRef}
          className="language-prompt-switch"
        />
      </div>

      {flight ? (
        <div
          className={`language-prompt-flight ${phase === "flying" ? "is-moving" : ""}`}
          style={{
            top: flight.top,
            left: flight.left,
            width: flight.width,
            height: flight.height,
            "--flight-x": `${flight.x}px`,
            "--flight-y": `${flight.y}px`,
            "--flight-scale-x": flight.scaleX,
            "--flight-scale-y": flight.scaleY,
          }}
          aria-hidden="true"
        >
          <LanguageSwitch locale={flightLocale} onSelect={() => {}} />
        </div>
      ) : null}

      {isTransitioning ? <span className="sr-only" aria-live="polite">Language selected</span> : null}
    </div>
  );
}

function Header({ locale, onToggleLocale, languageSwitchRef, promptActive }) {
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
        <LanguageSwitch
          locale={locale}
          onSelect={onToggleLocale}
          switchRef={languageSwitchRef}
          className={promptActive ? "is-prompt-destination-hidden" : ""}
        />
      </div>
    </header>
  );
}

function SectionEyebrow({ index, label, meta, className = "" }) {
  return (
    <div className={`section-eyebrow ${className}`.trim()}>
      <span className="index">{index}</span>
      <span className="rule" aria-hidden="true" />
      <span className="meta">{meta}</span>
      {label ? (
        <span className="section-eyebrow-label" style={{ gridColumn: "1 / -1", marginTop: 8, color: "inherit" }}>
          {label}
        </span>
      ) : null}
    </div>
  );
}

function PageTitle({ page }) {
  if (!page) {
    return null;
  }

  const lede = Array.isArray(page.lede) ? page.lede : [page.lede];

  return (
    <section className="page-title reveal" aria-labelledby="page-title">
      <HeroSoulRibbon />
      <div className="wrap">
        <div className="page-title-heading">
          <p className="page-title-kicker">{page.kicker}</p>
          <h1 id="page-title">{page.title}</h1>
        </div>
        <div className="page-title-lede">
          {lede.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

function HeroSoulRibbon() {
  const backgroundRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ribbon = createHeroSoulRibbon({ canvas: canvasRef.current, reducedMotion });
    let activated = false;
    let running = false;
    let pointerFrame = null;

    const syncPlayback = () => {
      const shouldRun = activated && document.visibilityState === "visible";
      if (shouldRun && !running) {
        ribbon.start();
        running = true;
      } else if (!shouldRun && running) {
        ribbon.stop();
        running = false;
      }
    };
    const activate = () => {
      activated = true;
      setReady(true);
      syncPlayback();
    };
    const fallbackTimer = window.setTimeout(activate, 5000);
    window.addEventListener("estiginto:page-entered", activate, { once: true });

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onPointerMove = (event) => {
      if (!finePointer || !backgroundRef.current) return;
      const rect = backgroundRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const energy = Math.max(0, 1 - Math.abs(x + y - 1) * 1.9);
      window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        ribbon.setEnergy(energy);
        backgroundRef.current?.style.setProperty("--soul-ribbon-x", `${((x - 0.5) * 8).toFixed(2)}px`);
        backgroundRef.current?.style.setProperty("--soul-ribbon-y", `${((y - 0.5) * 6).toFixed(2)}px`);
        backgroundRef.current?.style.setProperty("--soul-ribbon-energy", energy.toFixed(3));
      });
    };

    const onVisibilityChange = () => syncPlayback();

    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("estiginto:page-entered", activate);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(pointerFrame);
      ribbon.stop();
    };
  }, []);

  return (
    <div ref={backgroundRef} className="hero-soul-ribbon" aria-hidden="true" data-ready={ready}>
      <span className="hero-depth-grid" />
      <canvas ref={canvasRef} className="hero-soul-ribbon-canvas" />

    </div>
  );
}

function Hero({ copy }) {
  return (
    <section className="hero" id="home">
      <HeroSoulRibbon />
      <div className="wrap">
        <div>
          <div className="hero-meta">
            <b>ESTIGINTO</b>
            <span className="dot">/</span>
            <span>System Craft Studio</span>
            <span className="dot">·</span>
            <span>Est. 2011</span>
            <span className="dot">·</span>
            <span>Taipei, Taiwan</span>
          </div>

          <p className="hero-kicker">{copy.hero.kicker}</p>

          <h1 className="hero-title">
            <span className="row1">{copy.hero.title[0]}</span>
            <span className="row2 accent">{copy.hero.title[1]}</span>
          </h1>

          <p className="hero-lede">
            {copy.hero.lede[0]}
            <br />
            {copy.hero.lede[1]}
          </p>
        </div>
      </div>

      <a className="scrolldown" href="#home-directory">{copy.hero.scrolldown}</a>
    </section>
  );
}

function PageTransition() {
  const [phase, setPhase] = useState("entering");
  const [variant, setVariant] = useState(() => getInitialPageTransitionVariant(window.location.pathname));
  const leavingRef = useRef(false);
  const vortexCanvasRef = useRef(null);
  const transitionBrand = getPageTransitionBrand(variant);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isHomepage = window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
    const enterDuration = reducedMotion
      ? REDUCED_PAGE_TRANSITION_DURATION
      : isHomepage ? INITIAL_PAGE_ENTER_DURATION : PAGE_ENTER_DURATION;
    const leaveDuration = reducedMotion ? REDUCED_PAGE_TRANSITION_DURATION : PAGE_LEAVE_DURATION;
    const vortexTransition = variant === "vortex" && vortexCanvasRef.current
      ? createPageVortexTransition({ canvas: vortexCanvasRef.current, reducedMotion })
      : null;
    vortexTransition?.start();
    const enteredTimer = window.setTimeout(() => {
      setPhase("idle");
      window.dispatchEvent(new CustomEvent("estiginto:page-entered"));
      window.requestAnimationFrame(() => {
        const hashId = decodeURIComponent(window.location.hash.slice(1));
        const hashTarget = hashId ? document.getElementById(hashId) : null;
        hashTarget?.scrollIntoView({ block: "start" });
      });
    }, enterDuration);

    const onClick = (event) => {
      const anchor = event.target.closest?.("a[href]");
      const destination = getTransitionDestination({
        anchor,
        event,
        currentUrl: window.location.href,
      });
      if (!destination || leavingRef.current) return;

      event.preventDefault();
      leavingRef.current = true;
      setVariant(getPageTransitionVariant(new URL(destination).pathname));
      setPhase("leaving");
      window.setTimeout(() => {
        window.location.href = destination;
      }, leaveDuration);
    };

    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(enteredTimer);
      vortexTransition?.stop();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className={`page-transition transition-${variant} is-${phase}`} data-variant={variant} aria-hidden="true">
      <span className="page-transition-grille">
        {Array.from({ length: 7 }, (_, index) => <i key={`grille-${index}`} />)}
      </span>
      <span className="page-transition-matrix">
        {Array.from({ length: 12 }, (_, index) => <i key={`matrix-${index}`} />)}
      </span>
      <span className="page-transition-aperture"><i /></span>
      <span className="page-transition-axis"><i /><i /></span>
      <span className="page-transition-vortex">
        <canvas ref={vortexCanvasRef} className="page-transition-vortex-canvas" />
        <span className="page-transition-vortex-hud page-transition-vortex-hud-top">
          <i>ESTIGINTO</i><i>DESIGN & TECHNOLOGY</i><i>TAIPEI</i>
        </span>
        <span className="page-transition-vortex-interface">
          {transitionBrand ? (
            <span className="page-transition-vortex-brand">
              <img src={transitionBrand.src} alt={transitionBrand.alt} />
            </span>
          ) : null}
          <b data-text="ESTIGINTO">ESTIGINTO</b>
          <em>Innovation across borders</em>
        </span>
        <span className="page-transition-vortex-hud page-transition-vortex-hud-bottom">
          <i>ESTIGINTO</i><i>BRAND · EXPERIENCE · TECHNOLOGY</i>
        </span>
      </span>
      <span className="page-transition-panel-top" />
      <span className="page-transition-panel-bottom" />
      <span className="page-transition-scan" />
    </div>
  );
}

function HomeDirectory({ copy }) {
  const labels = menuLabels[copy.locale] || menuLabels.zh;
  const items = [
    { key: "about", label: labels.about, href: "/about.html" },
    { key: "solutions", label: labels.solutions, href: "/solutions.html" },
    ...getServiceMenuGroups(copy.locale).growth.items,
  ];
  const icons = {
    about: <><circle cx="16" cy="10" r="4" /><path d="M8 27v-4a8 8 0 0 1 16 0v4M6 8a3 3 0 0 0 0 6m20-6a3 3 0 0 1 0 6M3 25v-4a5 5 0 0 1 3-4m23 8v-4a5 5 0 0 0-3-4" /></>,
    solutions: <><path d="m16 3 12 7-12 7L4 10Zm-12 14 12 7 12-7M4 23l12 7 12-7" /></>,
    "systems-consulting": <><rect x="7" y="7" width="18" height="18" rx="2" /><path d="M12 12h8v8h-8ZM12 3v4m8-4v4m-8 18v4m8-4v4M3 12h4m-4 8h4m18-8h4m-4 8h4" /></>,
    "digital-integration": <><rect x="3" y="3" width="9" height="9" rx="1" /><rect x="20" y="20" width="9" height="9" rx="1" /><path d="M12 7h8a5 5 0 0 1 5 5v3m-3-3 3 3 3-3M20 25h-8a5 5 0 0 1-5-5v-3m-3 3 3-3 3 3" /></>,
    "visual-design": <><path d="m16 3 10 17-10 9L6 20ZM16 3v12M6 20h7m6 0h7" /><circle cx="16" cy="18" r="3" /></>,
    "international-marketing": <><circle cx="16" cy="16" r="12" /><ellipse cx="16" cy="16" rx="5" ry="12" /><path d="M4 16h24M7 8h18M7 24h18" /></>,
  };

  return (
    <section className="home-directory" id="home-directory">
      <nav className="home-directory-scroll" aria-label={labels.servicesMenu}>
        <ul className="home-directory-row">
          {items.map((item) => (
            <li key={item.key}>
              <a className="home-directory-link" href={item.href}>
                <svg className="home-directory-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                  {icons[item.key]}
                </svg>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
function ClientLogoMarquee({ copy }) {
  const lanes = buildClientLogoLanes(clientLogos);

  return (
    <section className="client-logo-marquee" id="clients">
      <header className="client-logo-marquee-header">
        <span className="client-logo-marquee-index" aria-hidden="true">§ 03</span>
        <h2>{copy.clientLogos.title}</h2>
        <span className="client-logo-marquee-header-rule" aria-hidden="true" />
      </header>
      <div className="client-logo-marquee-field" aria-hidden="true">
        {lanes.map((lane, laneIndex) => {
          return (
            <div className="client-logo-marquee-lane" key={`client-lane-${laneIndex + 1}`}>
              <div className="client-logo-marquee-track">
                {[0, 1].map((loopIndex) => (
                  <div className="client-logo-marquee-group" aria-hidden={loopIndex === 1 ? "true" : undefined} key={`client-loop-${loopIndex}`}>
                    {lane.map((client, itemIndex) => (
                      <div
                        className="client-logo-marquee-item"
                        data-client-id={client.id}
                        data-reserved={client.src ? undefined : "true"}
                        key={`${client.id}-${loopIndex}`}
                        style={client.visualScale ? { "--client-logo-scale": client.visualScale } : undefined}
                      >
                        {client.src ? <img src={client.src} alt="" loading="lazy" /> : (
                          <span aria-hidden="true">{String(itemIndex * 4 + laneIndex + 1).padStart(2, "0")}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Marquee({ copy }) {
  const items = copy.marquee;
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

function Numbers({ copy }) {
  const items = companyStatsByLocale[copy.locale] || companyStatsByLocale.zh;

  return (
    <section className="section reveal" aria-label="Studio achievements">
      <div className="wrap">
        <SectionEyebrow
          className="achievements-eyebrow"
          index="§ Achievements"
        />
        <div className="numbers">
          {items.map((n) => (
            <div className="number-cell" key={n.id}>
              <div className="key">
                <span>{n.keyLabel}</span>
                <span className="idx">{n.label}</span>
              </div>
              <div className="val">
                <span>{n.value}</span>
                <span className="unit">{n.suffix}</span>
              </div>
              <div className="desc">{n.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Manifesto({ copy }) {
  const manifesto = copy.manifesto;
  return (
    <section className="section bg-deep reveal" id="about" aria-label="Studio manifesto">
      <div className="wrap">
        <SectionEyebrow index="§ Industry-first" label={manifesto.label} meta="manifesto · 2026" />
        <div className="manifesto">
          <h2 className="manifesto-quote">
            <span className="mq-line mq-prelude">
              {manifesto.prelude}
            </span>
            <span className="mq-line mq-headline">
              {manifesto.headlinePrefix}<span className="hl underline">{manifesto.headlineHighlight}</span>。
            </span>
            <span className="mq-line mq-coda">
              {manifesto.points.map((point, index) => (
                <span key={point}>
                  {point}
                  {index < manifesto.points.length - 1 ? <br /> : null}
                </span>
              ))}
            </span>
          </h2>
          <div className="manifesto-aside">
            <p>
              {manifesto.quote}
            </p>
            {manifesto.paragraphs.map((paragraph) => (
              <p key={paragraph.join("|")}>
                {paragraph.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < paragraph.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ))}
            <span className="signoff">{manifesto.signoff}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection({ copy }) {
  const members = teamMembersByLocale[copy.locale] || teamMembersByLocale.en;
  const sectionCopy = teamSectionCopyByLocale[copy.locale] || teamSectionCopyByLocale.en;

  return (
    <section className="section team-section reveal" id="team" aria-label={sectionCopy.eyebrow}>
      <div className="wrap">
        <SectionEyebrow index={`§ ${sectionCopy.eyebrow}`} meta={sectionCopy.meta} />
        <div className="team-grid">
          {members.map((member) => (
            <article className="team-member-card" data-group={member.group} key={member.id}>
              <div className={`team-member-identity${member.portrait ? " team-member-identity-portrait" : ""}`}>
                {member.portrait ? (
                  <img
                    className="team-member-portrait"
                    src={member.portrait}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      "--portrait-scale": member.portraitFrame?.scale || 1,
                      "--portrait-x": `${member.portraitFrame?.x ?? 50}%`,
                      "--portrait-y": `${member.portraitFrame?.y ?? 20}%`,
                      "--portrait-offset-y": `${member.portraitFrame?.offsetY ?? 0}%`,
                    }}
                  />
                ) : (
                  <span aria-hidden="true">{member.mark}</span>
                )}
              </div>
              <div className="team-member-copy">
                <span className="team-member-group">{sectionCopy.groupLabels[member.group]}</span>
                <h3>{member.name}</h3>
                <p className="team-member-role">{member.role}</p>
                <p className="team-member-summary">{member.summary}</p>
                {member.linkedin ? (
                  <a
                    className="team-member-linkedin"
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <LinkedInIcon />
                    <span>LinkedIn</span>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LinkedInIcon() {
  return (
    <svg
      className="team-member-linkedin-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7v.01M12 17v-7m0 3a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

function ServiceOverview({ copy }) {
  const items = serviceFamiliesByLocale[copy.locale] || serviceFamiliesByLocale.zh;

  return (
    <section className="section service-overview reveal" id="services" aria-label={copy.solutionsUi.label}>
      <div className="wrap">
        <SectionEyebrow index={copy.solutionsUi.index} label={copy.solutionsUi.label} meta={`${items.length} directions`} />
        <div className="service-overview-grid">
          {items.map((service) => (
            <a className="service-overview-card" href="/solutions.html" key={service.id}>
              <span className="service-overview-number">{service.number}</span>
              <span className="service-overview-eyebrow">{service.eyebrow}</span>
              <h2>{service.title}</h2>
              <span className="service-overview-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solutions({ copy }) {
  const [active, setActive] = useState(0);
  const items = serviceFamiliesByLocale[copy.locale] || serviceFamiliesByLocale.zh;
  const item = items[active] || items[0];

  return (
    <section className="section reveal orbital-background-section" id="solutions" aria-label="Solutions">
      <OrbitalMark />
      <div className="wrap">
        <SectionEyebrow index={copy.solutionsUi.index} label={copy.solutionsUi.label}  />
        <div className="solutions">
          <ul className="sol-list">
            {items.map((s, i) => (
              <li
                key={s.id}
                className={`sol-row ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
              >
                <button className="sol-choice" type="button" aria-pressed={i === active} aria-controls="solution-preview" onClick={() => setActive(i)}>
                <span className="num">{s.number}</span>
                <span className="body">
                  <span className="tag">
                    <span>{s.eyebrow}</span>
                  </span>
                  <span className="sol-title">{s.title}</span>
                </span>

                </button>
              </li>
            ))}
          </ul>

          <aside className="sol-preview" id="solution-preview" aria-live="polite" aria-atomic="true">
            <div
              className="figure"
              style={{ backgroundImage: `url(${item.image})` }}
              role="img"
              aria-label={item.eyebrow}
            >
              <span className="frame" aria-hidden="true" />

            </div>
            <div className="info">
              <p>{item.summary}</p>
              <ul>
                {item.capabilities.map((p, pointIndex) => (
                  <li key={`${item.id}-${pointIndex}`}>{p}</li>
                ))}
              </ul>
              <a className="btn" href="/contact.html" style={{ marginTop: 8 }}>
                <span>{copy.solutionsUi.button}</span>
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

function ConsultingServices({ copy }) {
  const content = consultingServicesByLocale[copy.locale] || consultingServicesByLocale.zh;

  return (
    <section className="section consulting-services reveal" aria-label={content.sectionLabel}>
      <div className="wrap">
        <SectionEyebrow index="§ Consulting" label={content.sectionLabel} meta={content.sectionMeta} />
        <p className="consulting-intro">{content.intro}</p>
        <nav className="consulting-nav" aria-label={content.sectionLabel}>
          {content.services.map((service, index) => (
            <a href={`#${service.id}`} key={service.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {service.shortLabel}
            </a>
          ))}
        </nav>
        <div className="consulting-service-list">
          {content.services.map((service, index) => (
            <article className="consulting-service" id={service.id} key={service.id}>
              <header>
                <span className="consulting-service-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{service.title}</h2>
                  <p>{service.summary}</p>
                </div>
              </header>
              <div className="consulting-service-grid">
                <section>
                  <h3>{content.labels.situations}</h3>
                  <ul>{service.situations.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section>
                  <h3>{content.labels.scope}</h3>
                  <ul>{service.scope.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="consulting-deliverables">
                  <h3>{content.labels.deliverables}</h3>
                  <ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              </div>
              <div className="consulting-execution">
                <div><strong>{content.labels.execution}</strong><p>{service.execution}</p></div>
                <a className="btn" href="/contact.html"><span>{content.labels.consult}</span><span className="arrow" aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
        <section className="consulting-process" aria-labelledby="consulting-process-title">
          <h2 id="consulting-process-title">{content.processTitle}</h2>
          <ol>{content.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}</ol>
        </section>
      </div>
    </section>
  );
}


function AILab({ copy }) {
  return (
    <section className="section bg-night reveal" id="ai-lab" aria-label="AI Lab">
      <div className="wrap">
        <SectionEyebrow index="§ Service" label={copy.aiLab.label} meta="12 agents · in production" />
        <div className="ai-headline">
          <h2>
            {copy.aiLab.title}
          </h2>
          <p className="lede">
            {copy.aiLab.lede}
          </p>
        </div>

        <div className="ai-grid">
          {copy.aiCards.map((c) => (
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

function CasePortfolio({ copy }) {
  const cases = caseStudiesByLocale[copy.locale] || caseStudiesByLocale.zh;
  const groups = caseStudyGroupsByLocale[copy.locale] || caseStudyGroupsByLocale.zh;
  const casesById = new Map(cases.map((caseStudy) => [caseStudy.id, caseStudy]));
  const [activeCaseId, setActiveCaseId] = useState(null);
  const labels = {
    zh: { section: "精選實績", meta: "服務內容", intro: "以下依應用領域整理專案，點選案例可查看建置功能。", expand: "查看專案內容", collapse: "收合內容", details: "建置內容" },
    en: { section: "Selected Work", meta: "Services", intro: "Browse projects by application area and select a case to see the features delivered.", expand: "View project details", collapse: "Close details", details: "What we built" },
    ja: { section: "実績紹介", meta: "サービス内容", intro: "用途別に実績をご紹介します。各事例を選択すると、構築した機能をご覧いただけます。", expand: "構築内容を見る", collapse: "詳細を閉じる", details: "構築内容" },
  }[copy.locale] || { section: "精選實績", meta: "服務內容", intro: "以下依應用領域整理專案，點選案例可查看建置功能。", expand: "查看專案內容", collapse: "收合內容", details: "建置內容" };

  return (
    <section className="section reveal" id="case" aria-label={labels.section}>
      <div className="wrap">
        <SectionEyebrow index="§ Selected Work" label={labels.section} meta={labels.meta} />
        <p className="case-portfolio-intro">{labels.intro}</p>
        <div className="case-portfolio">
          {groups.map((group) => (
            <section className="case-portfolio-group" key={group.id} aria-labelledby={`case-group-${group.id}`}>
              <header className="case-portfolio-group-header">
                <span className="case-portfolio-group-number">{group.number}</span>
                <div>
                  <h2 id={`case-group-${group.id}`}>{group.title}</h2>
                  <p>{group.summary}</p>
                </div>
              </header>
              <ul className="case-portfolio-keywords" aria-label={`${group.title} keywords`}>
                {group.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
              </ul>
              <div className="case-portfolio-group-list">
                {group.caseIds.map((caseId) => {
                  const caseStudy = casesById.get(caseId);
                  if (!caseStudy) return null;

                  const isActive = activeCaseId === caseStudy.id;
                  const triggerId = `case-trigger-${caseStudy.id}`;
                  const detailId = `case-detail-${caseStudy.id}`;

                  return (
                    <article className={`case-portfolio-item ${isActive ? "is-active" : ""}`} key={caseStudy.id}>
                      <button
                        className="case-portfolio-trigger"
                        id={triggerId}
                        type="button"
                        aria-expanded={isActive}
                        aria-controls={detailId}
                        onClick={() => setActiveCaseId(isActive ? null : caseStudy.id)}
                      >
                        <span className="case-portfolio-number">{caseStudy.number}</span>
                        <span className="case-portfolio-heading">
                          <span className="case-portfolio-outcome">{caseStudy.outcome}</span>
                          <span className="case-portfolio-title">{caseStudy.title}</span>
                        </span>
                        <span className="case-portfolio-action">{isActive ? labels.collapse : labels.expand}</span>
                        <span className="case-portfolio-icon" aria-hidden="true" />
                      </button>
                      <p className="case-portfolio-summary">{caseStudy.summary}</p>
                      {isActive ? (
                        <div
                          className="case-portfolio-detail"
                          id={detailId}
                          role="region"
                          aria-labelledby={triggerId}
                        >
                          <span className="case-portfolio-detail-label">{labels.details}</span>
                          <ul className="case-capability-list">
                            {caseStudy.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                          </ul>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ copy }) {
  return (
    <section className="section bg-deep reveal" id="process" aria-label="Engagement process">
      <div className="wrap">
        <SectionEyebrow index="§ 05 / Process" label="從第一封信到上線維運。" meta="6 phases · transparent" />
        <div className="process-grid">
          {copy.processSteps.map(([num, title, body, week]) => (
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

function Insights() {
  const [activePost, setActivePost] = useState(null);
  const posts = [
    {
      idx: "01",
      tag: "AI Strategy",
      title: "AI 不是工具，而是營運流程的重構",
      body: "多數企業導入 AI 失敗，不是模型問題，而是流程沒有重設。我們看到的成功案例，都是先重做流程，再導入 AI。",
      image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
      meta: "Insight · 2026",
      content: [
        "企業真正需要的不是把 AI 放進每一個部門，而是先定義哪些流程值得被重新設計。從接案、客服、報價、庫存到決策報表，每一個節點都需要清楚的資料來源與責任邊界。",
        "ESTIGINTO 會先協助團隊拆解既有流程，找出重複、延遲與容易出錯的環節，再決定該由 AI、自動化或系統規則介入。這樣導入後的工具才會變成營運能力，而不是另一個需要維護的負擔。",
      ],
    },
    {
      idx: "02",
      tag: "System Design",
      title: "為什麼多數系統上線後就開始失敗",
      body: "問題從來不是技術，而是規劃。當系統用來「限制人」而不是「輔助決策」，它就會開始被繞過。",
      image: "/img/plan/laptop-coworking-space_53876-14515.webp",
      meta: "Journal · 2026",
      content: [
        "系統失敗通常不是因為功能不夠，而是它沒有對齊真實工作現場。當使用者需要用截圖、Excel 或通訊軟體補流程，就代表系統設計沒有承接決策脈絡。",
        "好的系統應該讓資訊更透明、責任更清楚、例外更容易被處理。我們在規劃階段會先整理角色、權限、狀態與資料流，讓上線後的系統能被長期使用與持續擴充。",
      ],
    },
    {
      idx: "03",
      tag: "Growth",
      title: "國際市場，不只是翻譯，而是重做銷售路徑",
      body: "從 SEO 到 Channel Partner，真正的關鍵是：你是否理解當地市場如何做決策，而不是只做曝光。",
      image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.webp",
      meta: "Field Note · 2026",
      content: [
        "進入海外市場時，語言只是第一層。更重要的是客戶如何搜尋、如何比較供應商、如何建立信任，以及付款、物流、客服與售後流程是否符合當地期待。",
        "我們會把品牌內容、網站架構、轉換路徑與合作夥伴流程一起規劃，讓國際化不只是多語頁面，而是一套能支撐成交與服務交付的完整系統。",
      ],
    },
  ];
  const selectedPost = activePost === null ? null : posts[activePost];

  useEffect(() => {
    if (!selectedPost) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActivePost(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPost]);

  return (
    <section className="section reveal" id="insights" aria-label="Insights">
      <div className="wrap">
        <SectionEyebrow
          index="§ News"
          label="最新消息"
          meta="latest"
        />

        <div className="insights-grid">
          {posts.map((p, index) => (
            <article
              className="insight-card"
              key={p.idx}
              role="button"
              tabIndex={0}
              onClick={() => setActivePost(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActivePost(index);
                }
              }}
            >
              <div
                className="figure"
                style={{ backgroundImage: `url(${p.image})` }}
              >
                <span className="label">{p.meta}</span>
              </div>

              <div className="body">
                <div className="head">
                  <span>{p.tag}</span>
                  <span className="idx">{p.idx}</span>
                </div>

                <h3>{p.title}</h3>
                <p>{p.body}</p>

                <span className="link" aria-hidden="true">
                  <span>Read more</span>
                  <span className="arrow" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {selectedPost ? (
          <div className="news-modal" role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
            <button className="news-modal-scrim" type="button" aria-label="關閉最新消息" onClick={() => setActivePost(null)} />
            <article className="news-modal-panel">
              <button className="news-modal-close" type="button" aria-label="關閉最新消息" onClick={() => setActivePost(null)}>
                <span aria-hidden="true" />
              </button>
              <div className="news-modal-figure" style={{ backgroundImage: `url(${selectedPost.image})` }}>
                <span>{selectedPost.meta}</span>
              </div>
              <div className="news-modal-body">
                <div className="news-modal-meta">
                  <span>{selectedPost.tag}</span>
                  <span>{selectedPost.idx}</span>
                </div>
                <h3 id="news-modal-title">{selectedPost.title}</h3>
                <p className="news-modal-lede">{selectedPost.body}</p>
                <div className="news-modal-copy">
                  {selectedPost.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FAQ({ copy }) {
  const [openGroup, setOpenGroup] = useState(0);
  const [open, setOpen] = useState("0-0");

  return (
    <section className="section bg-deep reveal" id="faq" aria-label="FAQ">
      <div className="wrap">
        <div className="faq-groups">
          {copy.faqGroups.map((group, groupIndex) => (
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
                aria-controls={`faq-body-${groupIndex}`}
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
              <div className="faq-group-body" id={`faq-body-${groupIndex}`} inert={openGroup !== groupIndex} aria-hidden={openGroup !== groupIndex}>
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
                            aria-controls={`faq-answer-${itemId}`}
                          >
                            <span className="num">{num}</span>
                            <span>{q}</span>
                            <span className="toggle" aria-hidden="true" />
                          </button>
                          <div className="faq-a" id={`faq-answer-${itemId}`} aria-hidden={!isOpen}>
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
                      <span>{copy.faqNoteLabel}</span>
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

function ContactIcon({ type }) {
  let geometry;

  switch (type) {
    case "email":
      geometry = (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      );
      break;
    case "phone":
      geometry = <path d="M7.2 3.5 10 7.8 7.9 10a14.2 14.2 0 0 0 6.1 6.1l2.2-2.1 4.3 2.8-.8 3a2.4 2.4 0 0 1-2.4 1.7C9.1 20.7 3.3 14.9 2.5 6.7a2.4 2.4 0 0 1 1.7-2.4l3-.8Z" />;
      break;
    case "mobile":
      geometry = (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
          <path d="M10 5h4M11 18.5h2" />
        </>
      );
      break;
    case "line":
      geometry = (
        <>
          <path d="M20.5 11.4c0 4.2-4 7.6-8.9 7.6-.8 0-1.6-.1-2.3-.3L4 21l1.5-4.1A7 7 0 0 1 2.7 11c0-4.2 4-7.6 8.9-7.6s8.9 3.4 8.9 8Z" />
          <path d="M7.5 11.2h.1m3.9 0h.1m3.9 0h.1" />
        </>
      );
      break;
    default:
      return null;
  }

  return (
    <svg
      className="contact-channel-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {geometry}
    </svg>
  );
}

function Footer({ copy }) {
  const footer = copy.footer;
  return (
    <footer className="page-footer" id="contact">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-wordmark">ESTIGINTO</p>
            <p className="footer-company">{footer.company}</p>
            <div className="footer-offices">
              <address>
                <span className="footer-office-label">Taipei Office</span>
                <span>台北市中山區南京東路一段15號3樓</span>
              </address>
              <address>
                <span className="footer-office-label">Taoyuan Office</span>
                <span>桃園市中壢區中央東路52號</span>
              </address>
            </div>
          </div>
          <nav className="footer-links" aria-label={footer.navLabel}>
            <h5>Explore</h5>
            <a href="/about.html">{menuLabels[copy.locale]?.about || menuLabels.zh.about}</a>
            <a href="/solutions.html">{menuLabels[copy.locale]?.solutions || menuLabels.zh.solutions}</a>
            <a href="/contact.html">{menuLabels[copy.locale]?.contact || menuLabels.zh.contact}</a>
          </nav>
          <div className="footer-links">
            <h5>Contact</h5>
            <a className="contact-channel-link" href="mailto:contact@estiginto.com"><ContactIcon type="email" /><span>contact@estiginto.com</span></a>
            <a className="contact-channel-link" href="tel:+886224315362"><ContactIcon type="phone" /><span>+886 2 2431 5362</span></a>
            <a className="contact-channel-link" href="tel:+886972118427"><ContactIcon type="mobile" /><span>+886 972 118 427</span></a>
            <a className="contact-channel-link" href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer"><ContactIcon type="line" /><span>{footer.line}</span></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2011 – 2026 ESTIGINTO Co., Ltd.</span>
        </div>
      </div>
    </footer>
  );
}

function ConstructionScreen({ copy }) {
  return (
    <main className="construction-screen" aria-labelledby="construction-title">
      <div className="construction-shell">
        <p className="construction-kicker">ESTIGINTO</p>
        <h1 id="construction-title">{copy.construction}</h1>
        <div className="construction-meta">
          <span>+886 2 2431 5362</span>
          <span>contact@estiginto.com</span>
        </div>
      </div>
    </main>
  );
}

function FontSizeControls({ onIncrease, onDecrease, onReset, canIncrease, canDecrease, isDefault, labels, tabIndex }) {
  return (
    <div className="menu-font-controls" aria-label={labels.label}>
      <button
        className="menu-font-button"
        type="button"
        aria-label={labels.increase}
        title={labels.increase}
        onClick={onIncrease}
        disabled={!canIncrease}
        tabIndex={tabIndex}
      >
        <span aria-hidden="true">A+</span>
      </button>
      <button
        className="menu-font-button"
        type="button"
        aria-label={labels.reset}
        title={labels.reset}
        onClick={onReset}
        disabled={isDefault}
        tabIndex={tabIndex}
      >
        <span aria-hidden="true">A</span>
      </button>
      <button
        className="menu-font-button"
        type="button"
        aria-label={labels.decrease}
        title={labels.decrease}
        onClick={onDecrease}
        disabled={!canDecrease}
        tabIndex={tabIndex}
      >
        <span aria-hidden="true">A-</span>
      </button>
    </div>
  );
}

function MobileNav({ locale, fontControls }) {
  const localizedMenuLabels = menuLabels[locale] || menuLabels.zh;
  const primaryLabels = desktopPrimaryMenuCopy[locale] || desktopPrimaryMenuCopy.zh;
  const serviceMenuGroups = getServiceMenuGroups(locale);
  const homeItem = { key: "home", label: localizedMenuLabels.home, href: "/", position: "center" };
  const primaryMenuItems = [
    homeItem,
    { key: "about", label: localizedMenuLabels.about, href: "/about.html" },
    { key: "solutions", label: localizedMenuLabels.solutions, href: "/solutions.html" },
    { key: "contact", label: localizedMenuLabels.contact, href: "/contact.html" },
  ];
  const mobileMenuGroups = {
    digital: { label: primaryLabels.siteMenu, items: primaryMenuItems },
    growth: serviceMenuGroups.growth,
  };
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [compact, setCompact] = useState(false);
  const [selectingKey, setSelectingKey] = useState(null);
  const [activeGroup, setActiveGroup] = useState("digital");
  const previousScrollYRef = useRef(0);
  const directionTravelRef = useRef(0);
  const motionTimerRef = useRef(null);
  const triggerRef = useRef(null);
  const activeGroupCopy = mobileMenuGroups[activeGroup];
  const items = activeGroup === "digital" ? primaryMenuItems : [homeItem, ...activeGroupCopy.items];
  const interactive = open && !opening && !closing;

  useEffect(() => () => window.clearTimeout(motionTimerRef.current), []);

  useEffect(() => {
    previousScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const scrollY = window.scrollY;
      setCompact((wasCompact) => {
        const nextState = advanceMobileNavScrollState({
          scrollY,
          previousScrollY: previousScrollYRef.current,
          isOpen: open,
          wasCompact,
          directionTravel: directionTravelRef.current,
        });
        directionTravelRef.current = nextState.directionTravel;
        return nextState.compact;
      });
      previousScrollYRef.current = scrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!interactive) {
      return undefined;
    }

    triggerRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [interactive]);

  const closeMenu = () => {
    if (!open || closing) return;

    window.clearTimeout(motionTimerRef.current);
    triggerRef.current?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpening(false);
      setClosing(false);
      setOpen(false);
      return;
    }

    setOpening(false);
    setClosing(true);
    motionTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 480);
  };

  const openMenu = () => {
    window.clearTimeout(motionTimerRef.current);
    setCompact(false);
    setSelectingKey(null);
    setActiveGroup("digital");
    directionTravelRef.current = 0;
    setClosing(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpening(false);
      setOpen(true);
      return;
    }

    setOpening(true);
    setOpen(true);
    motionTimerRef.current = window.setTimeout(() => {
      setOpening(false);
    }, 480);
  };

  return (
    <div className={`mobile-nav ${open ? "open" : ""} ${opening ? "mobile-channel-opening" : ""} ${closing ? "mobile-channel-closing" : ""} ${compact ? "compact" : ""}`.trim()}>
      <button className="mobile-nav-scrim" type="button" aria-label="Close mobile menu" tabIndex={-1} onClick={closeMenu} />
      <button
        ref={triggerRef}
        className="mobile-nav-trigger"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open && !closing}
        onClick={open ? closeMenu : openMenu}
      >
        <span className="mobile-nav-trigger-shape" aria-hidden="true" />
        <span className="mobile-nav-trigger-icon" aria-hidden="true"><span /><span /><span /></span>
      </button>

      <div className="mobile-nav-dialog" aria-hidden={!interactive}>
        <nav className="mobile-nav-diamond mobile-channel-panel" aria-label={localizedMenuLabels.servicesMenu}>
          <header className="mobile-channel-header">
            <div>
              <p>ESTIGINTO</p>
              <span>{localizedMenuLabels.servicesMenu}</span>
            </div>

          </header>

          <div className="mobile-nav-diamond-core mobile-channel-routes" key={activeGroup}>
            {items.map((item, index) => (
              <a
                key={item.key}
                className={`mobile-nav-link mobile-channel-link ${item.position || ""} ${selectingKey === item.key ? "is-selecting" : ""}`.trim()}
                href={item.href}
                aria-label={item.position === "center" ? item.label : undefined}
                tabIndex={interactive ? 0 : -1}
                style={{ "--menu-item-index": index }}
                onClick={() => setSelectingKey(item.key)}
              >
                <span className="mobile-channel-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span className="mobile-channel-name">
                  <span>{item.label}</span>
                </span>
                <span className="mobile-channel-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>

          <div className="mobile-nav-category-switch" role="group" aria-label="Navigation category">
            {Object.entries(mobileMenuGroups).map(([groupKey, group]) => (
              <button
                key={groupKey}
                className={`mobile-nav-category-button ${groupKey}`}
                type="button"
                aria-pressed={activeGroup === groupKey}
                tabIndex={interactive ? 0 : -1}
                onClick={() => {
                  setActiveGroup(groupKey);
                  setSelectingKey(null);
                }}
              >
                <span>{group.label}</span>
              </button>
            ))}
          </div>

          <footer className="mobile-channel-footer">
            <span>{fontControls.labels.label}</span>
            <FontSizeControls {...fontControls} tabIndex={interactive ? 0 : -1} />
            <span>EST / 2026</span>
          </footer>
        </nav>
      </div>
    </div>
  );
}

function DesktopCursorMenu({ locale, fontControls }) {
  const localizedMenuLabels = menuLabels[locale] || menuLabels.zh;
  const primaryLabels = desktopPrimaryMenuCopy[locale] || desktopPrimaryMenuCopy.zh;
  const primaryMenuItems = [
    { key: "home", label: localizedMenuLabels.home, href: "/" },
    { key: "about", label: localizedMenuLabels.about, href: "/about.html" },
    { key: "solutions", label: localizedMenuLabels.solutions, href: "/solutions.html" },
    { key: "contact", label: localizedMenuLabels.contact, href: "/contact.html" },
  ];
  const desktopMenuGroups = {
    primary: { label: primaryLabels.siteMenu, items: primaryMenuItems },
    growth: getServiceMenuGroups(locale).growth,
  };
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveringTrigger, setHoveringTrigger] = useState(false);
  const [position, setPosition] = useState({ x: 160, y: 160 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const pendingPositionRef = useRef(position);
  const triggerPositionRef = useRef(position);
  const lastPointerRef = useRef(null);
  const southeastTravelRef = useRef(0);
  const retreatTravelRef = useRef(0);
  const approachLockedRef = useRef(false);
  const frameRef = useRef(null);
  const hideTimerRef = useRef(null);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    const clearTimers = () => {
      window.clearTimeout(hideTimerRef.current);
      cancelCursorMenuFrame(window.cancelAnimationFrame.bind(window), frameRef);
    };

    const scheduleHide = () => {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        if (!hoveringTrigger && !open) {
          setVisible(false);
        }
      }, 6000);
    };

    const onMove = (event) => {
      const pointer = { x: event.clientX, y: event.clientY };
      const next = { x: pointer.x + 48, y: pointer.y + 48 };
      pendingPositionRef.current = next;
      const motion = resolveCursorMenuApproach({
        pointer,
        previousPointer: lastPointerRef.current,
        triggerCenter: triggerPositionRef.current,
        southeastTravel: southeastTravelRef.current,
        retreatTravel: retreatTravelRef.current,
        locked: approachLockedRef.current,
      });
      lastPointerRef.current = pointer;
      southeastTravelRef.current = motion.southeastTravel;
      retreatTravelRef.current = motion.retreatTravel;
      approachLockedRef.current = motion.locked;

      if (open || hoveringTrigger) {
        return;
      }

      setVisible(true);
      scheduleHide();
      if (!motion.shouldFollow) {
        return;
      }

      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;
          const nextPosition = pendingPositionRef.current;
          triggerPositionRef.current = nextPosition;
          setPosition(nextPosition);
        });
      }
    };

    const onLeave = () => {
      clearTimers();
      if (open) {
        return;
      }
      lastPointerRef.current = null;
      southeastTravelRef.current = 0;
      retreatTravelRef.current = 0;
      approachLockedRef.current = false;
      setVisible(false);
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
    setVisible(true);

    return undefined;
  }, [hoveringTrigger, open]);

  useEffect(() => {
    if (!open || closing || opening) {
      return undefined;
    }

    const menu = menuRef.current;
    const getFocusableControls = () => Array.from(menu?.querySelectorAll('a[href], button:not(:disabled)') || [])
      .filter((element) => element.tabIndex >= 0);
    getFocusableControls()[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = getFocusableControls();
      const firstControl = focusable[0];
      const lastControl = focusable[focusable.length - 1];
      if (!firstControl || !lastControl) {
        return;
      }

      if (!menu?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastControl : firstControl).focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl.focus();
      }
    };

    const onContextMenu = (event) => {
      event.preventDefault();
      closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, [closing, open, opening]);

  const closeMenu = () => {
    if (!open || closing) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    window.clearTimeout(openTimerRef.current);
    triggerRef.current?.focus();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpening(false);
      setOpen(false);
      setHoveringTrigger(false);
      return;
    }

    setOpening(false);
    approachLockedRef.current = false;
    southeastTravelRef.current = 0;
    retreatTravelRef.current = 0;
    triggerPositionRef.current = pendingPositionRef.current;
    setPosition(pendingPositionRef.current);
    setVisible(true);
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setHoveringTrigger(false);
    }, 620);
  };

  const openMenu = () => {
    window.clearTimeout(openTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
    setClosing(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpening(false);
      setOpen(true);
      return;
    }

    setOpening(true);
    setOpen(true);
    openTimerRef.current = window.setTimeout(() => {
      setOpening(false);
    }, 620);
  };

  const handleTriggerLeave = () => {
    setHoveringTrigger(false);
    if (open) {
      return;
    }
    window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
    }, 6000);
  };

  return (
    <div
      className={`desktop-cursor-menu ${open ? "open" : ""} ${opening ? "stream-opening" : ""} ${closing ? "stream-closing" : ""} ${hoveringTrigger ? "hovering" : ""}`}
      style={{ "--cursor-x": `${position.x}px`, "--cursor-y": `${position.y}px` }}
    >
      <button className="desktop-menu-scrim" type="button" aria-label="Close desktop menu" tabIndex={-1} onClick={closeMenu} />

      <button
        ref={triggerRef}
        className={`desktop-menu-trigger ${visible ? "visible" : ""}`}
        type="button"
        aria-label="Open desktop menu"
        aria-controls="desktop-service-navigation"
        aria-expanded={open && !closing}
        onClick={openMenu}
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

      <span className="desktop-menu-morph" aria-hidden="true">
        <span className="desktop-menu-morph-shape" />
        <span className="desktop-menu-morph-ring" />
        <span className="desktop-menu-morph-icon"><i /><i /><i /></span>
      </span>

      <div className="desktop-ambient-field" aria-hidden="true">
        <span className="desktop-ambient-layer cool" />
        <span className="desktop-ambient-layer warm" />
        <span className="desktop-ambient-layer depth" />
        <span className="desktop-spatial-depth">
          <i className="desktop-spatial-horizon" />
          <i className="desktop-spatial-plane far" />
          <i className="desktop-spatial-plane near" />
          <i className="desktop-spatial-orbit" />
        </span>
      </div>

      <nav
        ref={menuRef}
        id="desktop-service-navigation"
        className="desktop-service-menu"
        aria-label={localizedMenuLabels.servicesMenu}
        aria-hidden={!open || closing || opening}
      >
        <header className="desktop-channel-header">
          <div>
            <p className="desktop-service-eyebrow">ESTIGINTO</p>
            <p className="desktop-channel-status"><i aria-hidden="true" /> {localizedMenuLabels.servicesMenu}</p>
          </div>
          <button
            className="desktop-channel-close"
            type="button"
            tabIndex={open && !closing && !opening ? 0 : -1}
            onClick={closeMenu}
          >
            Close <span aria-hidden="true">↗</span>
          </button>
        </header>

        <div className="desktop-channel-deck">
          <div className="desktop-channel-axis">
            <span className="desktop-channel-axis-label" aria-hidden="true">EST. 2011</span>
            <button
              className="desktop-channel-core"
              type="button"
              aria-label="Close desktop menu"
              tabIndex={open && !closing && !opening ? 0 : -1}
              onClick={closeMenu}
            >
              <i aria-hidden="true" />
            </button>
            <span className="desktop-channel-axis-label" aria-hidden="true">ESTIGINTO</span>
          </div>

          <div className="desktop-service-columns">
          {Object.entries(desktopMenuGroups).map(([groupKey, group]) => {
            const headingId = `desktop-service-${groupKey}`;
            return (
              <section
                className={`desktop-service-group ${groupKey}`}
                data-channel={groupKey}
                aria-labelledby={headingId}
                key={groupKey}
              >
                <h2 className="desktop-service-title" id={headingId}>
                  <span className="desktop-service-marker" aria-hidden="true"><i /></span>
                  <span>{group.label}</span>

                </h2>
                <div className="desktop-service-links">
                  {group.items.map((item, index) => (
                    <a
                      className="desktop-service-link"
                      href={item.href}
                      key={item.key}
                      tabIndex={open && !closing && !opening ? 0 : -1}
                      style={{ "--channel-index": index }}
                    >
                      <span className="desktop-service-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <span className="desktop-service-name">{item.label}</span>
                      <span className="desktop-service-rule" aria-hidden="true"><i /></span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
          </div>
        </div>

        <footer className="desktop-channel-footer">
          <span>{localizedMenuLabels.servicesMenu}</span>
          <FontSizeControls {...fontControls} tabIndex={open && !closing && !opening ? 0 : -1} />
          <span>ESTIGINTO</span>
        </footer>
      </nav>
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

const fontScaleOptions = [90, 100, 110, 120];

export default function App() {
  const headerLanguageSwitchRef = useRef(null);
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
    const cookieLocale = readLanguageCookie(document.cookie);
    return getInitialLocale(savedLocale, window.navigator.language, cookieLocale);
  });
  const [languageTransitionPhase, setLanguageTransitionPhase] = useState("idle");
  const [languageTransitionTarget, setLanguageTransitionTarget] = useState(locale);
  const languageTransitionBusyRef = useRef(false);
  const languageTransitionTimersRef = useRef([]);
  const [fontScale, setFontScale] = useState(() => {
    if (typeof window === "undefined") {
      return 100;
    }

    const savedScale = Number(window.localStorage.getItem("estiginto-font-scale"));
    return fontScaleOptions.includes(savedScale) ? savedScale : 100;
  });
  const copy = useMemo(() => ({ ...getCopy(locale), locale }), [locale]);

  const [shouldUseMobileNav, setShouldUseMobileNav] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 640px), (pointer: coarse)").matches;
  });
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px), (pointer: coarse)");
    const onChange = (event) => setShouldUseMobileNav(event.matches);
    setShouldUseMobileNav(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);
  const hasLanguageCookie = useMemo(() => {
    if (typeof document === "undefined") {
      return false;
    }
    return readLanguageCookie(document.cookie) !== null;
  }, []);
  const promptEligible = shouldShowMobileHomeLanguagePrompt({
    initialSection,
    shouldUseMobileNav,
    hasLanguageCookie,
  });
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(promptEligible);
  const pageTitle = copy.pageTitles[initialSection];
  const isStandalonePage = Boolean(pageTitle);
  const isFAQPage = initialSection === "faq";
  const currentFontScaleIndex = fontScaleOptions.indexOf(fontScale);
  const fontControls = {
    labels: copy.font,
    canDecrease: currentFontScaleIndex > 0,
    canIncrease: currentFontScaleIndex < fontScaleOptions.length - 1,
    isDefault: fontScale === 100,
    onDecrease: () => {
      setFontScale((value) => fontScaleOptions[Math.max(0, fontScaleOptions.indexOf(value) - 1)] || 100);
    },
    onIncrease: () => {
      setFontScale((value) => fontScaleOptions[Math.min(fontScaleOptions.length - 1, fontScaleOptions.indexOf(value) + 1)] || 100);
    },
    onReset: () => {
      setFontScale(100);
    },
  };

  const commitLocale = (nextLocale) => {
    const languageCookie = serializeLanguageCookie(
      nextLocale,
      window.location.protocol === "https:",
    );
    if (!languageCookie) return false;

    setLocale(nextLocale);
    window.localStorage.setItem("estiginto-locale", nextLocale);
    document.cookie = languageCookie;
    return true;
  };

  const selectLocale = (nextLocale) => {
    if (nextLocale === locale || languageTransitionBusyRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = shouldAnimateLanguageChange({
      currentLocale: locale,
      nextLocale,
      busy: languageTransitionBusyRef.current,
      reducedMotion,
    });

    if (!shouldAnimate) {
      commitLocale(nextLocale);
      return;
    }

    languageTransitionBusyRef.current = true;
    setLanguageTransitionTarget(nextLocale);
    setLanguageTransitionPhase("covering");

    const swapTimer = window.setTimeout(() => {
      commitLocale(nextLocale);
      setLanguageTransitionPhase("revealing");
    }, LANGUAGE_TRANSITION_SWAP_DELAY);
    const completionTimer = window.setTimeout(() => {
      languageTransitionBusyRef.current = false;
      setLanguageTransitionPhase("idle");
      languageTransitionTimersRef.current = [];
    }, LANGUAGE_TRANSITION_DURATION);

    languageTransitionTimersRef.current = [swapTimer, completionTimer];
  };

  useEffect(() => () => {
    languageTransitionTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    languageTransitionBusyRef.current = false;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : locale === "ja" ? "ja" : "zh-Hant";
    window.localStorage.setItem("estiginto-locale", locale);
  }, [locale]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    window.localStorage.setItem("estiginto-font-scale", String(fontScale));
  }, [fontScale]);

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
  }, []);

  return (
    <>
      <PageTransition />
      <div className={`site-shell ${languageTransitionPhase === "idle" ? "" : `language-transition-active language-transition-${languageTransitionPhase}`}`.trim()}>
        <Header
          locale={locale}
          onToggleLocale={selectLocale}
          languageSwitchRef={headerLanguageSwitchRef}
          promptActive={showLanguagePrompt}
        />
        {showLanguagePrompt ? (
          <MobileHomeLanguagePrompt
            locale={locale}
            onSelect={commitLocale}
            destinationRef={headerLanguageSwitchRef}
            onComplete={() => setShowLanguagePrompt(false)}
          />
        ) : null}
        {shouldUseMobileNav ? <MobileNav locale={locale} fontControls={fontControls} /> : <DesktopCursorMenu locale={locale} fontControls={fontControls} />}
        <main className="page-main" id="mainpage">
        {isStandalonePage ? (
          <>
            <PageTitle page={pageTitle} />
            {initialSection === "about" ? <TeamSection copy={copy} /> : null}
            {initialSection === "case" ? (
              <>
                <CasePortfolio copy={copy} />
              </>
            ) : null}
            {initialSection === "solutions" ? <><Solutions copy={copy} /><Numbers copy={copy} /></> : null}
            {initialSection === "consulting" ? <ConsultingServices copy={copy} /> : null}
            {isFAQPage ? <FAQ copy={copy} /> : null}
          </>
        ) : (
          <>
            <Hero copy={copy} />
            <HomeDirectory copy={copy} />
            <Marquee copy={copy} />
            <ClientLogoMarquee copy={copy} />
          </>
        )}
        </main>
        <Footer copy={copy} />
        <GoToTop />
      </div>
      <div className={`language-transition language-transition-${languageTransitionPhase}`} aria-hidden="true" data-target-locale={languageTransitionTarget}>
        <span className="language-transition-scan" aria-hidden="true" />
        <span className="language-transition-decoder" aria-hidden="true">
          <span className="language-transition-noise">X7 / ▒░▓ / 0x4E7A / // 1010</span>
          <span className="language-transition-copy">{languageTransitionCopy[languageTransitionTarget] || languageTransitionCopy.zh}</span>
        </span>
      </div>
    </>
  );
}
