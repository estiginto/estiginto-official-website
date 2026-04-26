import { useEffect, useMemo, useState } from "react";

const navItems = [
  { href: "#home", label: "首頁" },
  { href: "#about-us", label: "關於我們" },
  { href: "#portfolio", label: "解決方案" },
  { href: "#process", label: "企劃階段" },
  { href: "#contact-info", label: "聯絡我們" },
];

const portfolioItems = [
  {
    eyebrow: "e-Commerce",
    title: "電子商務方案",
    image: "/img/plan/man-holding-credit-card-hand-entering-security-code-using-laptop-keyboard.jpg",
    alt: "電子商務方案示意圖",
    body: "規劃商品結構、客服/出貨流程與金物流串接，提供順暢購物體驗並支援會員成長與行銷自動化。",
    points: ["金流/物流/發票/ERP 串接", "會員等級/點數/優惠券/再行銷", "跨境與多語多幣"],
    cta: "查看技術與模組",
    href: "#service-dev",
  },
  {
    eyebrow: "Official Website",
    title: "品牌形象方案",
    image: "/img/plan/laptop-coworking-space_53876-14515.webp",
    alt: "品牌形象網站方案示意圖",
    body: "在有限的注意力裡先被看見，以敘事與視覺建立差異化，兼顧速度與 SEO。",
    points: ["首頁敘事/關鍵頁腳本與版型", "RWD + Core Web Vitals 優化", "搜尋曝光與社群分享設定"],
    cta: "看我們怎麼做設計",
    href: "#service-design",
  },
  {
    eyebrow: "Enterprise Resource",
    title: "企業資源管理方案",
    image: "/img/plan/businesspeople-meeting-plan-analysis-graph-company-finance-strat.jpg",
    alt: "企業資源管理方案示意圖",
    body: "從流程盤點到系統落地，打通商務、財務、人資、製造與供應鏈資料。",
    points: ["流程藍圖、權限/稽核制度", "報表/儀表板與 KPI 追蹤", "與既有系統雙向整合"],
    cta: "整合服務詳情",
    href: "#service-integration",
  },
  {
    eyebrow: "Warehouse Management",
    title: "倉儲管理方案",
    image: "/img/plan/interior-large-distribution-warehouse-with-shelves-stacked-with-palettes-goods-ready-market.jpg",
    alt: "倉儲管理方案示意圖",
    body: "條碼/PDA/批號/效期/盤點/庫齡一站式導入，降錯誤、提周轉，讓庫存看得見、控得住。",
    points: ["入出庫/調撥/庫存追蹤", "撿料策略與路徑最佳化", "與 ERP、電商、OMS 串接"],
    cta: "導入重點與費用範圍",
    href: "#service-dev",
  },
  {
    eyebrow: "Customization",
    title: "客製化解決方案",
    image: "/img/plan/close-up-elegant-decoration-house.jpg",
    alt: "客製化解決方案示意圖",
    body: "平台服務、B2B 工具、APP 到資訊看板，以迭代方式，把你的構想穩定變成產品。",
    points: ["POC/MVP 快速驗證", "資料流與雲端架構設計", "安全/權限/稽核與維運"],
    cta: "從規劃開始",
    href: "#process",
  },
];

const services = [
  {
    id: "service-dev",
    title: "軟體系統開發",
    body: "網站、電商、WMS/ERP/CRM/HRM、SaaS 平台、資料儀表板。使用 React/Next.js、Node、PostgreSQL/MySQL、雲端與容器化部署。",
    points: ["模組化設計、API First、可水平擴充", "權限/稽核/日誌與備援備份", "Core Web Vitals 與 SEO 友善"],
    cta: "瞭解規劃與估算",
    href: "#process",
  },
  {
    id: "service-design",
    title: "視覺設計",
    body: "品牌識別、版型系統、元件設計與設計規範。以敘事導向與可讀性，建立一致且可延展的品牌體驗。",
    points: ["Design System / 元件庫與文件化", "RWD 響應式與無障礙 (a11y) 細節", "社群素材與開箱頁/活動頁"],
    cta: "看看案例方向",
    href: "#portfolio",
  },
  {
    id: "service-integration",
    title: "整合資訊與行銷",
    body: "以資料流與營運流程為主軸，整合金物流、第三方服務與內部系統，讓行銷與營運能被量化、被追蹤、可持續優化。",
    points: ["金流/物流/發票、LINE/Email 自動化", "GA4/事件追蹤/儀表板", "CRM/工單/客服/倉儲/會計 串接"],
    cta: "討論你的整合清單",
    href: "#contact-info",
  },
];

