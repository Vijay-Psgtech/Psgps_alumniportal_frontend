import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

// ✅ API Configuration
const API_BASE = "http://localhost:5000/api";
console.log("📡 Auth API Base:", API_BASE);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch Profile ───────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      setError(null);

      const token = localStorage.getItem("authToken");

      // ✅ No token → stop early safely
      if (!token) {
        console.log("ℹ️ No token found");
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      console.log("🔍 Verifying token...");

      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ✅ HANDLE FAILURE SAFELY (NO THROW)
      if (!res.ok) {
        if (res.status === 401) {
          console.log("⚠️ Token expired");
          localStorage.removeItem("authToken");
          setError("Session expired. Please login again.");
        } else if (res.status === 403) {
          setError("Access denied");
        } else {
          setError(`Auth failed: ${res.status}`);
        }

        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      const data = await res.json();

      const freshUser = data?.user || data?.data?.user;

      // ✅ Validate response
      if (!freshUser || typeof freshUser !== "object") {
        console.warn("⚠️ Invalid user data");
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      // ✅ Normalize user
      const normalizedUser = {
        ...freshUser,
        role: freshUser.role || "alumni",
        isAdmin: freshUser.isAdmin ?? false,
        isApproved: freshUser.isApproved ?? true,
        email: freshUser.email || "",
        name: freshUser.name || freshUser.firstName || "",
      };

      console.log(
        "✅ Authenticated:",
        normalizedUser.email,
        "| Role:",
        normalizedUser.role
      );

      setUser(normalizedUser);
      setRole(normalizedUser.role);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error("❌ Profile fetch error:", err?.message);

      setUser(null);
      setRole(null);
      setIsAuthenticated(false);

      if (!err?.message?.includes("401")) {
        setError(err?.message || "Authentication failed");
      }
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── Initial Load ────────────────────────────────────────────────
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ── Login ──────────────────────────────────────────────────────
  const login = useCallback(
    async (userData, token) => {
      try {
        setError(null);

        if (token) {
          localStorage.setItem("authToken", token);
          console.log("💾 Token stored");
        }

        const normalizedUser = {
          ...userData,
          role: userData.role || "alumni",
          isAdmin: userData.isAdmin ?? false,
          isApproved: userData.isApproved ?? true,
          email: userData.email || "",
          name: userData.name || userData.firstName || "",
        };

        setUser(normalizedUser);
        setRole(normalizedUser.role);
        setIsAuthenticated(true);

        console.log(
          "✅ Logged in:",
          normalizedUser.email,
          "| Role:",
          normalizedUser.role
        );

        // ✅ Optional verification (safe)
        fetchProfile();
      } catch (err) {
        console.error("❌ Login error:", err);
        setError(err?.message || "Login failed");
        throw err;
      }
    },
    [fetchProfile]
  );

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        console.log("📤 Logging out from server...");
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("⚠️ Logout request failed:", err?.message);
    }

    localStorage.removeItem("authToken");

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    setError(null);

    console.log("✅ Logged out");
  }, []);

  // ── Refresh User ───────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      console.log("🔄 Refreshing user...");
      await fetchProfile();
    } catch {
      console.warn("⚠️ Refresh failed → logout");
      await logout();
    }
  }, [fetchProfile, logout]);

  // ── Clear Error ────────────────────────────────────────────────
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        authLoading,
        error,

        login,
        logout,
        refreshUser,
        clearError,
        fetchProfile,

        isAdmin: role === "admin",
        isSuperAdmin: role === "superadmin",
        isAlumni: role === "alumni",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}