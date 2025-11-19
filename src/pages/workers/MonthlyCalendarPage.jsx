import React, { useMemo, useState } from "react";
import "./MonthlyCalendarPage.css";
import WorkEditRequestBox from "../../components/worker/WorkEditRequestBox";
import AddWorkModal from "../../components/worker/AddWorkModal";
import CalendarCard from "../../components/worker/CalendarCard";

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const makeDateKey = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;

const initialWorkRecords = {
  "2025-10-06": [
    { id: 1, start: "09:00", end: "13:00", wage: 40900, place: "버거킹" },
  ],
  "2025-10-08": [
    { id: 2, start: "15:00", end: "21:00", wage: 60180, place: "맥도날드" },
  ],
  "2025-10-13": [
    { id: 3, start: "09:00", end: "13:00", wage: 40900, place: "버거킹" },
  ],
  "2025-10-15": [
    { id: 4, start: "09:00", end: "13:00", wage: 40900, place: "버거킹" },
    { id: 5, start: "15:00", end: "21:00", wage: 60180, place: "맥도날드" },
  ],
  "2025-10-20": [
    { id: 6, start: "09:00", end: "13:00", wage: 40900, place: "버거킹" },
  ],
  "2025-10-27": [
    { id: 7, start: "09:00", end: "13:00", wage: 40900, place: "버거킹" },
  ],
  "2025-10-22": [
    { id: 8, start: "15:00", end: "21:00", wage: 60180, place: "맥도날드" },
  ],
};

const workplaceOptions = ["맥도날드", "버거킹"];


const workLabelColorByPlace = (place) => { // 근무지에 따른 라벨 색상 클래스명 반환
  if (place.includes("버거킹")) return "burger";
  if (place.includes("맥도날드")) return "mcdonald";
  return "default";
};

const getKoreanDayLabel = (dayIndex) => { 
  const map = ["일", "월", "화", "수", "목", "금", "토"];
  return map[dayIndex] || "";
};

