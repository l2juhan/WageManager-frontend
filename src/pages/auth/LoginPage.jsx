import { useNavigate } from "react-router-dom";
import "../../styles/homePage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">월급관리소</h1>
        
        <div className="home-buttons">
          <button 
            className="home-button"
            onClick={() => navigate("/worker")}
          >
            근로자
          </button>
          
          <button 
            className="home-button"
            onClick={() => navigate("/employer")}
          >
            고용주
          </button>
        </div>
      </div>
    </div>
  );
}

