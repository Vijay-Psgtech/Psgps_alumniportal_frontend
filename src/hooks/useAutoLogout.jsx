import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const useAutoLogout = (timeout = 15 * 60 * 1000) => {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return; // only enable when the user is truly authenticated

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("Session Expired, Please Login again");
        logout();
      }, timeout);
    };

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(timer);
    };
  }, [isAuthenticated, logout, timeout]);
};

export default useAutoLogout;
