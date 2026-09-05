export const supportedLocales = ["zh", "en", "ja"];

export const aboutIntroductionsByLocale = {
  zh: [
    "團隊早期由國家軟體競賽代表選手組成。",
    "服務對象涵蓋政府單位、國際及涉外組織、金融投資機構、家族辦公室，以及有跨境營運需求的企業主。",
    "服務範圍涵蓋企業資訊架構、營運系統、資料治理、資訊安全、AI 導入與風險治理，協助企業整合數位營運所需的系統與能力。",
    "提升決策與執行效率，建立能支援長期成長與國際布局的數位能力。",
  ],
  en: [
    "Our team was initially formed by national software competition representatives.",
    "We serve government agencies, international and foreign-affairs organizations, financial investment institutions, family offices, and business owners with cross-border operating needs.",
    "Our work spans enterprise information architecture, operational systems, data governance, information security, AI adoption, and risk governance, integrating the systems and capabilities companies need to operate digitally.",
    "We improve decision-making and execution while building digital capabilities that support long-term growth and international expansion.",
  ],
  ja: [
    "チームは、ソフトウェア全国大会の代表選手を中心に発足しました。",
    "政府機関、国際・渉外組織、金融投資機関、ファミリーオフィス、そして国境を越えた事業運営を必要とする経営者を支援しています。",
    "企業情報アーキテクチャ、業務システム、データガバナンス、情報セキュリティから、AI導入、リスクガバナンスまで、企業のデジタル運営に必要なシステムと能力を統合します。",
    "意思決定と実行の効率を高め、長期的な成長と国際展開を支えるデジタル能力を構築します。",
  ],
};

export const companyStatsByLocale = {
  zh: [
    { id: "longevity", label: "長期運作", keyLabel: "Longevity", value: "12", suffix: " 年", description: "最久的系統已持續穩定運作 12 年。" },
    { id: "deliveries", label: "交付成果", keyLabel: "Delivered", value: "325", suffix: "+", description: "已完成的系統、設計與整合服務成果。" },
  ],
  en: [
    { id: "longevity", label: "Long-term operation", keyLabel: "Longevity", value: "12", suffix: " yrs", description: "Our longest-running system has remained in operation for 12 years." },
    { id: "deliveries", label: "Delivered outcomes", keyLabel: "Delivered", value: "325", suffix: "+", description: "Systems, design deliverables, and integrated solutions delivered." },
  ],
  ja: [
    { id: "longevity", label: "長期運用", keyLabel: "Longevity", value: "12", suffix: " 年", description: "最も長く稼働しているシステムは、12年間にわたり運用されています。" },
    { id: "deliveries", label: "納品実績", keyLabel: "Delivered", value: "325", suffix: "+", description: "システム、デザイン制作物、総合ソリューションなどを納品しています。" },
  ],
};

const serviceImages = {
  website: "/img/plan/laptop-coworking-space_53876-14515.webp",
  systems: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.webp",
  design: "/img/plan/close-up-elegant-decoration-house.webp",
  marketing: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.webp",
};

