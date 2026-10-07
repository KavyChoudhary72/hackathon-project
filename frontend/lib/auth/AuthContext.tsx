"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "MESS" | "DONOR" | "SHELTER" | "DRIVER";

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName: string;
  phone: string;
  locationCity: string;
  permissions: string[];
  avatarUrl?: string;
  donorType?: string;
  fssaiLicence?: string;
  capacityMeals?: number;
  vehicleType?: string;
}

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  organizationName: string;
  badgeLabel: string;
  iconName: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "SUPER_ADMIN",
    email: "kavychoudhary27@gmail.com",
    password: "Superadmin@12345",
    name: "Kavy Choudhary",
    organizationName: "Jaipur Food Commission & Municipal Operations",
    badgeLabel: "Super Admin (City Ops)",
    iconName: "ShieldAlert",
  },
  {
    role: "MESS",
    email: "mess.mnit@jaipur.ac.in",
    password: "Mess@12345",
    name: "MNIT Central Mess & Catering",
    organizationName: "MNIT Jaipur Student Dining",
    badgeLabel: "Mess / Dining Hall",
    iconName: "UtensilsCrossed",
  },
  {
    role: "DONOR",
    email: "hotel.clarks@jaipur.com",
    password: "Mess@12345",
    name: "Hotel Clarks Amer (Chef & Banquet)",
    organizationName: "Hotel Clarks Amer Jaipur",
    badgeLabel: "Hotel / Banquet Donor",
    iconName: "Building2",
  },
  {
    role: "SHELTER",
    email: "shelter.akshaya@jaipur.org",
    password: "Shelter@12345",
    name: "Sunita Sharma (Intake Director)",
    organizationName: "Akshaya Patra Foundation Jaipur",
    badgeLabel: "Shelter / NGO",
    iconName: "Home",
  },
  {
    role: "DRIVER",
    email: "driver.ramesh@logistics.in",
    password: "Driver@12345",
    name: "Ramesh Kumar (Fleet Lead)",
    organizationName: "Jaipur Green Logistics Volunteer Fleet",
    badgeLabel: "Logistics Driver",
    iconName: "Truck",
  },
];

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organizationName?: string;
  phone?: string;
  locationCity?: string;
  donorType?: string;
  fssaiLicence?: string;
  capacityMeals?: number;
  vehicleType?: string;
  vehicleNumber?: string;
}

export const SESSION_LIFETIME_MS = 15 * 60 * 1000; // 15 minutes maximum session duration

interface AuthContextType {
  user: AuthUser;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionRemainingSeconds: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  loginWithRole: (role: UserRole) => Promise<void>;
  logout: (expired?: boolean) => void;
  switchRole: (role: UserRole) => Promise<void>;
  demoAccounts: DemoAccount[];
}

