// TODO: 백엔드 연동 시 제거할 임시 더미 데이터

// 스케줄 더미 데이터
export const initialScheduleData = {
  "맥도날드 잠실점": {
    "2025-11-21": [
      {
        id: 1,
        name: "오지환",
        start: "07:00",
        end: "16:00",
        startHour: 7,
        durationHours: 9,
        workplaceDetail: "맥도날드 잠실점",
        breakMinutes: 60,
        hourlyWage: 11000,
        allowances: {
          overtime: { enabled: true, rate: 150 },
          night: { enabled: false, rate: 0 },
          holiday: { enabled: false, rate: 0 },
        },
        socialInsurance: true,
        withholdingTax: true,
      },
      {
        id: 2,
        name: "문보경",
        start: "04:30",
        end: "14:30",
        startHour: 4.5,
        durationHours: 10,
        workplaceDetail: "맥도날드 잠실점",
        breakMinutes: 45,
        hourlyWage: 10500,
        allowances: {
          overtime: { enabled: true, rate: 125 },
          night: { enabled: true, rate: 150 },
          holiday: { enabled: false, rate: 0 },
        },
        socialInsurance: true,
        withholdingTax: true,
      },
      {
        id: 3,
        name: "홍창기",
        start: "10:00",
        end: "15:00",
        startHour: 10,
        durationHours: 5,
        workplaceDetail: "맥도날드 잠실점",
        breakMinutes: 30,
        hourlyWage: 10000,
        allowances: {
          overtime: { enabled: false, rate: 0 },
          night: { enabled: false, rate: 0 },
          holiday: { enabled: false, rate: 0 },
        },
        socialInsurance: false,
        withholdingTax: false,
      },
    ],
  },
  "스타벅스 강남역점": {
    "2025-11-21": [
      {
        id: 6,
        name: "김민수",
        start: "08:00",
        end: "16:00",
        startHour: 8,
        durationHours: 8,
        workplaceDetail: "스타벅스 강남역점",
        breakMinutes: 30,
        hourlyWage: 12000,
        allowances: {
          overtime: { enabled: true, rate: 150 },
          night: { enabled: false, rate: 0 },
          holiday: { enabled: true, rate: 150 },
        },
        socialInsurance: true,
        withholdingTax: true,
      },
      {
        id: 7,
        name: "이지은",
        start: "09:00",
        end: "17:00",
        startHour: 9,
        durationHours: 8,
        workplaceDetail: "스타벅스 강남역점",
        breakMinutes: 30,
        hourlyWage: 12500,
        allowances: {
          overtime: { enabled: true, rate: 125 },
          night: { enabled: false, rate: 0 },
          holiday: { enabled: false, rate: 0 },
        },
        socialInsurance: true,
        withholdingTax: true,
      },
    ],
  },
  롯데리아: {},
  버거킹: {},
  KFC: {},
};

// 근무지 리스트 더미 데이터
export const initialWorkplaces = [
  { id: 1, name: "맥도날드 잠실점" },
  { id: 2, name: "스타벅스 강남역점" },
  { id: 3, name: "롯데리아" },
  { id: 4, name: "버거킹" },
  { id: 5, name: "KFC" },
];

// 근무지별 근무자 리스트
export const workplaceWorkers = {
  1: ["오지환", "문보경", "홍창기", "오스틴", "박해민", "임찬규", "송승기"],
  2: ["김민수", "이지은"],
  3: ["김지수", "박시우", "최민호"],
  4: ["이서연", "장도윤"],
  5: ["정윤호", "한지민"],
};
