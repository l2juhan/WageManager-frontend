// 근무 관련 유틸리티 함수

// 수당 유형 정의
export const allowanceDefinitions = [
  { key: "overtime", label: "연장수당" },
  { key: "night", label: "야간수당" },
  { key: "holiday", label: "휴일수당" },
];

// 수당 정보를 편집하기 쉬운 형태로 정규화
export const normalizeAllowances = (allowances = {}) => {
  return allowanceDefinitions.reduce((acc, { key }) => {
    const base = allowances[key] || {};
    acc[key] = {
      enabled: base.enabled ?? false,
      rate: typeof base.rate === "number" && base.rate > 0 ? base.rate : 150,
    };
    return acc;
  }, {});
};

// 선택한 근무 정보를 복제하면서 누락된 필드를 기본값으로 채움
export const cloneShiftWithDefaults = (shift) =>
  shift
    ? {
        ...shift,
        allowances: normalizeAllowances(shift.allowances),
        start: shift.start || "09:00",
        end: shift.end || "18:00",
        crossesMidnight: Boolean(shift.crossesMidnight),
      }
    : null;

// 근무자 추가 시 새로운 ID 생성
export const generateShiftId = (data) => {
  let maxId = 0;
  Object.values(data).forEach((workplace) => {
    Object.values(workplace || {}).forEach((shifts) => {
      shifts.forEach((shift) => {
        if (typeof shift.id === "number") {
          maxId = Math.max(maxId, shift.id);
        }
      });
    });
  });
  return maxId + 1 || Date.now();
};
