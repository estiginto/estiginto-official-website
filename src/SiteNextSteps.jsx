import { localizeHref } from "./siteRoutes.js";

const copyByLocale = {
  zh: {
    title: "了解服務與合作方式", label: "延伸資訊",
    about: ["認識團隊", "了解團隊背景與服務方向。"],
    consulting: ["顧問服務", "盤點需求，確認服務範圍與協作方式。"],
    case: ["精選實績", "依應用領域查看已交付的功能。"],
    faq: ["合作說明", "了解需求評估、交付、授權與維護安排。"],
    contact: ["聯絡我們", "透過 Email、電話或 LINE 討論需求。"],
  },
  en: {
    title: "Explore services and collaboration", label: "Related information",
    about: ["About us", "Meet the team and explore our areas of work."],
    consulting: ["Consulting", "Define requirements, scope, and responsibilities."],
    case: ["Selected work", "Review delivered features by application area."],
    faq: ["Working with us", "Learn about planning, delivery, licensing, and support."],
    contact: ["Contact us", "Discuss your requirements by email, phone, or LINE."],
  },
  ja: {
    title: "サービスとご依頼について", label: "関連情報",
    about: ["私たちについて", "チームとサービスの方針をご紹介します。"],
    consulting: ["コンサルティング", "要件、支援範囲、役割分担を整理します。"],
    case: ["実績紹介", "提供した機能を用途別にご覧いただけます。"],
    faq: ["ご依頼について", "要件整理、納品、ライセンス、保守をご案内します。"],
    contact: ["お問い合わせ", "メール、電話、LINEでご相談いただけます。"],
  },
};

const destinations = {
  about: ["consulting", "case", "contact"],
  case: ["consulting", "faq", "contact"],
  consulting: ["case", "faq", "contact"],
  faq: ["consulting", "case", "contact"],
  contact: ["consulting", "case", "faq"],
};

export default function SiteNextSteps({ page, locale }) {
  const copy = copyByLocale[locale] || copyByLocale.zh;
  if (!destinations[page]) return null;
  return (
    <section className="site-next-steps" aria-labelledby="site-next-steps-title">
      <div className="wrap">
        <p className="site-next-steps-label">{copy.label}</p>
        <h2 id="site-next-steps-title">{copy.title}</h2>
        <nav className="site-next-steps-links" aria-label={copy.label}>
          {destinations[page].map((key) => (
            <a href={localizeHref(`/${key}.html`, locale)} key={key}>
              <span className="site-next-steps-name">{copy[key][0]}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>
              <span>{copy[key][1]}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
