import { useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import "../../pages/workers/MyPage.css";

export default function ProfileEdit({ user, profileImage, onUserUpdate }) {
  const [editableSections, setEditableSections] = useState({
    basic: false,
    phone: false,
    email: false,
    password: false,
    kakaoPay: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  const toggleEdit = (section) => {
    setEditableSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    if (editableSections[section]) {
      // 완료 버튼을 눌렀을 때
      onUserUpdate(localUser);
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
          <div className="worker-mypage-avatar-wrapper-edit">
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className="worker-mypage-avatar-image-edit"
              />
            ) : (
              <div className="worker-mypage-avatar-placeholder-edit">
                <FaUser className="worker-mypage-avatar-icon-edit" />
              </div>
            )}
          </div>
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
              />
            </div>
            <div className="worker-mypage-birth">
              <span className="worker-mypage-label">생년월일</span>
              <input
                type="date"
                value={localUser.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>
            <div className="worker-mypage-gender">
              <span className="worker-mypage-label">성별</span>
              <select
                name="gender"
                value={localUser.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="man">남성</option>
                <option value="woman">여성</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <hr />

      {/* 전화번호 */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">전화 번호</span>
        <input
          type="tel"
          value={localUser.phone}
          disabled={!editableSections.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <button
          className="worker-mypage-edit-button"
          onClick={() => toggleEdit("phone")}
        >
          {editableSections.phone ? "완료" : "수정"}
        </button>
      </div>
      <hr />

      {/* 이메일 */}
      <div className="worker-mypage-field">
        <span className="worker-mypage-label">이메일</span>
        <input
          type="email"
          value={localUser.email}
          disabled={!editableSections.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
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
        <div className="worker-mypage-password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={localUser.password}
            disabled={!editableSections.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <button
            type="button"
            className="worker-mypage-view-button"
            onMouseEnter={() => setShowPassword(true)}
            onMouseLeave={() => setShowPassword(false)}
            onFocus={() => setShowPassword(true)}
            onBlur={() => setShowPassword(false)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
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
    profileImageUrl: PropTypes.string,
  }).isRequired,
  profileImage: PropTypes.string,
  onUserUpdate: PropTypes.func.isRequired,
};
