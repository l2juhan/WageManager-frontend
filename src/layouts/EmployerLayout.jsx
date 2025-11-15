import { Outlet } from "react-router-dom";
import EmployerNav from "../components/layout/EmployerNav.jsx";

export default function EmployerLayout() {
  return (
    <div className="employer-layout">
      <EmployerNav />
      <main className="app-main-with-sidebar">
        <Outlet />
      </main>
    </div>
  );
}

