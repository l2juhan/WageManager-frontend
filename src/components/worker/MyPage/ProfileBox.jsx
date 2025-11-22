import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaCamera, FaUser } from "react-icons/fa";
import "../../../pages/workers/MyPage.css";

export default function ProfileBox({
  user,
  profileImage,
  onProfileImageUpdate,
  activeTab,
  onTabChange,
}) {
  const previousImageUrlRef = useRef(null);

  // 컴포넌트 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      if (previousImageUrlRef.current) {
        URL.revokeObjectURL(previousImageUrlRef.current);
      }
    };
  }, []);

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // 이전 blob URL 해제
    if (previousImageUrlRef.current) {
      URL.revokeObjectURL(previousImageUrlRef.current);
    }
    const imageUrl = URL.createObjectURL(file);
    previousImageUrlRef.current = imageUrl;
    onProfileImageUpdate(imageUrl);
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
          <div className="worker-mypage-profile-name">{user.name}</div>
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
            보낸 근무 요청
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