const processSteps = [
  ["初談（30-45 分）", "釐清目標、預算範圍、時程限制與風險。"],
  ["規劃提案", "使用情境、資料流、里程碑、估算與 UAT 驗收指標。"],
  ["MVP/模組優先級", "先做能帶來效益的 20%，快速驗證。"],
  ["開發與週更", "每週迭代，提供可操作版本與進度回報。"],
  ["上線與培訓", "文件/權限/備援上線，並安排操作訓練。"],
  ["維運與優化", "事件回應、性能安全、功能優化與報表增補。"],
];

const faqs = [
  ["Q1：預算怎麼抓？", "我們會在規劃時提供分階段估算，先落地最關鍵的 20-40%，再視成效追加，降低一次到位的風險。"],
  ["Q2：時程怎麼排？", "以里程碑與 UAT 指標拆分，每週固定 Demo 與回報，避免後期才發現落差。"],
  ["Q3：上線後怎麼維護？", "提供事件回應、月度例行檢查、版本升級、安全修補與備份演練等維運方案。"],
  ["Q4：可與現有系統整合嗎？", "可。我們採 API First，支援 ERP/金流/物流/CRM/電商等常見系統雙向串接。"],
];

const heroStats = [
  ["10+", "年資深團隊"],
  ["0-1", "規劃到上線"],
  ["API", "整合優先"],
];

