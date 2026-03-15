'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Sparkles, Image as ImageIcon, CreditCard, Paintbrush, LogOut, Disc3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'The Studio', href: '/create', icon: Sparkles },
  { name: 'Library', href: '/history', icon: ImageIcon },
  { name: 'Brand Kit', href: '/brand-kit', icon: Paintbrush },
  { name: 'Credits', href: '/credits', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 h-screen fixed left-0 top-0 flex flex-col glass-sidebar p-6 z-50 transition-all">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-10 group">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all">
          <Disc3 className="text-white w-6 h-6 animate-[spin_10s_linear_infinite]" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Voon</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Area */}
      <div className="pt-6 mt-6 border-t border-white/10 relative z-10 flex flex-col gap-4">
        {/* Placeholder for Credit Badge logic */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <div className="h-full bg-blue-500 w-[70%] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Credits</span>
            <span className="text-sm font-bold text-white">7/10</span>
          </div>
          <Link href="/credits" className="text-xs text-blue-400 hover:text-blue-300">Get more credits</Link>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
