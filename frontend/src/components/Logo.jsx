import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSrc from "../../resources/logos/CodefolioLogo.png";

export default function Logo({ className = "h-10 w-auto" }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        if (user) {
          navigate("/dashboard");
        } else {
          window.location.href = "/";
        }
      }}
      className="shrink-0 cursor-pointer"
    >
      <img src={logoSrc} alt="CodeFolio" className={className} />
    </button>
  );
}
