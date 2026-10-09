const serviceMenuGroupsByLocale = {
  zh: {
    digital: {
      label: "網站導覽",
      items: [
        { key: "about", label: "關於我們", href: "/about.html", position: "top" },
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
      ],
    },
  },
  en: {
    digital: {
      label: "Site navigation",
      items: [
        { key: "about", label: "About", href: "/about.html", position: "top" },
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
      ],
    },
  },
  ja: {
    digital: {
      label: "サイト案内",
      items: [
        { key: "about", label: "私たちについて", href: "/about.html", position: "top" },
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
      ],
    },
  },
};

export function getServiceMenuGroups(locale) {
  return serviceMenuGroupsByLocale[locale] || serviceMenuGroupsByLocale.zh;
}
