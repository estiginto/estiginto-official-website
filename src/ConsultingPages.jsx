import { useState } from "react";
import { consultingServicesByLocale } from "./consultingContent.js";
import { consultingCaseIds, consultingFaqByLocale, consultingPageCopy, consultingServiceIds, getConsultingHref } from "./consultingPages.js";
import { caseStudiesByLocale, serviceFamiliesByLocale } from "./content2026.js";
import { getImplementationHref, getServiceImplementationIds, implementationOwners } from "./serviceImplementation.js";
import { faqContentByLocale } from "./faqContent.js";
import { serviceDetailsByLocale } from "./serviceDetails.js";
import { connectionCopy, consultingConnections, getContactHref, getServiceLabel } from "./serviceConnections.js";
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
              <ul className="advisory-directory-topics">{service.scope.slice(0, 3).map((item) => <li key={item.title}>{item.title}</li>)}</ul>
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
  const copy = consultingPageCopy[locale];
  const details = serviceDetailsByLocale[locale];
  return <section className="advisory-block" id="service-implementation" aria-labelledby="service-implementation-title">
    <h2 id="service-implementation-title">{copy.implementation}</h2>
    {ids.map((target) => {
      const item = serviceFamiliesByLocale[locale].find((family) => family.id === target);
      const delivery = details.solutions[target];
      return <section className="service-implementation" id={`implementation-${target}`} key={target} aria-labelledby={`implementation-${target}-title`}>
        <h3 id={`implementation-${target}-title`}>{item.title}</h3>
        <p className="advisory-block-intro">{item.summary}</p>
        <h4>{copy.capabilities}</h4>
        <ul className="service-implementation-features">{item.capabilities.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <div className="service-detail-grid">
          <section><h4>{details.labels.deliverables}</h4><ul>{delivery.deliverables.map((entry) => <li key={entry}>{entry}</li>)}</ul></section>
          <section><h4>{details.labels.preparation}</h4><p>{delivery.preparation}</p></section>
          <section><h4>{details.labels.boundaries}</h4><p>{delivery.boundaries}</p></section>
        </div>
        <p className="service-scope-note">{details.labels.note}</p>
      </section>;
    })}
  </section>;
}

export function ConsultingServicePage({ copy, id, children }) {
  const locale = copy.locale;
  const content = consultingServicesByLocale[locale];
  const service = content.services.find((item) => item.id === id);
  const labels = consultingPageCopy[locale];
  const details = serviceDetailsByLocale[locale];
  const cases = consultingCaseIds[id].map((caseId) => caseStudiesByLocale[locale].find((item) => item.id === caseId));
  const related = (consultingConnections[id] || []).filter((target) => implementationOwners[target] !== id);
  return <article className="section consulting-services advisory-page" data-service={id}>
    <div className="wrap">
      <div className="advisory-page-tools">
        <a className="service-inline-link" href={localizeHref("/consulting.html", locale)}>{labels.directory}</a>
        <a className="service-inline-link advisory-top-inquiry" href={getContactHref(id, locale)}>{labels.inquiry}<Arrow /></a>
      </div>
      <nav className="advisory-section-nav" aria-label={labels.contents}>
        <a href="#service-content">{labels.content}</a>
        {getServiceImplementationIds(id).length ? <a href="#service-implementation">{labels.implementation}</a> : null}
        {cases.length ? <a href="#reference-cases">{labels.cases}</a> : null}
        <a href="#service-faq">{labels.faq}</a>
        <a href="#service-process">{labels.process}</a>
      </nav>
      <section className="advisory-block" id="service-content" aria-labelledby="service-content-title">
        <h2 id="service-content-title">{labels.content}</h2>
        <div className="advisory-overview">
          <section><h3>{content.labels.situations}</h3><ul>{service.situations.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>{content.labels.deliverables}</h3><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        <section className="advisory-scope" aria-labelledby="service-scope-title">
          <h3 id="service-scope-title">{content.labels.scope}</h3>
          <ul className="advisory-scope-list">{service.scope.map((item) => <li key={item.title}><h4>{item.title}</h4><p>{item.description}</p></li>)}</ul>
        </section>
        {children}
        <div className="consulting-execution"><div><strong>{content.labels.execution}</strong><p>{service.execution}</p></div></div>
        {related.length ? <div className="service-related-links"><span>{connectionCopy[locale].implementation}</span>{related.map((target) => <a href={localizeHref(getImplementationHref(target), locale)} key={target}>{getServiceLabel(target, locale)}</a>)}</div> : null}
      </section>
      <ServiceImplementation id={id} locale={locale} />
      {cases.length ? <section className="advisory-block" id="reference-cases" aria-labelledby="reference-cases-title">
        <h2 id="reference-cases-title">{labels.cases}</h2>
        <p className="advisory-block-intro">{id === "international-marketing" ? labels.marketingCasesIntro : labels.casesIntro}</p>
        <div className="advisory-case-grid">{cases.map((item) => <article className="advisory-case" key={item.id} data-case={item.id}>
          <p className="advisory-case-outcome">{item.outcome}</p><h3>{item.title}</h3><p>{item.summary}</p>
          <ul>{item.capabilities.map((entry) => <li key={entry}>{entry}</li>)}</ul>
        </article>)}</div>
      </section> : null}
      <ServiceFAQ id={id} locale={locale} />
      <section className="consulting-process advisory-block" id="service-process" aria-labelledby="consulting-process-title">
        <h2 id="consulting-process-title">{content.processTitle}</h2>
        <ol>{content.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step}</h3><p>{details.process[index]}</p></div></li>)}</ol>
      </section>
      <div className="advisory-inquiry"><a className="btn" href={getContactHref(id, locale)}><span>{labels.inquiry}</span><span className="arrow" aria-hidden="true" /></a></div>
      <nav className="advisory-other-services" aria-label={labels.other}><h2>{labels.other}</h2><div className="service-related-links">{consultingServiceIds.filter((target) => target !== id).map((target) => <a key={target} href={localizeHref(getConsultingHref(target), locale)}>{getServiceLabel(target, locale)}</a>)}</div></nav>
    </div>
  </article>;
}
