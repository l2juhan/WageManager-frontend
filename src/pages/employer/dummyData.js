// 중앙 집중형 더미 데이터 (향후 백엔드 연동 시 제거 예정)

export const initialWorkplaces = [
  { id: 1, name: "맥도날드 잠실점" },
  { id: 2, name: "스타벅스 강남역점" },
  { id: 3, name: "롯데리아" },
  { id: 4, name: "버거킹" },
  { id: 5, name: "KFC" },
];

export const workplaceWorkers = {
  1: ["오지환", "문보경", "홍창기", "오스틴", "박해민", "임찬규", "송승기"],
  2: ["김민수", "이지은"],
  3: ["김지수", "박시우", "최민호"],
  4: ["이서연", "장도윤"],
  5: ["정윤호", "한지민"],
};

const workplaceNameById = initialWorkplaces.reduce((acc, wp) => {
  acc[wp.id] = wp.name;
  return acc;
}, {});

const pad2 = (value) => String(value).padStart(2, "0");

const toDateKey = (year, month, date) => `${year}-${pad2(month)}-${pad2(date)}`;

const timeToMinutes = (time) => {
  const [hour = "0", minute = "0"] = time.split(":");
  return Number(hour) * 60 + Number(minute);
};

const getKoreanDayLabel = (year, month, date) => {
  const labels = ["일", "월", "화", "수", "목", "금", "토"];
  return labels[new Date(year, month - 1, date).getDay()];
};

const calcPayAmount = (entry) => {
  if (typeof entry.payAmount === "number") {
    return entry.payAmount;
  }
  const minutes =
    timeToMinutes(entry.endTime) -
    timeToMinutes(entry.startTime) -
    (entry.breakMinutes || 0);
  return Math.round((minutes / 60) * entry.hourlyWage);
};

const withDefaultAllowances = (allowances = {}) => ({
  overtime: { enabled: false, rate: 0, ...(allowances.overtime || {}) },
  night: { enabled: false, rate: 0, ...(allowances.night || {}) },
  holiday: { enabled: false, rate: 0, ...(allowances.holiday || {}) },
});

const createRemittanceSeries = ({
  idPrefix,
  workerName,
  workplaceId,
  year,
  month,
  startTime,
  endTime,
  hourlyWage,
  payAmount,
  dates,
  breakMinutes = 0,
  allowances: allowancePreset,
  socialInsurance = true,
  withholdingTax = true,
}) =>
  dates.map((date, index) => ({
    id: `${idPrefix}-${index + 1}`,
    workerName,
    workplaceId,
    year,
    month,
    date,
    startTime,
    endTime,
    breakMinutes,
    hourlyWage,
    allowances: withDefaultAllowances(allowancePreset),
    socialInsurance,
    withholdingTax,
    contexts: ["remittance"],
    payAmount,
  }));

const scheduleSeed = [
  {
    id: "schedule-ojh-1121",
    workerName: "오지환",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 21,
    startTime: "07:00",
    endTime: "16:00",
    breakMinutes: 60,
    hourlyWage: 11000,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["schedule"],
  },
  {
    id: "schedule-mbk-1121",
    workerName: "문보경",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 21,
    startTime: "04:30",
    endTime: "14:30",
    breakMinutes: 45,
    hourlyWage: 10500,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 125 },
      night: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["schedule"],
  },
  {
    id: "schedule-hck-1121",
    workerName: "홍창기",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 21,
    startTime: "10:00",
    endTime: "15:00",
    breakMinutes: 30,
    hourlyWage: 10000,
    allowances: withDefaultAllowances(),
    socialInsurance: false,
    withholdingTax: false,
    contexts: ["schedule"],
  },
  {
    id: "schedule-kms-1121",
    workerName: "김민수",
    workplaceId: 2,
    year: 2025,
    month: 11,
    date: 21,
    startTime: "08:00",
    endTime: "16:00",
    breakMinutes: 30,
    hourlyWage: 12000,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
      holiday: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["schedule"],
  },
  {
    id: "schedule-ije-1121",
    workerName: "이지은",
    workplaceId: 2,
    year: 2025,
    month: 11,
    date: 21,
    startTime: "09:00",
    endTime: "17:00",
    breakMinutes: 30,
    hourlyWage: 12500,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 125 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["schedule"],
  },
];

