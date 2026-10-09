import { useEffect, useRef, useState } from "react";
import "./businessJourney.css";
import { getConsultingHref } from "./consultingPages.js";
import { getImplementationHref } from "./serviceImplementation.js";
import { localizeHref } from "./siteRoutes.js";

const destinations = [
  [getImplementationHref("graphic-design"), getConsultingHref("visual-design")],
  [getImplementationHref("website-design"), getImplementationHref("marketing-ads"), getConsultingHref("digital-integration")],
  [getImplementationHref("custom-systems"), getConsultingHref("systems-consulting")],
  [getConsultingHref("international-marketing")],
  [getConsultingHref("international-finance")],
];

const content = {
  zh: {
    label: "企業成長路徑", title: "從 0 到 1，持續成長。",
    intro: "從品牌起步到跨國經營，服務隨企業一起成長。規模越大，越需要升級視覺、行銷與營運能力。",
    loop: "成長，開啟下一輪升級。", loopText: "更大的企業，需要更成熟的品牌視覺與行銷策略。", loopLinks: ["品牌視覺升級", "行銷策略升級"],
    note: "依企業現況切入，服務可並行、持續深化；階段代表發展需求，並非固定年限。",
    ongoing: "營運系統持續演進", ongoingText: "從日常營運到跨國協作，隨組織、流程與市場規模擴充。",
    stages: [
      ["品牌起步", "讓想法有自己的樣子", "建立品牌定位、識別與視覺風格，讓企業有清楚、一致的對外形象。", ["品牌與平面設計", "視覺設計顧問"]],
      ["數位營運", "建立接觸與成交的入口", "以網站與電子商務承接客戶，串聯內容、行銷、金流與物流。", ["網站與電子商務", "行銷與廣告投放", "數位整合顧問"]],
      ["營運成長", "讓系統跟上企業規模", "整合訂單、會員、庫存與內部管理，讓營運流程與資料成為長期成長的基礎。", ["客製化營運系統", "資訊系統顧問"]],
      ["國際拓展", "與海外市場建立連結", "依市場規劃多語內容、國際 SEO、廣告與在地化溝通。", ["國際行銷顧問"]],
      ["跨國經營", "整合跨境專業與資源", "當企業跨國布局，串聯法律與財務規劃專業，整合資產資訊與管理系統。", ["國際金融服務"]],
    ],
  },
  en: {
    label: "Business growth journey", title: "From zero to one. And to the world.",
    loop: "Growth starts the next evolution.", loopText: "A bigger business needs a stronger brand and marketing strategy.", loopLinks: ["Evolve your brand", "Evolve your marketing"],
    intro: "Each stage calls for new capabilities. We connect brand, digital operations, and cross-border expertise to your business journey.",
    note: "Start where your business is today. Services can overlap and evolve; stages reflect needs, not fixed timelines.",
    ongoing: "Systems evolve with your business", ongoingText: "From daily operations to cross-border collaboration, adapting to your people, processes, and markets.",
    stages: [
      ["Brand foundation", "Give your idea an identity", "Define your positioning, identity, and visual language for a coherent presence.", ["Brand & graphic design", "Visual design consulting"]],
      ["Digital operations", "Connect with customers", "Build websites and e-commerce that connect content, marketing, payments, and logistics.", ["Websites & e-commerce", "Marketing & advertising", "Digital integration"]],
      ["Operational growth", "Build systems that scale", "Connect orders, customers, inventory, and internal workflows for sustained growth.", ["Custom operational systems", "Information systems consulting"]],
      ["Global expansion", "Reach international markets", "Plan multilingual content, international SEO, advertising, and local communication.", ["International marketing"]],
      ["Multinational operations", "Connect cross-border expertise", "Coordinate legal and financial planning specialists, asset information, and management systems.", ["International finance services"]],
    ],
  },
  ja: {
    label: "企業成長のタイムライン", title: "0 から 1 へ、そして世界へ。",
    loop: "成長が、次の進化につながる。", loopText: "企業の拡大に合わせて、ブランドとマーケティングも進化します。", loopLinks: ["ブランドの進化", "マーケティングの進化"],
    intro: "成長段階ごとに必要な力を。ブランド、デジタル運営、国際的な専門リソースで、企業の歩みを支えます。",
    note: "現在の課題から取り組めます。各サービスは並行して継続でき、段階は固定の年数を示すものではありません。",
    ongoing: "事業とともに進化する業務システム", ongoingText: "日常業務から国際協働まで、組織・業務・市場の拡大に合わせて発展します。",
    stages: [
      ["ブランドの始動", "アイデアに個性を", "ポジショニング、企業識別、ビジュアルを整え、一貫したブランド像を構築します。", ["ブランド・グラフィック", "ビジュアルコンサルティング"]],
      ["デジタル運営", "顧客とつながる入口を", "Web・ECを通じて、コンテンツ、販促、決済、物流をつなぎます。", ["Web・EC制作", "マーケティング・広告", "デジタル統合"]],
      ["事業の成長", "規模に応じた仕組みを", "受注、顧客、在庫、社内管理を統合し、長期的な成長基盤を構築します。", ["業務システム開発", "情報システムコンサルティング"]],
      ["海外への展開", "海外市場との接点を", "多言語コンテンツ、国際SEO、広告、現地に合ったコミュニケーションを設計します。", ["国際マーケティング"]],
      ["多国籍での経営", "国際的な専門家と連携", "法務・財務計画の専門家と連携し、資産情報と管理システムを整えます。", ["国際金融サービス"]],
    ],
  },
};

