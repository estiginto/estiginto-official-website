const serviceMenuGroupsByLocale = {
  zh: {
    digital: {
      label: "解決方案",
      items: [
        { key: "system-planning", label: "系統規劃", href: "/systems-consulting.html", position: "top" },
        { key: "custom-development", label: "客製開發", href: "/solutions.html#custom-systems", position: "left" },
        { key: "system-cases", label: "系統案例", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "專案諮詢", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "顧問服務",
      items: [
        { key: "systems-consulting", label: "資訊系統", href: "/systems-consulting.html", position: "top" },
        { key: "visual-design", label: "視覺設計", href: "/visual-design.html", position: "left" },
        { key: "international-marketing", label: "國際行銷", href: "/international-marketing.html", position: "right" },
        { key: "international-finance", label: "國際金融", href: "/international-finance.html" },
        { key: "digital-integration", label: "數位整合", href: "/digital-integration.html", position: "bottom" },
      ],
    },
  },
  en: {
    digital: {
      label: "Solutions",
      items: [
        { key: "system-planning", label: "Planning", href: "/systems-consulting.html", position: "top" },
        { key: "custom-development", label: "Custom Dev", href: "/solutions.html#custom-systems", position: "left" },
        { key: "system-cases", label: "System Work", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "Consult", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "Consulting",
      items: [
        { key: "systems-consulting", label: "Information Systems", href: "/systems-consulting.html", position: "top" },
        { key: "visual-design", label: "Visual Design", href: "/visual-design.html", position: "left" },
        { key: "international-marketing", label: "International Marketing", href: "/international-marketing.html", position: "right" },
        { key: "international-finance", label: "International Finance", href: "/international-finance.html" },
        { key: "digital-integration", label: "Digital Integration", href: "/digital-integration.html", position: "bottom" },
      ],
    },
  },
  ja: {
    digital: {
      label: "ソリューション",
      items: [
        { key: "system-planning", label: "システム設計", href: "/systems-consulting.html", position: "top" },
        { key: "custom-development", label: "開発", href: "/solutions.html#custom-systems", position: "left" },
        { key: "system-cases", label: "導入事例", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "相談", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "コンサルティング",
      items: [
        { key: "systems-consulting", label: "情報システム", href: "/systems-consulting.html", position: "top" },
        { key: "visual-design", label: "ビジュアルデザイン", href: "/visual-design.html", position: "left" },
        { key: "international-marketing", label: "国際マーケティング", href: "/international-marketing.html", position: "right" },
        { key: "international-finance", label: "国際金融", href: "/international-finance.html" },
        { key: "digital-integration", label: "デジタル統合", href: "/digital-integration.html", position: "bottom" },
      ],
    },
  },
};

export function getServiceMenuGroups(locale) {
  return serviceMenuGroupsByLocale[locale] || serviceMenuGroupsByLocale.zh;
}