export const serviceFamiliesByLocale = {
  zh: [
    { id: "website-design", number: "01", eyebrow: "Website Design", title: "網站設計", summary: "從品牌官網、線上預約到電子商務，依品牌規範與服務流程規劃網站，兼顧內容呈現、操作體驗與日常管理。", capabilities: ["品牌／商務官方網站", "電子商務與線上預約", "靜態與動態網站", "第三方服務串接", "高負載流量規劃"], image: serviceImages.website, meta: "WEB / 2026" },
    { id: "custom-systems", number: "02", eyebrow: "Custom Systems", title: "客製化系統開發", summary: "以企業流程與資料需求為基礎，整合部門作業、管理權限與資訊交換，建置可持續維運的業務系統。", capabilities: ["ERP／CRM／POS", "HRM／WMS／SCM", "BDM 業務開發管理", "線上管理系統", "桌面應用與行動 APP"], image: serviceImages.systems, meta: "SYSTEM / 2026" },
    { id: "graphic-design", number: "03", eyebrow: "Graphic Design", title: "平面與品牌設計", summary: "建立品牌識別與視覺規範，延伸至數位介面、商務簡報、行銷素材及實體接觸點，維持品牌表現的一致性。", capabilities: ["Logo 與企業識別", "名片／信封／信紙", "型錄與 DM", "社群與廣告素材", "簡報與展場視覺"], image: serviceImages.design, meta: "DESIGN / 2026" },
    { id: "marketing-ads", number: "04", eyebrow: "Marketing & Ads", title: "行銷與廣告投放", summary: "依市場定位與溝通目標，規劃內容、搜尋曝光與媒體投放，協調各通路的品牌訊息與推廣節奏。", capabilities: ["社群與內容行銷", "SEO 與 KOL 合作", "Google／Meta 廣告", "YouTube／LINE／TikTok 廣告", "電商平台與品牌顧問"], image: serviceImages.marketing, meta: "GROWTH / 2026" },
  ],
  en: [
    { id: "website-design", number: "01", eyebrow: "Website Design", title: "Website Design", summary: "Brand websites, online booking, and e-commerce planned around brand standards and service workflows, with attention to content, usability, and day-to-day management.", capabilities: ["Brand and corporate websites", "E-commerce and online booking", "Static and dynamic websites", "Third-party integrations", "High-traffic architecture"], image: serviceImages.website, meta: "WEB / 2026" },
    { id: "custom-systems", number: "02", eyebrow: "Custom Systems", title: "Custom System Development", summary: "Business systems that connect departmental workflows, access controls, and information exchange, designed around operating requirements and ongoing maintenance.", capabilities: ["ERP / CRM / POS", "HRM / WMS / SCM", "BDM sales development", "Online management systems", "Desktop and mobile apps"], image: serviceImages.systems, meta: "SYSTEM / 2026" },
    { id: "graphic-design", number: "03", eyebrow: "Graphic Design", title: "Brand & Graphic Design", summary: "Brand identity and visual standards applied consistently across digital interfaces, presentations, marketing materials, and physical touchpoints.", capabilities: ["Logo and identity", "Business stationery", "Catalogs and direct mail", "Social and advertising assets", "Presentations and event graphics"], image: serviceImages.design, meta: "DESIGN / 2026" },
    { id: "marketing-ads", number: "04", eyebrow: "Marketing & Ads", title: "Marketing & Advertising", summary: "Content, search visibility, and media campaigns planned around market positioning, with coordinated brand messaging across channels.", capabilities: ["Social and content marketing", "SEO and KOL partnerships", "Google and Meta advertising", "YouTube, LINE, and TikTok ads", "Marketplace and brand consulting"], image: serviceImages.marketing, meta: "GROWTH / 2026" },
  ],
  ja: [
    { id: "website-design", number: "01", eyebrow: "Website Design", title: "Webサイト制作", summary: "ブランド基準とサービスの流れに沿って、公式サイト、オンライン予約、ECを設計します。コンテンツの表現、操作性、日々の管理を考慮します。", capabilities: ["ブランド／コーポレートサイト", "EC／オンライン予約", "静的／動的Webサイト", "外部サービス連携", "高トラフィック対応"], image: serviceImages.website, meta: "WEB / 2026" },
    { id: "custom-systems", number: "02", eyebrow: "Custom Systems", title: "業務システム開発", summary: "企業の業務とデータ要件に基づき、部門間の作業、権限、情報交換を統合し、継続的に運用できる業務システムを構築します。", capabilities: ["ERP／CRM／POS", "HRM／WMS／SCM", "BDM 営業開発管理", "オンライン管理システム", "デスクトップ／モバイルアプリ"], image: serviceImages.systems, meta: "SYSTEM / 2026" },
    { id: "graphic-design", number: "03", eyebrow: "Graphic Design", title: "ブランド／グラフィックデザイン", summary: "ブランド識別とビジュアル基準を整え、デジタル画面、営業資料、販促素材、実際の接点まで一貫した表現を展開します。", capabilities: ["ロゴ／VI", "名刺／封筒／レターヘッド", "カタログ／DM", "SNS／広告クリエイティブ", "プレゼン／イベント装飾"], image: serviceImages.design, meta: "DESIGN / 2026" },
    { id: "marketing-ads", number: "04", eyebrow: "Marketing & Ads", title: "マーケティング／広告運用", summary: "市場での位置づけと発信の目的に沿って、コンテンツ、検索での露出、広告を計画し、各チャネルのメッセージと展開時期を調整します。", capabilities: ["SNS／コンテンツマーケティング", "SEO／KOL連携", "Google／Meta 広告", "YouTube／LINE／TikTok 広告", "ECモール／ブランドコンサルティング"], image: serviceImages.marketing, meta: "GROWTH / 2026" },
  ],
};

