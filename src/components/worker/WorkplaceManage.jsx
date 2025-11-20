import PropTypes from "prop-types";
import "../../pages/workers/MyPage.css";

export default function WorkplaceManage({ workplaces, previousWorkplaces }) {
  return (
    <div className="worker-mypage-container">
      {/* 현재 근무지 정보 */}
      <h2 className="worker-mypage-section-title">근무지 정보</h2>
      <div className="worker-mypage-workplace-list">
        {workplaces && workplaces.length > 0 ? (
          workplaces.map((workplace, index) => (
            <div key={index} className="worker-mypage-workplace-card">
              <div className="worker-mypage-workplace-info">
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">근무지:</span>
                  <span className="worker-mypage-workplace-value">
                    {workplace.name}
                  </span>
                </div>
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">
                    입사 날짜:
                  </span>
                  <span className="worker-mypage-workplace-value">
                    {workplace.startDate}
                  </span>
                </div>
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">시급:</span>
                  <span className="worker-mypage-workplace-value">
                    {Number(workplace.hourlyWage).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="worker-mypage-empty">현재 근무지가 없습니다.</p>
        )}
      </div>

      {/* 이전 근무 이력 */}
      <h2 className="worker-mypage-section-title" style={{ marginTop: "40px" }}>
        이전 근무 이력
      </h2>
      <div className="worker-mypage-workplace-list">
        {previousWorkplaces && previousWorkplaces.length > 0 ? (
          previousWorkplaces.map((workplace, index) => (
            <div key={index} className="worker-mypage-workplace-card">
              <div className="worker-mypage-workplace-info">
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">근무지:</span>
                  <span className="worker-mypage-workplace-value">
                    {workplace.name}
                  </span>
                </div>
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">
                    입사 날짜:
                  </span>
                  <span className="worker-mypage-workplace-value">
                    {workplace.startDate}
                  </span>
                </div>
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">
                    퇴사 날짜:
                  </span>
                  <span className="worker-mypage-workplace-value">
                    {workplace.endDate}
                  </span>
                </div>
                <div className="worker-mypage-workplace-row">
                  <span className="worker-mypage-workplace-label">시급:</span>
                  <span className="worker-mypage-workplace-value">
                    {Number(workplace.hourlyWage).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="worker-mypage-empty">이전 근무 이력이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

WorkplaceManage.propTypes = {
  workplaces: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.string,
      hourlyWage: PropTypes.number,
    })
  ),
  previousWorkplaces: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      hourlyWage: PropTypes.number,
    })
  ),
};