function ImageBlock({ src, alt, className = "" }) {
  return (
    <>
      <img className={`img-block ${className}`} src={src} alt={alt} />
      <div
        className="img"
        role="img"
        aria-label={alt}
        style={{ backgroundImage: `url("${src}")` }}
      />
    </>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-visible", menuOpen);
    return () => document.body.classList.remove("menu-visible");
  }, [menuOpen]);

  return (
    <header className="page-header navbar page-header-drawer menu-right logo-left topmenu-right">
      <button
        className={`navbar-toggler site-menu-icon ${menuOpen ? "menu-visible" : ""}`}
        id="navMenuIcon"
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={`menu-icon menu-icon-line ${menuOpen ? "menu-visible" : ""}`}>
          <span className="text show-menu-visible">Close</span>
          <span className="text hide-menu-visible">Menu</span>
          <span className="bars">
            <span className="bar1" />
            <span className="bar2" />
            <span className="bar3" />
          </span>
        </span>
      </button>

      <a className="navbar-brand" href="/">
        <span className="logo">
          <img className="light-logo" src="/img/Logo_ESTIGINTO.svg" alt="ESTIGINTO 造物者科技" />
        </span>
      </a>

      <div className={`all-menu-wrapper ${menuOpen ? "menu-visible" : ""}`} id="navbarMenu">
        <nav className="navbar-mainmenu">
          <button className="mainmenu-bg" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
          <div className="mainmenu-content">
            <ul className="navbar-nav">
              {navItems.map((item, index) => (
                <li className={`nav-item ${index === 0 ? "active" : ""}`} key={item.href}>
                  <a className={`nav-link ${menuOpen ? "menu-visible" : ""}`} href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="navbar-footer">
              <div className="row no-gutters">
                <div className="col col-12 col-md-6" />
                <div className="col col-12 col-md-6 footer-notes">
                  <p className="text-right">Since 2012 © ESTIGINTO Co., Ltd. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="section-title text-center anim" aria-hidden="true">
      <h2 className="title-bg">{children}</h2>
    </div>
  );
}

function Hero() {
  return (
    <section className="section section-home fullscreen-md main-home section-center content-black bg-level-1" id="home">
      <div className="section-frame" aria-hidden="true" />
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <div className="row c-wrapper">
            <div className="col-12 col-md-8 text-left">
              <div className="title-desc mb-0">
                <p className="section-kicker hero-kicker">ESTIGINTO / System Craft Studio</p>
                <h1 className="display-4 display-title home-title text-no-shadow anim-blur anim-2 mb-4">
                  <span className="line-mask"><span className="text-stroke">Solution</span></span>
                  <br />
                  <span className="line-mask"><span>Provider</span></span>
                </h1>
                <p className="hero-copy anim-3">
                  始於一群國家程式競賽代表選手組成的工作室
                  <br />
                  擅長在有限預算下提供直接有效、永續與彈性的解決方案
                  並提供良好的溝通反饋，持續成為客戶滿意的首選
                </p>
              </div>
              <div className="btns-action anim-4">
                <a className="btn btn-line" href="#about-us"><span className="text">關於我們</span></a>
                <a className="btn btn-line" href="#process"><span className="text">如何開始規劃</span></a>
                <a className="btn btn-line" href="#contact-info"><span className="text">預約初步規劃</span></a>
              </div>
              <div className="hero-stats anim-5">
                {heroStats.map(([value, label]) => (
                  <div className="hero-stat" key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="image-bg-wrapper center-vh">
              <div className="image-orbit" aria-hidden="true" />
              <div className="col-wrapper">
                <ImageBlock src="/img/bg-style-2.jpg" alt="ESTIGINTO 服務情境示意圖" />
              </div>
            </div>
          </div>
        </div>

        <footer className="section-footer scrolldown">
          <a className="down" href="#portfolio">
            <span className="icon" />
            <span className="txt">Scroll</span>
          </a>
        </footer>
      </div>
    </section>
  );
}

function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = portfolioItems[activeIndex];

  const next = () => setActiveIndex((index) => (index + 1) % portfolioItems.length);
  const prev = () => setActiveIndex((index) => (index - 1 + portfolioItems.length) % portfolioItems.length);

  useEffect(() => {
    const timer = window.setInterval(next, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="section section-slider fp-auto-height-responsive content-black reveal" id="portfolio">
      <SectionTitle>Portfolio</SectionTitle>
      <div className="section-wrapper fullwidth fullscreen-md">
        <div className="slider-swiper-alpha react-portfolio-slider" style={{ "--slide-index": activeIndex }}>
          <article className="media-slide-item-alpha" key={active.title}>
            <div className="media-image mask-black">
              <ImageBlock src={active.image} alt={active.alt} />
            </div>
            <div className="media-content text-white">
              <div className="row">
                <div className="col col-12">
                  <div className="media-body body-margin-right text-anim">
                    <h4 className="text-white">{active.eyebrow}</h4>
                    <h3 className="text-white">{active.title}</h3>
                    <p>{active.body}</p>
                    <ul className="mt-2">
                      {active.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <div className="btns-action">
                      <a className="btn btn-line" href={active.href}><span className="text">{active.cta}</span></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <nav className="items-navigation" aria-label="Portfolio slider">
            <div className="items-pagination bar" aria-label={`${activeIndex + 1} / ${portfolioItems.length}`}>
              {portfolioItems.map((item, index) => (
                <button
                  className={index === activeIndex ? "active" : ""}
                  type="button"
                  key={item.title}
                  aria-label={`Show ${item.title}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <div className="items-buttons">
              <div className="items-button-prev">
                <button className="btn btn-transp-arrow" type="button" onClick={prev}>
                  <i className="icon text-white"><span className="arrow-left" /></i>
                  <span className="text text-white">Prev</span>
                </button>
              </div>
              <div className="items-button-next">
                <button className="btn btn-transp-arrow" type="button" onClick={next}>
                  <span className="text text-white">Next</span>
                  <i className="icon text-white"><span className="arrow-right" /></i>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}

function Advantage() {
  return (
    <section className="section fp-auto-height-responsive bg-level-1 reveal" id="about-us">
      <SectionTitle>Advantage</SectionTitle>
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <div className="row">
            <div className="col-12 col-md-4 text-left">
              <div className="title-desc pr-4">
                <h2 className="display-5 anim-2">做好 0 到 1<br />才能順利<br />從 1 到 100</h2>
              </div>
              <div className="btns-action anim-3 mb-3">
                <a className="btn btn-line" href="#process"><span className="text">了解更多細節</span></a>
              </div>
            </div>
            <div className="col-12 col-md-8 text-left">
              <div className="title-desc anim-4">
                <p>
                  專案成功率，取決於「規劃」與「驗收標準」。
                  <br />
                  我們以使用情境拆解需求、定義可交付與里程碑，同步考量預算、期程與未來擴充，先讓 0→1 站穩，再用資料與流程把 1→100 做扎實。
                </p>
                <ul className="mt-2">
                  <li>以商業目標與限制條件為核心，制定路線圖</li>
                  <li>每階段有清楚可驗收產出（UAT 指標）</li>
                  <li>成本/效益與風險透明，決策可控</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="section section-list-feature reveal" id="services">
      <SectionTitle>Services</SectionTitle>
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <div className="section-content-header decor">
            <div className="row">
              <div className="col-12 col-md-4 text-left">
                <div className="title-desc pr-4">
                  <h2 className="display-5 anim-2">服務範圍</h2>
                </div>
              </div>
              <div className="col-12 col-md-8 text-left">
                <div className="title-desc anim-4">
                  <p>提供你的產業火箭<br />所需要的一切支援與協助<br />將許多的不可能，實現為可能</p>
                </div>
              </div>
            </div>
          </div>

          <div className="list-items row anim-list">
            {services.map((service, index) => (
              <div className="item col-12 col-lg-4" id={service.id} key={service.id}>
                <div className="media media-service">
                  <span className="service-index">0{index + 1}</span>
                  <div className="media-body">
                    <h4>{service.title}</h4>
                    <p>{service.body}</p>
                    <ul className="mt-2">
                      {service.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                  </div>
                  <footer className="media-footer">
                    <a className="btn btn-line" href={service.href}><span className="text">{service.cta}</span></a>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section fp-auto-height-responsive bg-level-1 reveal" id="process">
      <SectionTitle>Process</SectionTitle>
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <ol className="row process-list">
            {processSteps.map(([title, body], index) => (
              <li className="col-12 col-md-6 mb-3 process-card" key={title}>
                <b>{index + 1}. {title}</b>：{body}
              </li>
            ))}
          </ol>
          <div className="btns-action mt-2">
            <a className="btn btn-line" href="#contact-info"><span className="text">預約初步規劃</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStack() {
  const stacks = useMemo(() => [
    ["Frontend", "React / Next.js、TypeScript、Tailwind、Vite、RWD、a11y"],
    ["Backend", "Node.js、REST/GraphQL、PostgreSQL/MySQL、Redis、Directus/Strapi"],
    ["DevOps & Cloud", "Docker、Nginx、CI/CD、Linux、CDN、備援與監控、物件儲存"],
  ], []);

  return (
    <section className="section fp-auto-height-responsive reveal">
      <SectionTitle>Tech Stack</SectionTitle>
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <div className="row">
            {stacks.map(([title, body]) => (
              <div className="col-12 col-md-4 stack-card" key={title}>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="section fp-auto-height-responsive bg-level-1 reveal">
      <SectionTitle>FAQ</SectionTitle>
      <div className="section-wrapper with-margin">
        <div className="section-content anim">
          <div className="row">
            {faqs.map(([title, body]) => (
              <div className="col-12 col-md-6 faq-card" key={title}>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section section-contact fp-auto-height-responsive bg-level-1 reveal" id="contact-info">
      <div className="section-wrapper with-margin">
        <div className="section-content">
          <div className="row">
            <div className="col-12 col-lg-4 anim">
              <div className="title-desc pr-4">
                <h2 className="display-5 anim-2">聯絡我們</h2>
              </div>
            </div>
            <div className="col-12 col-lg-8">
              <div className="section-content anim text-left">
                <div className="contact-information" id="contact-information">
                  <div className="title-desc mb-0">
                    <div className="address-container anim-5">
                      <div className="row">
                        <div className="col-12 col-md-6 col-lg-6">
                          <h4 className="display-6"><b>通訊資料</b></h4>
                          <p>02-2431-5362<br />contact@estiginto.com</p>
                        </div>
                        <div className="col-12 col-md-6 col-lg-6">
                          <h4 className="display-6"><b>服務時間</b></h4>
                          <p>週二至週五 10:00-18:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    const sections = document.querySelectorAll(".reveal");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <div className="page-cover" />
      <main className="page-main main-anim fullpage-container" id="mainpage">
        <Hero />
        <Portfolio />
        <Advantage />
        <Services />
        <Process />
        <TechStack />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