const allCaseStudiesByLocale = {
  zh: [
    { id: "elevator-operations", number: "01", industry: "知名電梯製造商", title: "電梯總管系統", summary: "串接維修派工、設備狀態與跨區營運資訊，讓管理團隊即時掌握服務現場。", capabilities: ["自動化維修保養派工", "可視化管理", "行事曆與地圖", "物聯網電梯管理", "儀表板戰情室", "台灣／日本／中國多國運作"] },
    { id: "senior-care-iot", number: "02", industry: "大型安養中心", title: "安養物聯監控系統", summary: "整合全棟設備、健康監測與行政管理，建立安全且可持續運作的照護環境。", capabilities: ["全棟電氣設備聯網控制", "血氧與心率監控", "智慧電表／煙霧／瓦斯／香氛", "人員與物資採購管理", "資安防護", "UPS 備援"] },
    { id: "pharma-management", number: "03", industry: "全球知名藥廠", title: "醫藥管理系統", summary: "支援跨國醫療關係、供應商與文件簽署流程，兼顧資安與高流量使用情境。", capabilities: ["全球醫師管理", "全球診所管理", "全球供應商管理", "線上簽署機制", "同意書與協議簽署", "資安與高流量負載"] },
    { id: "shipping-warehouse", number: "04", industry: "煉油廠下游氣體廠商", title: "倉管航運管理系統", summary: "整合儲量偵測、船運通知與指派流程，支援倉儲與航運管理。", capabilities: ["儀表板戰情室", "自動化船運通知", "物聯網儲量偵測", "儲量報表管理", "自動化儲量指派"] },
    { id: "art-collection", number: "05", industry: "古董藝術拍賣", title: "藝術藏品系統", summary: "從數位典藏、憑證到拍賣與行銷，建立藝術資產的完整線上服務。", capabilities: ["3D 數位典藏", "虛擬證券化發行", "線上拍賣機制", "線上憑證簽章", "視覺設計", "行銷統包"] },
    { id: "fresh-food-omnichannel", number: "06", industry: "知名生鮮通路", title: "全台生鮮通路系統", summary: "整合電商、冷鏈、配送與企業管理，支援全台通路及大量會員使用。", capabilities: ["電子商務與冷鏈倉儲", "當日即時配送", "經營報表與百人企業管理", "線上線下整合", "倉儲管理", "八萬會員負載平衡"] },
    { id: "government-administration", number: "07", industry: "政府部門", title: "行政管理系統", summary: "以單一登入與內網資安架構承載全台教育、預算與大規模資料管理。", capabilities: ["單一登入 SSO", "全台教育資訊管理", "百萬人數據管理", "預算經費管理", "高度資安管理", "內網運作"] },
    { id: "yacht-event-management", number: "08", industry: "遊艇活動服務", title: "活動管理系統", summary: "整合高端交通、場地、報價、保險與預約，支援活動服務的完整成交流程。", capabilities: ["遊艇／飛機／會館空間管理", "線上報價單", "訂單管理", "自動化產險流程", "活動預約", "視覺設計與行銷統包"] },
    { id: "production-quality", number: "09", industry: "上市供應鏈設備廠", title: "產線履歷品管系統", summary: "以雙平台行動應用記錄品管、產品與產線影像，支援內網安全作業。", capabilities: ["iOS／Android APP", "品管驗收管理", "QR 作業", "產品管理", "產線照片管理", "高度資安與內網"] },
    { id: "manufacturing-management", number: "10", industry: "供應鏈製造業", title: "生產管理系統", summary: "整合物料、工單、組裝與成本管理，提供缺料及流程異常預警。", capabilities: ["物料管理", "半成品與產品管理", "自動化工單", "自動化組裝流程", "自動化成本計算", "缺料自動預警"] },
    { id: "travel-discovery", number: "11", industry: "旅遊社群服務", title: "旅遊地點應用", summary: "以地點與旅程為核心，結合社群互動及廣告版位的行動服務。", capabilities: ["旅遊地點管理", "地點設備管理", "旅行軌跡", "社群互動", "廣告收入管理", "版位管理"] },
    { id: "location-broadcast", number: "12", industry: "實境遊戲與通訊服務", title: "內部廣播通訊應用", summary: "依位置、範圍與頻率傳遞指定訊息，支援通知、信標與實境互動。", capabilities: ["範圍內訊息接收", "廣播範圍設定", "廣播頻率設定", "手機通知", "信標應用", "實境遊戲應用"] },
    { id: "event-booking-commerce", number: "13", industry: "電子商務與活動服務", title: "活動預約網站", summary: "把會員、預約、付款與通知整合成可自動運作的活動商務流程。", capabilities: ["活動預約", "會員管理", "線上結帳", "發票串接", "簡訊串接", "會費通知與繳費單生成"] },
    { id: "consumer-brand-site", number: "14", industry: "知名手機配件品牌", title: "品牌形象官網", summary: "以互動選色與完整購物機制，讓品牌體驗從視覺延伸到線上成交。", capabilities: ["線上選色互動搭配", "品牌形象", "視覺設計", "線上結帳", "優惠折扣機制"] },
  ],
  en: [
    { id: "elevator-operations", number: "01", industry: "Leading elevator manufacturer", title: "Elevator Operations Platform", summary: "Connects maintenance dispatch, equipment status, and regional operations so teams can see field service in real time.", capabilities: ["Automated maintenance dispatch", "Visual operations management", "Calendar and maps", "IoT elevator monitoring", "Operations dashboard", "Taiwan, Japan, and China operations"] },
    { id: "senior-care-iot", number: "02", industry: "Large senior care center", title: "Senior Care IoT Monitoring", summary: "Unifies building equipment, health monitoring, and administration for a safer, resilient care environment.", capabilities: ["Connected electrical control", "Blood oxygen and heart-rate monitoring", "Power, smoke, gas, and aroma sensors", "Personnel and procurement management", "Cybersecurity protection", "UPS backup"] },
    { id: "pharma-management", number: "03", industry: "Global pharmaceutical company", title: "Pharmaceutical Management Platform", summary: "Supports international medical relationships, suppliers, and document signing with security and high-load readiness.", capabilities: ["Global physician management", "Global clinic management", "Global supplier management", "Electronic signing", "Consent and agreement workflows", "Security and high-load operation"] },
    { id: "shipping-warehouse", number: "04", industry: "Downstream industrial gas supplier", title: "Shipping & Warehouse Management", summary: "Combines inventory sensing, shipping notifications, and allocation in one operational view.", capabilities: ["Operations dashboard", "Automated shipping notices", "IoT inventory sensing", "Inventory reporting", "Automated allocation"] },
    { id: "art-collection", number: "05", industry: "Antique and art auction", title: "Art Collection Platform", summary: "A connected digital service spanning archives, certificates, auctions, visual design, and marketing.", capabilities: ["3D digital archive", "Virtual securitization issuance", "Online auctions", "Digital certificate signing", "Visual design", "Integrated marketing"] },
    { id: "fresh-food-omnichannel", number: "06", industry: "Leading fresh-food retailer", title: "Nationwide Fresh-Food Platform", summary: "Unifies commerce, cold chain, delivery, and enterprise operations for nationwide channels and a large member base.", capabilities: ["E-commerce and cold-chain warehousing", "Same-day delivery", "Business reporting and large-team operations", "Online/offline integration", "Warehouse management", "Load balancing for 80,000 members"] },
    { id: "government-administration", number: "07", industry: "Government department", title: "Administrative Management System", summary: "Uses SSO and secure intranet architecture for nationwide education, budgets, and million-record-scale data.", capabilities: ["Single sign-on (SSO)", "Nationwide education information", "Million-record-scale data management", "Budget management", "High-security controls", "Intranet operation"] },
    { id: "yacht-event-management", number: "08", industry: "Yacht and premium event service", title: "Event Management Platform", summary: "Connects premium transport, venues, quotations, insurance, and booking into one service journey.", capabilities: ["Yacht, aircraft, and venue management", "Online quotations", "Order management", "Automated insurance workflow", "Event booking", "Visual design and integrated marketing"] },
    { id: "production-quality", number: "09", industry: "Listed supply-chain equipment company", title: "Production Traceability & Quality", summary: "A dual-platform mobile workflow for quality, products, and production imagery within a secure intranet.", capabilities: ["iOS and Android apps", "Quality acceptance", "QR workflows", "Product management", "Production photo records", "High-security intranet operation"] },
    { id: "manufacturing-management", number: "10", industry: "Supply-chain manufacturing", title: "Manufacturing Management System", summary: "Connects materials, work orders, assembly, and costing so shortages and process issues surface earlier.", capabilities: ["Material management", "Work-in-progress and finished goods", "Automated work orders", "Automated assembly workflow", "Automated cost calculation", "Shortage alerts"] },
    { id: "travel-discovery", number: "11", industry: "Travel community service", title: "Travel Discovery App", summary: "A location- and journey-led mobile service with social interaction and advertising inventory.", capabilities: ["Destination management", "Location facility management", "Travel trails", "Social interaction", "Advertising revenue management", "Placement management"] },
    { id: "location-broadcast", number: "12", industry: "Location-based games and communications", title: "Internal Broadcast App", summary: "Delivers targeted messages by location, range, and frequency with notifications, beacons, and real-world interaction.", capabilities: ["In-range message reception", "Broadcast range controls", "Broadcast frequency controls", "Mobile notifications", "Beacon integration", "Location-based game use"] },
    { id: "event-booking-commerce", number: "13", industry: "Event commerce service", title: "Event Booking Website", summary: "Combines membership, booking, payment, and notifications into an automated event commerce flow.", capabilities: ["Event booking", "Membership management", "Online checkout", "Invoice integration", "SMS integration", "Fee notices and payment-slip generation"] },
    { id: "consumer-brand-site", number: "14", industry: "Leading mobile-accessory brand", title: "Brand & Commerce Website", summary: "Extends the brand experience into conversion through interactive color matching and a complete shopping flow.", capabilities: ["Interactive color matching", "Brand presentation", "Visual design", "Online checkout", "Promotion and discount rules"] },
  ],
  ja: [
    { id: "elevator-operations", number: "01", industry: "大手エレベーターメーカー", title: "エレベーター統合管理システム", summary: "保守派遣、設備状態、地域別運用を連携し、現場サービスをリアルタイムで可視化します。", capabilities: ["保守点検の自動派遣", "運用の可視化", "カレンダー／地図", "IoTエレベーター管理", "ダッシュボード", "台湾／日本／中国での運用"] },
    { id: "senior-care-iot", number: "02", industry: "大規模介護施設", title: "介護施設IoT監視システム", summary: "館内設備、健康モニタリング、管理業務を統合し、安全で継続的な介護環境を支えます。", capabilities: ["館内電気設備の連携制御", "血中酸素／心拍数モニタリング", "電力／煙／ガス／香りセンサー", "人員／物資調達管理", "サイバーセキュリティ", "UPSバックアップ"] },
    { id: "pharma-management", number: "03", industry: "世界的な製薬会社", title: "医薬管理システム", summary: "各国の医療関係者、サプライヤー、電子署名を、安全性と高負荷対応を両立して管理します。", capabilities: ["各国の医師管理", "各国のクリニック管理", "グローバルサプライヤー管理", "電子署名", "同意書／契約書ワークフロー", "セキュリティ／高負荷対応"] },
    { id: "shipping-warehouse", number: "04", industry: "製油所下流の産業ガス事業者", title: "倉庫・海運管理システム", summary: "在庫量の検知、船便通知、自動割り当てを一つの運用画面に統合します。", capabilities: ["運用ダッシュボード", "船便の自動通知", "IoT在庫量検知", "在庫量レポート", "在庫の自動割り当て"] },
    { id: "art-collection", number: "05", industry: "骨董・美術品オークション", title: "美術品コレクションシステム", summary: "デジタルアーカイブ、証明書、オークション、デザイン、マーケティングを一体化したサービスです。", capabilities: ["3Dデジタルアーカイブ", "仮想証券化発行", "オンラインオークション", "オンライン証明書署名", "ビジュアルデザイン", "統合マーケティング"] },
    { id: "fresh-food-omnichannel", number: "06", industry: "大手生鮮食品流通企業", title: "全国生鮮流通システム", summary: "EC、コールドチェーン、当日配送、企業運営を統合し、全国の販売網と大規模会員基盤を支えます。", capabilities: ["EC／コールドチェーン倉庫", "当日配送", "経営レポート／大規模組織管理", "オンライン／オフライン統合", "倉庫管理", "8万人会員の負荷分散"] },
    { id: "government-administration", number: "07", industry: "政府機関", title: "行政管理システム", summary: "SSOとセキュアな庁内ネットワークで、全国の教育情報、予算、大規模データを管理します。", capabilities: ["シングルサインオン（SSO）", "全国教育情報管理", "100万人規模のデータ管理", "予算／経費管理", "高度なセキュリティ", "庁内ネットワーク運用"] },
    { id: "yacht-event-management", number: "08", industry: "ヨット／プレミアムイベント事業", title: "イベント管理システム", summary: "ヨット、航空機、会場、見積、保険、予約をつなぎ、サービス提供から成約までを管理します。", capabilities: ["ヨット／航空機／会場管理", "オンライン見積書", "注文管理", "保険手続きの自動化", "イベント予約", "デザイン／統合マーケティング"] },
    { id: "production-quality", number: "09", industry: "上場サプライチェーン設備企業", title: "生産履歴・品質管理システム", summary: "iOS／Androidアプリで品質検収、製品、生産写真を記録し、安全な社内運用を実現します。", capabilities: ["iOS／Androidアプリ", "品質検収管理", "QR作業", "製品管理", "生産写真管理", "高セキュリティ／社内ネットワーク"] },
    { id: "manufacturing-management", number: "10", industry: "サプライチェーン製造業", title: "生産管理システム", summary: "材料、製造指示、組立、原価を連携し、欠品や工程上の問題を早期に把握します。", capabilities: ["材料管理", "仕掛品／製品管理", "製造指示の自動化", "組立工程の自動化", "原価計算の自動化", "欠品アラート"] },
    { id: "travel-discovery", number: "11", industry: "旅行コミュニティサービス", title: "旅行スポットアプリ", summary: "スポットと旅程を軸に、コミュニティ機能と広告枠管理を備えたモバイルサービスです。", capabilities: ["旅行スポット管理", "施設情報管理", "旅行軌跡", "コミュニティ交流", "広告収益管理", "広告枠管理"] },
    { id: "location-broadcast", number: "12", industry: "位置情報ゲーム／通信サービス", title: "内部ブロードキャストアプリ", summary: "位置、範囲、頻度に応じて指定メッセージを配信し、通知、ビーコン、リアル体験に対応します。", capabilities: ["範囲内メッセージ受信", "配信範囲設定", "配信頻度設定", "モバイル通知", "ビーコン連携", "位置情報ゲーム活用"] },
    { id: "event-booking-commerce", number: "13", industry: "イベントECサービス", title: "イベント予約サイト", summary: "会員、予約、決済、通知を統合し、イベント販売業務を自動化します。", capabilities: ["イベント予約", "会員管理", "オンライン決済", "請求書連携", "SMS連携", "会費通知／払込票生成"] },
    { id: "consumer-brand-site", number: "14", industry: "大手スマートフォンアクセサリーブランド", title: "ブランド・ECサイト", summary: "インタラクティブなカラー提案と購買機能で、ブランド体験をオンライン成約へつなげます。", capabilities: ["オンラインカラーシミュレーション", "ブランド表現", "ビジュアルデザイン", "オンライン決済", "割引／キャンペーン設定"] },
  ],
};