function MonthlyCalendarPage() {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
  const [workRecords] = useState(initialWorkRecords);
  const [memos, setMemos] = useState({});

  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    makeDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const [editForm, setEditForm] = useState(null); // 수정 요청 폼 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [addForm, setAddForm] = useState(null);

  const handlePrevMonth = () => { // 이전 달로 이동
    setCurrentMonth((prev) => {
      const date = new Date(currentYear, prev - 1, 1);
      setCurrentYear(date.getFullYear());
      return date.getMonth();
    });
  };

  const handleNextMonth = () => { // 다음 달로 이동
    setCurrentMonth((prev) => {
      const date = new Date(currentYear, prev + 1, 1);
      setCurrentYear(date.getFullYear());
      return date.getMonth();
    });
  };

  const calendarCells = useMemo(() => { // 달력 셀 계산
    const firstDay = new Date(currentYear, currentMonth, 1);
    const firstDayOfWeek = firstDay.getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i += 1) cells.push(null);
    for (let d = 1; d <= lastDate; d += 1) cells.push(d);
    return cells;
  }, [currentYear, currentMonth]);

  const recordsForSelectedDay = workRecords[selectedDateKey] || [];

  const handleMemoChange = (e) => { 
    const value = e.target.value;
    setMemos((prev) => ({
      ...prev,
      [selectedDateKey]: value,
    }));
  };

  const memoForSelected = memos[selectedDateKey] || "";

  const { totalMinutes, totalWage } = useMemo(() => { // 월간 총 근무 시간 및 급여 계산
    let minutes = 0;
    let wage = 0;

    Object.entries(workRecords).forEach(([key, list]) => {
      const [y, m] = key.split("-").map(Number);
      if (y === currentYear && m === currentMonth + 1) {
        list.forEach((record) => {
          const [sh, sm] = record.start.split(":").map(Number);
          const [eh, em] = record.end.split(":").map(Number);
          const diff = eh * 60 + em - (sh * 60 + sm);
          minutes += diff;
          wage += record.wage;
        });
      }
    });

    return { totalMinutes: minutes, totalWage: wage };
  }, [currentYear, currentMonth, workRecords]);

  const totalHoursText = useMemo(() => { // 총 근무 시간 텍스트 변환
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}시간 ${mins}분`;
  }, [totalMinutes]);

  const selectedDateObj = useMemo(() => { // 선택된 날짜 객체 생성
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateKey]);

  const selectedDateTitle = useMemo(() => { // 선택된 날짜 제목 생성
    const m = selectedDateObj.getMonth() + 1;
    const d = selectedDateObj.getDate();
    const dayLabel = getKoreanDayLabel(selectedDateObj.getDay());
    return `${m}/${d}(${dayLabel})`;
  }, [selectedDateObj]);

  const displayYear = currentYear;
  const displayMonth = currentMonth + 1;
  const todayKey = makeDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const handleDateClick = (day) => {
    if (!day) return;
    const key = makeDateKey(currentYear, currentMonth, day);
    setSelectedDateKey(key);
    setEditForm(null);
  };

  const handleOpenEdit = (record, dateKey) => { // 수정 요청 폼 열기
    const [year, month, day] = dateKey.split("-");
    const [sh, sm] = record.start.split(":");
    const [eh, em] = record.end.split(":");

    setEditForm({
      recordId: record.id,
      originalDateKey: dateKey,
      place: record.place,
      wage: record.wage,
      date: `${year}-${pad2(Number(month))}-${pad2(Number(day))}`,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
      breakMinutes: record.breakMinutes ?? 60,
    });
  };

  const handleCloseEdit = () => { // 수정 요청 폼 닫기
    setEditForm(null);
  };

  const handleConfirmEdit = (form) => { // 수정 요청 확인 핸들러
    // TODO: 백엔드로 수정 요청 보내기
    console.log("edit request payload:", form);
    setEditForm(null);
  };

  const handleDeleteRequest = (form) => { // 삭제 요청 핸들러
    // TODO: 백엔드로 삭제 요청 보내기
    console.log("delete request payload:", form);
    setEditForm(null);
  };

  const handleOpenAddModal = () => { // 근무 추가 모달 열기
    setAddForm({
      place: workplaceOptions[0],
      date: selectedDateKey,
      startHour: "09",
      startMinute: "00",
      endHour: "13",
      endMinute: "00",
      breakMinutes: 60,
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => { // 근무 추가 모달 닫기
    setIsAddModalOpen(false);
    setAddForm(null);
  };

  const handleConfirmAddWork = (form) => { // 근무 추가 확인 핸들러
    // TODO: 백엔드에 근무 추가 API 호출
    console.log("add work payload:", form);
    handleCloseAddModal();
  };

  return (
    <div className="monthly-calendar-page">
      {/* 상단 월 네비게이션 */}
      <div className="month-nav">
        <button className="month-nav-arrow" onClick={handlePrevMonth}>
          {"<"}
        </button>
        <div className="month-nav-title">
          {displayYear}년 {displayMonth}월
        </div>
        <button className="month-nav-arrow" onClick={handleNextMonth}>
          {">"}
        </button>
      </div>

      <div className="monthly-calendar-layout">
        <CalendarCard
          currentYear={currentYear}
          currentMonth={currentMonth}
          calendarCells={calendarCells}
          selectedDateKey={selectedDateKey}
          workRecords={workRecords}
          onSelectDay={handleDateClick}
          makeDateKey={makeDateKey}
          workLabelColorByPlace={workLabelColorByPlace}
          todayKey={todayKey}
        />

        {/* 우측 패널 */}
        <div className="right-panel">
          <div className="work-list">
            {recordsForSelectedDay.length === 0 ? (
              <div className="work-list-empty">
                선택한 날짜의 근무 기록이 없습니다.
              </div>
            ) : (
              recordsForSelectedDay.map((record) => (
                <React.Fragment key={record.id}>
                  <div className="work-list-item">
                    <div className="work-list-date">
                      <div className="work-list-date-day">
                        {selectedDateObj.getDate()}
                      </div>
                      <div className="work-list-date-weekday">
                        {getKoreanDayLabel(selectedDateObj.getDay())}
                      </div>
                    </div>

                    <div className="work-list-main">
                      <div className="work-list-time">
                        {record.start} ~ {record.end}
                      </div>
                      <div className="work-list-wage">
                        {record.wage.toLocaleString()}원
                      </div>
                      <div className="work-list-place">{record.place}</div>
                    </div>

                    <button
                      className="work-list-edit-btn"
                      type="button"
                      onClick={() =>
                        handleOpenEdit(record, selectedDateKey)
                      }
                    >
                      근무 기록 정정 요청
                    </button>
                  </div>

                  {editForm && editForm.recordId === record.id && (
                    <WorkEditRequestBox
                      form={editForm}
                      setForm={setEditForm}
                      onConfirm={handleConfirmEdit}
                      onDelete={handleDeleteRequest}
                      onCancel={handleCloseEdit}
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </div>

          <button
            type="button"
            className="add-work-button"
            onClick={handleOpenAddModal}
          >
            + 근무 추가하기
          </button>

          <div className="memo-card">
            <div className="memo-header">메모 {selectedDateTitle}</div>
            <textarea
              className="memo-textarea"
              placeholder="텍스트를 입력하세요."
              value={memoForSelected}
              onChange={handleMemoChange}
            />
          </div>

          <div className="summary-row">
            <div className="summary-card">
              <div className="summary-label">월간 근무시간</div>
              <div className="summary-value">{totalHoursText}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">월 급여</div>
              <div className="summary-value">
                {totalWage.toLocaleString()}원
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddModalOpen && (
        <AddWorkModal
          form={addForm}
          setForm={setAddForm}
          workplaceOptions={workplaceOptions}
          onConfirm={handleConfirmAddWork}
          onCancel={handleCloseAddModal}
        />
      )}
    </div>
  );
}

export default MonthlyCalendarPage;
