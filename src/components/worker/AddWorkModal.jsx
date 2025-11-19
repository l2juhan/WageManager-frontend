import React from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import "./AddWorkModal.css";

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const hourOptions = Array.from({ length: 24 }, (_, i) => pad2(i));
const minuteOptions = ["00", "10", "20", "30", "40", "50"];
const breakOptions = [0, 30, 60, 90, 120];

function AddWorkModal({
  form,
  setForm,
  workplaceOptions,
  onConfirm,
  onCancel,
}) {
  if (!form) return null;

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBreakChange = (value) => {
    handleFieldChange("breakMinutes", Number(value));
  };

  const handleConfirmClick = async () => {
    const result = await Swal.fire({
      title: "근무 추가하기",
      text: "입력한 내용으로 근무를 추가할까요?",
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
    <div className="add-work-modal-overlay">
      <div className="add-work-modal-card">
        <div className="add-work-modal-header">
          <div className="add-work-modal-title">근무 추가하기</div>
          <select
            className="add-work-select"
            value={form.place}
            onChange={(e) => handleFieldChange("place", e.target.value)}
          >
            {workplaceOptions.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>

        <div className="add-work-modal-body">
          <div className="add-work-field">
            <div className="add-work-label">근무 시간</div>
            <div className="add-work-time-row">
              <div className="add-work-time-group start-group">
                <input
                  type="date"
                  className="work-edit-input work-edit-input-date add-work-date-input"
                  value={form.date}
                  onChange={(e) => handleFieldChange("date", e.target.value)}
                />
                <select
                  className="work-edit-select"
                  value={form.startHour}
                  onChange={(e) => handleFieldChange("startHour", e.target.value)}
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="add-work-time-colon">:</span>
                <select
                  className="work-edit-select"
                  value={form.startMinute}
                  onChange={(e) =>
                    handleFieldChange("startMinute", e.target.value)
                  }
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <span className="work-edit-time-tilde">~</span>

              <div className="add-work-time-group end-group">
                <select
                  className="work-edit-select"
                  value={form.endHour}
                  onChange={(e) => handleFieldChange("endHour", e.target.value)}
                >
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                <span className="add-work-time-colon">:</span>
                <select
                  className="work-edit-select"
                  value={form.endMinute}
                  onChange={(e) =>
                    handleFieldChange("endMinute", e.target.value)
                  }
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

          <div className="add-work-field">
            <div className="add-work-label">휴게 시간</div>
            <div className="work-edit-break-row">
              <select
                className="work-edit-select"
                value={form.breakMinutes}
                onChange={(e) => handleBreakChange(e.target.value)}
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

        <div className="add-work-modal-actions">
        <button
          type="button"
          className="work-edit-btn work-edit-btn-confirm"
          onClick={handleConfirmClick}
        >
            확인
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
    </div>
  );
}

AddWorkModal.propTypes = {
  form: PropTypes.shape({
    place: PropTypes.string,
    date: PropTypes.string,
    startHour: PropTypes.string,
    startMinute: PropTypes.string,
    endHour: PropTypes.string,
    endMinute: PropTypes.string,
    breakMinutes: PropTypes.number,
  }),
  setForm: PropTypes.func.isRequired,
  workplaceOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddWorkModal;
