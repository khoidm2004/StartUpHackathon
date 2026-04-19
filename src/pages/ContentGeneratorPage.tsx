import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { requestGenerateContent } from "../lib/generateContentApi";
import { useCompanyStore } from "../stores/companyStore";
import {
  CONTENT_TYPE_KEYS,
  type ContentGeneratorCloudPayload,
  type ContentTypeKey,
} from "../types/contentGenerator";

export type { ContentGeneratorCloudPayload } from "../types/contentGenerator";

const SUGGESTION_KEYS = [
  "seasonalPromo",
  "founderStory",
  "productLaunch",
  "localEvent",
] as const;

export function ContentGeneratorPage() {
  const { t } = useTranslation();
  const { companies, fetchCompanies } = useCompanyStore();

  const [contentType, setContentType] = useState<ContentTypeKey>("blogPost");
  /** Content type at last successful generate — output UI keys off this, not `contentType`, so changing chips does not alter the preview. */
  const [generatedContentType, setGeneratedContentType] =
    useState<ContentTypeKey | null>(null);
  const [outLang, setOutLang] = useState<"en" | "fi">("en");
  /** Output language at last successful generate — preview keys off this, not `outLang`, so changing the form language does not alter the preview. */
  const [generatedOutLang, setGeneratedOutLang] = useState<"en" | "fi" | null>(
    null,
  );
  const [industry, setIndustry] = useState("");
  const [audience, setAudience] = useState("");
  const [geo, setGeo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  /** When set, shown instead of locale sample copy. */
  const [generatedTitleFromApi, setGeneratedTitleFromApi] = useState<string | null>(
    null,
  );
  const [generatedBodyFromApi, setGeneratedBodyFromApi] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setPrompt(t("pages.generator.defaultPrompt"));
  }, [t]);

  useEffect(() => {
    void fetchCompanies();
  }, [fetchCompanies]);

  /** Collects current form values for cloud/API requests (generate, save draft, etc.). */
  const getFormPayload = (): ContentGeneratorCloudPayload => ({
    industry,
    audience,
    geo,
    outputLanguage: outLang,
    contentType,
    prompt,
  });

  const runGenerate = async () => {
    const typeAtClick = contentType;
    const langAtClick = outLang;
    setGenerateError(null);
    setGenerating(true);
    try {
      const result = await requestGenerateContent(
        getFormPayload(),
        companies[0] ?? null,
      );
      setGeneratedContentType(typeAtClick);
      setGeneratedOutLang(langAtClick);
      setHasGenerated(true);
      setGeneratedTitleFromApi(result.title);
      setGeneratedBodyFromApi(result.content);
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : String(e));
      setHasGenerated(false);
      setGeneratedTitleFromApi(null);
      setGeneratedBodyFromApi(null);
    } finally {
      setGenerating(false);
    }
  };

  const showApiOutput = Boolean(
    generatedBodyFromApi?.trim() || generatedTitleFromApi?.trim(),
  );

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.generator.title")}</h1>
          <p className="page__subtitle">{t("pages.generator.subtitle")}</p>
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
              <select
                id="industry"
                className="select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="" disabled>
                  {t("pages.generator.selectIndustry")}
                </option>
                <option value="food">
                  {t("pages.generator.industryFood")}
                </option>
                <option value="retail">
                  {t("pages.generator.industryRetail")}
                </option>
                <option value="professional">
                  {t("pages.generator.industryPro")}
                </option>
                <option value="health">
                  {t("pages.generator.industryHealth")}
                </option>
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
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
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
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                  placeholder={t("pages.generator.geoPh")}
                />
              </div>
              <span className="field__hint">
                {t("pages.generator.geoHint")}
              </span>
            </div>

            <div className="field">
              <span className="field__label">
                {t("pages.generator.language")}
              </span>
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
              <span className="field__hint">
                {t("pages.generator.outputHint")}
              </span>
            </div>

            <div className="field">
              <span className="field__label">
                {t("pages.generator.contentType")}
              </span>
              <div
                className="chip-group"
                role="radiogroup"
                aria-label={t("common.ariaContentType")}
              >
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
                <label
                  className="field__label"
                  htmlFor="prompt"
                  style={{ margin: 0 }}
                >
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
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="chip-group" style={{ marginTop: 8 }}>
                {SUGGESTION_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="btn btn--ghost btn--sm"
                  >
                    {t(`pages.generator.suggestionChips.${k}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {generateError && (
            <p
              role="alert"
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontSize: 14,
                color: "var(--stone-gray)",
              }}
            >
              {t("pages.generator.generateError", { message: generateError })}
            </p>
          )}

          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => void runGenerate()}
              disabled={generating}
            >
              {generating
                ? t("common.generating")
                : t("pages.generator.generateContent")}
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
            {hasGenerated && !generating && (
              <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
                {t("common.updatedJustNow")}
              </span>
            )}
          </div>

          {generating ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="skeleton" style={{ height: 22, width: "60%" }} />
              <div className="skeleton" style={{ height: 14, width: "100%" }} />
              <div className="skeleton" style={{ height: 14, width: "95%" }} />
              <div className="skeleton" style={{ height: 14, width: "88%" }} />
            </div>
          ) : !hasGenerated ? (
            <div
              style={{
                padding: "28px 8px 12px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  margin: "0 0 10px",
                  color: "var(--near-black)",
                }}
              >
                {t("pages.generator.emptyOutputTitle")}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: "var(--olive-gray)",
                  maxWidth: 320,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {t("pages.generator.emptyOutputBody")}
              </p>
            </div>
          ) : (
            <>
              {showApiOutput ? (
                <article
                  style={{ color: "var(--olive-gray)", lineHeight: 1.6 }}
                >
                  {generatedTitleFromApi?.trim() ? (
                    <h3
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: 20,
                        color: "var(--near-black)",
                        margin: "0 0 12px",
                      }}
                    >
                      {generatedTitleFromApi}
                    </h3>
                  ) : null}
                  <div style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                    {generatedBodyFromApi?.trim() ?? ""}
                  </div>
                </article>
              ) : generatedOutLang === "en" ? (
                <article
                  style={{ color: "var(--olive-gray)", lineHeight: 1.6 }}
                >
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
                  <p style={{ margin: "0 0 12px" }}>
                    {t("pages.generator.sample.enP1")}
                  </p>
                  <p style={{ margin: 0 }}>
                    {t("pages.generator.sample.enP2")}
                  </p>
                </article>
              ) : (
                <article
                  style={{ color: "var(--olive-gray)", lineHeight: 1.6 }}
                >
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
                  <p style={{ margin: "0 0 12px" }}>
                    {t("pages.generator.sample.fiP1")}
                  </p>
                  <p style={{ margin: 0 }}>
                    {t("pages.generator.sample.fiP2")}
                  </p>
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

              {generatedContentType === "video" && (
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
                <strong style={{ color: "var(--near-black)" }}>
                  {t("common.tip")}
                </strong>{" "}
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
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => void runGenerate()}
                  disabled={generating}
                >
                  {t("common.regenerate")}
                </button>
                <button type="button" className="btn btn--ghost">
                  {t("common.copy")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
