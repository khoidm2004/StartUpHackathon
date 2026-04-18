import { useState } from "react";
import { useTranslation } from "react-i18next";

const CONTENT_TYPE_KEYS = ["ads", "blogPost", "socialMedia", "email"] as const;
type ContentTypeKey = (typeof CONTENT_TYPE_KEYS)[number];

const SUGGESTION_KEYS = [
  "seasonalPromo",
  "founderStory",
  "productLaunch",
  "localEvent",
] as const;

export function ContentGeneratorPage() {
  const { t } = useTranslation();
  const [contentType, setContentType] = useState<ContentTypeKey>("socialMedia");
  const [outLang, setOutLang] = useState<"en" | "fi">("en");
  const [generating, setGenerating] = useState(false);

  const runGenerate = () => {
    setGenerating(true);
    window.setTimeout(() => setGenerating(false), 1400);
  };

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.generator.title")}</h1>
          <p className="page__subtitle">{t("pages.generator.subtitle")}</p>
        </div>
      </div>

      <div className="steps" aria-label="Progress">
        <div className="step step--active">
          <span className="step__num">1</span>
          {t("pages.generator.stepInput")}
        </div>
        <span className="step__arrow" aria-hidden>
          →
        </span>
        <div className="step">
          <span className="step__num">2</span>
          {t("pages.generator.stepGenerate")}
        </div>
        <span className="step__arrow" aria-hidden>
          →
        </span>
        <div className="step">
          <span className="step__num">3</span>
          {t("pages.generator.stepEdit")}
        </div>
        <span className="step__arrow" aria-hidden>
          →
        </span>
        <div className="step">
          <span className="step__num">4</span>
          {t("pages.generator.stepPublish")}
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card card--lg">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              margin: "0 0 20px",
            }}
          >
            {t("pages.generator.whatCreate")}
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div className="field">
              <label className="field__label" htmlFor="industry">
                {t("pages.generator.industry")}
              </label>
              <select id="industry" className="select" defaultValue="">
                <option value="" disabled>
                  {t("pages.generator.selectIndustry")}
                </option>
                <option>{t("pages.generator.industryFood")}</option>
                <option>{t("pages.generator.industryRetail")}</option>
                <option>{t("pages.generator.industryPro")}</option>
                <option>{t("pages.generator.industryHealth")}</option>
              </select>
              <span className="field__hint">
                {t("pages.generator.industryHint")}{" "}
                <button
                  type="button"
                  className="hint-btn"
                  title={t("pages.generator.industryHintTitle")}
                >
                  ?
                </button>
              </span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="audience">
                {t("pages.generator.audience")}
              </label>
              <input
                id="audience"
                className="input"
                placeholder={t("pages.generator.audiencePh")}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="geo">
                {t("pages.generator.geo")}
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--stone-gray)",
                  }}
                  aria-hidden
                >
                  📍
                </span>
                <input
                  id="geo"
                  className="input input--with-icon"
                  placeholder={t("pages.generator.geoPh")}
                />
              </div>
              <span className="field__hint">{t("pages.generator.geoHint")}</span>
            </div>

            <div className="field">
              <span className="field__label">{t("pages.generator.language")}</span>
              <div className="lang-switch" style={{ width: "fit-content" }}>
                <button
                  type="button"
                  className={outLang === "en" ? "active" : ""}
                  onClick={() => setOutLang("en")}
                >
                  {t("pages.generator.english")}
                </button>
                <button
                  type="button"
                  className={outLang === "fi" ? "active" : ""}
                  onClick={() => setOutLang("fi")}
                >
                  {t("pages.generator.finnish")}
                </button>
              </div>
              <span className="field__hint">{t("pages.generator.outputHint")}</span>
            </div>

            <div className="field">
              <span className="field__label">{t("pages.generator.contentType")}</span>
              <div className="chip-group" role="radiogroup" aria-label={t("common.ariaContentType")}>
                {CONTENT_TYPE_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={contentType === k}
                    className={`chip ${contentType === k ? "chip--active" : ""}`}
                    onClick={() => setContentType(k)}
                  >
                    {t(`pages.generator.contentTypes.${k}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <label className="field__label" htmlFor="prompt" style={{ margin: 0 }}>
                  {t("pages.generator.aiPrompt")}
                </label>
                <button type="button" className="btn btn--ghost btn--sm">
                  {t("pages.generator.suggestions")}
                </button>
              </div>
              <textarea
                id="prompt"
                className="textarea"
                style={{ minHeight: 160 }}
                defaultValue={t("pages.generator.defaultPrompt")}
              />
              <div className="chip-group" style={{ marginTop: 8 }}>
                {SUGGESTION_KEYS.map((k) => (
                  <button key={k} type="button" className="btn btn--ghost btn--sm">
                    {t(`pages.generator.suggestionChips.${k}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={runGenerate}
              disabled={generating}
            >
              {generating ? t("common.generating") : t("pages.generator.generateContent")}
            </button>
          </div>
        </div>

        <div className="card card--lg">
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                margin: 0,
              }}
            >
              {t("pages.generator.generatedContent")}
            </h2>
            <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
              {t("common.updatedJustNow")}
            </span>
          </div>

          <div className="tabs" role="tablist" aria-label={t("common.ariaOutputLanguage")}>
            <button
              type="button"
              role="tab"
              aria-selected={outLang === "en"}
              className={`tab ${outLang === "en" ? "tab--active" : ""}`}
              onClick={() => setOutLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={outLang === "fi"}
              className={`tab ${outLang === "fi" ? "tab--active" : ""}`}
              onClick={() => setOutLang("fi")}
            >
              FI
            </button>
          </div>

          {generating ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton" style={{ height: 22, width: "60%" }} />
              <div className="skeleton" style={{ height: 14, width: "100%" }} />
              <div className="skeleton" style={{ height: 14, width: "95%" }} />
              <div className="skeleton" style={{ height: 14, width: "88%" }} />
            </div>
          ) : (
            <>
              {outLang === "en" ? (
                <article style={{ color: "var(--olive-gray)", lineHeight: 1.6 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      color: "var(--near-black)",
                      margin: "0 0 12px",
                    }}
                  >
                    {t("pages.generator.sample.enTitle")}
                  </h3>
                  <p style={{ margin: "0 0 12px" }}>{t("pages.generator.sample.enP1")}</p>
                  <p style={{ margin: 0 }}>{t("pages.generator.sample.enP2")}</p>
                </article>
              ) : (
                <article style={{ color: "var(--olive-gray)", lineHeight: 1.6 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      color: "var(--near-black)",
                      margin: "0 0 12px",
                    }}
                  >
                    {t("pages.generator.sample.fiTitle")}
                  </h3>
                  <p style={{ margin: "0 0 12px" }}>{t("pages.generator.sample.fiP1")}</p>
                  <p style={{ margin: 0 }}>{t("pages.generator.sample.fiP2")}</p>
                </article>
              )}

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  border: "1px dashed var(--border-warm)",
                  borderRadius: 16,
                  textAlign: "center",
                  color: "var(--stone-gray)",
                  fontSize: 14,
                }}
              >
                {t("pages.generator.imagePlaceholder")}
              </div>

              <div
                style={{
                  marginTop: 12,
                  height: 160,
                  borderRadius: 16,
                  background: "var(--dark-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--warm-silver)",
                  fontSize: 14,
                }}
              >
                {t("pages.generator.videoPlaceholder")}
              </div>
            </>
          )}

          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "var(--ivory)",
              border: "1px solid var(--border-cream)",
              borderRadius: 12,
              fontSize: 14,
              color: "var(--olive-gray)",
            }}
          >
            <strong style={{ color: "var(--near-black)" }}>{t("common.tip")}</strong>{" "}
            {t("pages.generator.bottomTip")}
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <button type="button" className="btn btn--secondary">
              {t("common.edit")}
            </button>
            <button type="button" className="btn btn--secondary">
              {t("common.regenerate")}
            </button>
            <button type="button" className="btn btn--ghost">
              {t("common.copy")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
