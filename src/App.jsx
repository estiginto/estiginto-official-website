import { useEffect, useMemo, useRef, useState } from "react";
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
    contact: "聯繫我們",
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
  zh: { faq: "常見問題", articles: "文章", siteMenu: "網站導覽" },
  en: { faq: "FAQ", articles: "Articles", siteMenu: "Site navigation" },
  ja: { faq: "よくある質問", articles: "記事", siteMenu: "サイトナビゲーション" },
};

const consultingServicesByLocale = {
  zh: {
    sectionLabel: "商業顧問服務",
    sectionMeta: "四個專業方向",
    intro: "從真實問題出發，協助企業看清優先順序、整合資源，並把策略接到可執行的工作。",
    labels: { situations: "適合情境", scope: "顧問範圍", deliverables: "可交付內容", execution: "可銜接服務", consult: "預約諮詢" },
    processTitle: "顧問合作流程",
    process: ["現況盤點", "目標確認", "策略規劃", "執行協作", "成效檢視"],
    services: [
      { id: "systems-consulting", shortLabel: "系統顧問", title: "系統顧問服務", summary: "把營運流程、權限與資料關係整理成能落地的系統藍圖。", situations: ["準備導入或汰換 ERP、CRM、WMS", "既有系統分散，流程與資料難以串接"], scope: ["需求與流程盤點", "功能、權限與資料架構", "導入順序與專案風險"], deliverables: ["需求分析", "系統架構圖", "導入藍圖"], execution: "可銜接客製系統開發、既有系統整合與專案協作。" },
      { id: "digital-integration", shortLabel: "數位整合", title: "數位整合顧問", summary: "把網站、電商、會員與第三方服務整合成一致的數位流程。", situations: ["數位工具很多，但資料仍靠人工搬運", "網站、金流、物流與內部系統各自運作"], scope: ["數位服務盤點", "資料流與 API 串接", "自動化與階段建置"], deliverables: ["整合架構圖", "串接清單", "執行優先序"], execution: "可銜接網站、電商、會員、金流、物流及自動化建置。" },
      { id: "visual-design", shortLabel: "視覺設計", title: "視覺設計顧問", summary: "讓品牌、介面與行銷素材使用同一套清楚且可延續的視覺語言。", situations: ["品牌視覺缺乏一致性", "數位介面資訊層級不清楚"], scope: ["品牌視覺檢視", "UI 與資訊層級", "設計規範與素材管理"], deliverables: ["視覺方向", "設計規範", "改善清單"], execution: "可銜接品牌識別、UI、網站視覺及行銷素材設計。" },
      { id: "international-marketing", shortLabel: "國際行銷", title: "國際行銷顧問", summary: "依市場與決策路徑規劃海外溝通，不把國際化簡化成翻譯。", situations: ["準備進入海外市場", "已有多語內容但缺少轉換路徑"], scope: ["市場與受眾定位", "多語內容與國際 SEO", "廣告、通路與在地化"], deliverables: ["市場進入策略", "內容方向", "執行計畫"], execution: "可銜接多語網站、SEO、廣告素材與海外行銷執行。" },
    ],
  },
  en: {
    sectionLabel: "Business Consulting", sectionMeta: "Four advisory practices", intro: "We clarify priorities, connect resources, and turn strategy into executable work.",
    labels: { situations: "Best for", scope: "Advisory scope", deliverables: "Deliverables", execution: "Execution support", consult: "Book a consultation" }, processTitle: "How we work", process: ["Current state", "Goals", "Strategy", "Execution", "Review"],
    services: [
      { id: "systems-consulting", shortLabel: "Systems", title: "Systems Consulting", summary: "Turn workflows, permissions, and data relationships into an implementable system blueprint.", situations: ["Planning an ERP, CRM, or WMS rollout", "Disconnected systems and manual handoffs"], scope: ["Workflow discovery", "Functional and data architecture", "Implementation sequence and risk"], deliverables: ["Requirements analysis", "Architecture map", "Adoption roadmap"], execution: "Connects to custom development, integration, and delivery support." },
      { id: "digital-integration", shortLabel: "Integration", title: "Digital Integration Consulting", summary: "Connect websites, commerce, membership, and third-party services into one operating flow.", situations: ["Teams manually move data between tools", "Web, payment, logistics, and internal systems operate separately"], scope: ["Digital service audit", "Data flow and API integration", "Automation roadmap"], deliverables: ["Integration map", "Connection inventory", "Prioritized plan"], execution: "Connects to web, commerce, membership, payments, logistics, and automation." },
      { id: "visual-design", shortLabel: "Visual", title: "Visual Design Consulting", summary: "Create a consistent visual language across brand, interface, and marketing materials.", situations: ["Brand applications feel inconsistent", "Digital interfaces lack visual hierarchy"], scope: ["Brand review", "UI and information hierarchy", "Design governance"], deliverables: ["Visual direction", "Design guidelines", "Improvement list"], execution: "Connects to identity, UI, web visuals, and campaign assets." },
      { id: "international-marketing", shortLabel: "Global", title: "International Marketing Consulting", summary: "Plan overseas communication around market context and buyer decisions, not translation alone.", situations: ["Preparing to enter overseas markets", "Multilingual content exists without a conversion path"], scope: ["Market and audience position", "Multilingual content and SEO", "Ads, channels, and localization"], deliverables: ["Market-entry strategy", "Content direction", "Execution plan"], execution: "Connects to multilingual websites, SEO, advertising, and market execution." },
    ],
  },
  ja: {
    sectionLabel: "ビジネスコンサルティング", sectionMeta: "4つの専門領域", intro: "現状と優先順位を整理し、戦略を実行可能な仕事へつなげます。",
    labels: { situations: "適した状況", scope: "支援範囲", deliverables: "成果物", execution: "実行支援", consult: "相談を予約" }, processTitle: "支援の流れ", process: ["現状整理", "目標確認", "戦略設計", "実行連携", "効果検証"],
    services: [
      { id: "systems-consulting", shortLabel: "システム", title: "システムコンサルティング", summary: "業務、権限、データを導入可能なシステム設計へ整理します。", situations: ["ERP・CRM・WMS の導入や刷新", "システムと業務が分断している"], scope: ["業務と要件の整理", "機能・権限・データ設計", "導入順序とリスク"], deliverables: ["要件分析", "構成図", "導入ロードマップ"], execution: "カスタム開発、既存連携、プロジェクト支援へ接続できます。" },
      { id: "digital-integration", shortLabel: "デジタル統合", title: "デジタル統合コンサルティング", summary: "Web、EC、会員、外部サービスを一つの運用フローへ統合します。", situations: ["ツール間の手作業が多い", "決済・物流・社内システムが分断している"], scope: ["サービス棚卸し", "データと API 連携", "自動化計画"], deliverables: ["統合構成図", "連携一覧", "優先順位"], execution: "Web、EC、会員、決済、物流、自動化の構築へ接続できます。" },
      { id: "visual-design", shortLabel: "ビジュアル", title: "ビジュアルデザインコンサルティング", summary: "ブランド、UI、販促物に一貫した視覚言語を設計します。", situations: ["ブランド表現が統一されていない", "画面の情報階層が分かりにくい"], scope: ["ブランド診断", "UI と情報階層", "デザイン運用"], deliverables: ["ビジュアル方針", "デザイン規定", "改善一覧"], execution: "ブランド、UI、Web、マーケティング素材制作へ接続できます。" },
      { id: "international-marketing", shortLabel: "海外展開", title: "国際マーケティングコンサルティング", summary: "翻訳だけでなく、市場と購買判断に沿った海外展開を設計します。", situations: ["海外市場への進出を検討している", "多言語コンテンツに成果導線がない"], scope: ["市場・顧客定位", "多言語コンテンツと SEO", "広告・チャネル・現地化"], deliverables: ["市場参入戦略", "コンテンツ方針", "実行計画"], execution: "多言語サイト、SEO、広告、海外施策へ接続できます。" },
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
      ["11", "網址（URL）是什麼？", "使用者進入網站的地址。（就像門牌號碼）"],
      ["12", "網域（Domain）是什麼？", "網站名稱就像是你的住宅或社區名稱，需要向網域供應商每年續費，沒辦法買斷。(全世界的網域由 ICANN 管理，規則只能註冊／續租，不能永久擁有) "],
      ["13", "主機（Hosting）是什麼？", "放網站資料的伺服器。（就像是放置房屋建物的土地）"],
      ["14", "網域 vs 主機差在哪？", "網域是地址，主機是土地所在。而土地上面的房屋建物則是網站或程式系統。"],
      ["15", "API 是什麼？", "系統與系統之間的溝通方式。（按照特定規格溝通對接的模式）"],
      ["16", "什麼叫「串接」？", "將不同系統連接。（像把不同電器接到同一個電源）"],
      ["17", "為什麼串接會增加費用？ *", "需要整合第三方系統與處理流程及例外（例如：第三方支付、刷卡、電子發票、數位錢包、數位憑證等）。"],
      ["18", "什麼是前端 vs 後端？", "前端是畫面，後端是邏輯。（像餐廳店面裝潢 vs 餐廳動線機能）"],
      ["19", "資料庫是什麼？", "用來儲存資料。（像倉庫）"],
      ["20", "SaaS 是什麼？", "雲端軟體服務。（像租用現成店面）"],
    ],
  },
  {
    title: "C. 功能與開發決策",
    subtitle: "範圍選擇",
    items: [
      ["21", "可以先做一部分後再加功能嗎？ *", "可以，但前期架構需設計好。（像預留施工管線）"],
      ["22", "可以只做部分功能嗎？", "可以，建議先做核心。（先求有再求好）"],
      ["23", "是否一定要做 App？", "不一定，需要根據使用者類型，以及行銷策略而定。"],
      ["24", "Web App 跟網站差在哪？", "架構相同，但呈現方式大不同，通常是因為純移動裝置 APP 開發及維護成本較高，而優先使用 Web App。"],
      ["25", "是否需要管理後台？", "若是資料時常異動或時常累積，希望由公司內部人員可直接管理，最小化後期開發公司的支援，則需要管理後台。(需先定義好哪些資料可以編輯)"],
      ["26", "是否需要權限控管？", "幾乎一定需要。"],
      ["27", "是否需要報表？", "視營運需求而定，應將數據轉為可視化呈現或報表下載。"],
      ["28", "是否需要即時系統？", "若涉及到即時聊天室，則需要架構即時系統。若預算有限則改為非即時系統，則需要調整使用者體驗以配合非即時的特性，如 留言式對話。"],
      ["29", "是否可以用現成工具？", "可以，諸如 WordPress、Shopify、Wix 等，但擴充彈性受限於平台規範。（像租現成店面）"],
      ["30", "客製 vs 套版怎麼選？ *", "取決於功能需求、上線時間要求，看是否需要差異化。（像訂製西裝 vs 成衣）"],
    ],
  },
  {
    title: "D. 設計與使用體驗",
    subtitle: "介面與流程",
    items: [
      ["31", "為什麼視覺設計也要錢？ *", "若使用者為終端消費者，則視覺設計將嚴重影響轉換率與效率，但同時需要經過市場驗證，顧視覺設計仍然是使用型系統佔比非常大的部分，甚至部分品牌可能超過系統設計。（像店面品牌、店面動線設計）"],
      ["32", "UI vs UX 差在哪？", "UI 是畫面，UX 是體驗。（像裝潢 vs 動線）"],
      ["33", "是否一定要做 RWD？", "通常是內建選項。（像一個空間適合不同人使用）"],
      ["34", "可以照參考網站做嗎？", "可以參考但不能複製，必須以同品質但不同風格方式呈現。（像參考風格）"],
      ["35", "為什麼要先做設計規劃？", "避免開發後才發現不是自己要的或者規劃錯誤。（像先畫藍圖）"],
      ["36", "是否需要儀表板 Dashboard？", "通常都需要，因為只要系統有數據，就應該有可視化操作作呈現。尤其是若大型電視牆或者螢幕呈現。"],
      ["37", "是否需要動畫？", "不一定，視是否增加使用者體驗 UX 而定。"],
      ["38", "可以自己提供設計嗎？", "可以，但仍然需要實作成可施工設計圖。"],
      ["39", "品牌風格重要嗎？", "如同門面一般，影響信任感。"],
      ["40", "為什麼有些網站比較順？", "讀取速度取決於 前端設計架構、素材選擇、主機環境等，應逐步檢核、逐步優化。"],
    ],
  },
  {
    title: "E. AI 技術現實",
    subtitle: "工具與限制",
    items: [
      ["41", "你們會用 AI 做嗎？ *", "僅在我們的規劃下輔助使用，因為 AI 設計風格過於鮮明，而每一位客戶的需求及風格都不同，仍然需要搭配非常多的規劃設計、價值驗證。"],
      ["42", "用 AI 為什麼還這麼貴？ *", "AI 僅能解決部分的設計速度，但無法解決決策及底層邏輯，但可以讓預算用在最有價值的地方。"],
      ["43", "AI 可以直接做完整系統嗎？", "就實際落地商業化仍然還有一段距離。"],
      ["44", "為什麼還需要工程團隊？", "AI 如同施工助理，可以加速，但仍然需要整合與設計核心。"],
      ["45", "AI 會偷我的資料嗎？", "若涉及機密或者商業邏輯，則應該使用內部私有模型，避免外洩風險。"],
      ["46", "可以做私有 AI 嗎？", "可以，根據需求架設私人模型。"],
      ["47", "AI 做出來可靠嗎？", "就商業落地而言仍然有非常的多細節需要逐步修正。"],
      ["48", "AI 會取代工程師嗎？", "中高階工程師仍無法取代，但會對既有的市場收入產生影響。"],
      ["49", "可以用 AI 降成本嗎？", "絕對可以，根據目前已實際落地的專案，AI 已加速節省開發時間達 70%，剩餘決策、溝通、反饋時間仍無法縮短。"],
      ["50", "AI 最大限制是什麼？", "目前最缺乏的部份是商業邏輯機制、視覺設計、使用者體驗等，仍然需要有詳盡的系統規劃及品牌統一性。"],
    ],
  },
  {
    title: "F. 合約、權利與控制權",
    subtitle: "交付與授權",
    items: [
      ["51", "程式碼會給我嗎？ *", "視合約條件而定。一般可分為：僅提供系統使用權、交付程式碼但不包含重製／轉售／再授權權利，或依專案另行約定完整原始碼與智慧財產權歸屬。實際交付範圍、授權方式、維護責任與使用限制，皆應以合約明確載明。"],
      ["52", "設計稿可以給原始檔嗎？ *", "可提供，但需於合約中明確約定交付範圍（如 Figma / AI / PSD 等原始檔）、使用授權（是否包含修改權、再利用權）、以及是否包含設計系統與元件庫。未約定時，預設僅提供最終輸出檔。"],

      ["53", "著作權是誰的？", "依合約約定。一般區分為：著作財產權移轉（買斷）或授權使用（非專屬／專屬）。未特別約定時，著作權通常仍歸創作者所有，客戶僅取得使用授權。另需特別區分：若涉及客戶既有之專利、商業機密、營業秘密或專有技術（Know-how），其權利仍專屬於客戶，我方僅於專案範圍內為履約目的使用，且負有保密義務，不因設計或開發成果而取得任何權利或衍生權。相關權利歸屬與使用範圍，應於合約中明確載明。"],

      ["54", "我可以拿去給別人用嗎？", "需依授權範圍判定。若為非專屬授權且未限制，可於約定範圍內使用；若涉及轉讓、再授權或商業擴散，通常需取得書面同意或另行授權。"],

      ["55", "可以只買設計嗎？", "可以。可單獨委託設計服務，但需明確界定交付內容（如視覺稿、系統規劃書）、檔案格式、以及後續使用與授權範圍，避免與開發權責混淆。"],

      ["56", "我可以自己架主機嗎？", "可以。若採自架模式，需由客戶負責主機環境（含資安、備份、監控、更新維護等），我方可提供部署文件或技術支援，並於合約中界定責任邊界。"],

      ["57", "可以轉給別人維護嗎？", "可以，但需符合授權條款。若涉及程式碼交付，應確認是否包含維護權、修改權與技術文件完整性；必要時可提供交接文件或付費技術交接服務。"],

      ["58", "如果你們不在了怎麼辦？", "可透過機制降低風險，例如：完整技術文件、原始碼託管（如 escrow）、版本控管（Git）、第三方可接手的架構設計等，並於合約中事先約定交付與備援條款。"],

      ["59", "我可以改程式嗎？", "需視授權而定。若包含原始碼且授權含修改權，則可自行或委外修改；若未授權修改或僅提供使用權，則不得擅自變更，以免違反合約或影響維護責任。"],

      ["60", "是否需要合約？", "視專案規模與複雜度而定。小型案件可由報價單或訂單條款構成契約；中大型或涉及客製開發、智慧財產權與維運責任之專案，建議簽訂正式合約。無論形式為何，均應明確約定交付內容、費用、時程、驗收與授權條款，以降低履約與法律風險。"],
    ],
  },
  {
    title: "G. 風險、品質與現實",
    subtitle: "交付管理",
    items: [
      ["61", "可以保證成功嗎？ *", "無法保證最終商業成果（如營收或轉換率）。我們可保證依約完成交付內容、品質標準與技術規格；成效仍取決於市場、營運策略與使用方式等多重因素。"],

      ["62", "可以保證排名（SEO）嗎？ *", "無法保證特定排名。搜尋引擎演算法與競爭環境持續變動，我們可依最佳實務提供優化策略（技術SEO、內容結構等），但不承諾特定名次或流量。"],

      ["63", "為什麼專案會失敗？ *", "常見原因包含：需求定義不清、決策方向錯誤、頻繁變更範圍、資源不足或溝通落差。多數問題源於前期規劃與共識不足，而非單一技術問題。"],

      ["64", "為什麼需求要寫很細？", "為確保交付一致性與可驗收性。明確需求可作為報價、排程與驗收依據，降低誤解與重工風險。"],

      ["65", "可以很快做完嗎？", "可透過增加人力、簡化功能或採用現成方案加速，但通常會影響成本、品質或可擴展性，需於三者間取得平衡並事前約定。"],

      ["66", "可以邊做邊改嗎？", "可行，但需納入變更管理流程（Change Request），包含影響評估、時程與費用調整，避免失控與延誤。"],

      ["67", "為什麼修改要收費？", "若超出原合約範圍或影響既有設計／開發，將產生額外工時與風險，因此需依變更內容另行報價或計費。"],

      ["68", "可以無限修改嗎？", "通常不行。合約會約定修改次數或範圍；超出部分需走變更流程並另計費，以確保專案可控與如期交付。"],

      ["69", "為什麼要驗收？", "驗收用於確認交付是否符合合約規格與品質標準，並作為里程碑款項與責任轉移的依據。"],

      ["70", "為什麼要文件？", "文件可確保系統可維護、可交接與可擴展，並作為後續營運、除錯與風險控管的重要依據。"],
    ],
  },
  {
    title: "H. 付款相關",
    subtitle: "最關鍵",
    items: [
      ["71", "別人比較便宜？ *", "報價差異通常來自架構設計、穩定性、擴展性與服務範圍不同，而非單純功能表面。較低價格可能未包含完整測試、文件、資安、設計機制或長期維護成本，需綜合評估整體價值與風險。"],

      ["72", "我只要很簡單功能 *", "表面功能簡單不代表實作簡單，背後仍涉及資料結構、權限邏輯、例外處理與未來擴展性。需先釐清使用情境與邊界條件，才能準確評估成本與時程。"],

      ["73", "可以用模板嗎？", "可以。模板或現成方案可降低開發成本與時程，但在客製化程度、擴展性與系統整合上會有所限制，需評估是否符合長期需求。"],

      ["74", "為什麼客製功能這麼貴？", "成本主要來自邏輯設計、系統整合、穩定性與測試，而非畫面本身。越是關鍵功能，對資料正確性與例外處理要求越高，開發成本亦相對提升。"],

      ["75", "可以免費試做嗎？", "通常不提供免費開發。可透過需求訪談、原型設計或系統規劃來降低決策風險，確保方向正確後再進入正式開發。"],

      ["76", "可以成功再付錢嗎？", "原則上不建議以「最終商業成功」作為唯一付款條件，因其定義模糊且受市場與營運等外部因素影響。較可行方式為採里程碑分階段付款，並可另行約定具體且可驗證的量化指標（KPI），如流量、轉換率或系統效能等，作為部分款項的觸發條件。相關指標之定義、量測方式與責任歸屬，應於合約中明確約定。"],

      ["77", "為什麼要簽約？", "非所有案件皆需正式合約。小型或低複雜度專案可由報價單或訂單條款構成契約；但對於中大型、客製化或涉及智慧財產權與維運責任之專案，建議簽訂正式合約，以明確界定交付範圍、費用、時程、驗收與權利義務，降低履約風險與爭議。"],

      ["78", "為什麼要分階段付款？", "分攤雙方風險並對齊進度與成果，確保專案能持續推進，同時避免單方資金或履約壓力過高。"],

      ["79", "為什麼要這麼多討論？", "前期討論不僅為建立需求共識，亦包含機制設計、流程驗證與風險評估。透過完整規劃，可於開發前先進行市場驗證（如原型測試、用戶回饋、MVP 驗證等），提早修正方向，降低後續變更、重工與決策錯誤所帶來的成本與風險。"],

      ["80", "為什麼系統這麼複雜？", "系統複雜度通常源自實際商業流程、權限控管與資料流轉需求。為確保可用性與可擴展性，需反映這些真實條件，而非僅呈現表面功能。"],
    ],
  },
];

