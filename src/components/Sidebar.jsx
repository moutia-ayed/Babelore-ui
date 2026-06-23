import { useState } from "react";
import { NavLink } from "react-router-dom";

// Add new pages here later — one entry, nothing else to wire up.
const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Documents", to: "/documents" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // desktop collapse (full <-> icon rail)
  const [mobileOpen, setMobileOpen] = useState(false); // off-canvas drawer on small screens

  const navItemClass = ({ isActive }) =>
    `group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    } ${isOpen ? "" : "md:justify-center md:px-0"}`;

  return (
    <>
      {/* Mobile menu trigger — sits in the header band, hidden on desktop. */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="fixed left-3 top-3.5 z-30 inline-flex items-center justify-center rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>

      {/* Dimmed backdrop behind the mobile drawer. */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-gray-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-all duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        } ${isOpen ? "md:w-60" : "md:w-16"}`}
      >
        {/* Logo / brand area */}
        <div className="flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-gray-200 px-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-base font-bold text-white">
            B
          </span>
          <span
            className={`truncate text-base font-semibold tracking-tight text-gray-900 ${
              isOpen ? "md:inline" : "md:hidden"
            }`}
          >
            Babelore
          </span>

          {/* Close button — drawer only (mobile). */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="ml-auto rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Navigation — scrolls internally if items ever overflow. */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={navItemClass}
              title={item.label}
            >
              {/* Mobile drawer always shows the full label; desktop shows a
                  single-letter rail when collapsed. */}
              <span className="md:hidden">{item.label}</span>
              <span className="hidden md:inline">
                {isOpen ? item.label : item.label.charAt(0)}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Desktop collapse toggle — kept at the bottom so it never crowds the
            logo, and out of the way entirely on mobile. */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          className={`hidden flex-shrink-0 items-center gap-2 border-t border-gray-200 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 md:flex ${
            isOpen ? "" : "md:justify-center md:px-0"
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {isOpen ? "«" : "»"}
          </span>
          {isOpen && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
