import { useState } from "react";
import { useTranslation } from "react-i18next";

const INDUSTRY_PRESET_KEYS = [
  "food",
  "retail",
  "saas",
  "professionalServices",
  "health",
  "hospitality",
  "manufacturing",
  "creative",
] as const;

export function BrandProfilePage() {
  const { t } = useTranslation();
  const [brandName, setBrandName] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [operatingLocations, setOperatingLocations] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [industryDraft, setIndustryDraft] = useState("");

  const togglePreset = (key: string) => {
    const label = t(`pages.brand.industryPresets.${key}`);
    setIndustries((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const isPresetActive = (key: (typeof INDUSTRY_PRESET_KEYS)[number]) => {
    const label = t(`pages.brand.industryPresets.${key}`);
    return industries.includes(label);
  };

  const addCustomIndustry = () => {
    const next = industryDraft.trim();
    if (next && !industries.includes(next)) {
      setIndustries([...industries, next]);
      setIndustryDraft("");
    }
  };

  const removeIndustry = (label: string) => {
    setIndustries(industries.filter((x) => x !== label));
  };

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.brand.title")}</h1>
          <p className="page__subtitle">{t("pages.brand.subtitle")}</p>
        </div>
      </div>

      <div style={{ maxWidth: 720 }}>
        <div className="card card--lg">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              margin: "0 0 8px",
              color: "var(--near-black)",
            }}
          >
            {t("pages.brand.sectionIdentity")}
          </h2>
          <p
            style={{
              margin: "0 0 24px",
              fontSize: 15,
              color: "var(--olive-gray)",
              lineHeight: 1.55,
            }}
          >
            {t("pages.brand.sectionIdentityLead")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="field">
              <label className="field__label" htmlFor="brand-name">
                {t("pages.brand.brandName")}
              </label>
              <input
                id="brand-name"
                className="input"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={t("pages.brand.brandNamePh")}
                autoComplete="organization"
              />
            </div>

            <div className="field">
              <span className="field__label">{t("pages.brand.industries")}</span>
              <span className="field__hint" style={{ marginBottom: 10 }}>
                {t("pages.brand.industriesHint")}
              </span>
              <div className="chip-group" role="group" aria-label={t("pages.brand.industries")}>
                {INDUSTRY_PRESET_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`chip ${isPresetActive(key) ? "chip--active" : ""}`}
                    onClick={() => togglePreset(key)}
                  >
                    {t(`pages.brand.industryPresets.${key}`)}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {industries.map((label) => (
                  <span key={label} className="chip chip--active">
                    {label}
                    <button
                      type="button"
                      aria-label={t("common.removeKeyword", { keyword: label })}
                      onClick={() => removeIndustry(label)}
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
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  id="industry-custom"
                  className="input"
                  placeholder={t("pages.brand.industryCustomPh")}
                  value={industryDraft}
                  onChange={(e) => setIndustryDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomIndustry();
                    }
                  }}
                />
                <button type="button" className="btn btn--secondary" onClick={addCustomIndustry}>
                  {t("common.add")}
                </button>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="hq">
                {t("pages.brand.headquarters")}
              </label>
              <input
                id="hq"
                className="input"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder={t("pages.brand.headquartersPh")}
              />
              <span className="field__hint">{t("pages.brand.headquartersHint")}</span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="operating">
                {t("pages.brand.operatingLocations")}
              </label>
              <textarea
                id="operating"
                className="textarea"
                rows={4}
                value={operatingLocations}
                onChange={(e) => setOperatingLocations(e.target.value)}
                placeholder={t("pages.brand.operatingLocationsPh")}
              />
              <span className="field__hint">{t("pages.brand.operatingLocationsHint")}</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--border-cream)",
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            <button type="button" className="btn btn--ghost">
              {t("common.discard")}
            </button>
            <button type="button" className="btn btn--primary">
              {t("common.saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
