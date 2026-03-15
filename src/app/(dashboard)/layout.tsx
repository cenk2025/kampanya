import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black relative">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen p-8 relative z-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
