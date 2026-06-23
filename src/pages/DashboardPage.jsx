export default function DashboardPage() {
  return (
    // h-full fills the scroll area exactly (no stray scrollbar); content
    // overflows into <main>'s scroll only when it genuinely exceeds the height.
    <div className="flex h-full items-center justify-center p-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="12" width="7" height="9" rx="1.5" />
            <rect x="3" y="16" width="7" height="5" rx="1.5" />
          </svg>
        </span>
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1.5 text-sm text-gray-500">
          This page is empty for now. Your overview and stats will show up here.
        </p>
      </div>
    </div>
  );
}
