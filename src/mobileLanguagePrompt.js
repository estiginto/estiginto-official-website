const supportedLocales = new Set(["zh", "en", "ja"]);

export function readLanguageCookie(cookieString = "") {
  for (const pair of String(cookieString).split(";")) {
    const [rawName, ...rawValueParts] = pair.trim().split("=");
    if (rawName !== "estiginto_locale") continue;

    try {
      const value = decodeURIComponent(rawValueParts.join("="));
      return supportedLocales.has(value) ? value : null;
    } catch {
      return null;
    }
  }

  return null;
}

export function serializeLanguageCookie(locale, secure = false) {
  if (!supportedLocales.has(locale)) return "";

  const parts = [
    `estiginto_locale=${encodeURIComponent(locale)}`,
    "Max-Age=31536000",
    "Path=/",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

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
