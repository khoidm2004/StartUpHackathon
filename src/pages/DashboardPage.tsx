import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type TopicKeyHelsinki =
  | "localDining"
  | "designWeek"
  | "innerCity"
  | "sustainableRetail"
  | "waterfront";

type TopicKeyTampere =
  | "saunaCulture"
  | "studentLife"
  | "lakeNature"
  | "tamperePride"
  | "industrialHeritage";

const HELSINKI_TOPICS: { key: TopicKeyHelsinki; value: number }[] = [
  { key: "localDining", value: 92 },
  { key: "designWeek", value: 78 },
  { key: "sustainableRetail", value: 85 },
  { key: "innerCity", value: 71 },
  { key: "waterfront", value: 63 },
];

const TAMPERE_TOPICS: { key: TopicKeyTampere; value: number }[] = [
  { key: "tamperePride", value: 91 },
  { key: "saunaCulture", value: 88 },
  { key: "studentLife", value: 74 },
  { key: "industrialHeritage", value: 77 },
  { key: "lakeNature", value: 69 },
];

function TopicBarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="topic-bar-row">
      <div className="topic-bar-row__label">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="topic-bar-row__track" aria-hidden>
        <div className="topic-bar-row__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();

  const cards = [
    { k: t("pages.dashboard.engagement"), v: "4.2%" },
    { k: t("pages.dashboard.reach"), v: "12.8k" },
    { k: t("pages.dashboard.conversion"), v: "1.1%" },
  ];

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.dashboard.title")}</h1>
          <p className="page__subtitle">{t("pages.dashboard.subtitle")}</p>
        </div>
        <Link to="/generator" className="btn btn--primary">
          {t("pages.dashboard.newContent")}
        </Link>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {cards.map((c) => (
          <div key={c.k} className="card">
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--stone-gray)",
                margin: "0 0 8px",
              }}
            >
              {c.k}
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                margin: "0 0 4px",
                color: "var(--near-black)",
              }}
            >
              {c.v}
            </p>
            <p style={{ margin: 0, fontSize: 14, color: "var(--stone-gray)" }}>
              {t("common.vsLast30")}
            </p>
            <div
              className="skeleton"
              style={{ height: 40, marginTop: 16, borderRadius: 8 }}
              aria-hidden
            />
          </div>
        ))}
      </div>

      <section
        style={{ marginBottom: 32 }}
        aria-labelledby="trending-topics-heading"
      >
        <h2
          id="trending-topics-heading"
          className="page__title"
          style={{ fontSize: 26, marginBottom: 8 }}
        >
          {t("pages.dashboard.trendingTitle")}
        </h2>
        <p
          style={{
            margin: "0 0 24px",
            fontSize: 17,
            color: "var(--olive-gray)",
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          {t("pages.dashboard.trendingSubtitle")}
        </p>

        <div className="grid-2" style={{ alignItems: "stretch" }}>
          <div
            className="card card--lg topic-trend-card"
            role="region"
            aria-labelledby="trend-helsinki-title"
          >
            <div className="topic-trend-card__head">
              <p className="topic-trend-card__overline">
                {t("pages.dashboard.trendingOverline")}
              </p>
              <h3 className="topic-trend-card__city" id="trend-helsinki-title">
                Helsinki
              </h3>
            </div>
            <div
              className="topic-trend-card__bars"
              role="list"
              aria-label={t("pages.dashboard.trendingChartAria", {
                city: "Helsinki",
              })}
            >
              {HELSINKI_TOPICS.map(({ key, value }) => (
                <div key={key} role="listitem">
                  <TopicBarRow
                    label={t(`pages.dashboard.topics.helsinki.${key}`)}
                    value={value}
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="card card--lg topic-trend-card topic-trend-card--tampere"
            role="region"
            aria-labelledby="trend-tampere-title"
          >
            <div className="topic-trend-card__head">
              <p className="topic-trend-card__overline">
                {t("pages.dashboard.trendingOverline")}
              </p>
              <h3 className="topic-trend-card__city" id="trend-tampere-title">
                Tampere
              </h3>
            </div>
            <div
              className="topic-trend-card__bars"
              role="list"
              aria-label={t("pages.dashboard.trendingChartAria", {
                city: "Tampere",
              })}
            >
              {TAMPERE_TOPICS.map(({ key, value }) => (
                <div key={key} role="listitem">
                  <TopicBarRow
                    label={t(`pages.dashboard.topics.tampere.${key}`)}
                    value={value}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <p
          style={{
            margin: "16px 0 0",
            fontSize: 13,
            color: "var(--stone-gray)",
            lineHeight: 1.45,
          }}
        >
          {t("pages.dashboard.trendingFootnote")}
        </p>
      </section>

      <div className="card card--lg">
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 22,
            margin: "0 0 8px",
          }}
        >
          {t("pages.dashboard.continueFlow")}
        </h2>
        <p style={{ margin: "0 0 20px", color: "var(--olive-gray)" }}>
          {t("pages.dashboard.continueDesc")}
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/generator" className="btn btn--primary">
            {t("pages.dashboard.openGenerator")}
          </Link>
          <Link to="/brand" className="btn btn--secondary">
            {t("pages.dashboard.reviewBrand")}
          </Link>
        </div>
      </div>
    </>
  );
}
