export const LANGUAGE_TRANSITION_SWAP_DELAY = 280;
export const LANGUAGE_TRANSITION_DURATION = 650;

export function shouldAnimateLanguageChange({
  currentLocale,
  nextLocale,
  busy,
  reducedMotion,
}) {
  return Boolean(nextLocale)
    && nextLocale !== currentLocale
    && !busy
    && !reducedMotion;
}
