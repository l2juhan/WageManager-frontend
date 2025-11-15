import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import WorkerLayout from "./layouts/WorkerLayout.jsx";
import EmployerLayout from "./layouts/EmployerLayout.jsx";
import MonthlyCalendarPage from "./pages/workers/MonthlyCalendarPage.jsx";
import WeeklyCalendarPage from "./pages/workers/WeeklyCalendarPage.jsx";
import RemittancePage from "./pages/workers/RemittancePage.jsx";
import MyPage from "./pages/workers/MyPage.jsx";
import DailyCalendarPage from "./pages/employer/DailyCalendarPage.jsx";
import RemittanceManagePage from "./pages/employer/RemittanceManagePage.jsx";
import WorkerManagePage from "./pages/employer/WorkerManagePage.jsx";
import EmployerMyPage from "./pages/employer/EmployerMyPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/worker" element={<WorkerLayout />}>
          <Route
            index
            element={<Navigate to="/worker/monthly-calendar" replace />}
          />
          <Route path="monthly-calendar" element={<MonthlyCalendarPage />} />
          <Route path="weekly-calendar" element={<WeeklyCalendarPage />} />
          <Route path="remittance" element={<RemittancePage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>

        <Route path="/employer" element={<EmployerLayout />}>
          <Route
            index
            element={<Navigate to="/employer/daily-calendar" replace />}
          />
          <Route path="daily-calendar" element={<DailyCalendarPage />} />
          <Route path="remittance-manage" element={<RemittanceManagePage />} />
          <Route path="worker-manage" element={<WorkerManagePage />} />
          <Route path="employer-mypage" element={<EmployerMyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