const teamIdentities = [
  {
    id: "lanar-lan",
    name: "Lanar Lan",
    mark: "LL",
    group: "leadership",
    portrait: "/img/team/avatar_lanar.jpg",
    portraitFrame: { scale: 1.85, x: 50, y: 0, offsetY: -18 },
  },
  {
    id: "yu-liang-chen",
    name: "Yu-Liang Chen",
    mark: "YLC",
    group: "leadership",
    portrait: "/img/team/avatar_YuLiang.webp",
    portraitFrame: { scale: 3, x: 50, y: 0, offsetY: -7 },
  },
  {
    id: "cindy-wu",
    name: "Cindy Wu",
    mark: "CW",
    group: "leadership",
    portrait: "/img/team/avatar_Cindy.jpg",
    linkedin: "https://www.linkedin.com/in/cindy-wu-b3b1b89/",
    portraitFrame: { scale: 1.22, x: 50, y: 0, offsetY: 0 },
  },
  {
    id: "nicole-chien",
    name: "Nicole Chien",
    mark: "NC",
    group: "leadership",
    portrait: "/img/team/avatar_Nicole.webp",
    portraitFrame: { scale: 3, x: 50, y: 0, offsetY: -11 },
  },
  {
    id: "yen-chen",
    name: "Yen Chen",
    mark: "YC",
    group: "advisory",
    portrait: "/img/team/avatar_Yen.jpg",
    portraitFrame: { scale: 1, x: 50, y: 0, offsetY: -1.5 },
  },
  {
    id: "wayne-schutte",
    name: "Wayne Schutte",
    mark: "WS",
    group: "advisory",
    portrait: "/img/team/avatar_wayne.png",
    portraitFrame: { scale: 1, x: 50, y: 0, offsetY: -5 },
  },
  {
    id: "michael-mlejnek",
    hidden: true,
    name: "Michael Mlejnek",
    mark: "MM",
    group: "advisory",
    portrait: "/img/team/avatar_Michael.webp",
    portraitFrame: { scale: 2.8, x: 50, y: 0, offsetY: -2.5 },
  },
];

