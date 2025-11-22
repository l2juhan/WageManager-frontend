import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCamera, FaUser } from "react-icons/fa";
import "../../styles/employerMyPage.css";
import Swal from "sweetalert2";

export default function EmployerMyPage() {
  const initialUser = {
    name: "김나현",
    birthDate: "2003-03-01",
    gender: "woman",
    phone: "010-1234-5678",
    email: "abc@gmail.com",
    password: "password123",
  };
  const [user, setUser] = useState(initialUser);
  const [editableSections, setEditableSections] = useState({
    basic: false,
    phone: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const toggleEdit = (section) => {
    setEditableSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleChange = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };
  const handleNavClick = (path) => {
    navigate(path);
  };
  return (
    <div className="mypage-main">
      <div className="mypage-content">
        <nav className="mypage-nav">
          <div className="mypage-profile-card">
            <div className="mypage-avatar-wrapper">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필"
                  className="mypage-avatar-image"
                />
              ) : (
                <div className="mypage-avatar-placeholder">
                  <FaUser />
                </div>
              )}
              <label className="mypage-avatar-camera">
                <FaCamera />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
            <div className="mypage-profile-name">{user.name}</div>
            <hr />
          </div>
          <ul>
            <li>
              <button
                type="button"
                className="mypage-nav-checked"
                onClick={() => handleNavClick("/employer/employer-mypage")}
              >
                내 프로필 수정
              </button>
            </li>
            <li>
              <button
                type="button"
                className="mypage-nav-li"
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
          <h1 className="mypage-title">기본정보</h1>
          <div className="mypage-basic-info">
            <div className="mypage-name">
              <span className="mypage-label">이름</span>
              <input
                type="text"
                value={user.name}
                disabled={!editableSections.basic}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="mypage-brith">
              <span className="mypage-label">생년월일</span>
              <input
                type="date"
                value={user.birthDate}
                disabled={true}
                onChange={(e) => handleChange("birthDate", e.target.value)}
              />
            </div>
            <div className="mypage-gender">
              <span className="mypage-label">성별</span>
              <input
                type="text"
                value={user.gender === "man" ? "남성" : "여성"}
                disabled={true}
                readOnly
              />
            </div>
            <button
              className="mypage-edit-button"
              onClick={() => toggleEdit("basic")}
            >
              {editableSections.basic ? "완료" : "수정"}
            </button>
          </div>
          <hr />
          <div className="mypage-phone">
            <span className="mypage-label">전화번호</span>
            <input
              type="tel"
              value={user.phone}
              disabled={!editableSections.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <button
              className="mypage-edit-button"
              onClick={() => toggleEdit("phone")}
            >
              {editableSections.phone ? "완료" : "수정"}
            </button>
          </div>
          <hr />
          <div className="mypage-email">
            <span className="mypage-label">이메일</span>
            <input
              type="email"
              value={user.email}
              disabled={!editableSections.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <button
              className="mypage-edit-button"
              onClick={() => toggleEdit("email")}
            >
              {editableSections.email ? "완료" : "수정"}
            </button>
          </div>
          <hr />
          <div className="mypage-password">
            <span className="mypage-label">비밀번호</span>
            <div className="mypage-password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={user.password}
                disabled={!editableSections.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <button
                type="button"
                className="mypage-view-button"
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
                onFocus={() => setShowPassword(true)}
                onBlur={() => setShowPassword(false)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              className="mypage-edit-button"
              onClick={() => toggleEdit("password")}
            >
              {editableSections.password ? "완료" : "수정"}
            </button>
          </div>
          <div className="mypage-withdraw-section">
            <button
              className="mypage-withdraw-button"
              onClick={() => {
                Swal.fire({
                  icon: "warning",
                  title: "회원 탈퇴 하시겠습니까?",
                  text: "탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.",
                  showCancelButton: true,
                  confirmButtonText: "탈퇴",
                  cancelButtonText: "취소",
                  confirmButtonColor: "var(--color-red)",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      "탈퇴 완료",
                      "회원 탈퇴가 완료되었습니다.",
                      "success"
                    );
                  }
                });
              }}
            >
              회원 탈퇴 &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
