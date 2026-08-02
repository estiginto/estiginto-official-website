# Language Cookie Prompt Design

## Goal

Show the mobile homepage language prompt only when the visitor does not have a valid language cookie. Once a visitor chooses or changes a language, remember that choice for one year and do not ask again while the cookie remains valid.

## Cookie contract

- Cookie name: `estiginto_locale`.
- Supported values: `zh`, `en`, and `ja`.
- Lifetime: 31,536,000 seconds (365 days).
- Scope and policy: `Path=/; SameSite=Lax`.
- Add `Secure` when the page is served over HTTPS.
- A missing cookie or unsupported value is treated as no valid cookie.

## Initial locale and prompt behavior

- The prompt remains limited to the mobile homepage.
- A valid `estiginto_locale` cookie prevents the prompt from appearing.
- If the cookie is missing or invalid, the prompt appears even when an older `estiginto-locale` localStorage value exists. This gives existing visitors one final explicit choice under the new cookie contract.
- The initial locale uses the valid cookie first, then the existing valid localStorage value, then the browser language fallback.
- Desktop pages and non-home pages never show the prompt, as before.

## Persistence

- Selecting a language in the initial prompt writes both the cookie and the existing `estiginto-locale` localStorage key.
- Changing language from the header switch also refreshes both stores.
- Initial page loading and browser-language detection never create the cookie; the cookie records an explicit visitor choice only.
- Existing localStorage behavior remains for backward compatibility and locale restoration if cookies are later cleared.
- Clearing only the cookie causes the mobile homepage prompt to return, which is the intended test and reset mechanism.

## Implementation boundaries

- Cookie parsing, validation, and serialization live in `src/mobileLanguagePrompt.js` as pure functions where possible.
- `App.jsx` reads the cookie during initial state construction and passes cookie validity into the existing prompt eligibility helper.
- A shared explicit-selection handler updates the React locale, localStorage, and cookie. Initial state construction does not call this handler.
- No cookie banner is added because this cookie stores only a user-selected language preference and is not used for tracking.

## Testing and acceptance

- Unit tests cover valid, missing, malformed, and unsupported cookie values.
- Unit tests cover the exact one-year cookie serialization, shared path, SameSite policy, and conditional Secure flag.
- Eligibility tests prove that a valid cookie suppresses the mobile homepage prompt while a missing or invalid cookie allows it.
- Browser QA verifies:
  - a clean context shows the mobile homepage prompt;
  - choosing a language creates `estiginto_locale` and closes the prompt;
  - reloading with the cookie does not show the prompt;
  - clearing only the cookie makes the prompt return;
  - desktop and `/about.html` remain excluded;
  - no console errors or horizontal overflow are introduced.
- Run the full test, production build, and distribution verification before deployment.
