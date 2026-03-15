'use client';

import { Zap, CreditCard, Clock, Star } from 'lucide-react';

export default function CreditsPage() {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-500" />
          Credits & Billing
        </h1>
        <p className="text-gray-400">Manage your workspace credits, view generation history, and upgrade your plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Current Balance Card */}
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap className="w-32 h-32 text-blue-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-sm">Available Credits</h3>
            <div className="text-6xl font-black text-white mb-6 tracking-tighter">7<span className="text-2xl text-gray-500 font-normal">/10</span></div>
            
            <div className="space-y-2 mb-8">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-blue-400">70% Remaining</span>
                <span className="text-gray-500">Resets in 14 days</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
            </div>

            <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl transition-all shadow-md transform hover:scale-[1.02] active:scale-[0.98]">
              Top-up Credits
            </button>
          </div>
        </div>

        {/* Pro Plan Upsell */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 glass-panel p-8 rounded-2xl border border-blue-500/30 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 border border-blue-500/30">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h3>
            <p className="text-gray-300 mb-6">Unlock unlimited bulk generation, priority API access, and advanced brand kit templates.</p>
            <ul className="space-y-3 mb-8">
              {[
                '1,000 credits per month',
                'Generate up to 10 variations at once',
                'Priority queue (2x faster)',
                'Export to direct integrations'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] relative z-10">
            View Plans
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Recent Usage</h2>
        <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Action</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Platform</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: 'Today, 2:45 PM', action: 'Generated 4 variations', platform: 'Instagram', amount: '-4' },
                { date: 'Yesterday, 10:12 AM', action: 'Generated 1 variation', platform: 'YouTube', amount: '-1' },
                { date: 'Oct 12, 09:00 AM', action: 'Generated 2 variations', platform: 'Square', amount: '-2' },
                { date: 'Oct 01, 00:00 AM', action: 'Monthly Plan Renewed', platform: 'System', amount: '+10', isPositive: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{row.action}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    <span className="px-2.5 py-1 rounded bg-white/10 border border-white/5 text-xs font-medium">
                      {row.platform}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${row.isPositive ? 'text-green-400' : 'text-orange-400'}`}>
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
