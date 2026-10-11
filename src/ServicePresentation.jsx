import { servicePlanningByLocale, planningLabelsByLocale } from "./servicePlanning.js";
import { serviceDetailsByLocale } from "./serviceDetails.js";
import { getServiceImplementationIds } from "./serviceImplementation.js";
import { localizeHref } from "./siteRoutes.js";

const ownCaseCopy = {
  zh: { label: "自有品牌實作", title: "ESTIGINTO 品牌與官方網站", description: "從品牌識別延伸至多語官網，統一色彩、字體與資訊層級，支援手機與桌機瀏覽。", caption: "ESTIGINTO 官方網站實際畫面", features: ["品牌識別與視覺應用", "中文、英文與日文介面", "手機與桌機響應式排版"], design: "查看視覺設計", website: "查看網站與電商整合" },
  en: { label: "Our own brand project", title: "ESTIGINTO brand & official website", description: "An actual view of our website shows how identity, information hierarchy, and digital design come together.", caption: "Actual ESTIGINTO website", features: ["Brand identity and visual applications", "Chinese, English, and Japanese interfaces", "Responsive mobile and desktop layouts"], design: "Explore visual design", website: "Explore website & commerce integration" },
  ja: { label: "自社ブランドの制作実例", title: "ESTIGINTO ブランドと公式サイト", description: "当サイトの実際の画面を通して、ブランド識別、情報の階層、Webへの展開をご紹介します。", caption: "ESTIGINTO公式サイトの実際の画面", features: ["ブランド識別とビジュアル展開", "中国語・英語・日本語の画面", "スマートフォン・PCに対応したレイアウト"], design: "ビジュアルデザインを見る", website: "Web・EC連携を見る" },
};

export function OwnBrandCase({ locale }) {
  const ui = ownCaseCopy[locale] || ownCaseCopy.zh;
  return <section className="own-brand-case" id="estiginto-brand-website" aria-labelledby="own-brand-case-title">
    <figure><img src="/img/brand/estiginto-website.webp" alt={ui.caption} width="1440" height="1000" loading="lazy" /><figcaption>{ui.caption}</figcaption></figure>
    <div><p className="editorial-label">{ui.label}</p><h2 id="own-brand-case-title">{ui.title}</h2><p>{ui.description}</p><ul>{ui.features.map(item => <li key={item}>{item}</li>)}</ul><nav aria-label={ui.title}><a href={localizeHref("/visual-design.html", locale)}>{ui.design}</a><a href={localizeHref("/digital-integration.html", locale)}>{ui.website}</a></nav></div>
  </section>;
}

export function ServiceEntryGuide({ locale, id }) {
  const ui = {
    zh: { title: "依需求選擇服務", internal: "企業內部營運", internalBody: "ERP、CRM、WMS、部門流程與資料權限", external: "網站與電商整合", externalBody: "品牌官網、線上交易、會員預約與訂單串接" },
    en: { title: "Find the right service", internal: "Internal business operations", internalBody: "ERP, CRM, WMS, team workflows, and data access", external: "Website & commerce integration", externalBody: "Brand websites, online sales, memberships, booking, and order integration" },
    ja: { title: "課題に合ったサービス", internal: "社内業務システム", internalBody: "ERP・CRM・WMS、部門業務、データとアクセス権限", external: "Web・EC連携", externalBody: "ブランドサイト、オンライン販売、会員・予約、受注連携" },
  }[locale];
  return <aside className="service-entry-guide" aria-label={ui.title}><p className="editorial-label">{ui.title}</p><div>{[["systems-consulting", ui.internal, ui.internalBody], ["digital-integration", ui.external, ui.externalBody]].map(([key, title, body]) => <a key={key} href={localizeHref(`/${key}.html`, locale)} aria-current={id === key ? "page" : undefined}><strong>{title}</strong><span>{body}</span></a>)}</div></aside>;
}

