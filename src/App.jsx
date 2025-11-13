import { Routes, Route, Navigate } from "react-router-dom";
import WorkerLayout from "./layouts/WorkerLayout.jsx";
import MonthlyCalendarPage from "./pages/workers/MonthlyCalendarPage.jsx";
import WeeklyCalendarPage from "./pages/workers/WeeklyCalendarPage.jsx";
import RemittancePage from "./pages/workers/RemittancePage.jsx";
import MyPage from "./pages/workers/MyPage.jsx";

function App() {
  return (
    <>
      <Routes>
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

        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Routes>
    </>
  )
}

export default App
