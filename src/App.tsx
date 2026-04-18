import { Navigate, Route, Routes } from "react-router-dom";
import { DocumentLang } from "./components/DocumentLang";
import { AppShell } from "./components/layout/AppShell";
import { Onboarding } from "./components/Onboarding";
import { DashboardPage } from "./pages/DashboardPage";
import { ContentGeneratorPage } from "./pages/ContentGeneratorPage";
import { BrandProfilePage } from "./pages/BrandProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { MultilingualPage } from "./pages/MultilingualPage";

export default function App() {
  return (
    <>
      <DocumentLang />
      <Onboarding />
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/generator" element={<ContentGeneratorPage />} />
          <Route path="/brand" element={<BrandProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/multilingual" element={<MultilingualPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppShell>
    </>
  );
}
