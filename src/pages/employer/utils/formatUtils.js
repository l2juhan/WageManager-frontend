// 포맷 관련 유틸리티 함수

// 통화 포맷
export const formatCurrency = (value) =>
  typeof value === "number" ? `${value.toLocaleString("ko-KR")}원` : "-";

// 휴게 시간 포맷
export const formatBreakTime = (minutes) =>
  typeof minutes === "number" ? `${minutes}분` : "-";

// 근무 시간 포맷 (소수점 시간을 "X시간 Y분" 형식으로)
export const formatDuration = (hours) => {
  if (typeof hours !== "number") return "-";
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 0) {
    return `${wholeHours}시간`;
  }
  if (minutes === 60) {
    return `${wholeHours + 1}시간`;
  }
  return `${wholeHours}시간 ${minutes}분`;
};

// 시간 문자열을 소수로 변환 (예: "07:30" → 7.5)
export const timeStringToDecimal = (timeString) => {
  if (!timeString) return 0;
  const [hour = "0", minute = "0"] = timeString.split(":");
  return Number(hour) + Number(minute) / 60;
};
