import { localizeHref } from "./siteRoutes.js";

const copy = {
  zh: { title: "有適合的方向，歡迎聊聊。", description: "提供目前的需求、既有資料與預計時程，讓我們了解可以協助的範圍。", contact: "聯絡我們", case: "查看精選實績", consulting: "探索服務", faq: "了解合作方式" },
  en: { title: "Discuss what your business needs.", description: "Share your goals, existing resources, and timing so we can explore the right scope together.", contact: "Contact us", case: "Selected work", consulting: "Explore services", faq: "Working with us" },
  ja: { title: "事業の課題をお聞かせください。", description: "現在の課題、既存の資料、ご希望の日程から、支援できる範囲をご相談します。", contact: "お問い合わせ", case: "実績を見る", consulting: "サービスを見る", faq: "ご依頼について" },
};

const pageInvitations = {
  zh: {
    about: ["讓合適的團隊參與您的專案。", "說明您需要的專業、現有資源與合作方式，我們會一起界定服務範圍。"],
    case: ["有類似的建置需求？", "提供目前的作業方式、希望改善的問題與參考案例，討論適合的功能範圍。"],
    consulting: ["找到適合的服務方向了嗎？", "即使需求還在整理，也可以從目前的業務、工具與時程開始討論。"],
    faq: ["還有需要確認的合作條件？", "將需求、交付項目或維護安排告訴我們，讓討論對應您的實際情況。"],
  },
  en: {
    about: ["Bring the right expertise to your project.", "Tell us which capabilities you need, the resources available, and how you prefer to work together."],
    case: ["Planning a similar project?", "Share your current workflow, the problems to address, and any relevant examples to discuss the scope."],
    consulting: ["Discuss the service that fits your needs.", "You can start with your business, existing tools, and timing, even if the requirements are still taking shape."],
    faq: ["Have a question about working together?", "Ask about your scope, deliverables, or maintenance arrangements so we can address your specific situation."],
  },
  ja: {
    about: ["プロジェクトに必要な専門性をご相談ください。", "必要な専門分野、既存のリソース、ご希望の協力体制から、支援範囲を検討します。"],
    case: ["同様の構築をご検討ですか。", "現在の業務、改善したい課題、参考となる事例をもとに、必要な機能をご相談いただけます。"],
    consulting: ["課題に合ったサービスをご相談ください。", "要件がまだ固まっていない段階でも、現在の事業やツール、ご希望の日程をお聞かせください。"],
    faq: ["協力体制について、確認したいことはありますか。", "業務範囲、納品物、保守のご希望をお聞かせください。個別の状況に応じてご相談します。"],
  },
};
export default function PageContinuations({ locale, page }) {
  const ui = copy[locale] || copy.zh;
  const [title, description] = (pageInvitations[locale] || pageInvitations.zh)[page] || [ui.title, ui.description];
  const related = page === "case" ? ["consulting"] : page === "consulting" ? ["case"] : ["case", "consulting"];
  return <section className="page-continuation" aria-labelledby="continuation-title">
    <div className="wrap continuation-layout">
      <div><h2 id="continuation-title">{title}</h2><p>{description}</p></div>
      <nav aria-label={title}>
        <a className="btn btn-primary" href={localizeHref("/contact.html", locale)}>{ui.contact}<span className="arrow" aria-hidden="true" /></a>
        <div className="continuation-related">{related.map(key => <a key={key} href={localizeHref(`/${key}.html`, locale)}>{ui[key]}</a>)}</div>
      </nav>
    </div>
  </section>;
}
