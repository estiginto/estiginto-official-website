import { useEffect, useMemo, useRef, useState } from "react";

const localeOptions = [
  ["zh", "中文"],
  ["en", "EN"],
  ["ja", "日本語"],
];

const menuLabels = {
  zh: {
    home: "首頁",
    about: "關於我們",
    solutions: "參考案例",
    case: "常見問題",
    contact: "聯繫我們",
  },
  en: {
    home: "Home",
    about: "About",
    solutions: "Case Studies",
    case: "FAQ",
    contact: "Contact",
  },
  ja: {
    home: "ホーム",
    about: "私たちについて",
    solutions: "事例紹介",
    case: "よくある質問",
    contact: "お問い合わせ",
  },
};

const menuTargets = [
  { key: "home", href: "/", section: "home", position: "center" },
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

function SectionEyebrow({ index, label, meta, className = "" }) {
  return (
    <div className={`section-eyebrow ${className}`.trim()}>
      <span className="index">{index}</span>
      <span className="rule" aria-hidden="true" />
      <span className="meta">{meta}</span>
      <span className="section-eyebrow-label" style={{ gridColumn: "1 / -1", marginTop: 8, color: "inherit" }}>
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
          className="achievements-eyebrow"
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


function AILab() {
  return (
    <section className="section bg-night reveal" id="ai-lab" aria-label="AI Lab">
      <div className="wrap">
        <SectionEyebrow index="§ Service" label="以客戶為本" meta="12 agents · in production" />
        <div className="ai-headline">
          <h2>
            核心服務項目
          </h2>
          <p className="lede">
            自 2012 開始，深度結合台灣產業鏈資源，逐步走向國際
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

function Insights() {
  const [activePost, setActivePost] = useState(null);
  const posts = [
    {
      idx: "01",
      tag: "AI Strategy",
      title: "AI 不是工具，而是營運流程的重構",
      body: "多數企業導入 AI 失敗，不是模型問題，而是流程沒有重設。我們看到的成功案例，都是先重做流程，再導入 AI。",
      image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
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
      image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.jpg",
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
        <SectionEyebrow index="§ Contact Us" label="如果您準備好了" meta="立即預約" />
        <div className="contact">
          <div>
            <h2>
              將想像<br />
              <span className="hl">化為現實</span>。
            </h2>
            <p className="lede">
              立即預約線上諮詢<br />協助您打造自己的商業版圖。
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
              <span className="k">LINE@</span>
              <span className="v"><a href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer">@dbn3379w</a></span>
            </div>
            <div className="contact-cta">
              <a className="btn btn-primary" href="mailto:contact@estiginto.com?subject=Project%20Brief%20%7C%20ESTIGINTO">
                <span>寄信給我們</span>
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

function Footer() {
  return (
    <footer className="page-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-wordmark">ESTIGINTO</p>
            <p>造物者科技<br />統一編號: 42752468</p>
          </div>
          <nav className="footer-links" aria-label="頁尾網站導覽">
            <h5>Explore</h5>
            <a href="/about.html">關於我們</a>
            <a href="/case.html">參考案例</a>
            <a href="/faq.html">常見問題</a>
            <a href="/contact.html">聯繫我們</a>
          </nav>
          <div className="footer-links">
            <h5>Contact</h5>
            <a href="mailto:contact@estiginto.com">contact@estiginto.com</a>
            <a href="tel:+886224315362">+886 2 2431 5362</a>
            <a href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer">LINE@ 官方帳號</a>
            <a href="https://www.facebook.com/Estiginto/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2012 – 2026 ESTIGINTO Co., Ltd.</span>
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
        <h1 id="construction-title">網站內容更新中 敬請期待</h1>
        <div className="construction-meta">
          <span>+886 2 2431 5362</span>
          <span>contact@estiginto.com</span>
        </div>
      </div>
    </main>
  );
}

function FontSizeControls({ onIncrease, onDecrease, onReset, canIncrease, canDecrease, isDefault }) {
  return (
    <div className="menu-font-controls" aria-label="字體大小">
      <button
        className="menu-font-button"
        type="button"
        aria-label="放大字體"
        title="放大字體"
        onClick={onIncrease}
        disabled={!canIncrease}
      >
        <span aria-hidden="true">A+</span>
      </button>
      <button
        className="menu-font-button"
        type="button"
        aria-label="標準字體"
        title="標準字體"
        onClick={onReset}
        disabled={isDefault}
      >
        <span aria-hidden="true">A</span>
      </button>
      <button
        className="menu-font-button"
        type="button"
        aria-label="縮小字體"
        title="縮小字體"
        onClick={onDecrease}
        disabled={!canDecrease}
      >
        <span aria-hidden="true">A-</span>
      </button>
    </div>
  );
}

function MobileNav({ locale, fontControls }) {
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
        <FontSizeControls {...fontControls} />
      </div>
    </div>
  );
}

function DesktopCursorMenu({ locale, fontControls }) {
  const items = getMenuItems(locale);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveringTrigger, setHoveringTrigger] = useState(false);
  const [position, setPosition] = useState({ x: 160, y: 160 });
  const hideTimerRef = useRef(null);

  useEffect(() => {
    const clearHideTimer = () => {
      window.clearTimeout(hideTimerRef.current);
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
      if (open || hoveringTrigger) {
        return;
      }

      const next = { x: event.clientX + 48, y: event.clientY + 48 };

      if (!visible) {
        setPosition(next);
        setVisible(true);
      }

      scheduleHide();
    };

    const onLeave = () => {
      clearHideTimer();
      if (open) {
        return;
      }
      setVisible(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      clearHideTimer();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [hoveringTrigger, open, visible]);

  useEffect(() => {
    if (!hoveringTrigger || open) {
      return undefined;
    }

    window.clearTimeout(hideTimerRef.current);
    setVisible(true);

    return undefined;
  }, [hoveringTrigger, open]);

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
      <FontSizeControls {...fontControls} />
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
  const [fontScale, setFontScale] = useState(() => {
    if (typeof window === "undefined") {
      return 100;
    }

    const savedScale = Number(window.localStorage.getItem("estiginto-font-scale"));
    return fontScaleOptions.includes(savedScale) ? savedScale : 100;
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
  const isCasePage = initialSection === "case";
  const shouldShowConstructionScreen = isCasePage && (!isLocalPreview || showConstructionPreview);
  const shouldShowApplicationScenarios = initialSection === "case" || initialSection === "solutions";
  const currentFontScaleIndex = fontScaleOptions.indexOf(fontScale);
  const fontControls = {
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
    if (shouldShowConstructionScreen) {
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
  }, [shouldShowConstructionScreen]);

  if (shouldShowConstructionScreen) {
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
      {isLocalPreview && isCasePage ? (
        <button className="preview-toggle" type="button" onClick={() => setShowConstructionPreview(true)}>
          預覽建置中畫面
        </button>
      ) : null}
      <Header locale={locale} onToggleLocale={setLocale} />
      {shouldUseMobileNav ? <MobileNav locale={locale} fontControls={fontControls} /> : <DesktopCursorMenu locale={locale} fontControls={fontControls} />}
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
            <AILab />
            {isLocalPreview ? <Insights /> : null}
            {initialSection === "solutions" ? <Solutions /> : null}
            {initialSection === "case" ? <CaseStudy /> : null}
            {initialSection === "case" ? <Solutions /> : null}
            {initialSection === "about" ? <TechStack /> : null}
            <Contact />
          </>
        )}
      </main>
      {isFAQPage ? null : <Footer />}
      <GoToTop />
    </>
  );
}
