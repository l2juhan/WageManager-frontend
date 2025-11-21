import { useMemo, useState, useEffect } from "react";
import "../../styles/dailyCalendarPage.css";
import {
  initialScheduleData,
  initialWorkplaces,
  workplaceWorkers,
} from "./dummyData";
import { getDateKey, isSameDate, buildCalendarCells } from "./utils/dateUtils";
import {
  allowanceDefinitions,
  cloneShiftWithDefaults,
  generateShiftId,
} from "./utils/shiftUtils";
import {
  formatCurrency,
  formatBreakTime,
  formatDuration,
  timeStringToDecimal,
} from "./utils/formatUtils";
import { hours } from "./constants";
import TimeInput from "./components/TimeInput";

export default function DailyCalendarPage() {
  const today = new Date();
  // 화면 전반에서 사용하는 상태들
  const [selectedDate, setSelectedDate] = useState(today);
  const [displayMonth, setDisplayMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // 근무지 리스트 (백엔드에서 받아올 예정)
  const [workplaces] = useState(initialWorkplaces);
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState(1); // 기본값: 맥도날드 잠실점 ID

  // 선택된 근무지 정보
  const selectedWorkplace =
    workplaces.find((wp) => wp.id === selectedWorkplaceId)?.name || "";

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [scheduleData, setScheduleData] = useState(() =>
    JSON.parse(JSON.stringify(initialScheduleData))
  );
  const [editedShift, setEditedShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showWorkerListModal, setShowWorkerListModal] = useState(false);

  // 현재 시간 실시간 업데이트 (현재 근무 중 박스)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  const dateKey = getDateKey(selectedDate);
  // TODO: 백엔드 연동 시 scheduleData 구조 변경 필요
  const workplaceSchedules = useMemo(
    () => scheduleData[selectedWorkplace] || {},
    [scheduleData, selectedWorkplace]
  );
  const currentScheduleData = useMemo(
    () => workplaceSchedules[dateKey] || [],
    [workplaceSchedules, dateKey]
  );

  // 겹치는 근무를 서로 다른 레인으로 배치
  const scheduleWithLanes = useMemo(() => {
    // 시간순으로 정렬
    const sorted = [...currentScheduleData].sort(
      (a, b) => a.startHour - b.startHour
    );

    const lanes = []; // 각 레인에 있는 shift block들의 정보를 저장

    return sorted.map((item) => {
      const shiftStart = item.startHour;
      const shiftEnd = item.startHour + item.durationHours;

      // 겹치지 않는 레인 찾기
      let laneIndex = -1;
      for (let i = 0; i < lanes.length; i++) {
        // 해당 레인의 모든 block과 겹치지 않는지 확인
        const canFit = lanes[i].every(
          (block) => block.end <= shiftStart || block.start >= shiftEnd
        );
        if (canFit) {
          laneIndex = i;
          break;
        }
      }

      // 겹치지 않는 레인이 없으면 새 레인 생성
      if (laneIndex === -1) {
        laneIndex = lanes.length;
        lanes.push([{ start: shiftStart, end: shiftEnd }]);
      } else {
        // 레인에 새로운 block 추가
        lanes[laneIndex].push({ start: shiftStart, end: shiftEnd });
      }

      return { ...item, laneIndex };
    });
  }, [currentScheduleData]);

  const laneCount =
    scheduleWithLanes.reduce((max, item) => Math.max(max, item.laneIndex), 0) +
    1;

  const activeShift = scheduleWithLanes.find(
    (shift) => shift.id === activeShiftId
  );

  // 익일 근무인 경우 전날 근무 찾기
  const previousDate = new Date(selectedDate);
  previousDate.setDate(previousDate.getDate() - 1);
  const previousDateKey = getDateKey(previousDate);
  const previousScheduleData = workplaceSchedules[previousDateKey] || [];

  // 익일 근무이고 시작 시간이 0시인 경우 전날 근무 찾기
  const previousDayShift =
    activeShift && activeShift.startHour === 0 && activeShift.start === "00:00"
      ? previousScheduleData.find(
          (shift) => shift.name === activeShift.name && shift.crossesMidnight
        )
      : null;

  // 표시할 근무 정보 (익일 근무면 전날 근무 정보 사용)
  const displayShift = previousDayShift || activeShift;

  // 월 달력 셀 캐싱
  const calendarCells = useMemo(
    () => buildCalendarCells(displayMonth),
    [displayMonth]
  );

  // 이전/다음 달 이동 및 날짜 선택 핸들러
  const handlePrevMonth = () => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setDisplayMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setActiveShiftId(null);
    setIsEditing(false);
    setEditedShift(null);
  };

  // 타임라인 블록 선택 토글
  const handleShiftClick = (shiftId) => {
    // 클릭한 근무 찾기
    const clickedShift = currentScheduleData.find(
      (shift) => shift.id === shiftId
    );

    // 익일 근무인지 확인 (00:00에 시작하는 경우)
    if (
      clickedShift &&
      clickedShift.startHour === 0 &&
      clickedShift.start === "00:00"
    ) {
      // 전날 날짜 계산
      const prevDate = new Date(selectedDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateKey = getDateKey(prevDate);
      const prevScheduleData = workplaceSchedules[prevDateKey] || [];

      // 전날 같은 직원의 익일로 넘어가는 근무 찾기
      const prevDayShift = prevScheduleData.find(
        (shift) => shift.name === clickedShift.name && shift.crossesMidnight
      );

      if (prevDayShift) {
        // 전날 날짜로 이동하고 전날 근무 선택
        setSelectedDate(prevDate);
        setActiveShiftId(prevDayShift.id);
        setIsEditing(false);
        setEditedShift(null);
        return;
      }
    }

    // 일반적인 경우
    setActiveShiftId((prev) => {
      const newId = prev === shiftId ? null : shiftId;
      if (newId !== prev) {
        setIsEditing(false);
        setEditedShift(null);
      }
      return newId;
    });
  };

  // 해당 근무지의 모든 직원 리스트 가져오기
  const workersInWorkplace = useMemo(
    () => workplaceWorkers[selectedWorkplaceId] || [],
    [selectedWorkplaceId]
  );

  // 근무자 추가 핸들러 - 모달 열기
  const handleAddShift = () => {
    setShowWorkerListModal(true);
  };

  // 직원 선택 후 근무 추가
  const handleSelectWorker = (workerName) => {
    const newShiftId = generateShiftId(scheduleData);
    const dateKeyToAdd = getDateKey(selectedDate);

    // TODO: 백엔드 연동 시 근무지 상세 정보(workplaceDetail)를 API에서 받아와야 할 수 있음
    const newShift = {
      id: newShiftId,
      name: workerName,
      start: "09:00",
      end: "18:00",
      startHour: 9,
      durationHours: 9,
      workplaceDetail: selectedWorkplace, // 현재는 근무지 이름 사용, 백엔드 연동 시 상세 정보 필요
      breakMinutes: 60,
      hourlyWage: 10030,
      allowances: {
        overtime: { enabled: false, rate: 150 },
        night: { enabled: false, rate: 0 },
        holiday: { enabled: false, rate: 0 },
      },
      socialInsurance: false,
      withholdingTax: false,
      crossesMidnight: false,
    };

    setScheduleData((prev) => {
      const workplace = prev[selectedWorkplace] || {};
      const currentList = workplace[dateKeyToAdd] || [];

      return {
        ...prev,
        [selectedWorkplace]: {
          ...workplace,
          [dateKeyToAdd]: [...currentList, newShift],
        },
      };
    });

    // 새로 추가한 근무를 선택하고 편집 모드로 진입
    setActiveShiftId(newShiftId);
    setEditedShift(cloneShiftWithDefaults(newShift));
    setIsEditing(true);
    setShowWorkerListModal(false);
  };

  // 편집 모드 진입/취소/저장 로직
  const handleStartEdit = () => {
    if (displayShift) {
      setEditedShift(cloneShiftWithDefaults(displayShift));
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    if (displayShift) {
      setEditedShift(cloneShiftWithDefaults(displayShift));
    }
    setIsEditing(false);
  };

  // 근무자 삭제 핸들러
  const handleDeleteShift = () => {
    if (!activeShiftId || !activeShift) return;

    // 삭제 확인
    if (!window.confirm(`${activeShift.name} 근무자를 삭제하시겠습니까?`)) {
      return;
    }

    const dateKeyToDelete = getDateKey(selectedDate);

    setScheduleData((prev) => {
      const workplace = prev[selectedWorkplace] || {};
      const currentList = workplace[dateKeyToDelete] || [];

      // 당일 근무 삭제
      let updatedList = currentList.filter(
        (shift) => shift.id !== activeShiftId
      );

      // 익일로 넘어가는 근무인 경우 익일 근무도 삭제
      if (activeShift.crossesMidnight) {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextKey = getDateKey(nextDate);
        const nextList = workplace[nextKey] || [];

        // 익일 근무 찾아서 삭제
        const nextDayShift = nextList.find(
          (shift) => shift.name === activeShift.name && shift.start === "00:00"
        );

        if (nextDayShift) {
          const updatedNextList = nextList.filter(
            (shift) => shift.id !== nextDayShift.id
          );
          return {
            ...prev,
            [selectedWorkplace]: {
              ...workplace,
              [dateKeyToDelete]: updatedList,
              [nextKey]: updatedNextList,
            },
          };
        }
      }

      return {
        ...prev,
        [selectedWorkplace]: {
          ...workplace,
          [dateKeyToDelete]: updatedList,
        },
      };
    });

    // 삭제 후 패널 닫기
    setActiveShiftId(null);
    setIsEditing(false);
    setEditedShift(null);
  };

  const updateEditedShift = (field, value) => {
    setEditedShift((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateAllowance = (type, changes) => {
    setEditedShift((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        allowances: {
          ...prev.allowances,
          [type]: {
            ...prev.allowances?.[type],
            ...changes,
          },
        },
      };
    });
  };

  const handleSaveShift = () => {
    if (!editedShift || !activeShiftId) return;

    // 익일 근무를 클릭한 경우 전날 근무의 ID와 날짜 사용
    const shiftToUpdate = displayShift;
    const actualShiftId = shiftToUpdate?.id || activeShiftId;
    const actualDate = previousDayShift ? previousDate : selectedDate;
    const dateKeyToUpdate = getDateKey(actualDate);

    const { laneIndex: _unusedLaneIndex, ...shiftToSave } = editedShift;
    const startDecimal = timeStringToDecimal(shiftToSave.start);
    const endDecimalRaw =
      shiftToSave.end === "24:00" ? 24 : timeStringToDecimal(shiftToSave.end);
    const crossesMidnight =
      shiftToSave.crossesMidnight || endDecimalRaw < startDecimal;

    setScheduleData((prev) => {
      const workplace = prev[selectedWorkplace] || {};
      const currentList = workplace[dateKeyToUpdate] || [];
      let updatedList = currentList.map((shift) =>
        shift.id === actualShiftId ? { ...shift, ...shiftToSave } : shift
      );

      if (crossesMidnight) {
        const firstPartDuration = 24 - startDecimal;
        const secondPartDuration = endDecimalRaw === 24 ? 0 : endDecimalRaw;

        updatedList = updatedList.map((shift) => {
          if (shift.id !== actualShiftId) return shift;
          return {
            ...shift,
            ...shiftToSave,
            end: "24:00",
            durationHours: firstPartDuration,
            crossesMidnight: true,
            nextDayEndHour: undefined,
          };
        });

        const nextDate = new Date(actualDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextKey = getDateKey(nextDate);
        const nextList = workplace[nextKey] ? [...workplace[nextKey]] : [];

        // 익일 근무가 이미 존재하는 경우 (익일 근무를 클릭한 경우)
        const existingNextDayShift =
          activeShift && activeShift.start === "00:00"
            ? nextList.find((shift) => shift.id === activeShift.id)
            : null;

        if (secondPartDuration > 0) {
          if (existingNextDayShift) {
            // 기존 익일 근무 업데이트
            const updatedNextList = nextList.map((shift) =>
              shift.id === activeShift.id
                ? {
                    ...shiftToSave,
                    id: shift.id,
                    start: "00:00",
                    end: shiftToSave.end,
                    startHour: 0,
                    durationHours: secondPartDuration,
                    crossesMidnight: false,
                    nextDayEndHour: undefined,
                  }
                : shift
            );
            return {
              ...prev,
              [selectedWorkplace]: {
                ...workplace,
                [dateKeyToUpdate]: updatedList,
                [nextKey]: updatedNextList,
              },
            };
          } else {
            // 새 익일 근무 생성
            const newShiftId = generateShiftId(prev);
            nextList.push({
              ...shiftToSave,
              id: newShiftId,
              start: "00:00",
              end: shiftToSave.end,
              startHour: 0,
              durationHours: secondPartDuration,
              crossesMidnight: false,
              nextDayEndHour: undefined,
            });
          }
        }

        return {
          ...prev,
          [selectedWorkplace]: {
            ...workplace,
            [dateKeyToUpdate]: updatedList,
            [nextKey]: nextList,
          },
        };
      }

      const normalizedList = updatedList.map((shift) =>
        shift.id === actualShiftId
          ? {
              ...shift,
              crossesMidnight: false,
              nextDayEndHour: undefined,
            }
          : shift
      );

      return {
        ...prev,
        [selectedWorkplace]: {
          ...workplace,
          [dateKeyToUpdate]: normalizedList,
        },
      };
    });

    setIsEditing(false);

    // 저장 후 상태 업데이트
    if (crossesMidnight) {
      // 익일 근무가 생성/업데이트되었으므로 전날 근무의 ID로 변경
      setSelectedDate(actualDate);
      setActiveShiftId(actualShiftId);
    } else if (previousDayShift) {
      // 익일 근무를 클릭한 경우 전날 근무의 ID로 변경
      setSelectedDate(previousDate);
      setActiveShiftId(previousDayShift.id);
    }
  };

  // YYYY.MM.DD 포맷 helper
  const formattedSelectedDate = useMemo(() => {
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${selectedDate.getFullYear()}.${month}.${day}`;
  }, [selectedDate]);

  const handleTimeChange = (field, value) => {
    const sanitized = value || "00:00";
    setEditedShift((prev) => {
      if (!prev) return prev;
      const next = { ...prev };

      if (field === "start") {
        next.start = sanitized;
      } else {
        next.end = sanitized;
      }

      const startDecimal = timeStringToDecimal(next.start);
      let endDecimal = timeStringToDecimal(next.end);
      if (next.end === "24:00") {
        endDecimal = 24;
      }

      const crossesMidnight = endDecimal < startDecimal;
      const totalDuration = crossesMidnight
        ? 24 - startDecimal + endDecimal
        : endDecimal - startDecimal;

      next.startHour = startDecimal;
      next.durationHours = Math.max(totalDuration, 0);
      next.crossesMidnight = crossesMidnight;
      next.nextDayEndHour = endDecimal === 24 ? 0 : endDecimal;

      return next;
    });
  };

  // 읽기/편집 모드에 따라 표시할 근무 정보 선택
  const shiftForDisplay = isEditing && editedShift ? editedShift : displayShift;

  return (
    <div className="daily-page">
      <div className="daily-schedule-section">
        <div className="daily-schedule-header">
          <div className="daily-header-left">
            <select
              className="daily-workplace-select"
              value={selectedWorkplaceId}
              onChange={(e) => setSelectedWorkplaceId(Number(e.target.value))}
            >
              {workplaces.map((workplace) => (
                <option key={workplace.id} value={workplace.id}>
                  {workplace.name}
                </option>
              ))}
            </select>
            <h2 className="daily-date-heading">
              {`${selectedDate.getMonth() + 1}/${selectedDate.getDate()}(${
                ["일", "월", "화", "수", "목", "금", "토"][
                  selectedDate.getDay()
                ]
              })`}{" "}
              스케줄표
            </h2>
          </div>
          <button
            type="button"
            className="daily-add-button"
            onClick={handleAddShift}
          >
            + 근무자 추가하기
          </button>
        </div>
        <div className="daily-schedule-card">
          {/* 타임라인 상단 시간 레이블 */}
          <div className="daily-hours-row">
            {hours.map((hour) => (
              <div key={hour} className="daily-hour-cell">
                {hour}
              </div>
            ))}
          </div>
          <div
            className="daily-timeline"
            style={{ height: `${laneCount * 100 + 40}px` }}
          >
            {/* 근무자 타임라인 블록 */}
            {scheduleWithLanes.map((item) => {
              const left = (item.startHour / 24) * 100;
              const width = (item.durationHours / 24) * 100;
              const top = 20 + item.laneIndex * 100;
              // 근무 시간이 1시간 40분 이하일 때는 이름만 표시
              const isSmallBlock = item.durationHours <= 100 / 60; // 1시간 40분 = 100분
              // 근무 시간이 2시간 30분 이하일 때는 총 시간 숨김
              const hideDuration = item.durationHours <= 150 / 60; // 2시간 30분 = 150분
              return (
                <div
                  key={item.id}
                  className={`daily-shift-block ${
                    activeShiftId === item.id ? "active" : ""
                  } ${isSmallBlock ? "small" : ""}`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    top: `${top}px`,
                  }}
                  onClick={() => handleShiftClick(item.id)}
                >
                  <div className="shift-name">{item.name}</div>
                  {!isSmallBlock && (
                    <>
                      <div className="shift-time">{`${item.start} - ${item.end}`}</div>
                      {!hideDuration && (
                        <div className="shift-duration">
                          {formatDuration(item.durationHours)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {/* 근무 블록을 선택하면 토글되는 상세/편집 패널 */}
          {activeShift && (
            <div className="shift-detail-panel open">
              <div className="detail-header">
                <div className="detail-header-left">
                  <div>
                    <p className="detail-label">근무자</p>
                    <h3 className="detail-name">{shiftForDisplay?.name}</h3>
                  </div>
                  <div>
                    <p className="detail-label">근무지</p>
                    <p className="detail-value">
                      {activeShift.workplaceDetail || selectedWorkplace}
                    </p>
                  </div>
                </div>
                <div className="detail-header-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="detail-cancel-button"
                        onClick={handleCancelEdit}
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        className="detail-save-button"
                        onClick={handleSaveShift}
                      >
                        저장
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="detail-edit-button"
                        onClick={handleStartEdit}
                      >
                        정보 수정
                      </button>
                      <button
                        type="button"
                        className="detail-delete-button"
                        onClick={handleDeleteShift}
                      >
                        삭제
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="detail-close-button"
                    onClick={() => {
                      setActiveShiftId(null);
                      setIsEditing(false);
                      setEditedShift(null);
                    }}
                  >
                    닫기
                  </button>
                </div>
              </div>
              <div className="detail-grid">
                <div>
                  <p className="detail-label">근무 날짜</p>
                  <p className="detail-value">{formattedSelectedDate}</p>
                </div>
                <div>
                  <p className="detail-label">근무 시간</p>
                  {isEditing ? (
                    <div className="time-wheel-wrapper">
                      <TimeInput
                        label="시작"
                        value={editedShift?.start || "00:00"}
                        onChange={(val) => handleTimeChange("start", val)}
                      />
                      <TimeInput
                        label="종료"
                        value={editedShift?.end || "00:00"}
                        onChange={(val) => handleTimeChange("end", val)}
                        allowMidnight
                      />
                    </div>
                  ) : (
                    <p className="detail-value">
                      {(() => {
                        // 익일 근무를 클릭한 경우 (전날 근무가 displayShift인 경우)
                        if (
                          previousDayShift &&
                          activeShift &&
                          activeShift.start === "00:00"
                        ) {
                          return `${previousDayShift.start}~${activeShift.end}(익일)`;
                        }
                        // 전날 근무를 클릭한 경우 (crossesMidnight가 true인 경우)
                        if (shiftForDisplay?.crossesMidnight) {
                          const nextDate = new Date(selectedDate);
                          nextDate.setDate(nextDate.getDate() + 1);
                          const nextDateKey = getDateKey(nextDate);
                          const nextScheduleData =
                            workplaceSchedules[nextDateKey] || [];
                          const nextDayShift = nextScheduleData.find(
                            (shift) =>
                              shift.name === shiftForDisplay?.name &&
                              shift.start === "00:00"
                          );
                          if (nextDayShift) {
                            return `${shiftForDisplay?.start}~${nextDayShift.end}(익일)`;
                          }
                          return `${shiftForDisplay?.start}~${shiftForDisplay?.end}(익일)`;
                        }
                        return `${shiftForDisplay?.start}~${shiftForDisplay?.end}`;
                      })()}
                    </p>
                  )}
                </div>
                <div>
                  <p className="detail-label">총 근무</p>
                  <p className="detail-value">
                    {(() => {
                      // 익일 근무를 클릭한 경우 (전날 근무가 displayShift인 경우)
                      if (
                        previousDayShift &&
                        activeShift &&
                        activeShift.start === "00:00"
                      ) {
                        const totalHours =
                          previousDayShift.durationHours +
                          activeShift.durationHours;
                        return formatDuration(totalHours);
                      }
                      // 전날 근무를 클릭한 경우 (crossesMidnight가 true인 경우)
                      if (shiftForDisplay?.crossesMidnight) {
                        const nextDate = new Date(selectedDate);
                        nextDate.setDate(nextDate.getDate() + 1);
                        const nextDateKey = getDateKey(nextDate);
                        const nextScheduleData =
                          workplaceSchedules[nextDateKey] || [];
                        const nextDayShift = nextScheduleData.find(
                          (shift) =>
                            shift.name === shiftForDisplay?.name &&
                            shift.start === "00:00"
                        );
                        if (nextDayShift) {
                          const totalHours =
                            shiftForDisplay?.durationHours +
                            nextDayShift.durationHours;
                          return formatDuration(totalHours);
                        }
                      }
                      return formatDuration(shiftForDisplay?.durationHours);
                    })()}
                  </p>
                </div>
                <div>
                  <p className="detail-label">휴게 시간</p>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      className="detail-input"
                      value={editedShift?.breakMinutes ?? ""}
                      onChange={(e) =>
                        updateEditedShift(
                          "breakMinutes",
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <p className="detail-value">
                      {formatBreakTime(shiftForDisplay?.breakMinutes)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="detail-label">시급</p>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      className="detail-input"
                      value={editedShift?.hourlyWage ?? ""}
                      onChange={(e) =>
                        updateEditedShift("hourlyWage", Number(e.target.value))
                      }
                    />
                  ) : (
                    <p className="detail-value">
                      {formatCurrency(shiftForDisplay?.hourlyWage)}
                    </p>
                  )}
                </div>
              </div>
              <div className="detail-section">
                <p className="detail-label">수당 정보</p>
                <ul className="allowance-list">
                  {allowanceDefinitions.map(({ key, label }) => {
                    const allowance = (isEditing ? editedShift : activeShift)
                      ?.allowances?.[key] || {
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
                        {isEditing ? (
                          <label className="allowance-toggle">
                            <input
                              type="checkbox"
                              checked={allowance.enabled}
                              onChange={(e) =>
                                updateAllowance(key, {
                                  enabled: e.target.checked,
                                })
                              }
                            />
                            <span>{label}</span>
                          </label>
                        ) : (
                          <span>{label}</span>
                        )}
                        {isEditing ? (
                          <input
                            type="number"
                            min="100"
                            max="300"
                            step="5"
                            className="allowance-rate-input"
                            value={allowance.rate}
                            disabled={!allowance.enabled}
                            onChange={(e) =>
                              updateAllowance(key, {
                                rate: Number(e.target.value),
                              })
                            }
                          />
                        ) : (
                          <strong>
                            {allowance.enabled ? `${allowance.rate}%` : "없음"}
                          </strong>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="detail-status-row">
                {isEditing ? (
                  <>
                    <label className="status-toggle">
                      <input
                        type="checkbox"
                        checked={editedShift?.socialInsurance ?? false}
                        onChange={(e) =>
                          updateEditedShift("socialInsurance", e.target.checked)
                        }
                      />
                      <span>4대보험 적용</span>
                    </label>
                    <label className="status-toggle">
                      <input
                        type="checkbox"
                        checked={editedShift?.withholdingTax ?? false}
                        onChange={(e) =>
                          updateEditedShift("withholdingTax", e.target.checked)
                        }
                      />
                      <span>소득세 공제</span>
                    </label>
                  </>
                ) : (
                  <>
                    <div
                      className={`status-pill ${
                        shiftForDisplay?.socialInsurance ? "on" : "off"
                      }`}
                    >
                      4대보험{" "}
                      {shiftForDisplay?.socialInsurance ? "적용" : "미적용"}
                    </div>
                    <div
                      className={`status-pill ${
                        shiftForDisplay?.withholdingTax ? "on" : "off"
                      }`}
                    >
                      소득세{" "}
                      {shiftForDisplay?.withholdingTax ? "공제" : "미공제"}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className="daily-side-panel">
        {/* 우측 월 달력 */}
        <div className="daily-calendar-card">
          <div className="daily-calendar-header">
            <button type="button" onClick={handlePrevMonth}>
              {"<"}
            </button>
            <div className="calendar-month-year">
              {displayMonth.getFullYear()}년 {displayMonth.getMonth() + 1}월
            </div>
            <button type="button" onClick={handleNextMonth}>
              {">"}
            </button>
          </div>
          <div className="daily-calendar-grid">
            <div className="calendar-weekday">SUN</div>
            <div className="calendar-weekday">MON</div>
            <div className="calendar-weekday">TUE</div>
            <div className="calendar-weekday">WED</div>
            <div className="calendar-weekday">THU</div>
            <div className="calendar-weekday">FRI</div>
            <div className="calendar-weekday">SAT</div>
            {calendarCells.map(({ date, currentMonth }, idx) => {
              const isSelected = isSameDate(date, selectedDate);
              return (
                <div
                  key={`${date.toISOString()}-${idx}`}
                  className={`calendar-day ${isSelected ? "current" : ""} ${
                    currentMonth ? "" : "other"
                  }`}
                  onClick={() => handleSelectDate(date)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>
        {/* 우측 현재 근무자 리스트 */}
        <div className="daily-summary-card">
          <div className="summary-time">
            <p>
              {`${currentTime.getMonth() + 1}/${currentTime.getDate()}(${
                ["일", "월", "화", "수", "목", "금", "토"][currentTime.getDay()]
              })`}{" "}
              {`${String(currentTime.getHours()).padStart(2, "0")}:${String(
                currentTime.getMinutes()
              ).padStart(2, "0")}`}
            </p>
            <span>현재 근무중</span>
          </div>
          <ul>
            {(() => {
              const todayKey = getDateKey(currentTime);
              const todaySchedules =
                scheduleData[selectedWorkplace]?.[todayKey] || [];
              const currentHour = currentTime.getHours();
              const currentMinute = currentTime.getMinutes();
              const currentTimeDecimal = currentHour + currentMinute / 60;

              return todaySchedules
                .filter((item) => {
                  return (
                    item.startHour <= currentTimeDecimal &&
                    item.startHour + item.durationHours > currentTimeDecimal
                  );
                })
                .map((item) => (
                  <li key={item.id}>
                    <strong>
                      {item.start}~{item.end}
                    </strong>{" "}
                    {item.name}
                  </li>
                ));
            })()}
          </ul>
        </div>
      </aside>
      {/* 직원 선택 모달 */}
      {showWorkerListModal && (
        <div
          className="worker-list-modal-overlay"
          onClick={() => setShowWorkerListModal(false)}
        >
          <div
            className="worker-list-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="worker-list-modal-header">
              <h3>근무자 선택</h3>
              <button
                type="button"
                className="worker-list-modal-close"
                onClick={() => setShowWorkerListModal(false)}
              >
                ×
              </button>
            </div>
            <div className="worker-list-modal-body">
              {workersInWorkplace.length > 0 ? (
                <ul className="worker-list">
                  {workersInWorkplace.map((workerName) => (
                    <li
                      key={workerName}
                      className="worker-list-item"
                      onClick={() => handleSelectWorker(workerName)}
                    >
                      {workerName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="worker-list-empty">등록된 근무자가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
