import { Navigate } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("userData"));

  if (!user) return <Navigate to="/login" replace />;

  return user.name === "customer"
    ? <Navigate to="/customer" replace />
    : <Navigate to="/provider" replace />;
}