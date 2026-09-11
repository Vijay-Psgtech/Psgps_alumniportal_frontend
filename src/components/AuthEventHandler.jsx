import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthEventHandler() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleAuthLogout = (e) => {
      const url = e.detail?.url || "";
      logout(); // clears AuthContext state + localStorage
      if (url.includes("/admin")) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/alumni/login", { replace: true });
      }
    };

    const handleForbidden = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    window.addEventListener("auth:forbidden", handleForbidden);

    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
      window.removeEventListener("auth:forbidden", handleForbidden);
    };
  }, [logout, navigate]);

  return null; // renders nothing
}
