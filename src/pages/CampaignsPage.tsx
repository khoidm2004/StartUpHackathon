import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ROWS = [
  {
    id: "springLaunch" as const,
    slug: "spring-launch-helsinki",
    typeKey: "social" as const,
    status: "Scheduled" as const,
    updated: "Apr 12, 2026",
  },
  {
    id: "newsletter" as const,
    slug: "newsletter-ethical",
    typeKey: "email" as const,
    status: "Draft" as const,
    updated: "Apr 10, 2026",
  },
  {
    id: "blogGeo" as const,
    slug: "blog-geo-playbook",
    typeKey: "blogPost" as const,
    status: "Published" as const,
    updated: "Apr 2, 2026",
  },
];

function StatusBadge({
  status,
}: {
  status: "Draft" | "Published" | "Scheduled";
}) {
  const { t } = useTranslation();
  const key =
    status === "Draft"
      ? "draft"
      : status === "Published"
        ? "published"
        : "scheduled";
  const cls =
    status === "Draft"
      ? "badge--draft"
      : status === "Published"
        ? "badge--published"
        : "badge--scheduled";
  return (
    <span className={`badge ${cls}`}>{t(`pages.campaigns.status.${key}`)}</span>
  );
}

export function CampaignsPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.campaigns.title")}</h1>
          <p className="page__subtitle">{t("pages.campaigns.subtitle")}</p>
        </div>
        <button type="button" className="btn btn--primary">
          {t("pages.campaigns.newCampaign")}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div className="lang-switch" role="group" aria-label={t("common.ariaViewMode")}>
          <button
            type="button"
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            {t("common.table")}
          </button>
          <button
            type="button"
            className={view === "cards" ? "active" : ""}
            onClick={() => setView("cards")}
          >
            {t("common.cards")}
          </button>
        </div>
      </div>

      {view === "table" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("pages.campaigns.campaignCol")}</th>
                <th>{t("pages.campaigns.contentTypeCol")}</th>
                <th>{t("pages.campaigns.statusCol")}</th>
                <th>{t("pages.campaigns.lastUpdatedCol")}</th>
                <th aria-label={t("common.ariaActions")} />
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.slug}>
                  <td className="name-cell">
                    <strong>{t(`pages.campaigns.rows.${r.id}.name`)}</strong>
                    <span>{r.slug}</span>
                  </td>
                  <td>
                    <span className="badge badge--draft">
                      {t(`pages.campaigns.types.${r.typeKey}`)}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={{ color: "var(--stone-gray)", fontSize: 14 }}>
                    {r.updated}
                  </td>
                  <td>
                    <button type="button" className="btn btn--ghost btn--sm">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid-3">
          {ROWS.map((r) => (
            <Link
              key={r.slug}
              to="/generator"
              className="card card--interactive"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <strong
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                {t(`pages.campaigns.rows.${r.id}.name`)}
              </strong>
              <div style={{ marginBottom: 12 }}>
                <span className="badge badge--draft">
                  {t(`pages.campaigns.types.${r.typeKey}`)}
                </span>{" "}
                <StatusBadge status={r.status} />
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "var(--stone-gray)" }}>
                {t("common.updated", { date: r.updated })}
              </p>
              <span style={{ fontSize: 20, color: "var(--stone-gray)" }}>→</span>
            </Link>
          ))}
        </div>
      )}

      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          margin: "32px 0 16px",
        }}
      >
        {t("common.performancePreview")}
      </h2>
      <div className="grid-3">
        {[
          { label: t("pages.dashboard.engagement"), value: "4.2%" },
          { label: t("pages.dashboard.reach"), value: "12.8k" },
          { label: t("pages.dashboard.conversion"), value: "1.1%" },
        ].map((c) => (
          <div key={c.label} className="card">
            <p
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--stone-gray)",
                margin: "0 0 8px",
              }}
            >
              {c.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                margin: "0 0 4px",
              }}
            >
              {c.value}
            </p>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--stone-gray)" }}>
              {t("common.vsLast30")}
            </p>
            <div className="skeleton" style={{ height: 36, borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </>
  );
}
