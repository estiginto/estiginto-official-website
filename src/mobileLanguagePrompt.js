const supportedLocales = new Set(["zh", "en", "ja"]);

export function resolveBrowserLocale(language = "") {
  const primary = String(language).toLowerCase().split("-")[0];
  return supportedLocales.has(primary) ? primary : "zh";
}

export function getInitialLocale(savedLocale, browserLanguage) {
  return supportedLocales.has(savedLocale)
    ? savedLocale
    : resolveBrowserLocale(browserLanguage);
}

export function shouldShowMobileHomeLanguagePrompt({ initialSection, shouldUseMobileNav }) {
  return !initialSection && shouldUseMobileNav;
}
