import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../styles/employerMyPageReceive.css";

const mockRequests = [
  {
    id: 1,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: null, // 대기중
  },
  {
    id: 2,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: "approved", // 승인함
  },
  {
    id: 3,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: "rejected", // 거절함
  },
  {
    id: 4,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: null, // 대기중
  },
  {
    id: 5,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: null, // 대기중
  },
  {
    id: 6,
    workerName: "정ㅇㅇ",
    workplace: "맥도날드 ㅁㅁ점",
    month: 11,
    date: 27,
    startTime: "15:00",
    endTime: "17:00",
    status: null, // 대기중
  },
];

export default function EmployerMyPageReceive() {
  const navigate = useNavigate();
  const [expandedCardId, setExpandedCardId] = useState(null);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleCardClick = (cardId) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  return (
    <div className="mypage-main">
      <div className="mypage-content">
        <nav className="mypage-nav">
          <div className="mypage-profile-card">
            <div className="mypage-avatar-wrapper">
              <div className="mypage-avatar-placeholder">
                <FaUser />
              </div>
            </div>
            <div className="mypage-profile-name">김나현</div>
            <hr />
          </div>
          <ul>
            <li>
              <button
                type="button"
                className="mypage-nav-li"
                onClick={() => handleNavClick("/employer/employer-mypage")}
              >
                내 프로필 수정
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mypage-nav-checked"
                onClick={() =>
                  handleNavClick("/employer/employer-mypage-receive")
                }
              >
                받은 근무 요청
              </button>
            </li>
          </ul>
        </nav>
        <div className="mypage-container">
          <h1 className="mypage-title">받은 근무 요청</h1>
          <div className="mypage-receive-list">
            {mockRequests.length === 0 ? (
              <p>받은 근무 요청이 없습니다.</p>
            ) : (
              mockRequests.map((request) => (
                <div key={request.id}>
                  <div
                    className="mypage-receive-card"
                    onClick={() => handleCardClick(request.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="mypage-receive-date">
                      {request.month}월 {request.date}일
                    </div>
                    <div className="mypage-receive-divider"></div>
                    <div className="mypage-receive-info">
                      <div className="mypage-receive-worker">
                        {request.workerName}({request.workplace})
                      </div>
                      <div className="mypage-receive-time">
                        {request.startTime} ~ {request.endTime}
                      </div>
                    </div>
                    {request.status !== null && (
                      <div className="mypage-receive-status">
                        <button
                          type="button"
                          className={`mypage-status-button ${
                            request.status === "approved"
                              ? "mypage-status-approved"
                              : "mypage-status-rejected"
                          }`}
                          disabled
                        >
                          {request.status === "approved" ? "승인함" : "거절함"}
                        </button>
                      </div>
                    )}
                  </div>
                  {expandedCardId === request.id && (
                    <div className="mypage-receive-toggle">
                      <div className="mypage-receive-details">
                        <div className="mypage-receive-detail-row">
                          <div className="mypage-receive-detail-label">
                            근무자
                          </div>
                          <div className="mypage-receive-detail-value">
                            {request.workerName}
                          </div>
                        </div>
                        <div className="mypage-receive-detail-row">
                          <div className="mypage-receive-detail-label">
                            근무지
                          </div>
                          <div className="mypage-receive-detail-value">
                            {request.workplace}
                          </div>
                        </div>
                        <div className="mypage-receive-detail-row">
                          <div className="mypage-receive-detail-label">
                            근무 날짜
                          </div>
                          <div className="mypage-receive-detail-value">
                            2025.{String(request.month).padStart(2, "0")}.
                            {String(request.date).padStart(2, "0")}
                          </div>
                        </div>
                        <div className="mypage-receive-detail-row">
                          <div className="mypage-receive-detail-label">
                            근무 시간
                          </div>
                          <div className="mypage-receive-detail-value">
                            {request.startTime} ~ {request.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="mypage-receive-toggle-actions">
                        {request.status === null ? (
                          <>
                            <button
                              type="button"
                              className="mypage-receive-approve-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              승인
                            </button>
                            <button
                              type="button"
                              className="mypage-receive-reject-button"
                              onClick={(e) => e.stopPropagation()}
                            >
                              거절
                            </button>
                            <button
                              type="button"
                              className="mypage-receive-close-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCardId(null);
                              }}
                            >
                              닫기
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="mypage-receive-close-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCardId(null);
                            }}
                          >
                            닫기
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
