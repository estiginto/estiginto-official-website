// These describe topics to agree for each engagement, not fixed package promises.
export const serviceDetailsByLocale = {
  zh: {
    labels: { title: "合作內容", deliverables: "可規劃的交付內容", preparation: "需求討論可提供", boundaries: "合作範圍", outcomes: "規劃成果", practices: "資訊系統的應用與規劃", finance: "財務資訊與系統協作", terms: "常見系統用途", note: "實際交付項目、格式、驗收及授權條件，依需求與合作約定確認。" },
    solutions: {
      "website-design": {
        deliverables: ["網站內容架構、頁面與操作流程規劃", "依約定建置網站、管理功能與第三方串接", "裝置相容與功能測試、部署及操作交接"],
        preparation: "品牌規範、預計呈現的內容、既有網站與管理需求；涉及預約、交易或多語時，可說明流程、服務平台與內容審核分工。",
        boundaries: "內容撰寫、翻譯、既有資料移轉、搜尋基礎設定與教育訓練是否納入，於規劃中確認。網域、主機及第三方服務費用分別列明，避免與建置費用混淆。",
      },
      "custom-systems": {
        deliverables: ["作業流程、功能、資料與角色權限規劃", "依約定開發系統、移轉資料及串接外部服務", "功能與整合測試、部署安排及維運交接文件"],
        preparation: "現行作業流程、使用角色、資料範例、既有系統及介面文件；可說明必須保留的作業、導入限制與重要上線時點。",
        boundaries: "資料移轉、外部串接及部署以可取得的資料、介面與授權為評估基礎。驗收項目、原始碼交付、主機及後續維護依專案約定，不將所有功能視為固定包含。",
      },
      "graphic-design": {
        deliverables: ["品牌或視覺方向與應用範圍規劃", "約定的識別、版型、介面或行銷素材", "最終輸出檔及約定的視覺應用規範"],
        preparation: "既有識別與品牌規範、受眾、使用場景、文字及圖片來源；實體製作可提供尺寸、材質與印刷需求。",
        boundaries: "設計項目、提案與修改範圍、輸出格式及使用權於合作中明訂。可編輯原始檔依約定提供，未約定時交付最終輸出檔；字型、圖庫授權與印刷製作另行確認。",
      },
      "marketing-ads": {
        deliverables: ["市場定位、通路與內容執行計畫", "約定的行銷內容、廣告素材與投放管理", "成效追蹤規劃、報表及改善建議"],
        preparation: "產品或服務、目標市場、既有通路、素材與品牌規範、預算及成效目標；需確認帳號存取、資料使用與內容審核權責。",
        boundaries: "服務費、媒體預算與第三方製作費分別確認；內容數量、投放通路、報表與檢視頻率依約定執行。搜尋排名、流量與營收受市場及營運影響，不保證特定結果。",
      },
    },
    systems: [
      { title: "AI 導入與工作流程", description: "評估文件查詢、知識整理與作業輔助等需求，確認資料來源、允許用途、人工覆核及部署環境。模型或工具依需求評估，機密資料的使用條件須納入規劃。", outcomes: "適用流程、資料與工具需求、評估及測試條件。" },
      { title: "資料治理與資訊整合", description: "整理分散資料的來源、欄位定義、更新方式、品質問題與存取權限，讓不同部門使用一致的資料。資料整理與移轉的範圍依來源品質及可取得權限評估。", outcomes: "資料清冊、欄位與流向規劃、品質檢查及移轉需求。" },
      { title: "資訊安全與風險規劃", description: "從系統角色、敏感資料、存取方式與營運需求，討論權限、紀錄、備份及異常處理。專項檢測、認證或其他專業服務是否需要另行委託，依需求確認。", outcomes: "權限與安全需求、風險事項、備份及維運分工。" },
      { title: "決策輔助與作業自動化", description: "戰情室儀表板彙整營運指標與異常資訊；主動式應變決策系統依資料與規則提供提醒及處理建議。自動化執行輔助系統承接已確認的重複作業，執行權限、人工覆核與例外處理須明訂。", outcomes: "指標與資料來源、觸發規則、作業流程及人工確認節點。" },
    ],
    terms: ["ERP（企業資源規劃）整合營運流程；CRM（客戶關係管理）整理客戶與互動；POS（銷售點系統）支援門市交易。", "HRM（人力資源管理）處理人事作業；WMS（倉儲管理）追蹤庫存與出入庫；SCM（供應鏈管理）串聯採購、供應與交付；BDM（業務開發管理）追蹤商機及業務進度。"],
    finance: [
      { title: "財務規劃的資訊整理", description: "協助彙整資產、負債、持有關係、收支與資金需求，標示資料期間、來源及待確認事項。整理後的資訊供委任的法律、稅務與財務專業人員評估；專業規劃、意見及執行責任依委任範圍確認。", outcomes: "財務與資產資料清冊、資金需求及規劃議題、專業團隊分工。" },
      { title: "家族辦公室與資產盤點系統", description: "依企業或家族的協作需求，規劃資產與持有關係資料、文件、角色權限、審核與異動歷程、報表及既有系統串接。資料來源、更新責任與可共享範圍須確認；系統支援資訊管理，不取代相關專業判斷。", outcomes: "資料與權限架構、報表需求、文件協作流程及階段建置計畫。" },
    ],
    process: [
      "由客戶提供背景、作業流程與可分享資料，整理現況、限制及待釐清問題。",
      "確認目標、優先順序與參與角色，界定本次服務範圍及成果確認方式。",
      "依需求提出架構、工作項目與執行計畫；費用、時程、授權及分工於委託前確認。",
      "依已確認的範圍與授權安排建置及專業協作。需求變更須評估影響並取得共識後實施。",
      "依約定的成果與驗收條件檢視，整理待改善事項及交接、維護或後續階段需求。",
    ],
  },
  en: {
    labels: { title: "Engagement details", deliverables: "Deliverables to plan", preparation: "Useful for the discussion", boundaries: "Scope and responsibilities", outcomes: "Planning outputs", practices: "Information system applications", finance: "Financial information and system coordination", terms: "Common system purposes", note: "Deliverables, formats, acceptance criteria, and licensing are confirmed in the engagement terms." },
    solutions: {
      "website-design": {
        deliverables: ["Content structure, pages, and user journeys", "Agreed website, management features, and third-party integrations", "Device and functional testing, deployment, and operational handover"],
        preparation: "Share brand guidelines, planned content, the existing website, and management needs. For booking, transactions, or multilingual content, outline workflows, platforms, and content review responsibilities.",
        boundaries: "Confirm whether writing, translation, content migration, search foundations, and training are included. Domain, hosting, and third-party costs are identified separately from implementation fees.",
      },
      "custom-systems": {
        deliverables: ["Workflows, features, data, and role-based access planning", "Agreed development, data migration, and external integrations", "Functional and integration testing, deployment planning, and support handover documents"],
        preparation: "Share current workflows, user roles, sample data, existing systems, and interface documentation. Identify operations to preserve, rollout constraints, and important launch dates.",
        boundaries: "Migration, integration, and deployment are assessed against available data, interfaces, and permissions. Acceptance, source-code delivery, hosting, and ongoing support follow the project agreement; all features are not automatically included.",
      },
      "graphic-design": {
        deliverables: ["Brand or visual direction and application scope", "Agreed identity, templates, interfaces, or marketing assets", "Final exported files and agreed visual application guidelines"],
        preparation: "Share existing identity and guidelines, audiences, use contexts, and sources for text and images. Physical production can include size, material, and printing requirements.",
        boundaries: "Agree design items, proposal and revision scope, file formats, and usage rights. Editable files are supplied as agreed; otherwise final exports are provided. Font and stock licensing, printing, and production are confirmed separately.",
      },
      "marketing-ads": {
        deliverables: ["Market positioning, channels, and content execution plan", "Agreed content, advertising assets, and campaign management", "Measurement plan, reporting, and improvement recommendations"],
        preparation: "Share products or services, target markets, existing channels, assets, guidelines, budget, and objectives. Confirm account access, data use, and content approval responsibilities.",
        boundaries: "Confirm service fees, media budgets, and third-party production costs separately. Content volume, channels, reporting, and review frequency follow the agreement. Rankings, traffic, and revenue depend on market and operating conditions; specific results are not guaranteed.",
      },
    },
    systems: [
      { title: "AI adoption and workflows", description: "Assess document search, knowledge organization, and workflow assistance against data sources, permitted uses, human review, and deployment needs. Models and tools are assessed for the requirements, including conditions for confidential data use.", outcomes: "Suitable workflows, data and tool requirements, and evaluation and testing criteria." },
      { title: "Data governance and integration", description: "Define sources, fields, updates, quality issues, and access for fragmented records so departments can work from consistent data. Cleanup and migration are assessed against source quality and available permissions.", outcomes: "Data inventory, field and flow planning, quality checks, and migration requirements." },
      { title: "Information security and risk planning", description: "Discuss access, records, backups, and incident handling around roles, sensitive data, access methods, and operations. Confirm whether specialist testing, certification, or other professional services require a separate engagement.", outcomes: "Access and security requirements, risk items, and backup and support responsibilities." },
      { title: "Decision support and workflow automation", description: "Operations dashboards consolidate indicators and exceptions. Proactive response systems use data and rules to provide alerts and suggested actions. Workflow automation handles agreed repetitive tasks with defined execution permissions, human review, and exception handling.", outcomes: "Indicators and data sources, trigger rules, workflows, and human confirmation points." },
    ],
    terms: ["ERP (enterprise resource planning) connects operations; CRM (customer relationship management) organizes customers and interactions; POS (point of sale) supports retail transactions.", "HRM (human resource management) handles personnel workflows; WMS (warehouse management) tracks inventory and movements; SCM (supply chain management) connects purchasing, supply, and delivery; BDM (business development management) tracks opportunities and sales progress."],
    finance: [
      { title: "Information for financial planning", description: "Consolidate assets, liabilities, ownership, income, expenditure, and funding needs with record periods, sources, and open questions. Engaged legal, tax, and financial professionals use the information for their assessment. Professional planning, advice, and execution responsibilities follow each engagement.", outcomes: "Financial and asset inventory, funding needs and planning topics, and professional responsibilities." },
      { title: "Family office and asset inventory systems", description: "Plan asset and ownership records, documents, roles, approvals, change histories, reporting, and existing system integrations around business or family collaboration needs. Confirm sources, update responsibilities, and sharing permissions. The system manages information and does not replace professional judgment.", outcomes: "Data and access architecture, reporting needs, document workflows, and phased implementation plan." },
    ],
    process: [
      "The client shares background, workflows, and permitted information to identify the current state, constraints, and open questions.",
      "Agree objectives, priorities, and participants, defining the engagement scope and how outputs will be reviewed.",
      "Propose architecture, work items, and an execution plan. Fees, timing, permissions, and responsibilities are confirmed before commissioning.",
      "Arrange implementation and professional coordination within the agreed scope and permissions. Changes require impact assessment and agreement before implementation.",
      "Review agreed outputs and acceptance criteria, identifying improvements, handover, support, or further stages.",
    ],
  },
  ja: {
    labels: { title: "ご依頼の内容", deliverables: "計画する成果物", preparation: "ご相談時に共有いただく情報", boundaries: "範囲と役割分担", outcomes: "計画の成果物", practices: "情報システムの用途と計画", finance: "財務情報とシステムの連携", terms: "主なシステムの用途", note: "実際の成果物、形式、検収基準、利用許諾は、ご依頼の条件に従って確認します。" },
    solutions: {
      "website-design": {
        deliverables: ["コンテンツ構成、ページ、操作の流れの計画", "合意したWebサイト、管理機能、外部サービス連携の構築", "端末対応と機能のテスト、公開、操作の引き継ぎ"],
        preparation: "ブランド基準、掲載予定の内容、既存サイト、管理上の要件をご共有ください。予約、取引、多言語対応では、業務の流れ、利用サービス、内容確認の担当も整理します。",
        boundaries: "文章作成、翻訳、既存データの移行、検索の基礎設定、操作研修を含むか確認します。ドメイン、サーバー、外部サービスの費用は構築費用と分けて明示します。",
      },
      "custom-systems": {
        deliverables: ["業務、機能、データ、役割と権限の計画", "合意した開発、データ移行、外部サービス連携", "機能・連携テスト、導入計画、保守引き継ぎ資料"],
        preparation: "現行業務、利用者の役割、データ例、既存システム、接続仕様をご共有ください。維持すべき作業、導入の制約、重要な公開予定日も確認します。",
        boundaries: "移行、連携、導入は、取得できるデータ、接続仕様、許諾に基づいて検討します。検収、ソースコードの納品、サーバー、保守は案件ごとの合意に従い、すべての機能が一律に含まれるわけではありません。",
      },
      "graphic-design": {
        deliverables: ["ブランド・ビジュアル方針と展開範囲の計画", "合意した識別、テンプレート、画面、販促素材", "最終出力ファイルと合意したビジュアル運用基準"],
        preparation: "既存の識別とブランド基準、対象者、利用場面、文章と画像の出典をご共有ください。実物の制作では、寸法、素材、印刷の要件も確認します。",
        boundaries: "制作項目、提案・修正の範囲、出力形式、利用権を定めます。編集可能な元データは合意に従って提供し、合意がない場合は最終出力ファイルを納品します。フォント・画像の許諾、印刷、製作は別途確認します。",
      },
      "marketing-ads": {
        deliverables: ["市場での位置づけ、チャネル、コンテンツの実施計画", "合意したコンテンツ、広告素材、広告運用", "効果測定の計画、レポート、改善案"],
        preparation: "商品・サービス、対象市場、既存チャネル、素材、ブランド基準、予算、目標をご共有ください。アカウントへのアクセス、データ利用、内容承認の担当を確認します。",
        boundaries: "サービス費、広告予算、外部制作費を分けて確認します。内容の数量、チャネル、報告・検討の頻度は合意に従います。検索順位、アクセス数、売上は市場や運営に左右されるため、特定の結果は保証しません。",
      },
    },
    systems: [
      { title: "AI導入と業務フロー", description: "文書検索、知識の整理、作業支援を、データの出典、許可された用途、人による確認、処理環境に基づいて検討します。モデルやツールは要件に応じて評価し、機密情報の利用条件も計画に含めます。", outcomes: "適した業務、データ・ツールの要件、評価とテストの条件。" },
      { title: "データガバナンスと情報統合", description: "分散したデータの出典、項目の定義、更新方法、品質上の問題、アクセス権限を整理し、部門間で一貫した情報を利用できるよう計画します。整備や移行は出典の品質と取得可能な権限に基づいて検討します。", outcomes: "データ一覧、項目・流れの計画、品質確認、移行要件。" },
      { title: "情報セキュリティとリスク計画", description: "利用者の役割、機密データ、アクセス方法、運営の要件から、権限、記録、バックアップ、異常時の対応を検討します。専門的な検査、認証、その他の専門サービスを別途委託する必要があるか確認します。", outcomes: "権限・安全上の要件、リスク事項、バックアップと保守の役割分担。" },
      { title: "意思決定支援と業務の自動化", description: "運営ダッシュボードで指標や異常情報を集約し、能動的な対応支援システムではデータとルールに基づく通知や対応案を提示します。自動化支援は合意した反復作業を対象とし、実行権限、人による確認、例外処理を明確に定めます。", outcomes: "指標と出典、作動条件、業務フロー、人による確認箇所。" },
    ],
    terms: ["ERP（企業資源計画）は業務全体を連携し、CRM（顧客関係管理）は顧客と対応履歴を整理します。POS（販売時点管理）は店舗の取引を支援します。", "HRM（人材管理）は人事業務、WMS（倉庫管理）は在庫と入出庫、SCM（サプライチェーン管理）は調達・供給・納品を扱います。BDM（事業開発管理）は商談機会と営業進捗を管理します。"],
    finance: [
      { title: "財務計画のための情報整理", description: "資産、負債、保有関係、収支、資金需要を整理し、対象期間、出典、要確認事項を記載します。委任した法務・税務・財務の専門家が検討に利用します。専門的な計画、助言、実行の責任は、それぞれの委任範囲に従って確認します。", outcomes: "財務・資産の一覧、資金需要と計画の議題、専門家の役割分担。" },
      { title: "ファミリーオフィス・資産管理システム", description: "企業や家族の連携要件に応じ、資産・保有関係、文書、役割と権限、承認・変更履歴、レポート、既存システム連携を計画します。出典、更新担当、共有可能な範囲を確認します。システムは情報管理を支援し、専門家の判断を置き換えるものではありません。", outcomes: "データと権限の設計、レポート要件、文書連携の流れ、段階的な構築計画。" },
    ],
    process: [
      "お客様から背景、業務の流れ、共有可能な情報を伺い、現状、制約、要確認事項を整理します。",
      "目標、優先順位、関係者を確認し、サービス範囲と成果の確認方法を定めます。",
      "要件に応じた構成、作業項目、実施計画を提案し、委託前に費用、日程、許諾、担当を確認します。",
      "合意した範囲と許諾に沿って構築と専門家連携を進めます。変更は影響を評価し、実施方法の合意後に対応します。",
      "合意した成果と検収条件で確認し、改善事項、引き継ぎ、保守、次の段階の要件を整理します。",
    ],
  },
};
