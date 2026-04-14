"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type UserRole = "patient" | "doctor" | "clinic_ops" | "admin";

interface User {
  name: string;
  role: UserRole;
  initials: string;
  subtitle: string;
}

const ROLE_PROFILES: Record<UserRole, User> = {
  patient: { name: "Priya Sharma", role: "patient", initials: "PS", subtitle: "ABHA: 91-4502-8831" },
  doctor: { name: "Dr. Meera Nair", role: "doctor", initials: "MN", subtitle: "MBBS, MD · MCI Verified" },
  clinic_ops: { name: "Ryan Keshary", role: "clinic_ops", initials: "RK", subtitle: "Ops Manager · CityCare" },
  admin: { name: "Admin User", role: "admin", initials: "AU", subtitle: "Platform Administrator" },
};

interface AuthContextType {
  user: User;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("patient");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const user = ROLE_PROFILES[role];

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    // Set cookie for middleware
    document.cookie = `ss-role=${newRole}; path=/; max-age=86400; SameSite=Lax`;
  }, []);

  const login = useCallback((loginRole: UserRole) => {
    setRoleState(loginRole);
    setIsAuthenticated(true);
    document.cookie = `ss-role=${loginRole}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `ss-auth=demo-token; path=/; max-age=86400; SameSite=Lax`;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    document.cookie = "ss-role=; path=/; max-age=0";
    document.cookie = "ss-auth=; path=/; max-age=0";
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, setRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
