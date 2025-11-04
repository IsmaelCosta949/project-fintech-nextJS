"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Users } from "../interfaces/users";

interface UserContextType {
  user: Users | null;
  setUser: (user: Users | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Users | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, []);

  const setUser = (user: Users | null) => {
    setUserState(user);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser deve ser usado dentro de UserProvider");
  return context;
};