export const teamSectionCopyByLocale = {
  zh: {
    eyebrow: "領導與顧問團隊",
    meta: "Our Team",
    groupLabels: { leadership: "領導團隊", advisory: "顧問團隊" },
  },
  en: {
    eyebrow: "Leadership & Advisory",
    meta: "Our Team",
    groupLabels: { leadership: "Leadership", advisory: "Advisory" },
  },
  ja: {
    eyebrow: "リーダーシップ＆アドバイザリー",
    meta: "Our Team",
    groupLabels: { leadership: "リーダーシップ", advisory: "アドバイザリー" },
  },
};

const teamDetailsByLocale = {
  zh: [
    { role: "執行長（CEO）", summary: "20 年以上系統開發與企業數位轉型經驗。\n擅長將複雜工作轉化為可長期執行的策略與架構。" },
    { role: "技術長（CTO）", summary: "20 年以上系統架構及整合經驗。\n擅長大型系統維運及資訊安全。" },
    { role: "行銷長（CMO）", summary: "30 年以上跨文化溝通、國際行銷與組織領導背景，長期深耕品牌策略、國際市場拓展及跨領域資源整合。\n橫跨企業顧問、國際教育、文化外交與房地產等領域，擅長以全球視野整合品牌、行銷與國際合作策略，致力於打造具國際影響力與市場價值的品牌。" },
    { role: "國際專案經理", summary: "15 年以上跨領域資歷，熟悉軟體工程、市場行銷、國際商務與組織協調實務經驗，擅長跨文化溝通、台美文化及商務合作專案推進。" },
    { role: "國際商務與行銷發展總監", summary: "具備橫跨歐洲、亞洲與美國的品牌策略、包裝設計及國際行銷經驗。" },
    { role: "國際教育與課程顧問", summary: "擁有 25 年教學經驗，專注跨文化學習、教育創新與體驗式課程。" },
    { role: "法律顧問", summary: "美國執業律師，擅長國際商務專業，橫跨美國、亞洲及拉丁美洲，兼具法律實務、跨境商務與國際市場經驗，擅長以法律與商業雙重視角處理跨國事務。" },
  ],
  en: [
    { role: "CEO", summary: "More than 20 years of experience in systems development and enterprise digital transformation.\nSpecializes in turning complex work into strategies and frameworks built for long-term execution." },
    { role: "CTO", summary: "More than 20 years of experience in systems architecture and integration.\nSpecializes in large-scale system operations and information security." },
    { role: "CMO", summary: "More than 30 years of experience in cross-cultural communication, international marketing, and organizational leadership, with extensive work in brand strategy, global market expansion, and cross-disciplinary resource integration.\nHer experience spans corporate consulting, international education, cultural diplomacy, and real estate. She brings a global perspective to brand, marketing, and international partnership strategies, building brands with international influence and market value." },
    { role: "Global Project Manager", summary: "More than 15 years of cross-disciplinary experience spanning software engineering, marketing, international business, and organizational coordination. She specializes in cross-cultural communication and advancing Taiwan–U.S. cultural and business collaboration projects." },
    { role: "Director of International Business & Marketing Development", summary: "Brings brand strategy, packaging design, and international marketing experience across Europe, Asia, and the United States." },
    { role: "International Education Coordinator & Curriculum Specialist", summary: "Brings 25 years of teaching experience to cross-cultural learning, education innovation, and experiential programs." },
    { role: "Legal Consultant", summary: "A practicing attorney in the United States with expertise in international business across the United States, Asia, and Latin America. Combining legal practice, cross-border business, and international market experience, he handles multinational matters through both legal and commercial perspectives." },
  ],
  ja: [
    { role: "最高経営責任者（CEO）", summary: "20年以上にわたるシステム開発および企業のデジタルトランスフォーメーション経験。\n複雑な業務を、長期的に実行可能な戦略と仕組みに転換することを得意とします。" },
    { role: "最高技術責任者（CTO）", summary: "20年以上にわたるシステムアーキテクチャおよび統合経験。\n大規模システムの運用保守と情報セキュリティを得意とします。" },
    { role: "最高マーケティング責任者（CMO）", summary: "30年以上にわたり、異文化コミュニケーション、国際マーケティング、組織リーダーシップに携わり、ブランド戦略、海外市場開拓、分野横断のリソース統合を推進してきました。\n企業コンサルティング、国際教育、文化外交、不動産など幅広い領域で培った経験を生かし、グローバルな視点からブランド、マーケティング、国際連携の戦略を統合し、国際的な影響力と市場価値を備えたブランドづくりに取り組んでいます。" },
    { role: "グローバルプロジェクトマネージャー", summary: "15年以上の分野横断的な経験を持ち、ソフトウェアエンジニアリング、マーケティング、国際ビジネス、組織調整の実務に精通しています。異文化コミュニケーションと台湾・米国間の文化・ビジネス協力プロジェクトの推進を得意とします。" },
    { role: "国際事業・マーケティング開発ディレクター", summary: "欧州、アジア、米国にまたがるブランド戦略、パッケージデザイン、国際マーケティングの経験を生かします。" },
    { role: "国際教育・カリキュラムアドバイザー", summary: "25年の指導経験を生かし、異文化学習、教育イノベーション、体験型プログラムを支援します。" },
    { role: "法律顧問", summary: "米国で実務に従事する弁護士。米国、アジア、ラテンアメリカにまたがる国際ビジネスを専門とし、法務実務、越境ビジネス、国際市場の経験を生かして、法務とビジネス双方の視点から国際案件に対応します。" },
  ],
};

