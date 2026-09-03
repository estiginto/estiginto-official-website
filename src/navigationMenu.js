const serviceMenuGroupsByLocale = {
  zh: {
    digital: {
      label: "解決方案",
      items: [
        { key: "system-planning", label: "系統規劃", href: "/solutions.html", position: "top" },
        { key: "custom-development", label: "客製開發", href: "/solutions.html", position: "left" },
        { key: "system-cases", label: "系統案例", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "專案諮詢", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "顧問服務",
      items: [
        { key: "systems-consulting", label: "軟體系統", href: "/consulting.html#systems-consulting", position: "top" },
        { key: "visual-design", label: "視覺設計", href: "/consulting.html#visual-design", position: "left" },
        { key: "international-marketing", label: "國際行銷", href: "/consulting.html#international-marketing", position: "right" },
        { key: "digital-integration", label: "數位整合", href: "/consulting.html#digital-integration", position: "bottom" },
      ],
    },
  },
  en: {
    digital: {
      label: "Solutions",
      items: [
        { key: "system-planning", label: "Planning", href: "/solutions.html", position: "top" },
        { key: "custom-development", label: "Custom Dev", href: "/solutions.html", position: "left" },
        { key: "system-cases", label: "System Work", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "Consult", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "Consulting",
      items: [
        { key: "systems-consulting", label: "Software Systems", href: "/consulting.html#systems-consulting", position: "top" },
        { key: "visual-design", label: "Visual", href: "/consulting.html#visual-design", position: "left" },
        { key: "international-marketing", label: "Global", href: "/consulting.html#international-marketing", position: "right" },
        { key: "digital-integration", label: "Integration", href: "/consulting.html#digital-integration", position: "bottom" },
      ],
    },
  },
  ja: {
    digital: {
      label: "ソリューション",
      items: [
        { key: "system-planning", label: "システム設計", href: "/solutions.html", position: "top" },
        { key: "custom-development", label: "開発", href: "/solutions.html", position: "left" },
        { key: "system-cases", label: "導入事例", href: "/case.html#case-group-operations-management", position: "right" },
        { key: "project-consulting", label: "相談", href: "/contact.html", position: "bottom" },
      ],
    },
    growth: {
      label: "コンサルティング",
      items: [
        { key: "systems-consulting", label: "ソフトウェアシステム", href: "/consulting.html#systems-consulting", position: "top" },
        { key: "visual-design", label: "ビジュアル", href: "/consulting.html#visual-design", position: "left" },
        { key: "international-marketing", label: "海外展開", href: "/consulting.html#international-marketing", position: "right" },
        { key: "digital-integration", label: "デジタル統合", href: "/consulting.html#digital-integration", position: "bottom" },
      ],
    },
  },
};

export function getServiceMenuGroups(locale) {
  return serviceMenuGroupsByLocale[locale] || serviceMenuGroupsByLocale.zh;
}
