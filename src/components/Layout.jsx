import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.fullName?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    // The shell is locked to the viewport height and hides its own overflow so
    // the sidebar can stay fixed full-height while <main> is the *only* element
    // that scrolls. This kills the stray page scrollbar and the cut-off sidebar.
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 flex-shrink-0 items-center justify-end gap-3 border-b border-gray-200 bg-white px-4 pl-16 sm:px-6 md:pl-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
              {initial}
            </span>
            <span className="hidden text-sm font-medium text-gray-700 sm:inline">
              {user?.fullName}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            Log out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
