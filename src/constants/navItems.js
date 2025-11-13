// src/constants/navItems.js
import { FiCalendar, FiServer, FiCreditCard } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";

export const workerNavItems= [{
    id: "monthly-calendar",
    label: "월간 캘린더",
    icon: FiCalendar,
  },
  {
    id: "weekly-calendar",
    label: "주간 캘린더",
    icon: FiServer,
  },
  {
    id: "remittance",
    label: "송금 관리",
    icon: FiCreditCard,
  },
  {
    id: "mypage",
    label: "마이페이지",
    icon: IoMdPerson,
  },
];
