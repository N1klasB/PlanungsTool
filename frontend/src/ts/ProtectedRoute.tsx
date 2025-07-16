import { Navigate, Outlet } from "react-router-dom";
import { getIdToken } from "../auth.ts";

const ProtectedRoute = () => {
  const isLoggedIn = !!getIdToken();
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;