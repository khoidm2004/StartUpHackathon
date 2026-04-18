import { useState } from "react";
import { useTranslation } from "react-i18next";

const REGION_KEYS = ["uusimaa", "pirkanmaa", "southwest", "northOstrobothnia"] as const;
const REGION_PCT: Record<(typeof REGION_KEYS)[number], number> = {
  uusimaa: 78,
  pirkanmaa: 52,
  southwest: 44,
  northOstrobothnia: 28,
};

const SCORE_KEYS = ["localKeywords", "locationMentions", "readability"] as const;
const KEYWORD_KEYS = ["kw1", "kw2", "kw3"] as const;

export function AnalyticsPage() {
  const { t } = useTranslation();
  const [range, setRange] = useState("30");

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.analytics.title")}</h1>
          <p className="page__subtitle">{t("pages.analytics.subtitle")}</p>
        </div>
        <div className="field" style={{ minWidth: 200 }}>
          <label className="field__label" htmlFor="range">
            {t("pages.analytics.dateRange")}
          </label>
          <select
            id="range"
            className="select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7">{t("pages.analytics.last7")}</option>
            <option value="30">{t("pages.analytics.last30")}</option>
            <option value="90">{t("pages.analytics.last90")}</option>
            <option value="custom">{t("pages.analytics.custom")}</option>
          </select>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card card--lg">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              margin: "0 0 16px",
            }}
          >
            {t("pages.analytics.engagementByRegion")}
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {REGION_KEYS.map((rk) => {
              const pct = REGION_PCT[rk];
              return (
                <div key={rk}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: "var(--olive-gray)" }}>
                      {t(`pages.analytics.regions.${rk}`)}
                    </span>
                    <span style={{ color: "var(--stone-gray)" }}>{pct}%</span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 999,
                      background: "var(--border-cream)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--terracotta), var(--dark-surface))",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: "var(--stone-gray)", margin: "16px 0 0" }}>
            {t("common.exampleDataLayout")}
          </p>
        </div>

        <div className="card card--lg">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 20,
              margin: "0 0 16px",
            }}
          >
            {t("pages.analytics.performanceByLang")}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              height: 180,
              paddingTop: 8,
            }}
          >
            {[
              { lang: "EN", h: 72 },
              { lang: "FI", h: 88 },
            ].map((b) => (
              <div
                key={b.lang}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 120,
                    height: `${b.h}%`,
                    background:
                      b.lang === "EN"
                        ? "var(--terracotta)"
                        : "var(--dark-surface)",
                    borderRadius: "12px 12px 4px 4px",
                    minHeight: 40,
                  }}
                  title={`${b.lang} performance`}
                />
                <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
                  {b.lang}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--stone-gray)", margin: "16px 0 0" }}>
            {t("common.exampleDataLang")}
          </p>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              margin: "0 0 12px",
            }}
          >
            {t("pages.analytics.seoScore")}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: "8px solid var(--border-cream)",
                borderTopColor: "var(--terracotta)",
                borderRightColor: "var(--terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  color: "var(--near-black)",
                }}
              >
                84
              </span>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                color: "var(--olive-gray)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {SCORE_KEYS.map((sk) => (
                <li key={sk}>{t(`pages.analytics.scoreBullets.${sk}`)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              margin: "0 0 12px",
            }}
          >
            {t("pages.analytics.keywordSuggestions")}
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {KEYWORD_KEYS.map((k) => (
              <li
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-cream)",
                  fontSize: 14,
                  color: "var(--olive-gray)",
                }}
              >
                {t(`pages.analytics.${k}`)}
                <button type="button" className="btn btn--ghost btn--sm">
                  {t("common.add")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              margin: "0 0 12px",
            }}
          >
            {t("pages.analytics.optimizationTips")}
          </h3>
          <ol style={{ margin: 0, paddingLeft: 18, color: "var(--olive-gray)" }}>
            <li style={{ marginBottom: 10 }}>
              <strong style={{ color: "var(--near-black)" }}>
                {t("pages.analytics.tip1Title")}
              </strong>{" "}
              {t("pages.analytics.tip1Body")}
            </li>
            <li style={{ marginBottom: 10 }}>
              <strong style={{ color: "var(--near-black)" }}>
                {t("pages.analytics.tip2Title")}
              </strong>{" "}
              {t("pages.analytics.tip2Body")}
            </li>
            <li>
              <strong style={{ color: "var(--near-black)" }}>
                {t("pages.analytics.tip3Title")}
              </strong>{" "}
              {t("pages.analytics.tip3Body")}
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
