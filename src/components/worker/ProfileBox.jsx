import PropTypes from "prop-types";
import { FaCamera, FaUser } from "react-icons/fa";
import "../../pages/workers/MyPage.css";

export default function ProfileBox({
  user,
  profileImage,
  onProfileImageUpdate,
  activeTab,
  onTabChange,
}) {
  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    onProfileImageUpdate(imageUrl);
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
    <nav className="worker-mypage-nav">
      <div className="worker-mypage-profile-card">
        <div className="worker-mypage-profile-info-wrapper">
          <div className="worker-mypage-avatar-wrapper">
            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필"
                className="worker-mypage-avatar-image"
              />
            ) : (
              <div className="worker-mypage-avatar-placeholder">
                <FaUser className="worker-mypage-avatar-icon" />
              </div>
            )}
            <label className="worker-mypage-avatar-camera">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>
          <div className="worker-mypage-profile-info">
            <div className="worker-mypage-profile-name">{user.name}</div>
            <div className="worker-mypage-profile-birth">
              {formatDate(user.birthDate)}
            </div>
            <div className="worker-mypage-profile-gender">
              {getGenderText(user.gender)}
            </div>
          </div>
        </div>
        <hr />
      </div>
      <ul>
        <li>
          <button
            type="button"
            className={
              activeTab === "profile"
                ? "worker-mypage-nav-checked"
                : "worker-mypage-nav-li"
            }
            onClick={() => onTabChange("profile")}
          >
            내 프로필 수정
          </button>
        </li>
        <li>
          <button
            type="button"
            className={
              activeTab === "workplace"
                ? "worker-mypage-nav-checked"
                : "worker-mypage-nav-li"
            }
            onClick={() => onTabChange("workplace")}
          >
            근무지 관리
          </button>
        </li>
        <li>
          <button
            type="button"
            className={
              activeTab === "editRequest"
                ? "worker-mypage-nav-checked"
                : "worker-mypage-nav-li"
            }
            onClick={() => onTabChange("editRequest")}
          >
            보낸 근무 기록 정정 요청
          </button>
        </li>
      </ul>
    </nav>
  );
}

ProfileBox.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    birthDate: PropTypes.string,
    gender: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }).isRequired,
  profileImage: PropTypes.string,
  onProfileImageUpdate: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

