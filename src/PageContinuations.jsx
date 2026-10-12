import { localizeHref } from "./siteRoutes.js";

const copy = {
  zh: { title: "有適合的方向，歡迎聊聊。", description: "提供目前的需求、既有資料與預計時程，讓我們了解可以協助的範圍。", contact: "聯絡我們", case: "查看精選實績", consulting: "探索服務", faq: "了解合作方式" },
  en: { title: "Discuss what your business needs.", description: "Share your goals, existing resources, and timing so we can explore the right scope together.", contact: "Contact us", case: "Selected work", consulting: "Explore services", faq: "Working with us" },
  ja: { title: "事業の課題をお聞かせください。", description: "現在の課題、既存の資料、ご希望の日程から、支援できる範囲をご相談します。", contact: "お問い合わせ", case: "実績を見る", consulting: "サービスを見る", faq: "ご依頼について" },
};

export default function PageContinuations({ locale, page }) {
  const ui = copy[locale] || copy.zh;
  const related = page === "case" ? ["consulting"] : page === "consulting" ? ["case"] : ["case", "consulting"];
  return <section className="page-continuation" aria-labelledby="continuation-title">
    <div className="wrap continuation-layout">
      <div><h2 id="continuation-title">{ui.title}</h2><p>{ui.description}</p></div>
      <nav aria-label={ui.title}>
        <a className="btn btn-primary" href={localizeHref("/contact.html", locale)}>{ui.contact}<span className="arrow" aria-hidden="true" /></a>
        <div className="continuation-related">{related.map(key => <a key={key} href={localizeHref(`/${key}.html`, locale)}>{ui[key]}</a>)}</div>
      </nav>
    </div>
  </section>;
}
