import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute({ children }) {
  const { user, role } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // not admin -> send to home
  if (role !== "admin") {
    alert("⛔ Access Denied: This area is for Head Librarians only!");
    return <Navigate to="/" replace />;
  }

  return children;
}