const requestSeed = [
  {
    id: "request-1",
    workerName: "김민수",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 25,
    startTime: "09:00",
    endTime: "18:00",
    breakMinutes: 60,
    hourlyWage: 11000,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
      night: { enabled: true, rate: 150 },
      holiday: { enabled: true, rate: 200 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["request"],
  },
  {
    id: "request-2",
    workerName: "이지은",
    workplaceId: 2,
    year: 2025,
    month: 11,
    date: 26,
    startTime: "07:00",
    endTime: "15:00",
    breakMinutes: 45,
    hourlyWage: 12000,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 125 },
      holiday: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: false,
    contexts: ["request"],
    requestStatus: "approved",
  },
  {
    id: "request-3",
    workerName: "박서준",
    workplaceId: 3,
    year: 2025,
    month: 11,
    date: 27,
    startTime: "14:00",
    endTime: "22:00",
    breakMinutes: 30,
    hourlyWage: 10030,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 125 },
      night: { enabled: true, rate: 150 },
    }),
    socialInsurance: false,
    withholdingTax: true,
    contexts: ["request"],
    requestStatus: "rejected",
  },
  {
    id: "request-4",
    workerName: "최수진",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 27,
    startTime: "11:00",
    endTime: "20:00",
    breakMinutes: 60,
    hourlyWage: 10500,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 200 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["request"],
  },
  {
    id: "request-5",
    workerName: "정다은",
    workplaceId: 4,
    year: 2025,
    month: 11,
    date: 28,
    startTime: "06:00",
    endTime: "14:00",
    breakMinutes: 30,
    hourlyWage: 11500,
    allowances: withDefaultAllowances({
      night: { enabled: true, rate: 200 },
    }),
    socialInsurance: false,
    withholdingTax: false,
    contexts: ["request"],
  },
  {
    id: "request-6",
    workerName: "한소희",
    workplaceId: 2,
    year: 2025,
    month: 11,
    date: 28,
    startTime: "13:00",
    endTime: "21:00",
    breakMinutes: 45,
    hourlyWage: 12500,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
      night: { enabled: true, rate: 150 },
      holiday: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: false,
    contexts: ["request"],
  },
  {
    id: "request-7",
    workerName: "오지환",
    workplaceId: 5,
    year: 2025,
    month: 11,
    date: 29,
    startTime: "10:00",
    endTime: "19:00",
    breakMinutes: 60,
    hourlyWage: 10800,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 125 },
      night: { enabled: true, rate: 200 },
      holiday: { enabled: true, rate: 150 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["request"],
    requestStatus: "approved",
  },
  {
    id: "request-8",
    workerName: "문보경",
    workplaceId: 1,
    year: 2025,
    month: 11,
    date: 29,
    startTime: "16:00",
    endTime: "24:00",
    breakMinutes: 30,
    hourlyWage: 13000,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
      night: { enabled: true, rate: 200 },
    }),
    socialInsurance: true,
    withholdingTax: false,
    contexts: ["request"],
  },
  {
    id: "request-9",
    workerName: "홍창기",
    workplaceId: 3,
    year: 2025,
    month: 11,
    date: 30,
    startTime: "08:00",
    endTime: "17:00",
    breakMinutes: 45,
    hourlyWage: 10000,
    allowances: withDefaultAllowances(),
    socialInsurance: false,
    withholdingTax: false,
    contexts: ["request"],
    requestStatus: "rejected",
  },
  {
    id: "request-10",
    workerName: "김서연",
    workplaceId: 4,
    year: 2025,
    month: 12,
    date: 1,
    startTime: "12:00",
    endTime: "21:00",
    breakMinutes: 60,
    hourlyWage: 11200,
    allowances: withDefaultAllowances({
      overtime: { enabled: true, rate: 150 },
      holiday: { enabled: true, rate: 200 },
    }),
    socialInsurance: true,
    withholdingTax: true,
    contexts: ["request"],
  },
];

