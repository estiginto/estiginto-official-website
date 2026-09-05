const content = {
  zh: { label: '相關資訊', titles: { about: '專業服務與精選實績', solutions: '專案實績與合作說明', case: '相關服務', consulting: '專案實績與合作說明', faq: '專案與合作洽詢' }, about: '關於我們', solutions: '解決方案', consulting: '顧問服務', case: '精選實績', faq: '合作說明', contact: '聯絡我們' },
  en: { label: 'Related information', titles: { about: 'Services and selected work', solutions: 'Selected work and engagement details', case: 'Related services', consulting: 'Selected work and engagement details', faq: 'Discuss a project' }, about: 'About us', solutions: 'Solutions', consulting: 'Consulting', case: 'Selected work', faq: 'Working with us', contact: 'Contact us' },
  ja: { label: '関連情報', titles: { about: 'サービスと実績', solutions: '実績とご依頼について', case: '関連サービス', consulting: '実績とご依頼について', faq: 'プロジェクトのご相談' }, about: '私たちについて', solutions: 'ソリューション', consulting: 'コンサルティング', case: '実績紹介', faq: 'ご依頼について', contact: 'お問い合わせ' },
};
const destinations = {
  about: ['solutions', 'case', 'contact'],
  solutions: ['case', 'faq', 'contact'],
  case: ['solutions', 'consulting', 'contact'],
  consulting: ['case', 'faq', 'contact'],
  faq: ['solutions', 'consulting', 'contact'],
};

export default function PageNextSteps({ page, locale }) {
  const links = destinations[page];
  if (!links) return null;
  const ui = content[locale] || content.zh;
  return <section className="section page-next-steps" aria-labelledby="next-steps-title">
    <div className="wrap">
      <h2 id="next-steps-title">{ui.titles[page]}</h2>
      <nav className="page-next-links" aria-label={ui.label}>
        {links.map((key, index) => <a href={`/${key}.html`} key={key}>
          <span className="page-next-number">0{index + 1}</span><span>{ui[key]}</span><span className="arrow" aria-hidden="true" />
        </a>)}
      </nav>
    </div>
  </section>;
}
