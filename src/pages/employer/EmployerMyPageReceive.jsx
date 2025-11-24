import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../../styles/employerMyPageReceive.css";
import { formatCurrency, formatBreakTime } from "./utils/formatUtils";
import { mockRequests } from "./dummyData";
import { allowanceDefinitions } from "./utils/shiftUtils";
import Swal from "sweetalert2";

export default function EmployerMyPageReceive() {
  const navigate = useNavigate();
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [requests, setRequests] = useState(mockRequests);

  // 날짜 기준으로 최신순 정렬 (가장 최근 날짜가 위에)
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      // 날짜 비교: month와 date를 사용해서 Date 객체 생성
      const dateA = new Date(2025, a.month - 1, a.date);
      const dateB = new Date(2025, b.month - 1, b.date);
      // 최신 날짜가 위로 오도록 내림차순 정렬
      return dateB - dateA;
    });
  }, [requests]);

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleCardClick = (cardId) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  const handleApprove = (request, e) => {
    e.stopPropagation();
    Swal.fire({
      icon: "question",
      title: `${request.workerName}님의 근무 요청을 승인하시겠습니까?`,
      text: `${request.workplace} - ${request.startTime} ~ ${request.endTime}`,
      showCancelButton: true,
      confirmButtonText: "승인",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color-green)",
    }).then((result) => {
      if (result.isConfirmed) {
        // 상태 업데이트: 해당 요청의 status를 'approved'로 변경
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, status: "approved" } : req
          )
        );
        // 토글 패널 닫기
        setExpandedCardId(null);
        Swal.fire("승인 완료", "근무 요청이 승인되었습니다.", "success");
      }
    });
  };

  const handleReject = (request, e) => {
    e.stopPropagation();
    Swal.fire({
      icon: "warning",
      title: `${request.workerName}님의 근무 요청을 거절하시겠습니까?`,
      text: "거절된 요청은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "거절",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--color-red)",
    }).then((result) => {
      if (result.isConfirmed) {
        // 상태 업데이트: 해당 요청의 status를 'rejected'로 변경
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === request.id ? { ...req, status: "rejected" } : req
          )
        );
        // 토글 패널 닫기
        setExpandedCardId(null);
        Swal.fire("거절 완료", "근무 요청이 거절되었습니다.", "success");
      }
    });
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
            {sortedRequests.length === 0 ? (
              <p>받은 근무 요청이 없습니다.</p>
            ) : (
              sortedRequests.map((request) => (
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
                  <div
                    className={`shift-detail-panel ${
                      expandedCardId === request.id ? "open" : ""
                    }`}
                  >
                    <div className="detail-header">
                      <div className="detail-header-left">
                        <div>
                          <p className="detail-label">근무자</p>
                          <h3 className="detail-name">{request.workerName}</h3>
                        </div>
                        <div>
                          <p className="detail-label">근무지</p>
                          <p className="detail-value">{request.workplace}</p>
                        </div>
                      </div>
                      <div className="detail-header-actions">
                        {request.status === null ? (
                          <>
                            <button
                              type="button"
                              className="detail-save-button"
                              onClick={(e) => handleApprove(request, e)}
                            >
                              승인
                            </button>
                            <button
                              type="button"
                              className="detail-delete-button"
                              onClick={(e) => handleReject(request, e)}
                            >
                              거절
                            </button>
                          </>
                        ) : null}
                        <button
                          type="button"
                          className="detail-close-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCardId(null);
                          }}
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                    <div className="detail-grid">
                      <div>
                        <p className="detail-label">근무 날짜</p>
                        <p className="detail-value">
                          2025.{String(request.month).padStart(2, "0")}.
                          {String(request.date).padStart(2, "0")}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">근무 시간</p>
                        <p className="detail-value">
                          {request.startTime} ~ {request.endTime}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">휴게 시간</p>
                        <p className="detail-value">
                          {formatBreakTime(request.breakMinutes)}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">시급</p>
                        <p className="detail-value">
                          {formatCurrency(request.hourlyWage)}
                        </p>
                      </div>
                    </div>
                    <div className="detail-section">
                      <p className="detail-label">수당 정보</p>
                      <ul className="allowance-list">
                        {allowanceDefinitions.map(({ key, label }) => {
                          const allowance = request.allowances?.[key] || {
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
                              <strong>
                                {allowance.enabled
                                  ? `${allowance.rate}%`
                                  : "없음"}
                              </strong>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="detail-status-row">
                      <div
                        className={`status-pill ${
                          request.socialInsurance ? "on" : "off"
                        }`}
                      >
                        4대보험{" "}
                        {request.socialInsurance ? "적용" : "미적용"}
                      </div>
                      <div
                        className={`status-pill ${
                          request.withholdingTax ? "on" : "off"
                        }`}
                      >
                        소득세{" "}
                        {request.withholdingTax ? "공제" : "미공제"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
