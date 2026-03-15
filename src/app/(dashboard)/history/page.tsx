import { Download, Edit3, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import DeleteButton from '@/components/history/DeleteButton';

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch generations from Supabase
  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-500" />
            Asset Library
          </h1>
          <p className="text-gray-400">View, download, and edit your previously generated campaign assets.</p>
        </div>
      </div>

      {!generations || generations.length === 0 ? (
        <div className="glass-panel min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-white/5 border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Your library is empty</h3>
          <p className="text-gray-400 max-w-sm mb-6">
            You haven't generated any campaign assets yet. Head over to The Studio to create your first design.
          </p>
          <Link 
            href="/create" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Go to The Studio
          </Link>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {generations.map((gen) => (
            <div key={gen.id} className="relative group rounded-2xl overflow-hidden glass-panel border border-white/5 break-inside-avoid">
              <img 
                src={gen.image_url} 
                alt="Generated Campaign Asset" 
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                <div className="flex justify-end gap-2">
                  <DeleteButton generationId={gen.id} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-blue-500/30">
                      {gen.platform}
                    </span>
                    <span className="text-[10px] text-gray-300">
                      {new Date(gen.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium line-clamp-3 leading-snug mb-4">
                    "{gen.prompt}"
                  </p>
                  <div className="flex gap-2">
                    <Link 
                      href={`/editor/${gen.id}`}
                      className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-medium transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <a 
                      href={gen.image_url}
                      download={`Voon-${gen.id}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-xs font-medium backdrop-blur-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
