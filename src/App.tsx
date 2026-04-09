import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/routes/guards/AuthGuards";
import { AddGamePage } from "@/pages/AddGamePage";
import { HomeDashboardPage } from "@/pages/HomeDashboardPage";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<HomeDashboardPage />} />
        <Route path="/dashboard/add-game" element={<AddGamePage />} />
      </Route>
      <Route path="/sign-in" element={<Navigate to="/" replace />} />
      <Route path="/sign-up" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