const remittanceSeed = [
  ...createRemittanceSeries({
    idPrefix: "remit-ojh",
    workerName: "오지환",
    workplaceId: 1,
    year: 2025,
    month: 11,
    startTime: "15:00",
    endTime: "21:00",
    hourlyWage: 10030,
    payAmount: 60180,
    dates: [15, 13, 6, 5, 4],
    breakMinutes: 30,
    allowances: {
      overtime: { enabled: true, rate: 150 },
      night: { enabled: true, rate: 150 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-mbk",
    workerName: "문보경",
    workplaceId: 1,
    year: 2025,
    month: 11,
    startTime: "09:00",
    endTime: "18:00",
    hourlyWage: 9900,
    payAmount: 89100,
    dates: [20, 18, 12],
    breakMinutes: 60,
    allowances: {
      overtime: { enabled: true, rate: 125 },
      holiday: { enabled: true, rate: 150 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-hck",
    workerName: "홍창기",
    workplaceId: 1,
    year: 2025,
    month: 11,
    startTime: "10:00",
    endTime: "19:00",
    hourlyWage: 10000,
    payAmount: 90000,
    dates: [22, 19, 11, 8],
    breakMinutes: 45,
    allowances: {
      night: { enabled: true, rate: 200 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-ost",
    workerName: "오스틴",
    workplaceId: 1,
    year: 2025,
    month: 11,
    startTime: "14:00",
    endTime: "22:00",
    hourlyWage: 10000,
    payAmount: 80000,
    dates: [25, 17, 10],
    breakMinutes: 30,
    allowances: {
      night: { enabled: true, rate: 180 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-phm",
    workerName: "박해민",
    workplaceId: 1,
    year: 2025,
    month: 10,
    startTime: "11:00",
    endTime: "20:00",
    hourlyWage: 11000,
    payAmount: 99000,
    dates: [16, 9, 2],
    breakMinutes: 50,
    allowances: {
      overtime: { enabled: true, rate: 140 },
      holiday: { enabled: true, rate: 130 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-ick",
    workerName: "임찬규",
    workplaceId: 1,
    year: 2025,
    month: 11,
    startTime: "08:00",
    endTime: "17:00",
    hourlyWage: 11000,
    payAmount: 99000,
    dates: [24, 14, 7],
    breakMinutes: 60,
    allowances: {
      overtime: { enabled: true, rate: 130 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-ssg",
    workerName: "송승기",
    workplaceId: 1,
    year: 2025,
    month: 10,
    startTime: "12:00",
    endTime: "21:00",
    hourlyWage: 11000,
    payAmount: 99000,
    dates: [21, 3],
    breakMinutes: 30,
    allowances: {
      night: { enabled: true, rate: 170 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-kms",
    workerName: "김민수",
    workplaceId: 2,
    year: 2025,
    month: 10,
    startTime: "08:00",
    endTime: "16:00",
    hourlyWage: 12000,
    payAmount: 96000,
    dates: [21, 14, 7],
    breakMinutes: 30,
    allowances: {
      holiday: { enabled: true, rate: 180 },
    },
  }),
  ...createRemittanceSeries({
    idPrefix: "remit-ije",
    workerName: "이지은",
    workplaceId: 2,
    year: 2025,
    month: 10,
    startTime: "12:00",
    endTime: "20:00",
    hourlyWage: 12000,
    payAmount: 96000,
    dates: [23, 16, 9],
    breakMinutes: 40,
    allowances: {
      overtime: { enabled: true, rate: 125 },
      night: { enabled: true, rate: 150 },
      holiday: { enabled: true, rate: 120 },
    },
  }),
];

const baseShiftEntries = [...scheduleSeed, ...requestSeed, ...remittanceSeed];

const filterByContext = (context) =>
  baseShiftEntries.filter((entry) => entry.contexts.includes(context));

const buildInitialScheduleData = (entries) => {
  const result = initialWorkplaces.reduce((acc, wp) => {
    acc[wp.name] = {};
    return acc;
  }, {});

  entries.forEach((entry) => {
    const workplaceName =
      workplaceNameById[entry.workplaceId] || entry.workplaceName;
    const dateKey = toDateKey(entry.year, entry.month, entry.date);

    if (!result[workplaceName][dateKey]) {
      result[workplaceName][dateKey] = [];
    }

    result[workplaceName][dateKey].push({
      id: entry.id,
      name: entry.workerName,
      start: entry.startTime,
      end: entry.endTime,
      startHour: timeToMinutes(entry.startTime) / 60,
      durationHours:
        timeToMinutes(entry.endTime) / 60 - timeToMinutes(entry.startTime) / 60,
      workplaceDetail: workplaceName,
      breakMinutes: entry.breakMinutes ?? 0,
      hourlyWage: entry.hourlyWage,
      allowances: entry.allowances,
      socialInsurance: entry.socialInsurance,
      withholdingTax: entry.withholdingTax,
      crossesMidnight: entry.crossesMidnight ?? false,
    });
  });

  return result;
};

const buildMockRequests = (entries) =>
  entries.map((entry, index) => ({
    id: entry.requestId ?? index + 1,
    workerName: entry.workerName,
    workplace: workplaceNameById[entry.workplaceId] || entry.workplaceName,
    month: entry.month,
    date: entry.date,
    startTime: entry.startTime,
    endTime: entry.endTime,
    breakMinutes: entry.breakMinutes ?? 0,
    hourlyWage: entry.hourlyWage,
    allowances: entry.allowances,
    socialInsurance: entry.socialInsurance,
    withholdingTax: entry.withholdingTax,
    status: entry.requestStatus ?? null,
  }));

const buildRemittanceData = (entries) => {
  const result = {};

  entries.forEach((entry) => {
    const workplaceName =
      workplaceNameById[entry.workplaceId] || entry.workplaceName;
    if (!result[workplaceName]) {
      result[workplaceName] = {};
    }

    const workerBucket =
      result[workplaceName][entry.workerName] ||
      (result[workplaceName][entry.workerName] = { totalWage: 0 });
    const monthKey = `${entry.year}-${pad2(entry.month)}`;
    if (!workerBucket[monthKey]) {
      workerBucket[monthKey] = [];
    }

    const wage = calcPayAmount(entry);
    workerBucket[monthKey].push({
      date: entry.date,
      day: getKoreanDayLabel(entry.year, entry.month, entry.date),
      startTime: entry.startTime,
      endTime: entry.endTime,
      wage,
      hourlyWage: entry.hourlyWage,
      breakMinutes: entry.breakMinutes ?? 0,
      allowances: entry.allowances ? { ...entry.allowances } : undefined,
      socialInsurance: entry.socialInsurance ?? false,
      withholdingTax: entry.withholdingTax ?? false,
    });
    workerBucket.totalWage += wage;
  });

  return result;
};

export const initialScheduleData = buildInitialScheduleData(
  filterByContext("schedule")
);

export const mockRequests = buildMockRequests(filterByContext("request"));

export const remittanceData = buildRemittanceData(
  filterByContext("remittance")
);
