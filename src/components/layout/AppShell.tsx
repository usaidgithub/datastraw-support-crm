import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50/60 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Container Layout */}
      <div className="flex">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Page Content Viewport */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}