export const servicePlanningByLocale = {
  zh: {
    "systems-consulting": {
      intro: "讓系統規劃對應實際作業。從使用角色、資料流與既有工具釐清需求，訂出開發、串接與導入範圍，讓團隊能依據同一份規格協作。",
      fit: ["準備導入或汰換 ERP、CRM、WMS", "資料散落多套系統，需減少重複輸入", "需要釐清權限、驗收與維運責任"],
      steps: [
        { title: "盤點作業與需求", description: "訪談使用角色並檢視現有流程、工具及資料來源，標出重複作業與串接限制，確認系統要解決的問題。" },
        { title: "規劃建置範圍", description: "整理功能、資料欄位、權限和介接方式，排定開發與導入優先序，明確記錄待確認的技術條件。" },
        { title: "檢查並交接", description: "依約定情境檢查功能與資料流，整理驗收、部署、備份及操作文件，確認原始碼與後續維護的交接範圍。" },
      ],
      outputs: ["功能需求與使用角色清單", "系統架構及資料流向圖", "測試驗收與維運交接清單"],
    },
    "visual-design": {
      intro: "以品牌用途和使用情境界定視覺工作，整理識別、介面與行銷素材的共同規則。設計範圍、輸出規格及授權條件都能在製作前確認。",
      fit: ["品牌在不同接觸點呈現不一致", "網站或介面的資訊層級需要整理", "行銷與印刷素材缺少共用規範"],
      steps: [
        { title: "確認品牌與用途", description: "檢視現有識別、受眾與使用場景，確認需要製作的頁面、素材和尺寸，以及必須沿用的品牌資產。" },
        { title: "設計視覺應用", description: "建立色彩、字體、版型與元件方向，將核定的視覺規則應用到約定的數位或印刷項目。" },
        { title: "校對並交付", description: "檢查各尺寸、文字與輸出格式，整理可編輯檔和使用規範，確認字型、圖片及其他素材的授權條件。" },
      ],
      outputs: ["品牌與介面視覺方向", "約定頁面或素材的設計檔", "版型規範與檔案交接清單"],
    },
    "international-marketing": {
      intro: "依產品、客群與資源評估海外市場機會，安排多語內容、搜尋及廣告通路的角色。以可查核的洽詢與轉換指標檢視執行方向。",
      fit: ["評估進入哪些海外市場與客群", "多語內容已有基礎，需建立通路與洽詢路徑", "需要分清廣告預算、帳號權限和量測方式"],
      steps: [
        { title: "評估市場條件", description: "整理產品、目標客群、競爭條件與可投入資源，確認市場優先序及尚待查證的在地需求。" },
        { title: "規劃內容與通路", description: "設定多語內容主題、搜尋用語與網站路徑，分配廣告或其他通路的任務，明列翻譯和在地審核責任。" },
        { title: "量測並調整", description: "確認帳號、事件與報表設定，檢視洽詢和轉換資料，提出內容及通路調整建議，並記錄市場條件影響。" },
      ],
      outputs: ["目標市場與受眾評估表", "多語內容及通路執行計畫", "指標定義、追蹤設定與檢視報表"],
    },
    "international-finance": {
      intro: "將跨境資產、交易與家族安排所需資訊整理成可查核的決策基礎。法律、稅務、信託及金融議題由相關專業團隊依需求共同評估。",
      fit: ["跨國投資或交易需要整理條件與風險", "多地資產、持有關係及文件缺少統一紀錄", "傳承、信託或企業架構需要跨專業協作"],
      steps: [
        { title: "確認需求與資料", description: "界定資產、交易或傳承議題，彙整現有文件與合法可用資料，列出持有關係、資金及身分資訊的缺口。" },
        { title: "協同專業評估", description: "整理待決事項、交易條件與風險，依議題安排法律、稅務、信託或金融專業團隊的分工和查核。" },
        { title: "核對並交接", description: "將查核結果、未決問題與專業意見來源列清楚，交付決策資訊及後續執行順序；系統需求另列建置範圍。" },
      ],
      outputs: ["資產與持有關係清冊", "待查核事項及專業分工表", "交易風險與後續決策資訊清單"],
      groups: [
        { title: "資金、資產與背景查核", indices: [0, 1, 2] },
        { title: "跨境安排與交易評估", indices: [3, 4, 5, 6] },
        { title: "資產管理系統", indices: [7] },
      ],
    },
    "digital-integration": {
      intro: "讓網站、交易與內部作業使用一致的資料流。盤點既有平台和手動交接環節，界定串接、例外處理與上線後的操作責任。",
      fit: ["網站、金流、物流與內部系統彼此分離", "會員、預約或訂單資料需要人工搬移", "準備建立多語網站或電商並銜接日常營運"],
      steps: [
        { title: "盤點平台與流程", description: "確認網站功能、外部服務、資料欄位和作業負責人，辨識重複輸入、資料落差及平台介面限制。" },
        { title: "規劃建置與串接", description: "訂出網站、會員或交易功能的範圍，畫出資料交換、通知與異常處理方式，排定移轉和上線工作。" },
        { title: "測試並交接", description: "以實際作業情境檢查付款、通知與資料更新，記錄未通過項目，交付操作、異常處理及維護責任說明。" },
      ],
      outputs: ["網站功能與串接需求清單", "平台資料流及責任分工圖", "整合測試與操作交接文件"],
    },
  },
  en: {
    "systems-consulting": {
      intro: "Plan systems around actual workflows, users, and data. Define the development, integration, and rollout scope so every team works from the same requirements.",
      fit: ["Introducing or replacing an ERP, CRM, or WMS", "Reducing duplicate entry across disconnected systems", "Clarifying access, acceptance, and support responsibilities"],
      steps: [
        { title: "Review workflows", description: "Meet users and inspect current processes, tools, and data sources to identify repeated work, integration limits, and the problem to solve." },
        { title: "Define the build", description: "Specify features, fields, access roles, and interfaces; prioritize development and rollout while documenting open technical questions." },
        { title: "Verify and hand over", description: "Test agreed scenarios and data flows, then document acceptance, deployment, backups, operations, source-code delivery, and support scope." },
      ],
      outputs: ["Requirements and user-role inventory", "System architecture and data-flow map", "Acceptance and support handover checklist"],
    },
    "visual-design": {
      intro: "Define visual work by brand needs and use cases. Establish shared rules for identity, interfaces, and campaign assets, with output specifications and licensing agreed in scope.",
      fit: ["Inconsistent branding across touchpoints", "Website or interface hierarchy needs work", "Campaign and print assets lack shared rules"],
      steps: [
        { title: "Confirm uses and assets", description: "Review the existing identity, audience, and use cases; agree on pages, assets, sizes, and brand elements that must be retained." },
        { title: "Design applications", description: "Set color, typography, layout, and component direction, then apply approved rules to the agreed digital or print materials." },
        { title: "Check and deliver", description: "Review sizes, copy, and exports; prepare editable files and usage guidance, and confirm font, image, and other asset licenses." },
      ],
      outputs: ["Brand and interface visual direction", "Design files for agreed pages or assets", "Layout guidelines and file handover list"],
    },
    "international-marketing": {
      intro: "Assess overseas opportunities against the product, audience, and available resources. Give multilingual content, search, and advertising clear roles and review verifiable inquiry and conversion measures.",
      fit: ["Choosing target markets and audiences", "Connecting multilingual content to channels and inquiries", "Defining media budgets, account access, and measurement"],
      steps: [
        { title: "Assess market conditions", description: "Review the product, audience, competition, and available resources; set market priorities and flag local assumptions that need validation." },
        { title: "Plan content and channels", description: "Define multilingual topics, search terms, and site paths; assign channel roles and translation and local-review responsibilities." },
        { title: "Measure and refine", description: "Confirm account, event, and reporting setups; review inquiry and conversion data and recommend changes with market conditions in view." },
      ],
      outputs: ["Target-market and audience assessment", "Multilingual content and channel plan", "Metric definitions, tracking setup, and review report"],
    },
    "international-finance": {
      intro: "Organize cross-border assets, transactions, and family arrangements into verifiable decision information. Relevant legal, tax, trust, and financial professionals assess their respective matters together as needed.",
      fit: ["Reviewing cross-border investments or transaction risks", "Consolidating assets, ownership, and documents across locations", "Coordinating succession, trusts, or corporate structures"],
      steps: [
        { title: "Confirm needs and records", description: "Define the asset, transaction, or succession questions; gather available lawful records and identify gaps in ownership, funding, and identity information." },
        { title: "Coordinate assessment", description: "List decisions, terms, and risks, and assign checks to relevant legal, tax, trust, or financial professionals according to the issue." },
        { title: "Review and hand over", description: "Record findings, open questions, and professional sources; deliver decision information and next actions, with any system build scoped separately." },
      ],
      outputs: ["Asset inventory and ownership map", "Verification items and professional responsibility matrix", "Transaction risks and decision checklist"],
      groups: [
        { title: "Funding, assets, and background checks", indices: [0, 1, 2] },
        { title: "Cross-border structures and transaction review", indices: [3, 4, 5, 6] },
        { title: "Asset management systems", indices: [7] },
      ],
    },
    "digital-integration": {
      intro: "Connect websites, transactions, and internal work through consistent data flows. Map existing platforms and manual handoffs to define integrations, exception handling, and operating responsibilities.",
      fit: ["Web, payment, logistics, and internal tools operate separately", "Member, booking, or order data moves by hand", "A new multilingual or commerce site must support daily operations"],
      steps: [
        { title: "Map platforms and work", description: "Identify site features, external services, data fields, and owners; locate duplicate entry, data gaps, and interface constraints." },
        { title: "Plan the integration", description: "Define site, member, or transaction features and map data exchange, notifications, exceptions, migration, and launch tasks." },
        { title: "Test and hand over", description: "Check payments, notifications, and updates against real workflows; log failures and document operations, exceptions, and support ownership." },
      ],
      outputs: ["Website features and integration requirements", "Platform data-flow and ownership map", "Integration test and operations handover documents"],
    },
  },
  ja: {
    "systems-consulting": {
      intro: "実際の業務、利用者、データに沿ってシステムを計画します。開発・連携・導入の範囲を明確にし、関係者が共通の要件を基に進められるようにします。",
      fit: ["ERP・CRM・WMSの導入や刷新", "分断されたシステム間の重複入力の削減", "権限、検収、保守の責任範囲の明確化"],
      steps: [
        { title: "業務と要件の確認", description: "利用者への聞き取りと既存の業務、ツール、データの確認を通じて、重複作業や連携上の制約、解決すべき課題を整理します。" },
        { title: "構築範囲の設計", description: "機能、項目、権限、連携方式を定め、開発と導入の優先順位を決めます。技術面で未確認の事項も記録します。" },
        { title: "検証と引き継ぎ", description: "合意した場面とデータの流れを検証し、検収、配備、バックアップ、操作、ソースコードと保守範囲を文書化します。" },
      ],
      outputs: ["機能要件と利用者の役割一覧", "システム構成・データフロー図", "検収と保守の引き継ぎ一覧"],
    },
    "visual-design": {
      intro: "ブランドの用途と利用場面に合わせて視覚表現の範囲を定めます。識別、画面、販促素材に共通する規則と、出力仕様・ライセンス条件を整理します。",
      fit: ["接点ごとにブランド表現が異なる", "サイトや画面の情報階層を見直したい", "販促・印刷素材に共通の規則がない"],
      steps: [
        { title: "用途と素材の確認", description: "既存の識別、対象者、利用場面を確認し、制作するページ、素材、寸法、継続して使うブランド要素を合意します。" },
        { title: "視覚表現の設計", description: "色彩、書体、レイアウト、部品の方針を定め、承認された規則を合意済みのデジタル・印刷物に適用します。" },
        { title: "確認と納品", description: "寸法、文言、出力形式を確認し、編集可能なファイルと利用規則を整理します。書体や画像などの利用許諾も確認します。" },
      ],
      outputs: ["ブランド・画面の視覚方針", "合意したページや素材のデザインデータ", "レイアウト規則とファイル引き継ぎ一覧"],
    },
    "international-marketing": {
      intro: "製品、顧客、投入できる資源から海外市場を評価します。多言語コンテンツ、検索、広告の役割を定め、確認可能な問い合わせ・転換指標で施策を見直します。",
      fit: ["対象市場と顧客層を検討したい", "多言語コンテンツを流入と問い合わせにつなげたい", "広告予算、アカウント権限、測定方法を明確にしたい"],
      steps: [
        { title: "市場条件の評価", description: "製品、顧客、競争状況、投入可能な資源を整理し、市場の優先順位と現地で確認が必要な前提を明らかにします。" },
        { title: "内容と通路の設計", description: "多言語のテーマ、検索語、サイト上の導線を定め、各通路の役割と翻訳・現地確認の担当を整理します。" },
        { title: "測定と改善", description: "アカウント、イベント、報告の設定を確認し、問い合わせや転換データから改善案を作成します。市場条件も記録します。" },
      ],
      outputs: ["対象市場・顧客層の評価表", "多言語コンテンツと通路の実施計画", "指標定義・計測設定・検討レポート"],
    },
    "international-finance": {
      intro: "国際的な資産、取引、家族の取り決めに関する情報を、検証可能な意思決定資料に整理します。法務、税務、信託、金融の課題は必要に応じて専門家と評価します。",
      fit: ["国際投資や取引条件・リスクを検討する", "複数地域の資産、保有関係、文書をまとめる", "承継、信託、企業構造について専門家と連携する"],
      steps: [
        { title: "要件と資料の確認", description: "資産、取引、承継の論点を定め、適法に利用できる資料を集めます。保有関係、資金、本人情報の不足も明確にします。" },
        { title: "専門家との評価", description: "未決事項、取引条件、リスクを整理し、課題に応じて法務、税務、信託、金融の専門家による確認と役割を定めます。" },
        { title: "照合と引き継ぎ", description: "確認結果、残る課題、専門家の意見の出所を記録し、判断資料と次の作業を渡します。システム構築は別途範囲を定めます。" },
      ],
      outputs: ["資産一覧と保有関係図", "要確認事項と専門家の役割分担表", "取引リスクと意思決定情報の一覧"],
      groups: [
        { title: "資金・資産・背景の確認", indices: [0, 1, 2] },
        { title: "国際的な計画と取引評価", indices: [3, 4, 5, 6] },
        { title: "資産管理システム", indices: [7] },
      ],
    },
    "digital-integration": {
      intro: "サイト、取引、社内業務を一貫したデータの流れでつなぎます。既存のサービスと手作業を確認し、連携、例外対応、公開後の運用責任を定めます。",
      fit: ["サイト、決済、物流、社内ツールが分断している", "会員・予約・注文データを手作業で移している", "多言語サイトやECを日常業務につなげたい"],
      steps: [
        { title: "サービスと業務の確認", description: "サイト機能、外部サービス、データ項目、担当者を確認し、重複入力、情報の差異、連携上の制約を整理します。" },
        { title: "構築と連携の設計", description: "サイト、会員、取引の機能範囲を決め、データ交換、通知、例外対応、移行と公開作業を設計します。" },
        { title: "試験と引き継ぎ", description: "実際の業務場面で決済、通知、データ更新を確認し、不具合を記録します。操作、例外対応、保守の責任も文書化します。" },
      ],
      outputs: ["サイト機能と連携要件の一覧", "サービス間のデータと責任分担図", "統合試験と運用引き継ぎ資料"],
    },
  },
};

export const planningLabelsByLocale = {
  zh: { fit: "適合這些需求", process: "合作方式", outputs: "可確認的交付", related: "相關服務", viewCase: "查看案例內容" },
  en: { fit: "Best for", process: "How we work", outputs: "Planned deliverables", related: "Related services", viewCase: "View case study" },
  ja: { fit: "このような課題に", process: "進め方", outputs: "確認できる成果物", related: "関連サービス", viewCase: "事例を見る" },
};
