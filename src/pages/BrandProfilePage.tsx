import { useState } from "react";
import { useTranslation } from "react-i18next";

const VOICE_KEYS = [
  "friendlyExpert",
  "boldChallenger",
  "calmMinimalist",
  "warmStoryteller",
] as const;
const TONE_KEYS = ["professional", "playful", "inspirational", "direct"] as const;
type ToneKey = (typeof TONE_KEYS)[number];
const PREVIEW_KEYS = ["social", "email", "blogSnippet"] as const;
type PreviewKey = (typeof PREVIEW_KEYS)[number];

export function BrandProfilePage() {
  const { t } = useTranslation();
  const [tone, setTone] = useState<ToneKey>("playful");
  const [preview, setPreview] = useState<PreviewKey>("social");
  const [tags, setTags] = useState<string[]>([
    "artisan",
    "local",
    "carbon-neutral",
  ]);
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const next = draft.trim();
    if (next && !tags.includes(next)) {
      setTags([...tags, next]);
      setDraft("");
    }
  };

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.brand.title")}</h1>
          <p className="page__subtitle">{t("pages.brand.subtitle")}</p>
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <div className="field">
              <label className="field__label" htmlFor="voice">
                {t("pages.brand.brandVoice")}
              </label>
              <select id="voice" className="select" defaultValue={VOICE_KEYS[0]}>
                {VOICE_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t(`pages.brand.voices.${k}`)}
                  </option>
                ))}
              </select>
              <span className="field__hint">
                {t("pages.brand.voiceHint")}{" "}
                <button
                  type="button"
                  className="hint-btn"
                  title={t("pages.brand.voiceHintTitle")}
                >
                  ?
                </button>
              </span>
            </div>
          </div>

          <div className="card">
            <span className="field__label">{t("pages.brand.tone")}</span>
            <div className="chip-group" role="radiogroup" aria-label={t("common.ariaTone")}>
              {TONE_KEYS.map((toneKey) => (
                <button
                  key={toneKey}
                  type="button"
                  role="radio"
                  aria-checked={tone === toneKey}
                  className={`chip ${tone === toneKey ? "chip--active" : ""}`}
                  onClick={() => setTone(toneKey)}
                >
                  {t(`pages.brand.tones.${toneKey}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <label className="field__label" htmlFor="kw">
              {t("pages.brand.keywords")}
            </label>
            <div className="chip-group" style={{ marginBottom: 8 }}>
              {tags.map((k) => (
                <span key={k} className="chip chip--active">
                  {k}
                  <button
                    type="button"
                    aria-label={t("common.removeKeyword", { keyword: k })}
                    onClick={() => setTags(tags.filter((x) => x !== k))}
                    style={{
                      marginLeft: 8,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "var(--stone-gray)",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                id="kw"
                className="input"
                placeholder={t("pages.brand.keywordPh")}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button type="button" className="btn btn--secondary" onClick={addTag}>
                {t("common.add")}
              </button>
            </div>
          </div>

          <div className="card">
            <label className="field__label" htmlFor="guidelines">
              {t("pages.brand.guidelines")}
            </label>
            <textarea
              id="guidelines"
              className="textarea"
              rows={5}
              defaultValue={t("pages.brand.guidelinesDefault")}
            />
          </div>

          <div className="card">
            <span className="field__label">{t("pages.brand.logo")}</span>
            <div
              style={{
                border: "2px dashed var(--border-warm)",
                borderRadius: 16,
                padding: 32,
                textAlign: "center",
                color: "var(--stone-gray)",
                fontSize: 14,
                background: "var(--white)",
              }}
            >
              {t("pages.brand.logoDrop")}
            </div>
          </div>

          <div className="card">
            <span className="field__label">{t("pages.brand.brandAssets")}</span>
            <div
              style={{
                border: "1px solid var(--border-cream)",
                borderRadius: 12,
                padding: 12,
                background: "var(--white)",
              }}
            >
              <p style={{ margin: 0, fontSize: 14, color: "var(--stone-gray)" }}>
                {t("pages.brand.noFiles")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn--ghost">
              {t("common.discard")}
            </button>
            <button type="button" className="btn btn--primary">
              {t("common.saveChanges")}
            </button>
          </div>
        </div>

        <div className="card card--lg" style={{ position: "sticky", top: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              margin: "0 0 16px",
            }}
          >
            {t("pages.brand.preview")}
          </h2>
          <div className="tabs" role="tablist">
            {PREVIEW_KEYS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={preview === tab}
                className={`tab ${preview === tab ? "tab--active" : ""}`}
                onClick={() => setPreview(tab)}
              >
                {t(`pages.brand.previewTabs.${tab}`)}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--stone-gray)", margin: "0 0 12px" }}>
            {t("common.sampleOnly")}
          </p>
          {preview === "social" && (
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  margin: "0 0 8px",
                  color: "var(--near-black)",
                }}
              >
                {t("pages.brand.previewSocialTitle")}
              </h3>
              <p style={{ color: "var(--olive-gray)", lineHeight: 1.6, margin: 0 }}>
                {t("pages.brand.previewSocialBody")}
              </p>
            </div>
          )}
          {preview === "email" && (
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--stone-gray)",
                  margin: "0 0 8px",
                }}
              >
                {t("pages.brand.previewEmailSubject")}
              </p>
              <p style={{ color: "var(--olive-gray)", lineHeight: 1.6, margin: 0 }}>
                {t("pages.brand.previewEmailBody")}
              </p>
            </div>
          )}
          {preview === "blogSnippet" && (
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 20,
                  margin: "0 0 8px",
                  color: "var(--near-black)",
                }}
              >
                {t("pages.brand.previewBlogTitle")}
              </h3>
              <p style={{ color: "var(--olive-gray)", lineHeight: 1.6, margin: 0 }}>
                {t("pages.brand.previewBlogBody")}
              </p>
            </div>
          )}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid var(--border-cream)",
            }}
          >
            <span className="field__label">{t("pages.brand.brandFit")}</span>
            <div className="skeleton" style={{ height: 8, marginTop: 8 }} />
            <div
              className="skeleton"
              style={{ height: 8, marginTop: 6, width: "85%" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
