import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Achiever } from '../types';
import { Trophy, Award, Medal, Star, User } from 'lucide-react';

export default function Achievers() {
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Board Topper', 'Sports', 'Merit'];

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'achievers'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setAchievers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Achiever)));
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === 'All' ? achievers : achievers.filter(a => a.category === filter);

  const categoryIcon = (cat: string) => {
    if (cat === 'Board Topper') return Trophy;
    if (cat === 'Sports') return Medal;
    return Star;
  };

  const categoryColor = (cat: string) => {
    if (cat === 'Board Topper') return 'from-secondary-400 to-secondary-600';
    if (cat === 'Sports') return 'from-orange-400 to-orange-600';
    return 'from-primary-400 to-primary-600';
  };

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-secondary-600 to-secondary-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-extrabold text-white">Our Achievers</h1>
          </div>
          <p className="text-secondary-100">Celebrating excellence in academics and sports</p>
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
                  ? 'bg-secondary-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 rounded-2xl shimmer" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((achiever, i) => {
              const Icon = categoryIcon(achiever.category);
              return (
                <div
                  key={achiever.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 animate-fadeIn group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`h-32 bg-gradient-to-br ${categoryColor(achiever.category)} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl" />
                    </div>
                    {achiever.imageUrl ? (
                      <img src={achiever.imageUrl} alt={achiever.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/40">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Icon className="w-4 h-4 text-secondary-500" />
                      <span className="text-xs font-semibold text-secondary-600 uppercase tracking-wide">{achiever.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{achiever.name}</h3>
                    <p className="text-sm text-slate-500 mb-2">{achiever.title}</p>
                    {achiever.scoreOrAward && (
                      <p className="text-sm font-semibold text-primary-600 mb-1">{achiever.scoreOrAward}</p>
                    )}
                    {achiever.year && (
                      <p className="text-xs text-slate-400">Session: {achiever.year}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No achievers to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
