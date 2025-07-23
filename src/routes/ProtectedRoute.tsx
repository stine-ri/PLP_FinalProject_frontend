import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, role } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;