const faqCount = faqGroups.reduce((count, group) => count + group.items.length, 0);

const pageTitles = {
  about: {
    kicker: "About",
    title: "關於我們",
    lede: aboutIntroductionsByLocale.zh,
  },
  case: {
    kicker: "Selected Work",
    title: "精選實績",
    lede: "不只完成系統，更把複雜的營運需求，整理成真正能長期使用的工具。",
  },
  solutions: {
    kicker: "Solutions",
    title: "解決方案",
    lede: "網站、客製系統、品牌設計與數位行銷，從需求規劃到長期運作一次整合。",
  },
  consulting: {
    kicker: "Business Consulting",
    title: "商業顧問服務",
    lede: "從系統、數位整合、視覺設計到國際行銷，先釐清問題，再把策略接到可執行的工作。",
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
        "以思緒縝密的設計著名",
        "讓企業產生持續的影響力",
      ],
      scrolldown: "往下滾動",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "服務過的客戶",
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
      index: "§ 參考其他人的應用情境",
      label: "依需求查看解法",
      button: "討論這個方案",
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
      faqLabel: "常見問題",
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
      case: { kicker: "Selected Work", title: "Selected Work", lede: "We turn complex operating needs into systems teams can rely on and keep using." },
      solutions: { kicker: "Solutions", title: "Solutions", lede: "Websites, custom systems, brand design, and digital marketing - connected from planning through long-term operation." },
      consulting: { kicker: "Business Consulting", title: "Business Consulting", lede: "Systems, digital integration, visual design, and international marketing advice connected to practical execution." },
      faq: { kicker: "FAQ", title: "FAQ", lede: "Questions clients most often ask before working with us, covering pricing, systems, design, AI, contracts, risk, and payment." },
      contact: { kicker: "Contact", title: "Contact Us", lede: "Tell us where you are, what you want to achieve, and where you are stuck. We will help clarify the direction first." },
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
        "Known for thoughtful, meticulously considered design.",
        "We help businesses create lasting impact.",
      ],
      scrolldown: "Scroll down",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "Clients we've served",
      status: "CLIENT ARCHIVE / 03 STREAMS",
    },
    marquee: ["Adaptive decision systems", "Software system planning and implementation", "Software, hardware, and IoT integration", "ERP / WMS / CRM", "Business websites / e-commerce / payments / invoices", "Custom app development", "War-room dashboards", "Automation execution support systems"],
    achievements: { label: "We build designs with a soul, turning systems into engines for brand growth and lasting impact.", meta: "Since 2011" },
    manifesto: { label: "Our Approach", prelude: "Let systems fit the way work gets done", headlinePrefix: "instead of making work", headlineHighlight: "adapt to the system", points: ["1. Interactions reflect real working habits", "2. Information appears clearly when it is needed", "3. The architecture leaves room to adapt and grow"], quote: "\"Understand the work before designing the system.\"", paragraphs: [["We begin with users, workflows, and information flows", "clarifying the interactions and decisions that matter", "then shaping the needs into a system plan we can validate and build step by step."], ["The system becomes a natural part of the team's day-to-day work", "reducing repeated checks and unnecessary steps", "while leaving room for future changes and growth."]], signoff: "- Let tools return to their role of supporting the work." },
    solutionsUi: { index: "§ Reference application scenarios", label: "Explore by need", button: "Discuss this solution" },
    aiLab: { label: "Customer-centered", title: "Core Services", lede: "Since 2011, we have connected deeply with Taiwan's industry chain and gradually expanded internationally." },
    faqNoteLabel: "Key answer logic",
    contact: { label: "When you are ready", meta: "Book a consultation", titleA: "Seize your", titleHighlight: "chance to shape the future", lede: ["Book an online consultation now", "and let us help build your business landscape."], emailButton: "Email us" },
    footer: { company: "ESTIGINTO Co., Ltd.", navLabel: "Footer navigation", line: "LINE@ Official Account", faqLabel: "FAQ" },
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
      faq: { kicker: "FAQ", title: "よくある質問", lede: "価格、システム、機能、設計、AI、契約、リスク、支払いなど、相談前によくある質問をまとめました。" },
      contact: { kicker: "Contact", title: "お問い合わせ", lede: "現状、目標、課題をお聞かせください。まず方向性の整理からお手伝いします。" },
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
        "緻密に考え抜かれたデザインで知られています。",
        "企業が持続的な影響力を生み出せるよう支援します。",
      ],
      scrolldown: "下へスクロール",
    },
    clientLogos: {
      eyebrow: "Selected relationships / 2011—2026",
      title: "ご支援した企業",
      status: "CLIENT ARCHIVE / 03 STREAMS",
    },
    marquee: ["能動型意思決定システム", "ソフトウェアシステムの設計と構築", "ソフト・ハード・IoT 統合", "ERP / WMS / CRM", "ビジネスサイト / EC / 決済 / 請求書", "カスタム APP", "戦情室ダッシュボード", "自動化実行支援システム"],
    achievements: { label: "魂のあるデザインを作り、システムをブランド成長と持続的な影響力の推進力にします。", meta: "2011 年から" },
    manifesto: { label: "私たちのアプローチ", prelude: "システムを仕事に合わせる", headlinePrefix: "仕事をシステムに", headlineHighlight: "合わせるのではなく", points: ["1. 実際の働き方に沿った操作", "2. 必要なときに、必要な情報が明確に届く", "3. 変化や拡張に対応できる余地を残す"], quote: "「仕事を理解してから、システムを設計する。」", paragraphs: [["利用者、業務プロセス、情報の流れから始め", "重要な操作と意思決定のポイントを整理し", "検証しながら段階的に実現できるシステム計画へ落とし込みます。"], ["システムをチームの日常に自然になじませ", "繰り返しの確認や不要な操作を減らし", "将来の変更や拡張にも余地を残します。"]], signoff: "- ツールを、仕事を支える本来の役割へ。" },
    solutionsUi: { index: "§ 他社の活用シーンを参考にする", label: "課題別に見る", button: "この方案を相談する" },
    aiLab: { label: "顧客中心", title: "主要サービス", lede: "2011 年から台湾の産業チェーン資源と深く連携し、国際展開を進めています。" },
    faqNoteLabel: "回答の要点",
    contact: { label: "準備ができたら", meta: "相談を予約", titleA: "未来を変える", titleHighlight: "チャンスをつかむ", lede: ["オンライン相談をご予約ください", "あなたのビジネス構想を形にするお手伝いをします。"], emailButton: "メールする" },
    footer: { company: "造物者科技", navLabel: "フッターナビゲーション", line: "LINE@ 公式アカウント", faqLabel: "よくある質問" },
    construction: "サイト内容を更新中です。しばらくお待ちください。",
    font: { label: "文字サイズ", increase: "文字を大きく", reset: "標準サイズ", decrease: "文字を小さく" },
    preview: { show: "工事中画面をプレビュー", back: "完全ページへ戻る" },
  },
};

