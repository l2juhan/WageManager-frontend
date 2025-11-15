// src/constants/navItems.js
import { FiCalendar, FiServer, FiCreditCard } from "react-icons/fi";
import { IoMdPerson } from "react-icons/io";

export const workerNavItems = [
  {
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

export const employerNavItems = [
  {
    id: "daily-calendar",
    label: "일간 캘린더",
    icon: FiCalendar,
  },
  {
    id: "remittance-manage",
    label: "고용주송금 관리",
    icon: FiServer,
  },
  {
    id: "worker-manage",
    label: "근무지 관리",
    icon: FiCreditCard,
  },
  {
    id: "employer-mypage",
    label: "고용주 마이페이지",
    icon: IoMdPerson,
  },
];
