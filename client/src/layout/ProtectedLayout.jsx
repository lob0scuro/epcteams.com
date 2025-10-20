import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/volunteer" />;
  return <Outlet />;
};

export default ProtectedLayout;
