import PropTypes from "prop-types";
import "../../../styles/dailyCalendarPage.css";

// 정보수정 - 시간 입력 컴포넌트
function TimeInput({ label, value, onChange, allowMidnight = false } = {}) {
  const [hour = "00", minute = "00"] = (value || "00:00").split(":");

  const handleHourChange = (e) => {
    const nextHour = String(
      Math.max(
        0,
        Math.min(allowMidnight ? 24 : 23, Number(e.target.value) || 0)
      )
    ).padStart(2, "0");
    onChange(`${nextHour}:${nextHour === "24" ? "00" : minute}`);
  };

  const handleMinuteChange = (e) => {
    const nextMinute = String(
      Math.max(0, Math.min(59, Number(e.target.value) || 0))
    ).padStart(2, "0");
    onChange(`${hour}:${nextMinute}`);
  };

  return (
    <div className="time-wheel">
      <span className="time-wheel-label">{label}</span>
      <div className="time-wheel-columns">
        <input
          type="number"
          className="time-wheel-input"
          value={hour}
          onChange={handleHourChange}
          min="0"
          max={allowMidnight ? 24 : 23}
        />
        <span className="time-wheel-separator">:</span>
        <input
          type="number"
          className="time-wheel-input"
          value={minute}
          onChange={handleMinuteChange}
          min="0"
          max="59"
          disabled={hour === "24"}
        />
      </div>
    </div>
  );
}

TimeInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  allowMidnight: PropTypes.bool,
};

export default TimeInput;
