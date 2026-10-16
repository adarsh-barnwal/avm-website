import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { MediaItem } from '../types';
import { Camera, Video, X, Play, Image as ImageIcon } from 'lucide-react';

export default function Gallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<MediaItem | null>(null);

  const categories = ['All', 'Campus', 'Sports', 'Toppers', 'Celebrations', 'AnnualDay'];

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem)));
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === 'All' ? media : media.filter(m => m.category === filter);

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-accent-700 to-accent-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Camera className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-extrabold text-white">School Gallery</h1>
          </div>
          <p className="text-accent-100">Capturing moments from campus life and events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-accent-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-56 rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer animate-fadeIn bg-slate-100"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setSelected(item)}
              >
                {item.type === 'photo' ? (
                  item.mediaUrl.startsWith('data:') || item.mediaUrl.startsWith('http') ? (
                    <img src={item.mediaUrl} alt={item.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-56 flex items-center justify-center bg-slate-200">
                      <ImageIcon className="w-10 h-10 text-slate-400" />
                    </div>
                  )
                ) : (
                  <div className="w-full h-56 bg-slate-900 flex items-center justify-center relative">
                    {item.mediaUrl.includes('youtube') || item.mediaUrl.includes('youtu.be') ? (
                      <div className="w-full h-full">
                        <iframe
                          src={item.mediaUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          title={item.title}
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <>
                        <Video className="w-10 h-10 text-white/50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                      {item.category}
                    </span>
                    {item.type === 'video' && (
                      <span className="px-2 py-0.5 rounded-md bg-error-500/80 text-white text-xs font-medium flex items-center gap-1">
                        <Video className="w-3 h-3" /> Video
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No media in the gallery yet.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="max-w-3xl w-full animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-lg">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {selected.type === 'photo' ? (
              <img src={selected.mediaUrl} alt={selected.title} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            ) : (
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                {selected.mediaUrl.includes('youtube') || selected.mediaUrl.includes('youtu.be') ? (
                  <iframe src={selected.mediaUrl.replace('watch?v=', 'embed/')} className="w-full h-full" title={selected.title} allowFullScreen />
                ) : (
                  <video src={selected.mediaUrl} controls className="w-full h-full" />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
