import { useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type CityId = "helsinki" | "tampere";

/** Topic trend row — labels are API-style data (English), not UI translations. */
type TopicRow = { key: string; label: string; value: number };

const CITY_TOPICS: Record<CityId, TopicRow[]> = {
  helsinki: [
    { key: "localDining", label: "Local dining & openings", value: 92 },
    { key: "designWeek", label: "Design & culture week", value: 78 },
    { key: "sustainableRetail", label: "Sustainable retail", value: 85 },
    { key: "innerCity", label: "Inner-city services", value: 71 },
    { key: "waterfront", label: "Waterfront & events", value: 63 },
  ],
  tampere: [
    { key: "tamperePride", label: "“Tampere” local pride", value: 91 },
    { key: "saunaCulture", label: "Sauna & wellness", value: 88 },
    { key: "studentLife", label: "Student life & events", value: 74 },
    { key: "industrialHeritage", label: "Industrial heritage tours", value: 77 },
    { key: "lakeNature", label: "Lake trails & nature", value: 69 },
  ],
};

/** Content ideas keyed by topic — English source data for the suggestion card. */
const TOPIC_SUGGESTIONS: Record<CityId, Record<string, string>> = {
  helsinki: {
    localDining:
      "Pitch a weekend brunch Reels series naming two or three neighborhoods you deliver to.",
    designWeek:
      "Bundle event dates with venue names in a short blog post and recap it in Stories.",
    sustainableRetail:
      "Highlight one supplier story plus a measurable claim (distance, certification, batch size).",
    innerCity:
      "Publish a carousel of services ‘near me’ with hours and walking distance from metro stops.",
    waterfront:
      "Tie a limited offer to evening and weekend weather windows along the shore.",
  },
  tampere: {
    tamperePride:
      "Run a customer-quote mini-campaign with district tags and #Tampere in every asset.",
    saunaCulture:
      "Pair one sauna + one local maker in a calm, non-luxury tone—specific names, no clichés.",
    studentLife:
      "Time a student offer to term start and mention pickup points near campus.",
    industrialHeritage:
      "Turn a factory or museum route into a three-part threaded post series.",
    lakeNature:
      "Promote a ‘15 minutes from centre’ trail with parking, stroller access, and a soft CTA.",
  },
};

/** Weeks the current #1 topic has held the top spot (preview data). */
const STREAK_WEEKS: Record<CityId, Record<string, number>> = {
  helsinki: {
    localDining: 12,
    designWeek: 5,
    sustainableRetail: 8,
    innerCity: 6,
    waterfront: 4,
  },
  tampere: {
    tamperePride: 10,
    saunaCulture: 9,
    studentLife: 7,
    industrialHeritage: 6,
    lakeNature: 5,
  },
};

function getHottest(topics: TopicRow[]): TopicRow {
  return topics.reduce((best, cur) => (cur.value > best.value ? cur : best));
}

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
  const citySelectId = useId();
  const [city, setCity] = useState<CityId>("helsinki");

  const topics = CITY_TOPICS[city];
  const hottest = useMemo(() => getHottest(topics), [topics]);
  const cityName = t(`pages.dashboard.cities.${city}`);

  const hottestTitle = hottest.label;
  const streakWeeks = STREAK_WEEKS[city][hottest.key] ?? 0;
  const suggestion =
    TOPIC_SUGGESTIONS[city][hottest.key] ?? "";

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

      <div
        className="field"
        style={{ marginBottom: 20, maxWidth: 280 }}
      >
        <label className="field__label" htmlFor={citySelectId}>
          {t("pages.dashboard.cityLabel")}
        </label>
        <select
          id={citySelectId}
          className="select"
          value={city}
          onChange={(e) => setCity(e.target.value as CityId)}
        >
          <option value="helsinki">{t("pages.dashboard.cities.helsinki")}</option>
          <option value="tampere">{t("pages.dashboard.cities.tampere")}</option>
        </select>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card">
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--stone-gray)",
              margin: "0 0 8px",
            }}
          >
            {t("pages.dashboard.cardHottestTopic")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              lineHeight: 1.2,
              margin: "0 0 12px",
              color: "var(--near-black)",
            }}
          >
            {hottestTitle}
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--stone-gray)" }}>
            {cityName}
          </p>
          <div
            className="topic-bar-row__track"
            style={{ marginTop: 16 }}
            aria-hidden
          >
            <div
              className="topic-bar-row__fill"
              style={{ width: `${hottest.value}%` }}
            />
          </div>
        </div>

        <div className="card">
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--stone-gray)",
              margin: "0 0 8px",
            }}
          >
            {t("pages.dashboard.cardLongestStreak")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 32,
              margin: "0 0 8px",
              color: "var(--near-black)",
            }}
          >
            {t("pages.dashboard.streakValue", { count: streakWeeks })}
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--olive-gray)" }}>
            {t("pages.dashboard.streakSubtitle", { city: cityName })}
          </p>
        </div>

        <div className="card">
          <p
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--stone-gray)",
              margin: "0 0 8px",
            }}
          >
            {t("pages.dashboard.cardSuggestion")}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.55,
              color: "var(--olive-gray)",
            }}
          >
            {suggestion}
          </p>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 12,
              color: "var(--stone-gray)",
            }}
          >
            {t("pages.dashboard.suggestionBasedOn", {
              topic: hottestTitle,
            })}
          </p>
        </div>
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

        <div
          className={`card card--lg topic-trend-card ${city === "tampere" ? "topic-trend-card--tampere" : ""}`}
          role="region"
          aria-labelledby={`trend-city-${city}`}
        >
          <div className="topic-trend-card__head">
            <p className="topic-trend-card__overline">
              {t("pages.dashboard.trendingOverline")}
            </p>
            <h3 className="topic-trend-card__city" id={`trend-city-${city}`}>
              {cityName}
            </h3>
          </div>
          <div
            className="topic-trend-card__bars"
            role="list"
            aria-label={t("pages.dashboard.trendingChartAria", {
              city: cityName,
            })}
          >
            {topics.map(({ key, label, value }) => (
              <div key={key} role="listitem">
                <TopicBarRow label={label} value={value} />
              </div>
            ))}
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
