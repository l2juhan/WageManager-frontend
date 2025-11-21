import { useState } from "react";
import ProfileBox from "../../components/worker/MyPage/ProfileBox";
import ProfileEdit from "../../components/worker/MyPage/ProfileEdit";
import WorkplaceManage from "../../components/worker/MyPage/WorkplaceManage";
import WorkEditRequestList from "../../components/worker/MyPage/WorkEditRequestList";
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

  // 프로필 이미지 상태 관리
  const [profileImage, setProfileImage] = useState(user.profileImageUrl);


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
    {
      place: "맥도날드",
      date: "2월 3일",
      startTime: "15:00",
      endTime: "21:00",
      status: "approved",
    },
    {
      place: "맥도날드",
      date: "5월 27일",
      startTime: "15:00",
      endTime: "21:00",
      status: "rejected",
    },
    {
      place: "맥도날드",
      date: "7월 14일",
      startTime: "15:00",
      endTime: "21:00",
      status: "pending",
    },
  ]);

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    // 나중에 API 호출 추가
  };

  const handleProfileImageUpdate = (imageUrl) => {
    setProfileImage(imageUrl);
    // user 상태의 profileImageUrl도 업데이트
    setUser((prev) => ({
      ...prev,
      profileImageUrl: imageUrl,
    }));
    // 나중에 프로필 이미지 업데이트 API 호출 추가
  };


  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileEdit
            user={user}
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
        return null;
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

