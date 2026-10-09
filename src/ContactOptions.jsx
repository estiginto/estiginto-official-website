import { getServiceLabel } from "./serviceConnections.js";
import { localizeHref } from "./siteRoutes.js";

const contactCopy = {
  zh: { selected: "洽詢項目", clear: "一般洽詢", email: "Email", phone: "公司電話", mobile: "行動電話", line: "LINE", subject: "服務洽詢" },
  en: { selected: "Service of interest", clear: "General inquiry", email: "Email", phone: "Office phone", mobile: "Mobile phone", line: "LINE", subject: "Service inquiry" },
  ja: { selected: "ご相談のサービス", clear: "一般のお問い合わせ", email: "メール", phone: "オフィスに電話", mobile: "携帯電話", line: "LINE", subject: "サービスのご相談" },
};

function ChannelIcon({ type }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "email" ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></> : type === "line" ? <><path d="M21 11c0 4-4 7-9 7l-6 3 1-5a7 7 0 0 1-4-5c0-4 4-7 9-7s9 3 9 7Z" /><path d="M8 11h.1m4 0h.1m4 0h.1" /></> : <path d="M7 3 10 7 8 10a15 15 0 0 0 6 6l3-2 4 3-1 3c-9 2-18-7-17-16Z" />}</svg>;
}

export default function ContactOptions({ locale }) {
  const copy = contactCopy[locale] || contactCopy.zh;
  const id = new URLSearchParams(window.location.search).get("service");
  const service = getServiceLabel(id, locale);
  const subject = service ? `${copy.subject}：${service}` : copy.subject;
  const channels = [
    { type: "email", title: copy.email, value: "contact@estiginto.com", href: `mailto:contact@estiginto.com?subject=${encodeURIComponent(subject)}` },
    { type: "line", title: copy.line, value: "LINE", href: "https://lin.ee/vFdwfVg", external: true },
    { type: "phone", title: copy.phone, value: "+886 2 2431 5362", href: "tel:+886224315362" },
    { type: "phone", title: copy.mobile, value: "+886 972 118 427", href: "tel:+886972118427" },
  ];
  return (
    <section className="contact-options" aria-labelledby="page-title">
      <div className="wrap">
        {service ? <div className="contact-selected-service"><p>{copy.selected}：<strong>{service}</strong></p><a href={localizeHref("/contact.html", locale)}>{copy.clear}</a></div> : null}
        <div className="contact-options-grid">
          {channels.map((channel) => <a className="contact-option" key={channel.title} href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}><ChannelIcon type={channel.type} /><span><strong>{channel.title}</strong><span>{channel.value}</span></span></a>)}
        </div>
      </div>
    </section>
  );
}
