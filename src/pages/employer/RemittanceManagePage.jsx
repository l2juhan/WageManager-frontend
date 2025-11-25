import { useState, useMemo } from "react";
import "../../styles/remittanceManagePage.css";
import {
  initialWorkplaces,
  workplaceWorkers,
  remittanceData,
} from "./dummyData";
import { formatCurrency, formatBreakTime } from "./utils/formatUtils";
import { allowanceDefinitions } from "./utils/shiftUtils";

export default function RemittanceManagePage() {
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState(1);
  const [currentYear, setCurrentYear] = useState(() =>
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date().getMonth() + 1
  );

  const selectedWorkplace =
    initialWorkplaces.find((wp) => wp.id === selectedWorkplaceId)?.name || "";

  const workers = useMemo(() => {
    return workplaceWorkers[selectedWorkplaceId] || [];
  }, [selectedWorkplaceId]);

  const selectedWorker = useMemo(() => {
    return workers.length > 0 ? workers[0] : null;
  }, [workers]);

  const [manuallySelectedWorker, setManuallySelectedWorker] = useState(null);
  const currentSelectedWorker = manuallySelectedWorker || selectedWorker;

  const [expandedRecordIndex, setExpandedRecordIndex] = useState(null);

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

  const totalWage = useMemo(() => {
    if (!currentSelectedWorker || !remittanceData[selectedWorkplace]) {
      return 0;
    }
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    const workerMonthData =
      remittanceData[selectedWorkplace]?.[currentSelectedWorker]?.[monthKey];
    if (!workerMonthData || workerMonthData.length === 0) {
      return 0;
    }

    // 선택된 연/월의 레코드만 합산
    return workerMonthData.reduce((sum, record) => sum + (record.wage ?? 0), 0);
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
    setManuallySelectedWorker(null);
    setExpandedRecordIndex(null);
  };

  const handleWorkerClick = (workerName) => {
    setManuallySelectedWorker(workerName);
    setExpandedRecordIndex(null);
  };

  const handleRemittance = () => {
    alert("카카오톡 송금하기 연결 예정");
  };

  const handleRecordClick = (index) => {
    setExpandedRecordIndex((prev) => (prev === index ? null : index));
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
              <div key={`${record.date}-${record.startTime}`}>
                <div
                  className="remittance-detail-card"
                  onClick={() => handleRecordClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleRecordClick(index);
                    }
                  }}
                >
                  <div className="detail-date">
                    <span className="date-number">{record.date}</span>
                    <span className="date-day">{record.day}</span>
                  </div>
                  <div className="detail-time">
                    <span>
                      {record.startTime} ~ {record.endTime}
                    </span>
                  </div>
                  <div className="detail-wage">
                    {formatCurrency(record.wage)}
                  </div>
                </div>
                <div
                  className={`remittance-detail-panel ${
                    expandedRecordIndex === index ? "open" : ""
                  }`}
                >
                  <div className="detail-header">
                    <div className="detail-header-left">
                      <div>
                        <h3 className="detail-name">
                          {currentSelectedWorker || "-"}
                        </h3>
                      </div>
                      <div>
                        <p className="detail-value">
                          {selectedWorkplace || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="detail-grid">
                    <div>
                      <p className="detail-label">근무 날짜</p>
                      <p className="detail-value">
                        {currentYear}.{String(currentMonth).padStart(2, "0")}.
                        {String(record.date).padStart(2, "0")} ({record.day})
                      </p>
                    </div>
                    <div>
                      <p className="detail-label">근무 시간</p>
                      <p className="detail-value">
                        {record.startTime} ~ {record.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="detail-label">시급</p>
                      <p className="detail-value">
                        {record.hourlyWage
                          ? formatCurrency(record.hourlyWage)
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="detail-label">휴게 시간</p>
                      <p className="detail-value">
                        {formatBreakTime(record.breakMinutes)}
                      </p>
                    </div>
                  </div>
                  <div className="detail-section">
                    <p className="detail-label">수당 정보</p>
                    <ul className="allowance-list">
                      {allowanceDefinitions.map(({ key, label }) => {
                        const allowance = record.allowances?.[key] || {
                          enabled: false,
                          rate: 0,
                        };
                        return (
                          <li
                            key={key}
                            className={`allowance-item ${
                              allowance.enabled ? "on" : "off"
                            }`}
                          >
                            <span>{label}</span>
                            <span className="allowance-rate">
                              {allowance.enabled
                                ? `${allowance.rate}%`
                                : "없음"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="detail-status-row">
                    <span
                      className={`status-pill ${
                        record.socialInsurance ? "on" : "off"
                      }`}
                    >
                      4대보험 {record.socialInsurance ? "적용" : "미적용"}
                    </span>
                    <span
                      className={`status-pill ${
                        record.withholdingTax ? "on" : "off"
                      }`}
                    >
                      소득세 {record.withholdingTax ? "적용" : "미적용"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">근무 내역이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="remittance-right-panel">
        <div className="remittance-summary-box">
          <h3 className="summary-title">누적 급여</h3>
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