export const teamMembersByLocale = Object.fromEntries(
  supportedLocales.map((locale) => [
    locale,
    teamIdentities.map((identity, index) => ({ ...identity, ...teamDetailsByLocale[locale][index] })),
  ]),
);

const hiddenCaseIds = new Set(["elevator-operations"]);

const caseOutcomesByLocale = {
  zh: {
    "elevator-operations": "維修派工與設備即時管理",
    "senior-care-iot": "全棟設備與照護資料整合",
    "pharma-management": "跨國醫療關係與簽署流程",
    "shipping-warehouse": "儲量、船運與指派同步",
    "art-collection": "數位典藏到交易服務",
    "fresh-food-omnichannel": "電商、冷鏈與配送整合",
    "government-administration": "高安全性大規模資料管理",
    "yacht-event-management": "報價、保險與預約串接",
    "production-quality": "行動驗收與生產履歷",
    "manufacturing-management": "物料、工單與成本串接",
    "travel-discovery": "地點探索與社群互動",
    "location-broadcast": "定位式訊息與實境互動",
    "event-booking-commerce": "會員、預約與支付自動化",
    "consumer-brand-site": "品牌體驗與購物轉換",
  },
  en: {
    "elevator-operations": "Real-time dispatch and equipment operations",
    "senior-care-iot": "Connected facilities and care data",
    "pharma-management": "Global medical relationships and approvals",
    "shipping-warehouse": "Inventory, shipping, and allocation in sync",
    "art-collection": "From digital archives to transactions",
    "fresh-food-omnichannel": "Commerce, cold chain, and delivery",
    "government-administration": "Secure large-scale data operations",
    "yacht-event-management": "Quotations, insurance, and booking",
    "production-quality": "Mobile inspection and production records",
    "manufacturing-management": "Materials, work orders, and costing",
    "travel-discovery": "Place discovery and community engagement",
    "location-broadcast": "Location-aware messaging and interaction",
    "event-booking-commerce": "Automated membership, booking, and payment",
    "consumer-brand-site": "Brand experience and shopping conversion",
  },
  ja: {
    "elevator-operations": "保守派遣と設備のリアルタイム管理",
    "senior-care-iot": "館内設備とケアデータの統合",
    "pharma-management": "グローバル医療関係者・署名業務",
    "shipping-warehouse": "在庫量・船便・割り当ての一元化",
    "art-collection": "デジタルアーカイブから取引まで",
    "fresh-food-omnichannel": "EC・コールドチェーン・配送の統合",
    "government-administration": "高セキュリティの大規模データ管理",
    "yacht-event-management": "見積・保険・予約の連携",
    "production-quality": "モバイル検収と生産履歴",
    "manufacturing-management": "材料・製造指示・原価の連携",
    "travel-discovery": "スポット探索とコミュニティ交流",
    "location-broadcast": "位置連動メッセージとリアル体験",
    "event-booking-commerce": "会員・予約・決済の自動化",
    "consumer-brand-site": "ブランド体験と購買導線",
  },
};

