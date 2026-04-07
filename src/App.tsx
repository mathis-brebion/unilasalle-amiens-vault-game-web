import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { AddGamePage } from "@/pages/AddGamePage";
import { HomeDashboardPage } from "@/pages/HomeDashboardPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPageLayout />}>
        <Route index element={<Navigate to="sign-in" replace />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
      </Route>
      <Route path="/dashboard" element={<HomeDashboardPage />} />
      <Route path="/dashboard/add-game" element={<AddGamePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
