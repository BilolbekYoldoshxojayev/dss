"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession, UserRole } from "@/types";

interface AuthContextType {
  user: UserSession | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  signOut: () => void;
  isLoading: boolean;
}

const DEMO_ACCOUNTS: Record<UserRole, UserSession> = {
  director: {
    id: "usr-dir-01",
    email: "director@namps.uz",
    fullName: "Dilshodbek Rustamov",
    role: "director",
  },
  manager: {
    id: "usr-mgr-01",
    email: "manager@namps.uz",
    fullName: "Nodira Karimova",
    role: "manager",
  },
  teacher: {
    id: "usr-tch-01",
    email: "jasur.rahimov@namps.uz",
    fullName: "Jasur Rahimov",
    role: "teacher",
  },
  student: {
    id: "usr-stu-01",
    email: "azamat.toirov@student.namps.uz",
    fullName: "Azamat Toirov",
    role: "student",
    gradeLevel: 10,
    section: "A",
  },
  parent: {
    id: "usr-par-01",
    email: "farhod.toirov@parent.uz",
    fullName: "Farhod Toirov",
    role: "parent",
    childrenIds: ["usr-stu-01"],
  },
  librarian: {
    id: "usr-lib-01",
    email: "librarian@namps.uz",
    fullName: "Shahnoza Sobirova",
    role: "librarian",
  },
  staff: {
    id: "usr-stf-01",
    email: "staff@namps.uz",
    fullName: "Mansur Jo'rayev",
    role: "staff",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default demo role is student
  const [user, setUser] = useState<UserSession | null>(DEMO_ACCOUNTS.student);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("namps_demo_role") as UserRole;
    if (savedRole && DEMO_ACCOUNTS[savedRole]) {
      setUser(DEMO_ACCOUNTS[savedRole]);
    }
    setIsLoading(false);
  }, []);

  const switchRole = (newRole: UserRole) => {
    if (DEMO_ACCOUNTS[newRole]) {
      setUser(DEMO_ACCOUNTS[newRole]);
      localStorage.setItem("namps_demo_role", newRole);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("namps_demo_role");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : "student",
        switchRole,
        signOut,
        isLoading,
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
