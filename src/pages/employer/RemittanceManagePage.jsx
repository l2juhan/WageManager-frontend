import { useState, useMemo } from "react";
import "../../styles/remittanceManagePage.css";
import {
  initialWorkplaces,
  workplaceWorkers,
  remittanceData,
} from "./dummyData";
import { formatCurrency } from "./utils/formatUtils";

export default function RemittanceManagePage() {
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState(1);
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(10);

  const selectedWorkplace =
    initialWorkplaces.find((wp) => wp.id === selectedWorkplaceId)?.name || "";

  const workers = useMemo(() => {
    return workplaceWorkers[selectedWorkplaceId] || [];
  }, [selectedWorkplaceId]);

  // 첫 번째 직원을 기본 선택 (workers가 변경될 때마다 자동 업데이트)
  const selectedWorker = useMemo(() => {
    return workers.length > 0 ? workers[0] : null;
  }, [workers]);

  // selectedWorker를 state로 관리하기 위한 함수 (직원 클릭 시 사용)
  const [manuallySelectedWorker, setManuallySelectedWorker] = useState(null);

  // 수동으로 선택된 직원이 있으면 그것을 사용, 없으면 기본값 사용
  const currentSelectedWorker = manuallySelectedWorker || selectedWorker;

  // 선택된 직원의 근무 내역 가져오기
  const workerData = useMemo(() => {
    if (!currentSelectedWorker || !remittanceData[selectedWorkplace]) {
      return null;
    }
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    return (
      remittanceData[selectedWorkplace]?.[currentSelectedWorker]?.[monthKey] ||
      null
    );
  }, [currentSelectedWorker, selectedWorkplace, currentYear, currentMonth]);

  // 누적 급여 계산
  const totalWage = useMemo(() => {
    if (!currentSelectedWorker || !remittanceData[selectedWorkplace]) {
      return 0;
    }
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    const workerMonthData =
      remittanceData[selectedWorkplace]?.[currentSelectedWorker]?.[monthKey];
    // 해당 월의 근무 내역이 있으면 totalWage 사용, 없으면 0
    return workerMonthData
      ? remittanceData[selectedWorkplace]?.[currentSelectedWorker]?.totalWage ||
          0
      : 0;
  }, [currentSelectedWorker, selectedWorkplace, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 1) {
        setCurrentYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 12) {
        setCurrentYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  const handleWorkplaceChange = (e) => {
    const newWorkplaceId = Number(e.target.value);
    setSelectedWorkplaceId(newWorkplaceId);
    // 근무지 변경 시 수동 선택 초기화 (기본값으로 돌아감)
    setManuallySelectedWorker(null);
  };

  const handleWorkerClick = (workerName) => {
    setManuallySelectedWorker(workerName);
  };

  const handleRemittance = () => {
    // 송금하기 로직 추가 예정
    alert("카카오톡 송금하기 연결 예정");
  };

  return (
    <div className="remittance-manage-page">
      <div className="remittance-left-panel">
        <div className="remittance-workplace-select">
          <select
            value={selectedWorkplaceId}
            onChange={handleWorkplaceChange}
            className="workplace-select"
          >
            {initialWorkplaces.map((wp) => (
              <option key={wp.id} value={wp.id}>
                {wp.name}
              </option>
            ))}
          </select>
        </div>
        <div className="remittance-worker-list">
          {workers.map((worker) => (
            <div
              key={worker}
              className={`worker-item ${
                currentSelectedWorker === worker ? "selected" : ""
              }`}
              onClick={() => handleWorkerClick(worker)}
            >
              {worker}
            </div>
          ))}
        </div>
      </div>

      <div className="remittance-center-panel">
        <div className="remittance-month-nav">
          <button
            type="button"
            className="month-nav-button"
            onClick={handlePrevMonth}
          >
            &lt;
          </button>
          <span className="month-display">
            {currentYear}년 {currentMonth}월
          </span>
          <button
            type="button"
            className="month-nav-button"
            onClick={handleNextMonth}
          >
            &gt;
          </button>
        </div>

        <h2 className="remittance-detail-title">근무 상세 내역</h2>

        <div className="remittance-detail-list">
          {workerData && workerData.length > 0 ? (
            workerData.map((record, index) => (
              <div key={index} className="remittance-detail-card">
                <div className="detail-date">
                  <span className="date-number">{record.date}</span>
                  <span className="date-day">{record.day}</span>
                </div>
                <div className="detail-time">
                  {record.startTime} ~ {record.endTime}
                </div>
                <div className="detail-wage">{formatCurrency(record.wage)}</div>
              </div>
            ))
          ) : (
            <p className="no-data">근무 내역이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="remittance-right-panel">
        <div className="remittance-summary-box">
          <h3 className="summary-title">이번달 누적 급여</h3>
          <div className="summary-amount">{formatCurrency(totalWage)}</div>
        </div>
        <button
          type="button"
          className="remittance-button"
          onClick={handleRemittance}
        >
          송금하기
        </button>
      </div>
    </div>
  );
}