function getCopy(locale) {
  const copy = localizedCopy[locale] || localizedCopy.zh;
  if (locale === "en") {
    const faqHeadings = [
      ["A. Getting Started and Pricing", "Common topics"],
      ["B. System Concepts and Basics", "Basic terms"],
      ["C. Feature and Development Decisions", "Scope choices"],
      ["D. Design and User Experience", "Interface and flow"],
      ["E. The Reality of AI", "Tools and limits"],
      ["F. Contracts, Rights, and Control", "Delivery and licensing"],
      ["G. Risk, Quality, and Reality", "Delivery management"],
      ["H. Payment", "Key points"],
    ];
    return {
      ...copy,
      faqGroups: faqGroups.map((group, index) => ({
        ...group,
        title: faqHeadings[index]?.[0] || group.title,
        subtitle: faqHeadings[index]?.[1] || group.subtitle,
      })),
    };
  }
  if (locale === "ja") {
    const faqHeadings = [
      ["A. 入門と価格の考え方", "よくある議題"],
      ["B. システムの基本理解", "基礎用語"],
      ["C. 機能と開発判断", "範囲選択"],
      ["D. デザインと利用体験", "画面と流れ"],
      ["E. AI 技術の現実", "ツールと制約"],
      ["F. 契約、権利、管理権", "納品とライセンス"],
      ["G. リスク、品質、現実", "納品管理"],
      ["H. 支払い関連", "重要事項"],
    ];
    return {
      ...copy,
      faqGroups: faqGroups.map((group, index) => ({
        ...group,
        title: faqHeadings[index]?.[0] || group.title,
        subtitle: faqHeadings[index]?.[1] || group.subtitle,
      })),
    };
  }
  return copy;
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
      <canvas ref={canvasRef} className="hero-soul-ribbon-canvas" />
      <span className="hero-soul-ribbon-hud">SOUL CURRENT / FULL FIELD · 01A</span>
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

      <a className="scrolldown" href="#clients">{copy.hero.scrolldown}</a>
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
          <i>TRANSIT / 02</i><i>CHRONO FIELD</i><i>TAIPEI / 25.0330° N</i>
        </span>
        <span className="page-transition-vortex-interface">
          {transitionBrand ? (
            <span className="page-transition-vortex-brand">
              <img src={transitionBrand.src} alt={transitionBrand.alt} />
            </span>
          ) : null}
          <b data-text="ESTIGINTO">ESTIGINTO</b>
          <em>DESIGNING SYSTEMS FOR THE NEXT REALITY</em>
        </span>
        <span className="page-transition-vortex-hud page-transition-vortex-hud-bottom">
          <i>ESTIGINTO MOTION SYSTEM</i><i>ACCELERATE · INVERT · LOCK</i>
        </span>
      </span>
      <span className="page-transition-panel-top" />
      <span className="page-transition-panel-bottom" />
      <span className="page-transition-scan" />
    </div>
  );
}