export const caseStudiesByLocale = Object.fromEntries(
  Object.entries(allCaseStudiesByLocale).map(([locale, caseStudies]) => [
    locale,
    caseStudies
      .filter(({ id }) => !hiddenCaseIds.has(id))
      .map(({ industry: _industry, ...caseStudy }, index) => ({
        ...caseStudy,
        outcome: caseOutcomesByLocale[locale][caseStudy.id],
        number: String(index + 1).padStart(2, "0"),
      })),
  ]),
);

const caseGroupKeywordsByLocale = {
  zh: {
    "operations-management": ["ERP", "WMS", "SCM", "SSO", "權限管理", "生產履歷", "成本管理", "數據儀表板"],
    "iot-visibility": ["IoT", "即時監控", "感測器整合", "派工管理", "設備管理", "戰情室", "Beacon"],
    "commerce-members": ["電子商務", "會員系統", "線上預約", "金流串接", "電子發票", "冷鏈物流", "CRM"],
    "brand-digital": ["品牌官網", "UI/UX", "行動應用", "數位典藏", "互動體驗", "社群功能", "數位產品"],
  },
  en: {
    "operations-management": ["ERP", "WMS", "SCM", "SSO", "Access Control", "Production Traceability", "Cost Management", "Data Dashboards"],
    "iot-visibility": ["IoT", "Real-time Monitoring", "Sensor Integration", "Dispatch Management", "Equipment Management", "Command Dashboard", "Beacon"],
    "commerce-members": ["E-commerce", "Membership Systems", "Online Booking", "Payment Integration", "E-invoicing", "Cold-chain Logistics", "CRM"],
    "brand-digital": ["Brand Websites", "UI/UX", "Mobile Apps", "Digital Archives", "Interactive Experiences", "Community Features", "Digital Products"],
  },
  ja: {
    "operations-management": ["ERP", "WMS", "SCM", "SSO", "権限管理", "生産履歴", "原価管理", "データダッシュボード"],
    "iot-visibility": ["IoT", "リアルタイム監視", "センサー連携", "作業指示管理", "設備管理", "統合ダッシュボード", "Beacon"],
    "commerce-members": ["ECサイト", "会員システム", "オンライン予約", "決済連携", "電子インボイス", "コールドチェーン物流", "CRM"],
    "brand-digital": ["ブランドサイト", "UI/UX", "モバイルアプリ", "デジタルアーカイブ", "インタラクティブ体験", "コミュニティ機能", "デジタルプロダクト"],
  },
};

