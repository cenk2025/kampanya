'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  generationId: string;
}

export default function DeleteButton({ generationId }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/delete-generation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: generationId }),
      });
      const data = await res.json();
      if (data.success) {
        router.refresh(); // Refresh the server component to re-fetch data
      } else {
        alert('Silme başarısız: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error(err);
      alert('Silme sırasında hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-8 h-8 rounded-lg bg-black/40 hover:bg-red-500/20 text-white hover:text-red-400 flex items-center justify-center backdrop-blur-md transition-colors disabled:opacity-50"
    >
      {isDeleting ? (
        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
