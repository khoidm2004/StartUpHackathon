import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const { t } = useTranslation();

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.settings.title")}</h1>
          <p className="page__subtitle">{t("pages.settings.subtitle")}</p>
        </div>
      </div>

      <div className="card card--lg" style={{ maxWidth: 560 }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            margin: "0 0 16px",
          }}
        >
          {t("pages.settings.notifications")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle__track">
              <span className="toggle__thumb" />
            </span>
            <span className="toggle__label">{t("pages.settings.emailPublished")}</span>
          </label>
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            <span className="toggle__track">
              <span className="toggle__thumb" />
            </span>
            <span className="toggle__label">{t("pages.settings.weeklySummary")}</span>
          </label>
        </div>
      </div>

      <div className="card card--lg" style={{ maxWidth: 560, marginTop: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            margin: "0 0 16px",
          }}
        >
          {t("pages.settings.accessibility")}
        </h2>
        <div className="field">
          <label className="field__label" htmlFor="font-scale">
            {t("pages.settings.textSize")}
          </label>
          <select id="font-scale" className="select" defaultValue="100">
            <option value="100">{t("pages.settings.font100")}</option>
            <option value="110">{t("pages.settings.font110")}</option>
            <option value="125">{t("pages.settings.font125")}</option>
          </select>
          <span className="field__hint">{t("pages.settings.fontHint")}</span>
        </div>
      </div>
    </>
  );
}
