import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "geo-onboarding-complete";

// Product is under maintenance: the intro window shows a maintenance notice
// instead of the full product tour below. The tour is kept intact (reading
// from the "onboardingTour" locale namespace) so it can be restored by
// flipping this flag back once maintenance ends.
const MAINTENANCE_MODE = true;

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

  if (!open) return null;

  if (MAINTENANCE_MODE) {
    return (
      <div className="modal-overlay" role="dialog" aria-modal="true">
        <div className="modal">
          <button
            type="button"
            className="modal__close"
            onClick={finish}
            aria-label={t("common.close")}
          >
            ×
          </button>
          <h2 className="modal__title">{t("onboarding.maintenanceTitle")}</h2>
          <p className="modal__body">{t("onboarding.maintenanceBody")}</p>
          <p className="modal__body">{t("onboarding.maintenanceSubBody")}</p>
          <div className="modal__footer">
            <button type="button" className="btn btn--primary" onClick={finish}>
              {t("onboarding.maintenanceAck")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingTour t={t} step={step} setStep={setStep} finish={finish} />;
}

function OnboardingTour({
  t,
  step,
  setStep,
  finish,
}: {
  t: ReturnType<typeof useTranslation>["t"];
  step: number;
  setStep: (fn: (x: number) => number) => void;
  finish: () => void;
}) {
  const steps = useMemo(
    () => [
      {
        title: t("onboardingTour.welcomeTitle"),
        body: t("onboardingTour.welcomeBody"),
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
        title: t("onboardingTour.brandTitle"),
        body: t("onboardingTour.brandBody"),
        content: (
          <div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="field__label" htmlFor="ob-industry">
                {t("onboardingTour.industry")}
              </label>
              <select id="ob-industry" className="select" defaultValue="">
                <option value="" disabled>
                  {t("onboardingTour.selectPlaceholder")}
                </option>
                <option>{t("onboardingTour.industryFood")}</option>
                <option>{t("onboardingTour.industryRetail")}</option>
                <option>{t("onboardingTour.industryPro")}</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <span className="field__label">{t("onboardingTour.tone")}</span>
              <div className="chip-group">
                {[t("onboardingTour.toneFriendly"), t("onboardingTour.toneBold"), t("onboardingTour.toneCalm")].map(
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
                {t("onboardingTour.keywordLabel")}
              </label>
              <input
                id="ob-keyword"
                className="input"
                placeholder={t("onboardingTour.keywordPh")}
              />
            </div>
          </div>
        ),
      },
      {
        title: t("onboardingTour.geoTitle"),
        body: t("onboardingTour.geoBody"),
        content: (
          <>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="field__label" htmlFor="ob-geo">
                {t("onboardingTour.primaryLocation")}
              </label>
              <input
                id="ob-geo"
                className="input"
                placeholder={t("onboardingTour.locationPh")}
              />
            </div>
            <div className="field">
              <span className="field__label">{t("onboardingTour.languages")}</span>
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
        title: t("onboardingTour.doneTitle"),
        body: t("onboardingTour.doneBody"),
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
            {t("onboardingTour.doneTip")}
          </div>
        ),
      },
    ],
    [t],
  );

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
            {isLast ? t("onboardingTour.startCreating") : t("common.next")}
          </button>
        </div>
      </div>
    </div>
  );
}