export const caseStudyGroupsByLocale = {
  zh: [
    { id: "operations-management", number: "01", title: "營運整合與管理", summary: "整合人員權限、業務資料與作業流程，支援跨部門管理及資訊查詢。", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT 與即時監控", summary: "整合設備、感測資料與派工資訊，提供現場監控及營運管理所需的資訊。", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "電商與會員服務", summary: "串接會員、預約、付款、物流與通知，支援完整的線上交易及後續服務。", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "品牌體驗與數位創新", summary: "結合內容、互動與服務設計，將品牌識別延伸至數位產品及使用體驗。", caseIds: ["art-collection", "travel-discovery"] },
  ],
  en: [
    { id: "operations-management", number: "01", title: "Operations & Management", summary: "Bring people, data, permissions, and workflows into one operation teams can track and manage.", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT & Real-time Visibility", summary: "Connect equipment, sensor data, dispatch, and dashboards so teams can see what is happening and act sooner.", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "Commerce & Member Services", summary: "Connect membership, booking, payment, logistics, and notifications into services that complete transactions and support operations.", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "Brand Experience & Digital Products", summary: "Turn content, interaction, and service ideas into useful digital products that carry the brand forward.", caseIds: ["art-collection", "travel-discovery"] },
  ],
  ja: [
    { id: "operations-management", number: "01", title: "業務統合・管理", summary: "人、データ、権限、業務フローを一つに整理し、追跡・管理できる運用基盤を構築します。", caseIds: ["pharma-management", "government-administration", "production-quality", "manufacturing-management"] },
    { id: "iot-visibility", number: "02", title: "IoT・リアルタイム監視", summary: "設備、センサーデータ、派遣、ダッシュボードをつなぎ、現場の状況把握と迅速な対応を支えます。", caseIds: ["senior-care-iot", "shipping-warehouse", "location-broadcast"] },
    { id: "commerce-members", number: "03", title: "EC・会員サービス", summary: "会員、予約、決済、物流、通知をつなぎ、取引から運用まで続くオンラインサービスを設計します。", caseIds: ["fresh-food-omnichannel", "yacht-event-management", "event-booking-commerce", "consumer-brand-site"] },
    { id: "brand-digital", number: "04", title: "ブランド体験・デジタルプロダクト", summary: "コンテンツ、体験、サービスを使えるデジタルプロダクトへ落とし込み、ブランドの展開を支えます。", caseIds: ["art-collection", "travel-discovery"] },
  ],
};

for (const [locale, groups] of Object.entries(caseStudyGroupsByLocale)) {
  caseStudyGroupsByLocale[locale] = groups.map((group) => ({
    ...group,
    keywords: caseGroupKeywordsByLocale[locale][group.id],
  }));
}
