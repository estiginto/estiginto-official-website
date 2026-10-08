const serviceMenuGroupsByLocale = {
  zh: {
    digital: {
      label: "網站導覽",
      items: [
        { key: "about", label: "關於我們", href: "/about.html", position: "top" },
        { key: "case", label: "精選實績", href: "/case.html", position: "left" },
        { key: "faq", label: "合作說明", href: "/faq.html", position: "right" },
        { key: "contact", label: "聯絡我們", href: "/contact.html", position: "bottom" },
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
      label: "Site navigation",
      items: [
        { key: "about", label: "About", href: "/about.html", position: "top" },
        { key: "case", label: "Selected Work", href: "/case.html", position: "left" },
        { key: "faq", label: "Working with us", href: "/faq.html", position: "right" },
        { key: "contact", label: "Contact", href: "/contact.html", position: "bottom" },
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
      label: "サイト案内",
      items: [
        { key: "about", label: "私たちについて", href: "/about.html", position: "top" },
        { key: "case", label: "実績紹介", href: "/case.html", position: "left" },
        { key: "faq", label: "ご依頼について", href: "/faq.html", position: "right" },
        { key: "contact", label: "お問い合わせ", href: "/contact.html", position: "bottom" },
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
