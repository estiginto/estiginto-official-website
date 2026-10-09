import { getServiceLabel } from "./serviceConnections.js";
import { localizeHref } from "./siteRoutes.js";

const contactCopy = {
  zh: { selected: "洽詢項目", clear: "一般洽詢", email: "Email", phone: "公司電話", mobile: "行動電話", line: "LINE 官方帳號", subject: "服務洽詢" },
  en: { selected: "Service of interest", clear: "General inquiry", email: "Email", phone: "Office phone", mobile: "Mobile phone", line: "LINE official account", subject: "Service inquiry" },
  ja: { selected: "ご相談のサービス", clear: "一般のお問い合わせ", email: "メール", phone: "オフィスに電話", mobile: "携帯電話", line: "LINE公式アカウント", subject: "サービスのご相談" },
};

function ChannelIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "email" ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></> : type === "line" ? <><path d="M21 11c0 4-4 7-9 7l-6 3 1-5a7 7 0 0 1-4-5c0-4 4-7 9-7s9 3 9 7Z" /><path d="M8 11h.1m4 0h.1m4 0h.1" /></> : <path d="M7 3 10 7 8 10a15 15 0 0 0 6 6l3-2 4 3-1 3c-9 2-18-7-17-16Z" />}</svg>;
}

function ContactArrow() {
  return <svg className="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

export default function ContactOptions({ locale, page, children }) {
  const copy = contactCopy[locale] || contactCopy.zh;
  const id = new URLSearchParams(window.location.search).get("service");
  const service = getServiceLabel(id, locale);
  const subject = service ? `${copy.subject}：${service}` : copy.subject;
  const phones = [
    { type: "phone", title: copy.phone, value: "+886 2 2431 5362", href: "tel:+886224315362" },
    { type: "phone", title: copy.mobile, value: "+886 972 118 427", href: "tel:+886972118427" },
  ];
  return (
    <section className="contact-page" aria-labelledby="page-title">
      {children}
      <div className="wrap contact-layout">
        <header className="contact-heading">
          <p className="contact-kicker">{page.kicker}</p>
          <h1 id="page-title">{page.title}</h1>
          <p className="contact-intro">{page.lede}</p>
        </header>
        <div className="contact-methods">
          {service ? <div className="contact-selected-service"><p>{copy.selected}：<strong>{service}</strong></p><a href={localizeHref("/contact.html", locale)}>{copy.clear}</a></div> : null}
          <a className="contact-option contact-email" href={`mailto:contact@estiginto.com?subject=${encodeURIComponent(subject)}`}>
            <span className="contact-channel-label"><ChannelIcon type="email" />{copy.email}</span>
            <span className="contact-email-address">contact@estiginto.com</span>
            <ContactArrow />
          </a>
          <a className="contact-option contact-line" href="https://lin.ee/vFdwfVg" target="_blank" rel="noopener noreferrer">
            <span><ChannelIcon type="line" />{copy.line}</span><ContactArrow />
          </a>
          <div className="contact-phones">
            {phones.map((channel) => <a className="contact-option contact-phone" key={channel.title} href={channel.href}><span className="contact-channel-label"><ChannelIcon type={channel.type} />{channel.title}</span><span className="contact-phone-number">{channel.value}</span></a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
