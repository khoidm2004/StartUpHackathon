import { useState } from "react";
import { useTranslation } from "react-i18next";

export function MultilingualPage() {
  const { t } = useTranslation();
  const [sync, setSync] = useState(true);
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <>
      <div className="page__header">
        <div>
          <h1 className="page__title">{t("pages.multilingual.title")}</h1>
          <p className="page__subtitle">{t("pages.multilingual.subtitle")}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
          padding: 12,
          background: "var(--ivory)",
          border: "1px solid var(--border-cream)",
          borderRadius: 12,
        }}
      >
        <label className="toggle">
          <input
            type="checkbox"
            checked={sync}
            onChange={(e) => setSync(e.target.checked)}
          />
          <span className="toggle__track">
            <span className="toggle__thumb" />
          </span>
          <span className="toggle__label">{t("pages.multilingual.syncEdits")}</span>
        </label>
        <button
          type="button"
          className="hint-btn"
          title={t("pages.multilingual.syncHintTitle")}
        >
          ?
        </button>
        {sync && (
          <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
            {t("pages.multilingual.syncNote")}
          </span>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          style={{ marginLeft: "auto" }}
          onClick={() => setCompareOpen(true)}
        >
          {t("pages.multilingual.compare")}
        </button>
      </div>

      <div className="split-editor">
        <div className="card" style={{ borderRadius: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--near-black)" }}>
              {t("pages.multilingual.enLabel")}
            </span>
            <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
              {t("common.chars", { n: 412 })}
            </span>
          </div>
          <textarea
            className="textarea"
            style={{
              minHeight: 320,
              background: "var(--parchment)",
              border: "1px solid var(--border-cream)",
            }}
            defaultValue={t("pages.multilingual.enSample")}
          />
        </div>
        <div className="split-editor__gutter" title="Drag to resize" aria-hidden />
        <div className="card" style={{ borderRadius: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--near-black)" }}>
              {t("pages.multilingual.fiLabel")}
            </span>
            <span style={{ fontSize: 13, color: "var(--stone-gray)" }}>
              {t("common.chars", { n: 378 })}
            </span>
          </div>
          <textarea
            className="textarea"
            style={{
              minHeight: 320,
              background: "var(--parchment)",
              border: "1px solid var(--border-cream)",
            }}
            defaultValue={t("pages.multilingual.fiSample")}
          />
        </div>
      </div>

      {compareOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal modal--wide">
            <button
              type="button"
              className="modal__close"
              onClick={() => setCompareOpen(false)}
              aria-label={t("common.close")}
            >
              ×
            </button>
            <h2 className="modal__title">{t("pages.multilingual.modalTitle")}</h2>
            <p className="modal__body" style={{ marginBottom: 16 }}>
              <span style={{ background: "var(--warm-sand)", padding: "0 4px" }}>
                {t("pages.multilingual.added")}
              </span>{" "}
              ·{" "}
              <span style={{ textDecoration: "line-through", color: "var(--stone-gray)" }}>
                {t("pages.multilingual.removed")}
              </span>
            </p>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--olive-gray)",
                maxHeight: 280,
                overflow: "auto",
              }}
            >
              <p>{t("pages.multilingual.compareSample1")}</p>
              <p style={{ marginTop: 12 }}>{t("pages.multilingual.compareSample2")}</p>
            </div>
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setCompareOpen(false)}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
