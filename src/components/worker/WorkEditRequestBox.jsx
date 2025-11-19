import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import "./WorkEditRequestBox.css";
import { createUpdateField } from "../../pages/workers/utils/updateField";

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);

const hourOptions = Array.from({ length: 24 }, (_, i) => pad2(i));
const minuteOptions = ["00", "10", "20", "30", "40", "50"];
const breakOptions = [0, 30, 60, 90, 120];

function WorkEditRequestBox({ form, setForm, onConfirm, onDelete, onCancel }) {
  if (!form) return null;

  const updateField = createUpdateField(setForm);

  const handleConfirmClick = async () => {
    const result = await Swal.fire({
      title: "근무 기록 정정 요청",
      text: "입력한 내용으로 근무 정정 요청을 보내시겠어요?",
      icon: "question",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      onConfirm(form);
    }
  };

  return (
    <div className="work-edit-box">
      {/* 근무지 / 시급 */}
      <div className="work-edit-row">
        <div className="work-edit-field">
          <div className="work-edit-label">근무지</div>
          <input
            className="work-edit-input readonly work-edit-input-place"
            value={form.place}
            readOnly
          />
        </div>
        <div className="work-edit-field">
          <div className="work-edit-label">시급</div>
          <div className="work-edit-wage-wrapper">
            <input
              className="work-edit-input readonly work-edit-input-wage"
              value={Number(form.wage).toLocaleString()}
              readOnly
            />
            <span className="work-edit-wage-unit">원</span>
          </div>
        </div>
      </div>

      {/* 근무 시간 */}
      <div className="work-edit-row">
        <div className="work-edit-field full">
          <div className="work-edit-label">근무 시간</div>
          <div className="work-edit-time-row">
            {/* 날짜 */}
            <input
              type="date"
              className="work-edit-input work-edit-input-date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />

            {/* 시작 시간 */}
            <select
              className="work-edit-select"
              value={form.startHour}
              onChange={(e) => updateField("startHour", e.target.value)}
            >
              {hourOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              className="work-edit-select"
              value={form.startMinute}
              onChange={(e) => updateField("startMinute", e.target.value)}
            >
              {minuteOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <span className="work-edit-time-tilde">~</span>

            {/* 종료 시간 */}
            <select
              className="work-edit-select"
              value={form.endHour}
              onChange={(e) => updateField("endHour", e.target.value)}
            >
              {hourOptions.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              className="work-edit-select"
              value={form.endMinute}
              onChange={(e) => updateField("endMinute", e.target.value)}
            >
              {minuteOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 휴게 시간 */}
      <div className="work-edit-row">
        <div className="work-edit-field">
          <div className="work-edit-label">휴게 시간</div>
          <div className="work-edit-break-row">
            <select
              className="work-edit-select"
              value={form.breakMinutes}
              onChange={(e) =>
                updateField("breakMinutes", Number(e.target.value))
              }
            >
              {breakOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <span>분</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="work-edit-actions">
        <button
          type="button"
          className="work-edit-btn work-edit-btn-confirm"
          onClick={handleConfirmClick}
        >
          확인
        </button>
        <button
          type="button"
          className="work-edit-btn work-edit-btn-delete"
          onClick={() => onDelete(form)}
        >
          삭제
        </button>
        <button
          type="button"
          className="work-edit-btn work-edit-btn-cancel"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default WorkEditRequestBox;

WorkEditRequestBox.propTypes = {
  form: PropTypes.shape({
    recordId: PropTypes.number,
    originalDateKey: PropTypes.string,
    place: PropTypes.string,
    wage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    date: PropTypes.string,
    startHour: PropTypes.string,
    startMinute: PropTypes.string,
    endHour: PropTypes.string,
    endMinute: PropTypes.string,
    breakMinutes: PropTypes.number,
  }),
  setForm: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
