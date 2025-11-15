import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { employerNavItems } from "../../constants/navItems.js";
import "../../styles/employerNav.css";

export default function EmployerNav() {
  const [activeId, setActiveId] = useState("daily-calendar");
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    setActiveId(id);
    navigate(`/employer/${id}`);
  };

  return (
    <aside className="employer-sidebar">
      <div className="nav-icon-list">
        {employerNavItems.map(({ id, label, icon: Icon }) => (
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
