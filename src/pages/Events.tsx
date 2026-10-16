import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { SchoolEvent } from '../types';
import { Calendar, MapPin, Clock, X } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Upcoming');
  const [selected, setSelected] = useState<SchoolEvent | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolEvent)));
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = events.filter(e => filter === 'All' || e.status === filter);

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-secondary-400" />
            <h1 className="text-3xl font-extrabold text-white">School Events</h1>
          </div>
          <p className="text-blue-200">Celebrate with us — upcoming and past events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          {['Upcoming', 'Completed', 'All'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((event, i) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-slate-100 animate-fadeIn cursor-pointer flex flex-col sm:flex-row gap-4"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setSelected(event)}
              >
                {event.bannerUrl && (
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-primary-100 text-primary-700 text-xs font-semibold">{event.category}</span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      event.status === 'Upcoming' ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600'
                    }`}>{event.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                    {event.date && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.date}</span>}
                    {event.venue && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.venue}</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No events to display.</p>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scaleIn overflow-hidden" onClick={e => e.stopPropagation()}>
            {selected.bannerUrl && (
              <img src={selected.bannerUrl} alt={selected.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary-100 text-primary-700 text-xs font-semibold">{selected.category}</span>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selected.status === 'Upcoming' ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600'}`}>{selected.status}</span>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{selected.title}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                {selected.date && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {selected.date}</span>}
                {selected.venue && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selected.venue}</span>}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
