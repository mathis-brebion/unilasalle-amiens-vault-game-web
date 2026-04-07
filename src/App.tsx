import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/guards/AuthGuards";
import { AddGamePage } from "@/pages/AddGamePage";
import { HomeDashboardPage } from "@/pages/HomeDashboardPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<AuthPageLayout />}>
          <Route index element={<Navigate to="sign-in" replace />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<HomeDashboardPage />} />
        <Route path="/dashboard/add-game" element={<AddGamePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
