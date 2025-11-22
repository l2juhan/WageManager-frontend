import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../../pages/workers/MyPage.css";

export default function ProfileEdit({ user, onUserUpdate }) {
  const [editableSections, setEditableSections] = useState({
    basic: false,
    phone: false,
    email: false,
    password: false,
    kakaoPay: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [errors, setErrors] = useState({});

  // user prop이 변경될 때 localUser 동기화
  // 단, 사용자가 수정 중이 아닐 때만 동기화하여 입력 중인 데이터를 보호
  useEffect(() => {
    const isEditing = Object.values(editableSections).some((value) => value);
    if (!isEditing) {
      setLocalUser(user);
      setErrors({});
    }
  }, [user, editableSections]);

  const validateField = (section, value) => {
    if (!value || value.trim() === "") {
      return { isValid: false, message: "필수 입력 항목입니다." };
    }

    switch (section) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, message: "올바른 이메일 형식이 아닙니다." };
        }
        break;
      }
      case "phone": {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(value)) {
          return {
            isValid: false,
            message: "전화번호는 010-XXXX-XXXX 형식이어야 합니다.",
          };
        }
        break;
      }
      case "password": {
        if (value.length < 8) {
          return { isValid: false, message: "비밀번호는 8자 이상이어야 합니다." };
        }
        break;
      }
      case "name": {
        if (value.trim().length < 2) {
          return { isValid: false, message: "이름은 2자 이상이어야 합니다." };
        }
        break;
      }
      default:
        break;
    }

    return { isValid: true, message: "" };
  };

  const toggleEdit = (section) => {
    const wasEditing = editableSections[section];

    if (wasEditing) {
      // 완료 버튼을 눌렀을 때 유효성 검사
      const fieldName =
        section === "kakaoPay"
          ? "kakaoPayLink"
          : section === "basic"
            ? "name"
            : section;
      const fieldValue = localUser[fieldName];

      // basic 섹션의 경우 이름만 검증
      if (section === "basic") {
        const validation = validateField("name", localUser.name);
        if (!validation.isValid) {
          setErrors({ basic: validation.message });
          return;
        }
      } else {
        const validation = validateField(section, fieldValue);
        if (!validation.isValid) {
          setErrors({ [section]: validation.message });
          return;
        }
      }

      // 유효성 검사 통과 시 에러 초기화 및 저장
      setErrors({});
      onUserUpdate(localUser);
    }

    setEditableSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));

    // 수정 모드로 전환 시 해당 필드의 에러 초기화
    if (!wasEditing) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[section];
        delete newErrors.basic;
        return newErrors;
      });
    }
  };

  const handleChange = (field, value) => {
    setLocalUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // ISO 날짜 형식(YYYY-MM-DD)인 경우 타임존 문제를 피하기 위해 직접 파싱
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (isoDateRegex.test(dateString)) {
      const [year, month, day] = dateString.split("-");
      // 로컬 시간으로 Date 객체 생성하여 유효성 검증 (month는 0부터 시작하므로 -1)
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      // 유효한 날짜인지 확인 (타임존 문제 없이 로컬 시간으로 생성했으므로 검증 가능)
      if (
        date.getFullYear() === Number(year) &&
        date.getMonth() === Number(month) - 1 &&
        date.getDate() === Number(day)
      ) {
        // 파싱한 값을 그대로 사용 (이미 zero-padding 되어 있음)
        return `${year}.${month}.${day}`;
      }
    }
    
    // 다른 형식이거나 유효하지 않은 날짜인 경우 기존 방식 사용
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const getGenderText = (gender) => {
    return gender === "man" ? "남성" : "여성";
  };

  return (
    <div className="worker-mypage-container">
      <h1 className="worker-mypage-title">기본 정보</h1>

      {/* 이름, 생년월일, 성별 */}
      <div className="worker-mypage-basic-info">
        <div className="worker-mypage-name-row">
          <div className="worker-mypage-name-text-wrapper">
            <div className="worker-mypage-name-text">{localUser.name}</div>
            <div className="worker-mypage-birth-text">
              {formatDate(localUser.birthDate)}
            </div>
            <div className="worker-mypage-gender-text">
              {getGenderText(localUser.gender)}
            </div>
          </div>
          <button
            className="worker-mypage-edit-button"
            onClick={() => toggleEdit("basic")}
          >
            {editableSections.basic ? "완료" : "수정"}
          </button>
        </div>
        {editableSections.basic && (
          <div className="worker-mypage-edit-fields">
            <div className="worker-mypage-name">
              <span className="worker-mypage-label">이름</span>
              <input
                type="text"
                value={localUser.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.basic ? "worker-mypage-input-error" : ""}
              />
              {errors.basic && (
                <span className="worker-mypage-error-message">
                  {errors.basic}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <hr />

      {/* 전화번호 */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">전화 번호</span>
        <div className="worker-mypage-input-wrapper">
          <input
            type="tel"
            value={localUser.phone}
            disabled={!editableSections.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={errors.phone ? "worker-mypage-input-error" : ""}
          />
          {errors.phone && (
            <span className="worker-mypage-error-message">{errors.phone}</span>
          )}
        </div>
        <button
          className="worker-mypage-edit-button"
          onClick={() => toggleEdit("phone")}
        >
          {editableSections.phone ? "완료" : "수정"}
        </button>
      </div>
      <hr />

      {/* 이메일 */}
      <div className="worker-mypage-field worker-mypage-email-field">
        <span className="worker-mypage-label">이메일</span>
        <div className="worker-mypage-email-input-container">
          <input
            type="email"
            value={localUser.email}
            disabled={!editableSections.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "worker-mypage-input-error" : ""}
          />
          {errors.email && (
            <span className="worker-mypage-error-message worker-mypage-email-error">
              {errors.email}
            </span>
          )}
        </div>
        <button
          className="worker-mypage-edit-button"
          onClick={() => toggleEdit("email")}
        >
          {editableSections.email ? "완료" : "수정"}
        </button>
      </div>
      <hr />

      {/* 비밀번호 */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">비밀번호</span>
        <div className="worker-mypage-input-wrapper">
          <div className="worker-mypage-password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={localUser.password}
              disabled={!editableSections.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={errors.password ? "worker-mypage-input-error" : ""}
            />
            <button
              type="button"
              className="worker-mypage-view-button"
              onMouseEnter={() => setShowPassword(true)}
              onMouseLeave={() => setShowPassword(false)}
              onFocus={() => setShowPassword(true)}
              onBlur={() => setShowPassword(false)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              title={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && (
            <span className="worker-mypage-error-message">
              {errors.password}
            </span>
          )}
        </div>
        <button
          className="worker-mypage-edit-button"
          onClick={() => toggleEdit("password")}
        >
          {editableSections.password ? "완료" : "수정"}
        </button>
      </div>
      <hr />

      {/* 카카오페이 송금 링크 */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">카카오페이 송금 링크</span>
        <input
          type="text"
          value={localUser.kakaoPayLink || ""}
          disabled={!editableSections.kakaoPay}
          onChange={(e) => handleChange("kakaoPayLink", e.target.value)}
        />
        <button
          className="worker-mypage-edit-button"
          onClick={() => toggleEdit("kakaoPay")}
        >
          {editableSections.kakaoPay ? "완료" : "수정"}
        </button>
      </div>
      <hr />

      {/* 근무자 코드 (읽기 전용) */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">근무자 코드</span>
        <input
          type="text"
          value={localUser.employeeCode || ""}
          readOnly
          className="worker-mypage-readonly"
        />
      </div>
      <hr />

      {/* 계정 이용 */}
      <div className="worker-mypage-account-section">
        <h2 className="worker-mypage-section-title">계정 이용</h2>
        <a href="#" className="worker-mypage-link">
          서비스 이용 동의 <span className="worker-mypage-arrow">→</span>
        </a>
      </div>
      <hr />

      {/* 회원 탈퇴 */}
      <div className="worker-mypage-withdraw">
        <a href="#" className="worker-mypage-withdraw-link">
          회원 탈퇴 <span className="worker-mypage-arrow">→</span>
        </a>
      </div>
    </div>
  );
}

ProfileEdit.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    birthDate: PropTypes.string,
    gender: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    password: PropTypes.string,
    kakaoPayLink: PropTypes.string,
    employeeCode: PropTypes.string,
  }).isRequired,
  onUserUpdate: PropTypes.func.isRequired,
};