const journeyUi = {
  zh: { prompt: "選擇成長階段", previous: "上一個階段", next: "下一個階段", cycle: "成長，持續循環", ongoing: "長期支援", stage: "成長階段" },
  en: { prompt: "Explore each stage", previous: "Previous stage", next: "Next stage", cycle: "Growth keeps evolving", ongoing: "Ongoing support", stage: "Growth stage" },
  ja: { prompt: "成長段階を選ぶ", previous: "前の段階", next: "次の段階", cycle: "成長は循環する", ongoing: "長期サポート", stage: "成長段階" },
};

function JourneyIcon({ index, ...props }) {
  const paths = [
    <><path d="m12 3 8 8-8 10-4-5-5-4 9-9Z" /><path d="m3 21 6-6m-1 1 7-7" /><circle cx="15" cy="9" r="2" /></>,
    <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01m-3 6h2l1.5 4h6l1.5-4h-6M11 18h.01M16 18h.01" /></>,
    <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></>,
    <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18m-16-5h14M5 17h14" /></>,
    <><path d="M3 21h18M5 21V8l7-5v18m0-12h7v12M8 10h.01M8 14h.01M8 18h.01M15 12h.01M15 16h.01" /></>,
  ];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[index]}</svg>;
}

function JourneyArrow({ back = false }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={back ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function BusinessJourney({ locale }) {
  const copy = content[locale] || content.zh;
  const ui = journeyUi[locale] || journeyUi.zh;
  const [active, setActive] = useState(0);
  const stagesRef = useRef(null);
  const [stage, title, description, services] = copy.stages[active];

  useEffect(() => {
    const item = stagesRef.current.children[active];
    const viewport = stagesRef.current.parentElement;
    const itemBounds = item.getBoundingClientRect();
    const viewportBounds = viewport.getBoundingClientRect();
    if (itemBounds.left < viewportBounds.left || itemBounds.right > viewportBounds.right) {
      viewport.scrollTo({
        left: item.offsetLeft - (viewport.clientWidth - item.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  }, [active]);

  return (
    <section className="section business-journey reveal" id="business-journey" aria-labelledby="journey-title">
      <div className="wrap">
        <header className="journey-heading">
          <h2 id="journey-title">{copy.title}</h2>
          <p className="journey-intro">{copy.intro}</p>
        </header>
        <div className="growth-experience">
          <div className="growth-visual">
            <div className="growth-network">
              <ol className="growth-node-list" aria-label={ui.prompt} ref={stagesRef}>
                {copy.stages.map(([label], index) => (
                  <li className="growth-node-position" key={index}>
                    <button className={"growth-node " + (active === index ? "is-selected" : "")} type="button" aria-pressed={active === index} aria-controls="growth-detail" onClick={() => setActive(index)} onFocus={() => setActive(index)}>
                      <span className="growth-icon-tile"><JourneyIcon index={index} /></span>
                      <span className="growth-node-label"><span>{String(index + 1).padStart(2, "0")}</span>{label}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="growth-persistence">
              <div className="growth-persistence-heading"><span className="growth-live-dot" aria-hidden="true" /><strong>{copy.ongoing}</strong><span>{ui.ongoing}</span></div>
              <p>{copy.ongoingText}</p>
            </div>
          </div>
          <div className="growth-detail" id="growth-detail" aria-live="polite" aria-atomic="true">
            <div className="growth-detail-copy" key={active}>
              <span className="growth-detail-number">{String(active + 1).padStart(2, "0")} <span>/ 05</span></span>
              <h3>{stage}</h3>
              <p className="growth-detail-title">{title}</p>
              <p className="growth-detail-description">{description}</p>
              <ul className="growth-service-links">
                {services.map((service, index) => <li key={service}><a href={localizeHref(destinations[active][index], locale)}><span>{service}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" strokeLinecap="round" strokeLinejoin="round" /></svg></a></li>)}
              </ul>
            </div>
            <div className="growth-stage-controls">
              <span>{ui.prompt}</span>
              <button type="button" aria-label={ui.previous} onClick={() => setActive((current) => (current + 4) % 5)}><JourneyArrow back /></button>
              <button type="button" aria-label={ui.next} onClick={() => setActive((current) => (current + 1) % 5)}><JourneyArrow /></button>
            </div>
          </div>
        </div>
        <div className="growth-renewal">
          <p>{copy.loopText}</p>
          <div><a href={localizeHref(getImplementationHref("graphic-design"), locale)}>{copy.loopLinks[0]}<span aria-hidden="true">↗</span></a><a href={localizeHref(getImplementationHref("marketing-ads"), locale)}>{copy.loopLinks[1]}<span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
    </section>
  );
}

