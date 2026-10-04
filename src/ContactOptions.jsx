import { getServiceLabel } from "./serviceConnections.js";
import { localizeHref } from "./siteRoutes.js";

const contactCopy = {
  zh: { title: "討論您的需求", selected: "洽詢項目", clear: "一般洽詢", email: "Email 洽詢", phone: "電話聯絡", mobile: "行動電話", line: "LINE 聯絡", details: "可提供的需求資訊", items: ["專案背景、希望解決的問題與服務項目", "既有網站、系統、品牌資料或跨境資產整理需求", "預計時程、參與團隊與方便聯絡的方式"], finance: "國際金融需求可說明涉及的國家或地區、資產與持有架構，以及需要協作的法律、稅務或財務議題。法律、稅務、信託及金融事項由相關專業團隊依需求共同評估。", privacy: "初次洽詢可提供概況；機密、個人及資產文件的傳送方式與存取權限，於討論中確認。", subject: "服務洽詢" },
  en: { title: "Discuss your requirements", selected: "Service of interest", clear: "General inquiry", email: "Email us", phone: "Call our office", mobile: "Mobile phone", line: "Contact on LINE", details: "Useful information to share", items: ["Project background, objectives, and services of interest", "Existing websites, systems, brand materials, or cross-border asset needs", "Expected schedule, participating teams, and preferred contact method"], finance: "For international finance inquiries, describe the jurisdictions, assets and ownership structure, and legal, tax, or financial matters requiring coordination. Relevant professional teams assess legal, tax, trust, and financial matters according to your requirements.", privacy: "An overview is enough for an initial inquiry. We agree how confidential, personal, and asset documents will be shared and who may access them during the discussion.", subject: "Service inquiry" },
  ja: { title: "ご要望をお聞かせください", selected: "ご相談のサービス", clear: "一般のお問い合わせ", email: "メールで相談", phone: "オフィスに電話", mobile: "携帯電話", line: "LINEで相談", details: "お知らせいただきたい情報", items: ["プロジェクトの背景、課題、ご希望のサービス", "既存のWebサイト、システム、ブランド資料、国際資産整理の要件", "予定日程、参加チーム、ご希望の連絡方法"], finance: "国際金融のご相談では、対象の国・地域、資産と保有構造、連携が必要な法務・税務・財務の課題をお知らせください。法務・税務・信託・金融の事項は、ご要望に応じて専門チームと検討します。", privacy: "初回は概要をお知らせください。機密情報、個人情報、資産関連文書の共有方法とアクセス権は、ご相談の中で確認します。", subject: "サービスのご相談" },
};

const meetingCopy = {
  zh: "會面地點、時間與參與人員，請於聯絡時確認。跨境需求可一併說明涉及地區與溝通語言；實際協作方式及專業團隊依專案需求確認。",
  en: "Confirm the meeting location, time, and participants when contacting us. For cross-border work, share the jurisdictions and preferred communication language; coordination and professional teams are confirmed for the project.",
  ja: "ご連絡時に、打ち合わせの場所、日時、参加者をご確認ください。国際案件では、対象の国・地域と希望する連絡言語もお知らせください。実際の連携方法と専門チームは案件の要件に応じて確認します。",
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
    { type: "phone", title: copy.phone, value: "+886 2 2431 5362", href: "tel:+886224315362" },
    { type: "phone", title: copy.mobile, value: "+886 972 118 427", href: "tel:+886972118427" },
    { type: "line", title: copy.line, value: "LINE", href: "https://lin.ee/vFdwfVg", external: true },
  ];
  return (
    <section className="contact-options" aria-labelledby="contact-options-title">
      <div className="wrap">
        <h2 id="contact-options-title">{copy.title}</h2>
        {service ? <div className="contact-selected-service"><p>{copy.selected}：<strong>{service}</strong></p><a href={localizeHref("/contact.html", locale)}>{copy.clear}</a></div> : null}
        <div className="contact-options-grid">
          {channels.map((channel) => <a className="contact-option" key={channel.title} href={channel.href} target={channel.external ? "_blank" : undefined} rel={channel.external ? "noopener noreferrer" : undefined}><ChannelIcon type={channel.type} /><span><strong>{channel.title}</strong><span>{channel.value}</span></span></a>)}
        </div>
        <div className="contact-requirements"><h3>{copy.details}</h3><ul>{copy.items.map((item) => <li key={item}>{item}</li>)}</ul>{id === "international-finance" ? <p>{copy.finance}</p> : null}<p>{meetingCopy[locale] || meetingCopy.zh}</p><p className="contact-privacy-note">{copy.privacy}</p></div>
      </div>
    </section>
  );
}
