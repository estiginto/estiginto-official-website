import { useState } from "react";
import { consultingServicesByLocale } from "./consultingContent.js";
import { consultingCaseIds, consultingFaqByLocale, consultingPageCopy, consultingServiceIds, getConsultingHref } from "./consultingPages.js";
import { caseStudiesByLocale } from "./content2026.js";
import { getImplementationHref, getServiceImplementationIds } from "./serviceImplementation.js";
import { faqContentByLocale } from "./faqContent.js";
import { serviceDetailsByLocale } from "./serviceDetails.js";
import { getContactHref, getServiceLabel } from "./serviceConnections.js";
import { localizeHref } from "./siteRoutes.js";

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;

export function ConsultingServices({ copy }) {
  const content = consultingServicesByLocale[copy.locale];
  const labels = consultingPageCopy[copy.locale];
  return (
    <section className="section consulting-services consulting-directory" aria-label={content.sectionLabel}>
      <div className="wrap">
        <div className="advisory-directory-grid">
          {consultingServiceIds.map((id, index) => {
            const service = content.services.find((item) => item.id === id);
            return <a className="advisory-directory-card" href={localizeHref(getConsultingHref(id), copy.locale)} key={id}>
              <span className="consulting-service-number">{String(index + 1).padStart(2, "0")}</span>
              <h2>{getServiceLabel(id, copy.locale)}</h2>
              <p>{service.summary}</p>
              <span className="advisory-card-action">{labels.view}<Arrow /></span>
            </a>;
          })}
        </div>
      </div>
    </section>
  );
}

export function ServiceFaqDirectory({ locale }) {
  const labels = consultingPageCopy[locale];
  return <section className="service-faq-directory wrap" aria-labelledby="service-faq-directory-title">
    <h2 id="service-faq-directory-title">{labels.faqDirectory}</h2>
    <nav className="service-related-links" aria-label={labels.faqDirectory}>
      {consultingServiceIds.map((id) => <a key={id} href={localizeHref(`${getConsultingHref(id)}#service-faq`, locale)}>{getServiceLabel(id, locale)}</a>)}
    </nav>
  </section>;
}

function ServiceFAQ({ id, locale }) {
  const [open, setOpen] = useState(null);
  const labels = consultingPageCopy[locale];
  const items = id === "international-finance"
    ? faqContentByLocale[locale][3].items.map(([, question, answer]) => [question, answer])
    : consultingFaqByLocale[locale][id];
  return <section className="advisory-block advisory-faq" id="service-faq" aria-labelledby="service-faq-title">
    <h2 id="service-faq-title">{labels.faq}</h2>
    <div className="faq-list">
      {items.map(([question, answer], index) => {
        const expanded = open === index;
        return <div className={`faq-item ${expanded ? "open" : ""}`} key={index}>
          <h3><button className="faq-q" type="button" id={`service-question-${index}`} aria-expanded={expanded} aria-controls={`service-answer-${index}`} onClick={() => setOpen(expanded ? null : index)}>
            <span className="num">{String(index + 1).padStart(2, "0")}</span><span>{question}</span><span className="toggle" aria-hidden="true" />
          </button></h3>
          <div className="faq-a" id={`service-answer-${index}`} role="region" aria-labelledby={`service-question-${index}`} aria-hidden={!expanded} inert={!expanded}><div><p>{answer}</p></div></div>
        </div>;
      })}
    </div>
    <a className="service-inline-link" href={localizeHref("/faq.html", locale)}>{labels.general}</a>
  </section>;
}

function ServiceImplementation({ id, locale }) {
  const ids = getServiceImplementationIds(id);
  if (!ids.length) return null;
  const details = serviceDetailsByLocale[locale];
  return <div className="service-delivery" id="service-implementation">
    {ids.map((target) => {
      const delivery = details.solutions[target];
      return <section className="service-implementation" id={`implementation-${target}`} key={target} aria-labelledby={`implementation-${target}-title`}>
        <h3 id={`implementation-${target}-title`}>{details.labels.deliverables}</h3>
        <ul>{delivery.deliverables.map((entry) => <li key={entry}>{entry}</li>)}</ul>
      </section>;
    })}
    <p className="service-scope-note">{details.labels.note}</p>
  </div>;
}

export function ConsultingServicePage({ copy, id }) {
  const locale = copy.locale;
  const content = consultingServicesByLocale[locale];
  const service = content.services.find((item) => item.id === id);
  const labels = consultingPageCopy[locale];
  const details = serviceDetailsByLocale[locale];
  const cases = consultingCaseIds[id].map((caseId) => caseStudiesByLocale[locale].find((item) => item.id === caseId));
  return <article className="section consulting-services advisory-page" data-service={id}>
    <div className="wrap">
      <div className="advisory-page-tools">
        <a className="service-inline-link" href={localizeHref("/consulting.html", locale)}>{labels.directory}</a>
      </div>
      <nav className="advisory-section-nav" aria-label={labels.contents}>
        <a href="#service-content">{labels.content}</a>
        {cases.length ? <a href="#reference-cases">{labels.cases}</a> : null}
        <a href="#service-faq">{labels.faq}</a>
      </nav>
      <section className="advisory-block" id="service-content" aria-labelledby="service-content-title">
        <h2 id="service-content-title">{labels.content}</h2>
        <ul className="advisory-scope-list">{service.scope.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.description}</p></li>)}</ul>
        <ServiceImplementation id={id} locale={locale} />
        {id === "international-finance" ? <div className="service-finance-note"><p>{labels.financeNote}</p><a className="service-inline-link" href={localizeHref(getImplementationHref("custom-systems"), locale)}>{details.labels.systemImplementation}<Arrow /></a></div> : null}
      </section>
      {cases.length ? <section className="advisory-block" id="reference-cases" aria-labelledby="reference-cases-title">
        <h2 id="reference-cases-title">{labels.cases}</h2>
        <p className="advisory-block-intro">{id === "international-marketing" ? labels.marketingCasesIntro : labels.casesIntro}</p>
        <div className="advisory-case-grid">{cases.map((item) => <article className="advisory-case" key={item.id} data-case={item.id}>
          <h3>{item.title}</h3><p>{item.summary}</p>
        </article>)}</div>
      </section> : null}
      <ServiceFAQ id={id} locale={locale} />
      <div className="advisory-inquiry" id="service-process"><a className="btn" href={getContactHref(id, locale)}><span>{labels.inquiry}</span><span className="arrow" aria-hidden="true" /></a></div>
    </div>
  </article>;
}
