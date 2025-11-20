import { useState } from "react";
import ProfileBox from "../../components/worker/ProfileBox";
import ProfileEdit from "../../components/worker/ProfileEdit";
import WorkplaceManage from "../../components/worker/WorkplaceManage";
import WorkEditRequestList from "../../components/worker/WorkEditRequestList";
import "./MyPage.css";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // 임시 데이터 (나중에 API로 대체)
  const [user, setUser] = useState({
    name: "김나현",
    birthDate: "2003-03-01",
    gender: "woman",
    phone: "010-5156-1565",
    email: "abc@gmail.com",
    password: "*********",
    kakaoPayLink: "djfoaflkjaelakewewf",
    employeeCode: "fde5fd",
    profileImageUrl: null,
  });

  // 프로필 이미지 상태 (ProfileBox와 ProfileEdit에서 공유)
  const [profileImage, setProfileImage] = useState(user.profileImageUrl || null);

  // 임시 근무지 데이터
  const [workplaces] = useState([
    {
      name: "맥도날드",
      startDate: "2025년 4월 23일",
      hourlyWage: 10030,
    },
    {
      name: "버거킹",
      startDate: "2025년 5월 15일",
      hourlyWage: 10030,
    },
  ]);

  // 임시 이전 근무지 데이터
  const [previousWorkplaces] = useState([
    {
      name: "롯데리아",
      startDate: "2023년 4월 23일",
      endDate: "2024년 5월 15일",
      hourlyWage: 10030,
    },
    {
      name: "스타벅스",
      startDate: "2022년 1월 28일",
      endDate: "2024년 5월 15일",
      hourlyWage: 10030,
    },
  ]);

  // 임시 정정 요청 데이터
  const [editRequests] = useState([
    // 나중에 API로 대체
  ]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    // 나중에 API 호출 추가
  };

  const handleProfileImageUpdate = (imageUrl) => {
    setProfileImage(imageUrl);
    setUser((prev) => ({
      ...prev,
      profileImageUrl: imageUrl,
    }));
    // 나중에 API 호출 추가
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileEdit
            user={user}
            profileImage={profileImage}
            onUserUpdate={handleUserUpdate}
          />
        );
      case "workplace":
        return (
          <WorkplaceManage
            workplaces={workplaces}
            previousWorkplaces={previousWorkplaces}
          />
        );
      case "editRequest":
        return <WorkEditRequestList requests={editRequests} />;
      default:
        return (
          <ProfileEdit
            user={user}
            profileImage={profileImage}
            onUserUpdate={handleUserUpdate}
          />
        );
    }
  };

  return (
    <div className="worker-mypage-main">
      <div className="worker-mypage-content">
        <ProfileBox
          user={user}
          profileImage={profileImage}
          onProfileImageUpdate={handleProfileImageUpdate}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {renderContent()}
      </div>
    </div>
  );
}
