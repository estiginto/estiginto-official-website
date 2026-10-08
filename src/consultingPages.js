export const consultingServiceIds = [
  "systems-consulting", "visual-design", "international-marketing", "international-finance", "digital-integration",
];

export function getConsultingHref(id) {
  return consultingServiceIds.includes(id) ? `/${id}.html` : "/consulting.html";
}

// Existing shared bookmarks retain their service and language after the split.
export function getLegacyConsultingDestination(pathname, hash, search = "") {
  const prefix = pathname.match(/^\/(en|ja)(?=\/)/)?.[0] || "";
  if (pathname !== `${prefix}/consulting.html`) return null;
  const id = hash.replace(/^#/, "");
  return consultingServiceIds.includes(id) ? `${prefix}${getConsultingHref(id)}${search}` : null;
}

// These are existing public implementation references, not new advisory claims.
export const consultingCaseIds = {
  "systems-consulting": ["manufacturing-management", "government-administration"],
  "visual-design": ["consumer-brand-site", "art-collection"],
  "international-marketing": ["consumer-brand-site", "yacht-event-management"],
  "international-finance": [],
  "digital-integration": ["fresh-food-omnichannel", "event-booking-commerce"],
};

export const consultingPageCopy = {
  zh: {
    directory: "顧問服務總覽", view: "查看服務內容", contents: "本頁內容", content: "服務內容", cases: "參考案例", faq: "常見問題", inquiry: "討論這項服務", other: "其他顧問服務", general: "一般合作說明", faqDirectory: "各服務常見問題",
    casesIntro: "以下取自已公開的建置實績，可參考相關功能與應用方式；顧問工作與建置工作可分別委託，實際範圍依合作約定確認。",
    marketingCasesIntro: "以下是品牌網站與行銷整合的建置參考，展示品牌呈現與數位通路功能；不代表特定海外市場或廣告投放成果。",
  },
  en: {
    directory: "All consulting services", view: "Explore this service", contents: "On this page", content: "Service details", cases: "Reference work", faq: "Frequently asked questions", inquiry: "Discuss this service", other: "Other consulting services", general: "Working with us", faqDirectory: "Questions by service",
    casesIntro: "These published implementation references illustrate related features and applications. Consulting and implementation can be commissioned separately; the agreed engagement defines the scope.",
    marketingCasesIntro: "These brand website and marketing integration references illustrate brand presentation and digital channels. They do not represent results in a particular overseas market or advertising campaign.",
  },
  ja: {
    directory: "コンサルティング一覧", view: "サービス内容を見る", contents: "このページの内容", content: "サービス内容", cases: "参考実績", faq: "よくあるご質問", inquiry: "このサービスについて相談する", other: "その他のコンサルティング", general: "ご依頼について", faqDirectory: "サービス別のよくあるご質問",
    casesIntro: "公開済みの構築実績から、関連する機能や用途をご紹介します。コンサルティングと構築は個別にご依頼いただけます。実際の範囲はご依頼の条件に従って確認します。",
    marketingCasesIntro: "ブランドサイトとマーケティング連携の構築実績として、ブランド表現とデジタル販路の機能をご紹介します。特定の海外市場や広告配信の成果を示すものではありません。",
  },
};

export const consultingFaqByLocale = {
  zh: {
    "systems-consulting": [
      ["是否一定要重新開發系統？", "會依既有系統、流程與資料介面評估沿用、調整、串接或客製開發的可行性，整理各選項的限制、導入成本及維護需求，供您決定建置方式。"],
      ["需求盤點要提供哪些資料？", "可提供現有作業流程、使用角色、表單或報表範例、系統清單，以及希望改善的問題。涉及機密資料時，可用去識別範例討論，實際存取依授權範圍確認。"],
      ["顧問規劃可以交給其他團隊建置嗎？", "可以討論由內部團隊或其他廠商執行。需求文件、架構、驗收條件、交接方式與文件使用權須納入合作約定，讓執行團隊能理解規劃內容。"],
      ["如何安排系統導入，避免影響日常營運？", "依流程依賴與營運時點規劃導入階段，確認資料移轉、測試、使用者訓練及切換條件。平行作業、備份與復原安排依系統風險及建置範圍評估。"],
    ],
    "visual-design": [
      ["已有品牌識別，還能委託視覺設計顧問嗎？", "可以以既有識別與使用規範為基礎，檢視網站、介面與行銷素材的應用，整理不一致之處及延伸規則，不預設需要重新設計標誌。"],
      ["顧問服務是否包含實際設計製作？", "顧問工作可包含視覺檢視、方向與規範規劃；品牌識別、介面與素材製作則依委託範圍另行確認。會說明成果形式、修改次數及交付條件。"],
      ["如何讓內部團隊延續設計規範？", "可規劃色彩、字體、版面、元件及素材使用方式，搭配應用範例與交接說明。規範文件、可編輯檔案與元件庫是否交付，依合作約定確認。"],
      ["網站與行銷素材能一起檢視嗎？", "可將品牌網站、社群、簡報、廣告及印刷物納入同一範圍，確認各接觸點的資訊層級與視覺一致性。檢視項目與後續製作分工於需求討論時約定。"],
    ],
    "international-marketing": [
      ["尚未決定目標國家，可以開始討論嗎？", "可從產品、客群、競爭條件、通路與可投入資源整理市場評估方向。研究範圍、資料來源及比較方式依需求確認，不預設所有市場都適合進入。"],
      ["多語網站只是翻譯中文內容嗎？", "規劃也涵蓋受眾需求、網站架構、搜尋用語、洽詢與購買流程。內容提供、翻譯、在地審核與更新責任須確認，讓各語系能配合目標市場使用。"],
      ["服務是否包含廣告投放與通路執行？", "可分別委託策略規劃、內容與素材製作、網站建置或廣告執行。平台帳號、媒體預算、服務費及外部合作事項會明確列入範圍與分工。"],
      ["如何評估海外行銷的成效？", "依目標市場與營運條件約定有效洽詢、轉換或其他可查核指標，確認資料取得及追蹤方式。排名、流量與營收受市場因素影響，不保證特定成果。"],
    ],
    "digital-integration": [
      ["哪些工具與系統可以串接？", "依現有網站、電商、會員、金流、物流與內部系統的介面、權限及供應商條件評估。若無可用 API，會說明可行替代方式與限制，不預設所有平台都能直接串接。"],
      ["串接前需要整理哪些資料？", "需釐清資料來源、欄位定義、唯一識別、更新頻率及負責團隊，也要確認使用授權與保留方式。可用樣本資料檢視格式差異與重複資料處理需求。"],
      ["自動化失敗或資料不同步時怎麼處理？", "規劃會涵蓋錯誤通知、處理紀錄、重試、重複資料防護與人工補處理方式。依作業重要性約定監控、維護及問題處理的責任與範圍。"],
      ["可以分階段串接，保留原來的工具嗎？", "可依資料依賴及營運優先順序安排階段，保留可用工具並逐步調整資料流。各階段的介面、測試、切換與驗收條件會於執行前確認。"],
    ],
  },
  en: {
    "systems-consulting": [
      ["Does consulting always lead to a new system?", "We assess retaining, adapting, connecting, or replacing existing systems against workflows and available interfaces. Options describe constraints, implementation costs, and maintenance needs to support your decision."],
      ["What information is useful for discovery?", "Existing workflows, user roles, sample forms or reports, system inventories, and problems to resolve are useful. De-identified samples can support confidential discussions; access to actual records follows the agreed authorization."],
      ["Can another team implement the plan?", "Implementation by an internal team or another provider can be arranged. Requirements, architecture, acceptance criteria, handover, and document usage rights need to be specified in the engagement terms."],
      ["How is rollout planned around daily operations?", "Stages reflect workflow dependencies and operating schedules, covering migration, testing, training, and cutover criteria. Parallel operation, backups, and recovery are assessed according to system risks and implementation scope."],
    ],
    "visual-design": [
      ["Can you work with our existing brand identity?", "Yes. Existing identity and guidelines can guide a review of websites, interfaces, and marketing materials. We identify inconsistent applications and extension rules without assuming the logo needs replacement."],
      ["Does consulting include design production?", "Consulting can cover visual review, direction, and guidelines. Identity, interface, and asset production are confirmed in the commissioned scope, including deliverable formats, revision rounds, and acceptance terms."],
      ["How can our team continue using the design guidelines?", "Guidelines can address color, typography, layouts, components, and assets with application examples and handover. Delivery of editable files, documentation, and component libraries follows the engagement terms."],
      ["Can website and marketing materials be reviewed together?", "Brand websites, social content, presentations, advertisements, and print can be included in one review of hierarchy and consistency. Review items and subsequent production responsibilities are agreed during discovery."],
    ],
    "international-marketing": [
      ["Can we begin before choosing a target country?", "We can organize market evaluation around the product, audience, competition, channels, and available resources. Research scope, sources, and comparison methods are agreed without assuming every market is suitable."],
      ["Is a multilingual website simply a translation?", "Planning also covers audiences, content structure, search terms, and inquiry or purchase journeys. Responsibilities for content, translation, local review, and updates are confirmed for each target market."],
      ["Does the service include advertising and channel execution?", "Strategy, content and assets, website implementation, and advertising execution can be commissioned separately. Platform accounts, media budgets, service fees, and external partnerships are specified in the scope and responsibilities."],
      ["How are international marketing results evaluated?", "Verifiable metrics such as qualified inquiries or conversions are agreed around market and operating objectives, together with data access and tracking. Rankings, traffic, and revenue depend on market factors; specific outcomes are not guaranteed."],
    ],
    "digital-integration": [
      ["Which tools and systems can be connected?", "Feasibility depends on interfaces, permissions, and provider terms for websites, commerce, membership, payments, logistics, and internal systems. Where an API is unavailable, alternatives and limitations are explained."],
      ["What data preparation is needed?", "We clarify sources, field definitions, unique identifiers, update frequency, ownership, usage permissions, and retention. Sample data can help identify format differences and duplicate handling needs."],
      ["What happens when automation fails or records fall out of sync?", "Planning addresses error notifications, logs, retries, duplicate protection, and manual recovery. Monitoring, maintenance, and incident responsibilities are agreed according to the workflow's importance."],
      ["Can integration be phased while retaining existing tools?", "Yes. Stages can follow data dependencies and operating priorities while retaining usable tools and progressively adjusting data flows. Interfaces, testing, cutover, and acceptance criteria are confirmed for each stage."],
    ],
  },
  ja: {
    "systems-consulting": [
      ["システムを作り直す必要がありますか？", "既存システム、業務、接続方法を確認し、継続利用、改修、連携、新規開発を検討します。各案の制約、導入費用、保守要件を整理し、構築方法の判断を支援します。"],
      ["要件整理にはどのような資料が必要ですか？", "現行の業務フロー、利用者の役割、帳票の例、システム一覧、改善したい課題をご共有ください。機密情報は匿名化した例でも検討できます。実データへのアクセスは許可された範囲で行います。"],
      ["計画を別のチームに構築してもらえますか？", "社内チームや他社による構築もご相談いただけます。要件、構成、検収基準、引き継ぎ方法、文書の利用権を依頼条件に含め、実行側が計画を理解できるようにします。"],
      ["日常業務への影響を抑える導入計画はできますか？", "業務の依存関係と運営日程に合わせ、移行、テスト、操作研修、切替条件を整理します。並行運用、バックアップ、復旧はシステムのリスクと構築範囲に応じて検討します。"],
    ],
    "visual-design": [
      ["既存のブランド識別を活用できますか？", "既存の識別と規定を基に、Web、画面、販促物への適用を確認できます。不統一な箇所や展開ルールを整理し、ロゴの刷新を前提とせずに検討します。"],
      ["コンサルティングにデザイン制作も含まれますか？", "ビジュアルの確認、方針、規定の計画を支援します。ブランド識別、画面、素材の制作は依頼範囲に応じて確認し、成果物の形式、修正回数、納品条件を定めます。"],
      ["社内チームが規定を継続して使えますか？", "色、書体、レイアウト、部品、素材の使い方を、適用例や引き継ぎ説明とともに計画できます。編集可能なファイル、文書、部品ライブラリの納品は依頼条件に従います。"],
      ["Webと販促物をまとめて確認できますか？", "ブランドサイト、SNS、プレゼン資料、広告、印刷物を一つの範囲に含め、情報階層と一貫性を確認できます。対象と制作の役割分担をご相談時に定めます。"],
    ],
    "international-marketing": [
      ["対象国が決まる前でも相談できますか？", "製品、顧客、競合、販路、投入可能な資源を基に、市場評価の方針を整理できます。調査範囲、情報源、比較方法を確認し、すべての市場への進出を前提とはしません。"],
      ["多言語サイトは翻訳だけですか？", "対象顧客、コンテンツ構成、検索用語、問い合わせや購入の流れも検討します。コンテンツ提供、翻訳、現地確認、更新の担当を定め、各市場の利用方法に合わせます。"],
      ["広告配信や販路の実行も含まれますか？", "戦略、コンテンツ・素材、Web構築、広告運用を個別に依頼できます。アカウント、媒体予算、サービス費用、外部連携を範囲と役割分担に明記します。"],
      ["海外マーケティングの効果はどう評価しますか？", "市場と運営目標に応じ、有効な問い合わせや購入など確認可能な指標とデータ取得方法を定めます。順位、アクセス、売上は市場要因にも左右され、特定の成果は保証しません。"],
    ],
    "digital-integration": [
      ["どのツールやシステムを連携できますか？", "Web、EC、会員、決済、物流、社内システムの接続方法、権限、提供元の条件に応じて検討します。APIが利用できない場合は、代替案と制約を説明します。"],
      ["連携前にどのようなデータ整理が必要ですか？", "情報源、項目の定義、一意の識別子、更新頻度、担当チーム、利用権限、保存方法を確認します。サンプルを使って形式の違いや重複処理の要件を確認できます。"],
      ["自動化の失敗やデータの不一致にはどう対応しますか？", "エラー通知、処理履歴、再試行、重複防止、手動復旧を計画に含めます。業務の重要度に応じて、監視、保守、障害対応の範囲と担当を定めます。"],
      ["既存ツールを残して段階的に連携できますか？", "データの依存関係と業務の優先順位に応じ、利用可能なツールを残して段階的にデータの流れを調整できます。各段階の接続、テスト、切替、検収条件を実施前に確認します。"],
    ],
  },
};
