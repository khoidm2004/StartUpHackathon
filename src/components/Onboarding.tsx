import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "geo-onboarding-complete";

export function Onboarding() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const steps = useMemo(
    () => [
      {
        title: t("onboarding.welcomeTitle"),
        body: t("onboarding.welcomeBody"),
        content: (
          <div
            style={{
              height: 120,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #c96442 0%, #30302e 55%, #e8e6dc 100%)",
              opacity: 0.85,
              marginBottom: 8,
            }}
            aria-hidden
          />
        ),
      },
      {
        title: t("onboarding.brandTitle"),
        body: t("onboarding.brandBody"),
        content: (
          <div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="field__label" htmlFor="ob-industry">
                {t("onboarding.industry")}
              </label>
              <select id="ob-industry" className="select" defaultValue="">
                <option value="" disabled>
                  {t("onboarding.selectPlaceholder")}
                </option>
                <option>{t("onboarding.industryFood")}</option>
                <option>{t("onboarding.industryRetail")}</option>
                <option>{t("onboarding.industryPro")}</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <span className="field__label">{t("onboarding.tone")}</span>
              <div className="chip-group">
                {[t("onboarding.toneFriendly"), t("onboarding.toneBold"), t("onboarding.toneCalm")].map(
                  (label) => (
                    <button key={label} type="button" className="chip">
                      {label}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="ob-keyword">
                {t("onboarding.keywordLabel")}
              </label>
              <input
                id="ob-keyword"
                className="input"
                placeholder={t("onboarding.keywordPh")}
              />
            </div>
          </div>
        ),
      },
      {
        title: t("onboarding.geoTitle"),
        body: t("onboarding.geoBody"),
        content: (
          <>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="field__label" htmlFor="ob-geo">
                {t("onboarding.primaryLocation")}
              </label>
              <input
                id="ob-geo"
                className="input"
                placeholder={t("onboarding.locationPh")}
              />
            </div>
            <div className="field">
              <span className="field__label">{t("onboarding.languages")}</span>
              <div className="lang-switch" style={{ width: "fit-content" }}>
                <button type="button" className="active">
                  EN
                </button>
                <button type="button">FI</button>
              </div>
            </div>
          </>
        ),
      },
      {
        title: t("onboarding.doneTitle"),
        body: t("onboarding.doneBody"),
        content: (
          <div
            style={{
              padding: 16,
              background: "var(--parchment)",
              borderRadius: 12,
              border: "1px solid var(--border-cream)",
              fontSize: 14,
              color: "var(--stone-gray)",
            }}
          >
            <strong style={{ color: "var(--near-black)" }}>{t("common.tip")}</strong>{" "}
            {t("onboarding.doneTip")}
          </div>
        ),
      },
    ],
    [t],
  );

  if (!open) return null;

  const s = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal modal--wide">
        <button
          type="button"
          className="modal__close"
          onClick={finish}
          aria-label={t("common.skipTourAria")}
        >
          ×
        </button>
        <p className="modal__progress">
          {t("common.stepOf", { current: step + 1, total: steps.length })}
        </p>
        <div className="dots" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={i === step ? "active" : undefined} />
          ))}
        </div>
        <h2 className="modal__title">{s.title}</h2>
        <p className="modal__body">{s.body}</p>
        {s.content}
        <div className="modal__footer">
          {step > 0 && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep((x) => x - 1)}
            >
              {t("common.back")}
            </button>
          )}
          <button type="button" className="btn btn--secondary" onClick={finish}>
            {t("common.skipTour")}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => (isLast ? finish() : setStep((x) => x + 1))}
          >
            {isLast ? t("onboarding.startCreating") : t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
