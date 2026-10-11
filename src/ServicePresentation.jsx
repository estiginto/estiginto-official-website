import { servicePlanningByLocale, planningLabelsByLocale } from "./servicePlanning.js";

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
  return <section className="advisory-block service-working-method" id="service-working-method" aria-labelledby="service-working-title">
    <h2 id="service-working-title">{ui.process}</h2>
    <ol>{content.steps.map((step, index) => <li key={step.title}><span className="editorial-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
    <div className="working-outputs"><h3>{ui.outputs}</h3><ul>{content.outputs.map(item => <li key={item}>{item}</li>)}</ul></div>
  </section>;
}
