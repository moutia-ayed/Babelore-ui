import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait for the localStorage check in AuthContext to finish before
  // deciding whether to redirect — otherwise a logged-in user gets
  // bounced to /login for a split second on every page refresh.
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renders whichever nested route matched (e.g. Layout, which
  // itself renders the sidebar + the specific page).
  return <Outlet />;
}