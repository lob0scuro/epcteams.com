import React, { useState, useContext, createContext, useEffect } from "react";

const UserContext = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/hydrate_user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error when fetching user: ", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message || "Server Error" };
    }
    setUser(null);
    return { success: true, message: data.message };
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, setLoading, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
