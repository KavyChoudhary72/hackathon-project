"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "SUPER_ADMIN" | "DONOR" | "SHELTER" | "DRIVER";

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
    email: "admin@surplus2shelter.org",
    password: "Admin@2026",
    name: "Jaipur City Ops Command",
    organizationName: "Jaipur Municipal & Food Rescue Ops",
    badgeLabel: "Super Admin",
    iconName: "ShieldAlert",
  },
  {
    role: "DONOR",
    email: "hotel.clarks@jaipur.com",
    password: "Donor@2026",
    name: "Chef Vikas (Banquet Ops)",
    organizationName: "Hotel Clarks Amer Jaipur",
    badgeLabel: "Hotel / Mess Donor",
    iconName: "Building2",
  },
  {
    role: "SHELTER",
    email: "akshaya.patra@jaipur.org",
    password: "Shelter@2026",
    name: "Sunita Sharma (Intake Coordinator)",
    organizationName: "Akshaya Patra Foundation Jaipur",
    badgeLabel: "Shelter / NGO",
    iconName: "Home",
  },
  {
    role: "DRIVER",
    email: "driver.ramesh@logistics.in",
    password: "Driver@2026",
    name: "Ramesh Kumar",
    organizationName: "Volunteer Green Fleet",
    badgeLabel: "Logistics Driver",
    iconName: "Truck",
  },
];

interface AuthContextType {
  user: AuthUser;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  demoAccounts: DemoAccount[];
}

const DEFAULT_SUPER_ADMIN: AuthUser = {
  userId: "usr_admin_01",
  name: "Jaipur City Ops Command",
  email: "admin@surplus2shelter.org",
  role: "SUPER_ADMIN",
  organizationName: "Jaipur Municipal & Food Rescue Ops",
  phone: "+91-98290-00001",
  locationCity: "Jaipur, Rajasthan",
  permissions: ["all", "audit_decisions", "fssai_arbitration", "feature_flags", "master_analytics"],
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>(DEFAULT_SUPER_ADMIN);
  const [token, setToken] = useState<string | null>("jwt_s2s_super_admin");
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("s2s_auth_role") as UserRole | null;
      const storedUser = localStorage.getItem("s2s_auth_user");
      if (storedRole) {
        const matched = DEMO_ACCOUNTS.find((a) => a.role === storedRole);
        if (matched) {
          setUser({
            userId: `usr_${matched.role.toLowerCase()}`,
            name: matched.name,
            email: matched.email,
            role: matched.role,
            organizationName: matched.organizationName,
            phone: "+91-98290-00000",
            locationCity: "Jaipur, Rajasthan",
            permissions: matched.role === "SUPER_ADMIN" ? ["all"] : [matched.role.toLowerCase()],
          });
        }
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const matched = DEMO_ACCOUNTS.find((a) => a.role === newRole);
    if (!matched) return;

    const newUser: AuthUser = {
      userId: `usr_${matched.role.toLowerCase()}`,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      organizationName: matched.organizationName,
      phone: "+91-98290-00000",
      locationCity: "Jaipur, Rajasthan",
      permissions: matched.role === "SUPER_ADMIN" ? ["all"] : [matched.role.toLowerCase()],
    };

    setUser(newUser);
    setToken(`jwt_s2s_${newRole.toLowerCase()}`);
    localStorage.setItem("s2s_auth_role", newRole);
    localStorage.setItem("s2s_auth_user", JSON.stringify(newUser));

    // Redirect to relevant root dashboard based on role
    if (newRole === "DONOR") {
      router.push("/donor");
    } else if (newRole === "SHELTER") {
      router.push("/shelter");
    } else if (newRole === "DRIVER") {
      router.push("/driver");
    } else if (newRole === "SUPER_ADMIN") {
      router.push("/admin");
    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);

    if (matched) {
      switchRole(matched.role);
      return true;
    }

    // Default fallback to Super Admin
    switchRole("SUPER_ADMIN");
    return true;
  };

  const loginWithRole = (targetRole: UserRole) => {
    switchRole(targetRole);
  };

  const logout = () => {
    localStorage.removeItem("s2s_auth_role");
    localStorage.removeItem("s2s_auth_user");
    setUser(DEFAULT_SUPER_ADMIN);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        token,
        isAuthenticated: true,
        login,
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
