import React from "react";
import PropTypes from "prop-types";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function CalendarCard({
  currentYear,
  currentMonth,
  calendarCells,
  selectedDateKey,
  workRecords,
  onSelectDay,
  makeDateKey,
  workLabelColorByPlace,
  todayKey,
}) {
  return (
    <div className="calendar-card">
      <div className="calendar-header-row">
        {dayNames.map((day) => (
          <div key={day} className="calendar-header-cell">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarCells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="calendar-cell empty" />;
          }

          const key = makeDateKey(currentYear, currentMonth, day);
          const labels = workRecords[key] || [];
          const isSelected = selectedDateKey === key;
          const isToday = todayKey === key;

          const cellClasses = [
            "calendar-cell",
            isSelected ? "selected" : "",
            !isSelected && isToday ? "today" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              type="button"
              key={key}
              className={cellClasses}
              onClick={() => onSelectDay(day)}
            >
              <div className="calendar-day-number">{day}</div>
              <div className="calendar-label-wrapper">
                {labels.map((w) => (
                  <span
                    key={w.id}
                    className={`work-label work-label-${workLabelColorByPlace(
                      w.place
                    )}`}
                  >
                    {w.place}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

CalendarCard.propTypes = {
  currentYear: PropTypes.number.isRequired,
  currentMonth: PropTypes.number.isRequired,
  calendarCells: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
  ).isRequired,
  selectedDateKey: PropTypes.string.isRequired,
  workRecords: PropTypes.object.isRequired,
  onSelectDay: PropTypes.func.isRequired,
  makeDateKey: PropTypes.func.isRequired,
  workLabelColorByPlace: PropTypes.func.isRequired,
  todayKey: PropTypes.string.isRequired,
};

export default CalendarCard;