const brandCopy = {
  zh: { title: "從識別到網站，讓品牌有一致的樣子。", note: "ESTIGINTO 本站品牌應用示例", caption: "以本站的標誌、深藍與金色、字體層次及網站應用，呈現識別如何延伸至數位介面。", type: "字體與資訊層次", line: "以遠見布局", accent: "連結世界與台灣", palette: "品牌色彩", application: "網站應用" },
  en: { title: "One identity across brand and website.", note: "ESTIGINTO website · our own brand application", caption: "Our own identity illustrates how a mark, navy and gold palette, typography, and layout work together across a digital experience.", type: "Typography and hierarchy", line: "Built on vision.", accent: "Connected across borders.", palette: "Brand palette", application: "Website application" },
  ja: { title: "ブランドとWebに、一貫した表現を。", note: "ESTIGINTO自社サイトのブランド活用例", caption: "自社のロゴ、紺と金の配色、文字の階層、Webサイトへの展開を通じて、デジタル表現へのつながりをご紹介します。", type: "文字と情報の階層", line: "先を見据えた構想。", accent: "世界と台湾をつなぐ。", palette: "ブランドカラー", application: "Webサイトへの展開" },
};

export function BrandApplication({ locale }) {
  const ui = brandCopy[locale] || brandCopy.zh;
  return <section className="brand-application" aria-labelledby="brand-application-title">
    <header><p className="editorial-label">{ui.note}</p><h2 id="brand-application-title">{ui.title}</h2><p>{ui.caption}</p></header>
    <div className="brand-application-board">
      <div className="brand-signature"><img src="/img/logo_estiginto.png" alt="ESTIGINTO" width="100" height="100" /><span>ESTIGINTO</span></div>
      <div className="brand-type"><span>{ui.type}</span><p>{ui.line}<br /><strong>{ui.accent}</strong></p></div>
      <div className="brand-palette" aria-label={ui.palette}><span>Navy<br />#0A1F44</span><span>Gold<br />#B18B54</span><span>Paper<br />#F8F7F3</span></div>
      <figure className="brand-site-preview"><img src="/img/brand/estiginto-website.webp" alt={ui.application} width="1440" height="1000" loading="lazy" /><figcaption>{ui.application}</figcaption></figure>
    </div>
  </section>;
}

export function ServicePlanning({ locale, id }) {
  const ui = planningLabelsByLocale[locale] || planningLabelsByLocale.zh;
  const content = (servicePlanningByLocale[locale] || servicePlanningByLocale.zh)[id];
  return <>
    <section className="service-fit" aria-labelledby="service-fit-title"><div><h2 id="service-fit-title">{ui.fit}</h2><p>{content.intro}</p></div><ul>{content.fit.map(item => <li key={item}>{item}</li>)}</ul></section>
  </>;
}

export function ServiceWorkingMethod({ locale, id }) {
  const ui = planningLabelsByLocale[locale] || planningLabelsByLocale.zh;
  const content = (servicePlanningByLocale[locale] || servicePlanningByLocale.zh)[id];
  const details = serviceDetailsByLocale[locale] || serviceDetailsByLocale.zh;
  const implementationIds = getServiceImplementationIds(id);
  return <section className="advisory-block service-working-method" id="service-working-method" aria-labelledby="service-working-title">
    <h2 id="service-working-title">{ui.process}</h2>
    <ol>{content.steps.map((step, index) => <li key={step.title}><span className="editorial-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    <div className="working-outputs" id="service-implementation">
      <h3>{implementationIds.length ? details.labels.deliverables : ui.outputs}</h3>
      <div>{implementationIds.length ? implementationIds.map(target => <ul id={`implementation-${target}`} key={target}>{details.solutions[target].deliverables.map(item => <li key={item}>{item}</li>)}</ul>) : <ul>{content.outputs.map(item => <li key={item}>{item}</li>)}</ul>}
      <p className="service-scope-note">{details.labels.note}</p></div>
    </div>
  </section>;
}
