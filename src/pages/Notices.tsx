import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Notice } from '../types';
import { Megaphone, Search, Filter, FileText, Download, X } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Notice | null>(null);

  const categories = ['All', 'Admissions', 'Academics', 'Sports', 'Circular', 'Events'];

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
    } catch {
      // offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const filtered = notices.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.details.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || n.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-primary-800 to-primary-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="w-8 h-8 text-secondary-400" />
            <h1 className="text-3xl font-extrabold text-white">School Notices</h1>
          </div>
          <p className="text-blue-200">Stay updated with the latest announcements and circulars</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notices..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-xl shimmer" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((notice, i) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-slate-100 animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setSelected(notice)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-primary-100 text-primary-700 text-xs font-semibold">
                      {notice.category}
                    </span>
                    {notice.isNew && (
                      <span className="px-2.5 py-1 rounded-lg bg-error-500 text-white text-xs font-semibold animate-pulse">
                        New
                      </span>
                    )}
                    {notice.downloadable && (
                      <span className="px-2.5 py-1 rounded-lg bg-accent-100 text-accent-700 text-xs font-semibold flex items-center gap-1">
                        <Download className="w-3 h-3" /> Attachment
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">{notice.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{notice.details}</p>
                {notice.date && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {notice.date}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No notices found.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-primary-100 text-primary-700 text-xs font-semibold">{selected.category}</span>
                {selected.isNew && <span className="px-2.5 py-1 rounded-lg bg-error-500 text-white text-xs font-semibold">New</span>}
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{selected.title}</h2>
            {selected.date && <p className="text-sm text-slate-400 mb-4">{selected.date}</p>}
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selected.details}</p>
            {selected.downloadable && (
              <div className="mt-4 p-3 bg-accent-50 rounded-xl flex items-center gap-2 text-sm text-accent-700">
                <Download className="w-4 h-4" /> Attachment available for download
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
