import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchTopicsByCity } from "../lib/topicsApi";
import type { TopicFromApi } from "../types/topics";

type CityId = "helsinki" | "tampere";

const CITY_TO_API: Record<CityId, "Helsinki" | "Tampere"> = {
  helsinki: "Helsinki",
  tampere: "Tampere",
};

function getHottest(topics: TopicFromApi[]): TopicFromApi | null {
  if (!topics.length) return null;
  return topics.reduce((best, cur) =>
    cur.trend_score > best.trend_score ? cur : best,
  );
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
  const [topics, setTopics] = useState<TopicFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const apiCity = CITY_TO_API[city];
    setLoading(true);
    setError(null);
    fetchTopicsByCity(apiCity)
      .then((data) => {
        if (!cancelled) {
          setTopics(data.topics ?? []);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setTopics([]);
          setError(e instanceof Error ? e.message : "Failed to load topics");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  const hottest = useMemo(() => getHottest(topics), [topics]);
  const cityName = t(`pages.dashboard.cities.${city}`);

  const hottestTitle = hottest?.title ?? "";
  const streakDays = hottest?.streak_days ?? 0;
  const suggestion = hottest?.description ?? "";

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

      {error ? (
        <p
          role="alert"
          style={{
            margin: "0 0 20px",
            padding: 12,
            borderRadius: 8,
            background: "rgba(180, 80, 80, 0.08)",
            color: "var(--near-black)",
            fontSize: 14,
          }}
        >
          {t("pages.dashboard.topicsError", { message: error })}
        </p>
      ) : null}

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
          {loading ? (
            <p style={{ margin: 0, color: "var(--stone-gray)" }}>
              {t("pages.dashboard.topicsLoading")}
            </p>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 26,
                  lineHeight: 1.2,
                  margin: "0 0 12px",
                  color: "var(--near-black)",
                }}
              >
                {hottestTitle || t("pages.dashboard.topicsEmpty")}
              </p>
              {hottest ? (
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: 13,
                    color: "var(--olive-gray)",
                  }}
                >
                  {hottest.category}
                </p>
              ) : null}
              <p style={{ margin: 0, fontSize: 14, color: "var(--stone-gray)" }}>
                {cityName}
              </p>
              <div
                className="topic-bar-row__track"
                style={{ marginTop: 16 }}
                aria-hidden
              >
                {hottest ? (
                  <div
                    className="topic-bar-row__fill"
                    style={{ width: `${hottest.trend_score}%` }}
                  />
                ) : null}
              </div>
            </>
          )}
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
          {loading ? (
            <p style={{ margin: 0, color: "var(--stone-gray)" }}>
              {t("pages.dashboard.topicsLoading")}
            </p>
          ) : (
            <>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  margin: "0 0 8px",
                  color: "var(--near-black)",
                }}
              >
                {hottest
                  ? t("pages.dashboard.streakValue", { count: streakDays })
                  : "—"}
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--olive-gray)" }}>
                {t("pages.dashboard.streakSubtitle", { city: cityName })}
              </p>
            </>
          )}
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
          {loading ? (
            <p style={{ margin: 0, color: "var(--stone-gray)" }}>
              {t("pages.dashboard.topicsLoading")}
            </p>
          ) : (
            <>
              <p
                style={{
                  margin: 0,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--olive-gray)",
                }}
              >
                {suggestion || t("pages.dashboard.topicsEmpty")}
              </p>
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 12,
                  color: "var(--stone-gray)",
                }}
              >
                {t("pages.dashboard.suggestionBasedOn", {
                  topic: hottestTitle || "—",
                })}
              </p>
            </>
          )}
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
            {loading ? (
              <p style={{ margin: 0, color: "var(--stone-gray)" }}>
                {t("pages.dashboard.topicsLoading")}
              </p>
            ) : topics.length === 0 ? (
              <p style={{ margin: 0, color: "var(--stone-gray)" }}>
                {t("pages.dashboard.topicsEmpty")}
              </p>
            ) : (
              topics.map((topic) => (
                <div key={`${topic.rank}-${topic.title}`} role="listitem">
                  <TopicBarRow label={topic.title} value={topic.trend_score} />
                </div>
              ))
            )}
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
