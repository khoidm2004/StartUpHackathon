import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const items = [
  { to: "/dashboard", key: "dashboard", icon: "◆" },
  { to: "/generator", key: "generator", icon: "✎" },
  { to: "/brand", key: "brand", icon: "◎" },
  { to: "/multilingual", key: "multilingual", icon: "⇄" },
  { to: "/settings", key: "settings", icon: "⚙" },
] as const;

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden />
        <div>
          <p className="sidebar__title">{t("sidebar.title")}</p>
          <p className="sidebar__tag">{t("sidebar.tag")}</p>
        </div>
      </div>
      <nav className="nav" aria-label={t("sidebar.primaryNavAria")}>
        {items.map(({ to, key, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            end={to === "/dashboard"}
          >
            <span className="nav__icon" aria-hidden>
              {icon}
            </span>
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <a href="#help">{t("sidebar.help")}</a>
        {" · "}
        <a href="#whats-new">{t("sidebar.whatsNew")}</a>
      </div>
    </aside>
  );
}
