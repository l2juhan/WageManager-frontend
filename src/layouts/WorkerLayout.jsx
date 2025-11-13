
import { Outlet } from "react-router-dom";
import WorkerNav from "../components/layout/WorkerNav.jsx";

export default function WorkerLayout() {
  return (
    <div className="worker-layout">
      <WorkerNav />
      <main className="app-main-with-sidebar">
        <Outlet />
      </main>
    </div>
  );
}
