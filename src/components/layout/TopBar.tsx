import { useTranslation } from "react-i18next";

export function TopBar() {
  const { t, i18n } = useTranslation();
  const active: "en" | "fi" = i18n.language.startsWith("fi") ? "fi" : "en";

  const setLang = (lng: "en" | "fi") => {
    void i18n.changeLanguage(lng);
  };

  return (
    <header className="topbar">
      <div className="topbar__search">
        <span className="topbar__search-icon" aria-hidden>
          ⌕
        </span>
        <label htmlFor="global-search" className="sr-only">
          {t("topbar.searchLabel")}
        </label>
        <input
          id="global-search"
          type="search"
          placeholder={t("topbar.searchPlaceholder")}
          title={t("topbar.searchTitle")}
        />
      </div>
      <div className="topbar__actions">
        <button type="button" className="icon-btn" aria-label={t("topbar.notifications")}>
          <span aria-hidden>🔔</span>
          <span className="icon-btn__dot" aria-hidden />
        </button>
        <div
          className="lang-switch"
          role="group"
          aria-label={t("topbar.interfaceLangAria")}
        >
          <button
            type="button"
            className={active === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={active === "fi" ? "active" : ""}
            onClick={() => setLang("fi")}
          >
            FI
          </button>
        </div>
        <button type="button" className="user-menu" aria-label={t("topbar.userMenu")}>
          <span className="user-menu__avatar" aria-hidden>
            AK
          </span>
          <span className="user-menu__name">Alex Kim</span>
          <span className="user-menu__chev" aria-hidden>
            ▾
          </span>
        </button>
      </div>
    </header>
  );
}