const DEFAULT_SUPER_ADMIN: AuthUser = {
  userId: "usr_superadmin_kavy",
  name: "Kavy Choudhary",
  email: "kavychoudhary27@gmail.com",
  role: "SUPER_ADMIN",
  organizationName: "Jaipur Food Commission & Municipal Operations",
  phone: "+91-98290-00001",
  locationCity: "Jaipur, Rajasthan",
  permissions: ["all", "audit_decisions", "fssai_arbitration", "feature_flags", "master_analytics", "manage_users"],
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>(DEFAULT_SUPER_ADMIN);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionRemainingSeconds, setSessionRemainingSeconds] = useState<number>(15 * 60);

  const getRedirectPathForRole = useCallback((role: UserRole): string => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/admin";
      case "MESS":
      case "DONOR":
        return "/donor";
      case "SHELTER":
        return "/shelter";
      case "DRIVER":
        return "/driver";
      default:
        return "/donor";
    }
  }, []);

  const logout = useCallback((expired?: boolean | unknown) => {
    try {
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch {}

    localStorage.removeItem("foodlink_jwt_token");
    localStorage.removeItem("foodlink_auth_user");
    localStorage.removeItem("foodlink_session_start");
    setToken(null);
    setUser(DEFAULT_SUPER_ADMIN);
    setSessionRemainingSeconds(0);

    if (expired === true) {
      router.push("/login?session_expired=true");
    } else {
      router.push("/login");
    }
  }, [router]);

  // Restore authenticated session on mount with strict 15-min check
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem("foodlink_jwt_token");
        const storedUserJson = localStorage.getItem("foodlink_auth_user");
        const storedSessionStart = localStorage.getItem("foodlink_session_start");

        if (storedToken && storedUserJson) {
          const sessionStart = storedSessionStart ? parseInt(storedSessionStart, 10) : 0;
          const elapsed = Date.now() - sessionStart;

          // Check if session has exceeded 15 minutes max
          if (!sessionStart || elapsed > SESSION_LIFETIME_MS) {
            localStorage.removeItem("foodlink_jwt_token");
            localStorage.removeItem("foodlink_auth_user");
            localStorage.removeItem("foodlink_session_start");
            if (isMounted) {
              setToken(null);
              setUser(DEFAULT_SUPER_ADMIN);
              setSessionRemainingSeconds(0);
            }
            // If on a protected route, route to login
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.startsWith("/login") &&
              !window.location.pathname.startsWith("/signup") &&
              window.location.pathname !== "/"
            ) {
              router.push("/login?session_expired=true");
            }
            return;
          }

          const parsedUser = JSON.parse(storedUserJson) as AuthUser;
          const remaining = Math.max(0, Math.floor((SESSION_LIFETIME_MS - elapsed) / 1000));
          if (isMounted) {
            setToken(storedToken);
            setUser(parsedUser);
            setSessionRemainingSeconds(remaining);
          }

          // Verify token against backend in background
          try {
            const res = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            if (res.ok) {
              const resJson = await res.json();
              if (resJson.success && resJson.data && isMounted) {
                const refreshedUser: AuthUser = {
                  userId: resJson.data.user_id,
                  name: resJson.data.name,
                  email: resJson.data.email,
                  role: resJson.data.role as UserRole,
                  organizationName: resJson.data.organization_name,
                  phone: resJson.data.phone,
                  locationCity: resJson.data.location_city,
                  permissions: resJson.data.permissions || [],
                  avatarUrl: resJson.data.avatar_url,
                  donorType: resJson.data.donor_type,
                  fssaiLicence: resJson.data.fssai_licence,
                  capacityMeals: resJson.data.capacity_meals,
                  vehicleType: resJson.data.vehicle_type,
                };
                setUser(refreshedUser);
                localStorage.setItem("foodlink_auth_user", JSON.stringify(refreshedUser));
              }
            }
          } catch {
            // Keep cached user if offline
          }
        } else {
          // No stored credentials: initialize default demo state
          if (isMounted) {
            setUser(DEFAULT_SUPER_ADMIN);
            setToken(null);
            setSessionRemainingSeconds(0);
          }
        }
      } catch {
        // Fallback default
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Active 1-second Interval Countdown Timer for 15-Minute Session Expiration
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      const storedSessionStart = localStorage.getItem("foodlink_session_start");
      if (!storedSessionStart) {
        logout(true);
        return;
      }
      const sessionStart = parseInt(storedSessionStart, 10);
      const elapsed = Date.now() - sessionStart;
      const remainingSec = Math.max(0, Math.floor((SESSION_LIFETIME_MS - elapsed) / 1000));
      setSessionRemainingSeconds(remainingSec);

      if (remainingSec <= 0) {
        clearInterval(interval);
        logout(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [token, logout]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const nowMs = Date.now().toString();

    try {
      // 1. Attempt API Login to FastAPI Backend
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const receivedToken = data.data.token;
        const u = data.data.user;
        const authUser: AuthUser = {
          userId: u.user_id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          organizationName: u.organization_name,
          phone: u.phone,
          locationCity: u.location_city,
          permissions: u.permissions || [],
          avatarUrl: u.avatar_url,
          donorType: u.donor_type,
          fssaiLicence: u.fssai_licence,
          capacityMeals: u.capacity_meals,
          vehicleType: u.vehicle_type,
        };

        setToken(receivedToken);
        setUser(authUser);
        setSessionRemainingSeconds(15 * 60);
        localStorage.setItem("foodlink_jwt_token", receivedToken);
        localStorage.setItem("foodlink_auth_user", JSON.stringify(authUser));
        localStorage.setItem("foodlink_session_start", nowMs);

        router.push(getRedirectPathForRole(authUser.role));
        return { success: true };
      } else {
        const errMsg = data.detail || data.error || "Invalid email or password.";

        // 2. Offline fallback for demo accounts
        const demoAcc = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === cleanEmail && a.password === password
        );
        if (demoAcc) {
          const fallbackToken = `jwt_foodlink_${demoAcc.role.toLowerCase()}_${Date.now()}`;
          const fallbackUser: AuthUser = {
            userId: `usr_${demoAcc.role.toLowerCase()}`,
            name: demoAcc.name,
            email: demoAcc.email,
            role: demoAcc.role,
            organizationName: demoAcc.organizationName,
            phone: "+91-98290-00000",
            locationCity: "Jaipur, Rajasthan",
            permissions: demoAcc.role === "SUPER_ADMIN" ? ["all"] : [demoAcc.role.toLowerCase()],
          };
          setToken(fallbackToken);
          setUser(fallbackUser);
          setSessionRemainingSeconds(15 * 60);
          localStorage.setItem("foodlink_jwt_token", fallbackToken);
          localStorage.setItem("foodlink_auth_user", JSON.stringify(fallbackUser));
          localStorage.setItem("foodlink_session_start", nowMs);
          router.push(getRedirectPathForRole(demoAcc.role));
          return { success: true };
        }

        return { success: false, error: errMsg };
      }
    } catch {
      // Backend offline fallback for demo accounts
      const demoAcc = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === cleanEmail && a.password === password
      );
      if (demoAcc) {
        const fallbackToken = `jwt_foodlink_${demoAcc.role.toLowerCase()}_${Date.now()}`;
        const fallbackUser: AuthUser = {
          userId: `usr_${demoAcc.role.toLowerCase()}`,
          name: demoAcc.name,
          email: demoAcc.email,
          role: demoAcc.role,
          organizationName: demoAcc.organizationName,
          phone: "+91-98290-00000",
          locationCity: "Jaipur, Rajasthan",
          permissions: demoAcc.role === "SUPER_ADMIN" ? ["all"] : [demoAcc.role.toLowerCase()],
        };
        setToken(fallbackToken);
        setUser(fallbackUser);
        setSessionRemainingSeconds(15 * 60);
        localStorage.setItem("foodlink_jwt_token", fallbackToken);
        localStorage.setItem("foodlink_auth_user", JSON.stringify(fallbackUser));
        localStorage.setItem("foodlink_session_start", nowMs);
        router.push(getRedirectPathForRole(demoAcc.role));
        return { success: true };
      }

      return {
        success: false,
        error: "Unable to reach authentication server. Please verify backend status.",
      };
    }
  };

  const register = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; error?: string }> => {
    const nowMs = Date.now().toString();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          name: payload.name.trim(),
          role: payload.role,
          organization_name: payload.organizationName,
          phone: payload.phone,
          location_city: payload.locationCity || "Jaipur, Rajasthan",
          donor_type: payload.donorType,
          fssai_licence: payload.fssaiLicence,
          capacity_meals: payload.capacityMeals,
          vehicle_type: payload.vehicleType,
          vehicle_number: payload.vehicleNumber,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const receivedToken = data.data.token;
        const u = data.data.user;
        const authUser: AuthUser = {
          userId: u.user_id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          organizationName: u.organization_name,
          phone: u.phone,
          locationCity: u.location_city,
          permissions: u.permissions || [],
          avatarUrl: u.avatar_url,
          donorType: u.donor_type,
          fssaiLicence: u.fssai_licence,
          capacityMeals: u.capacity_meals,
          vehicleType: u.vehicle_type,
        };

        setToken(receivedToken);
        setUser(authUser);
        setSessionRemainingSeconds(15 * 60);
        localStorage.setItem("foodlink_jwt_token", receivedToken);
        localStorage.setItem("foodlink_auth_user", JSON.stringify(authUser));
        localStorage.setItem("foodlink_session_start", nowMs);

        router.push(getRedirectPathForRole(authUser.role));
        return { success: true };
      } else {
        return {
          success: false,
          error: data.detail || data.error || "Registration failed. Please check inputs.",
        };
      }
    } catch (e: any) {
      return {
        success: false,
        error: e.message || "Failed to register account with backend service.",
      };
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    const matched = DEMO_ACCOUNTS.find((a) => a.role === targetRole);
    if (!matched) return;

    // Use full credentials login
    await login(matched.email, matched.password);
  };

  const loginWithRole = async (targetRole: UserRole) => {
    await switchRole(targetRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        sessionRemainingSeconds,
        login,
        register,
        loginWithRole,
        logout,
        switchRole,
        demoAccounts: DEMO_ACCOUNTS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