function ClientLogoMarquee({ copy }) {
  const lanes = buildClientLogoLanes(clientLogos);

  return (
    <section className="client-logo-marquee" id="clients" aria-label={copy.clientLogos.title}>
      <div className="client-logo-marquee-field">
        {lanes.map((lane, laneIndex) => {
          return (
            <div className="client-logo-marquee-lane" key={`client-lane-${laneIndex + 1}`}>
              <div className="client-logo-marquee-track">
                {[0, 1].map((loopIndex) => (
                  <div className="client-logo-marquee-group" aria-hidden={loopIndex === 1 ? "true" : undefined} key={`client-loop-${loopIndex}`}>
                    {lane.map((client, itemIndex) => (
                      <div
                        className="client-logo-marquee-item"
                        data-reserved={client.src ? undefined : "true"}
                        key={`${client.id}-${loopIndex}`}
                      >
                        {client.src ? <img src={client.src} alt={client.alt} loading="lazy" /> : (
                          <span aria-hidden="true">{String(itemIndex * 3 + laneIndex + 1).padStart(2, "0")}</span>
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
    <section className="section reveal" id="solutions" aria-label="Solutions">
      <div className="wrap">
        <SectionEyebrow index={copy.solutionsUi.index} label={copy.solutionsUi.label} meta={`${items.length} programs`} />
        <div className="solutions">
          <ul className="sol-list">
            {items.map((s, i) => (
              <li
                key={s.id}
                className={`sol-row ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <span className="num">{s.number}</span>
                <div className="body">
                  <span className="tag">
                    <span>{s.eyebrow}</span>
                  </span>
                  <h3>{s.title}</h3>
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
              <span className="label">{item.meta}</span>
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
    zh: { section: "精選實績", meta: "依需求查看解法", intro: "從問題出發，看見我們如何把流程做成可持續運作的系統。", expand: "查看解法", collapse: "收合內容", details: "建置內容" },
    en: { section: "Selected Work", meta: "Explore by need", intro: "Start with the problem and see how we turn workflows into systems built for ongoing use.", expand: "View solution", collapse: "Close details", details: "What we built" },
    ja: { section: "実績紹介", meta: "課題別に見る", intro: "課題を起点に、業務フローを継続運用できる仕組みへ整えた事例をご紹介します。", expand: "解決内容を見る", collapse: "詳細を閉じる", details: "構築内容" },
  }[copy.locale] || { section: "精選實績", meta: "依需求查看解法", intro: "從問題出發，看見我們如何把流程做成可持續運作的系統。", expand: "查看解法", collapse: "收合內容", details: "建置內容" };

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

function Contact({ copy }) {
  const contact = copy.contact;
  return (
    <section className="section reveal" id="contact" aria-label="Contact">
      <div className="wrap">
        <SectionEyebrow index="§ Contact Us" label={contact.label} meta={contact.meta} />
        <div className="contact">
          <div>
            <h2>
              {contact.titleA} <span className="hl">{contact.titleHighlight}</span>
            </h2>
            <p className="lede">
              {contact.lede[0]}<br />{contact.lede[1]}
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-row">
              <span className="k">Email</span>
              <span className="v"><a className="contact-channel-link" href="mailto:contact@estiginto.com"><ContactIcon type="email" /><span>contact@estiginto.com</span></a></span>
            </div>
            <div className="contact-row">
              <span className="k">Phone</span>
              <span className="v"><a className="contact-channel-link" href="tel:+886224315362"><ContactIcon type="phone" /><span>+886 2 2431 5362</span></a></span>
            </div>
            <div className="contact-row">
              <span className="k">Sales</span>
              <span className="v"><a className="contact-channel-link" href="tel:+886972118427"><ContactIcon type="mobile" /><span>+886 972 118 427</span></a></span>
            </div>
            <div className="contact-row">
              <span className="k">LINE@</span>
              <span className="v"><a className="contact-channel-link" href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer"><ContactIcon type="line" /><span>@dbn3379w</span></a></span>
            </div>
            <div className="contact-cta">
              <a className="btn btn-primary" href="mailto:contact@estiginto.com?subject=Project%20Brief%20%7C%20ESTIGINTO">
                <span>{contact.emailButton}</span>
                <span className="arrow" aria-hidden="true" />
              </a>
              <a className="btn" href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer">
                <span>LINE@</span>
                <span className="arrow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ copy }) {
  const footer = copy.footer;
  return (
    <footer className="page-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-wordmark">ESTIGINTO</p>
            <p>{footer.company}</p>
          </div>
          <nav className="footer-links" aria-label={footer.navLabel}>
            <h5>Explore</h5>
            <a href="/about.html">{menuLabels[copy.locale]?.about || menuLabels.zh.about}</a>
            <a href="/solutions.html">{menuLabels[copy.locale]?.solutions || menuLabels.zh.solutions}</a>
            <a href="/case.html">{menuLabels[copy.locale]?.case || menuLabels.zh.case}</a>
            <a href="/faq.html">{copy.footer.faqLabel}</a>
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
    { key: "case", label: localizedMenuLabels.case, href: "/case.html" },
    { key: "faq", label: primaryLabels.faq, href: "/faq.html" },
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
              <p>Temporal navigation / Estiginto</p>
              <span>Mobile channel · TPE 25.0330° N</span>
            </div>
            <span aria-hidden="true">CH / 02</span>
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
            <span>Channel control</span>
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
    { key: "case", label: localizedMenuLabels.case, href: "/case.html" },
    { key: "faq", label: primaryLabels.faq, href: "/faq.html" },
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
            <p className="desktop-service-eyebrow">Temporal navigation / Estiginto</p>
            <p className="desktop-channel-status"><i aria-hidden="true" /> Channel stable · TPE 25.0330° N</p>
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
            <span className="desktop-channel-axis-label" aria-hidden="true">NOW / 00</span>
            <button
              className="desktop-channel-core"
              type="button"
              aria-label="Close desktop menu"
              tabIndex={open && !closing && !opening ? 0 : -1}
              onClick={closeMenu}
            >
              <i aria-hidden="true" />
            </button>
            <span className="desktop-channel-axis-label" aria-hidden="true">ROUTE / ∞</span>
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
                  <small>{groupKey === "primary" ? "Origin paths" : "Advisory paths"}</small>
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
          <span>Temporal channel control deck</span>
          <FontSizeControls {...fontControls} tabIndex={open && !closing && !opening ? 0 : -1} />
          <span>Estiginto motion system / 2026</span>
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
  const isCasePage = initialSection === "case";
  const shouldShowApplicationScenarios = initialSection === "case" || initialSection === "solutions";
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
                <Solutions copy={copy} />
              </>
            ) : null}
            {initialSection === "solutions" ? <><Solutions copy={copy} /><Numbers copy={copy} /></> : null}
            {initialSection === "consulting" ? <><ConsultingServices copy={copy} /><Contact copy={copy} /></> : null}
            {isFAQPage ? <FAQ copy={copy} /> : null}
            {initialSection === "contact" ? <Contact copy={copy} /> : null}
          </>
        ) : (
          <>
            <Hero copy={copy} />
            <ClientLogoMarquee copy={copy} />
            <Marquee copy={copy} />
            <Contact copy={copy} />
          </>
        )}
        </main>
        {isFAQPage ? null : <Footer copy={copy} />}
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
