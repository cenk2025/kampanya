import Link from 'next/link';
import { Sparkles, ArrowRight, Zap, Image as ImageIcon, Paintbrush } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Header section with greeting */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Creator'}
          </h1>
          <p className="text-gray-400">Here's what's happening with your workspace today.</p>
        </div>
        <Link 
          href="/create" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          <Sparkles className="w-5 h-5" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium mb-1">Generations This Week</h3>
            <div className="text-4xl font-bold text-white mb-2">24</div>
            <div className="text-sm text-green-400 flex items-center gap-1">
              <span>↑ 12%</span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ImageIcon className="w-24 h-24 text-purple-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium mb-1">Saved Assets</h3>
            <div className="text-4xl font-bold text-white mb-2">142</div>
            <Link href="/history" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <span>View library</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Paintbrush className="w-24 h-24 text-orange-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium mb-1">Brand Kit</h3>
            <div className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Active</span>
            </div>
            <Link href="/brand-kit" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
              <span>Manage brand assets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Generations section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Generations</h2>
          <Link href="/history" className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Placeholder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel rounded-xl overflow-hidden group cursor-pointer">
              <div className="aspect-[4/3] bg-white/5 relative">
                {/* Image placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-500">
                  <ImageIcon className="w-12 h-12" />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <p className="text-white font-medium line-clamp-2 text-sm leading-snug">
                    "Summer Sale for Eco-friendly Shoes in neon aesthetic"
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                <span>2 hours ago</span>
                <span className="px-2 py-1 bg-white/10 rounded font-medium text-gray-300">16:9</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
