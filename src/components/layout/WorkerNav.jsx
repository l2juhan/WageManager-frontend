import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { workerNavItems } from "../../constants/navItems.js";
import "../../styles/workerNav.css";

export default function WorkerNav() {
  const [activeId, setActiveId] = useState("monthly-calendar");
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    setActiveId(id);
    navigate(`/worker/${id}`);
  };

  return (
    <aside className="worker-sidebar">
    <div className="nav-icon-list">
    {workerNavItems.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        type="button"
        className="nav-icon-button"
        data-active={activeId === id}
        onClick={() => handleItemClick(id)}
        aria-label={label}
      >
      <Icon size={28} />
      </button>
    ))}
    </div>
    </aside>
  );
}
