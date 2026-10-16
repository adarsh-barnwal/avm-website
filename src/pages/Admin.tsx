import { useEffect, useState } from 'react';
import {
  collection, query, orderBy, getDocs, addDoc, updateDoc,
  deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Notice, Admission as AdmissionType, Achiever, MediaItem, SchoolEvent } from '../types';
import {
  LayoutDashboard, Megaphone, ClipboardList, Trophy, Camera,
  Calendar, LogOut, Plus, Edit2, Trash2, X, Save, Loader2,
  Search, Phone, MapPin, Bus, TrendingUp,
} from 'lucide-react';

type AdminTab = 'dashboard' | 'notices' | 'admissions' | 'achievers' | 'gallery' | 'events';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    const stored = sessionStorage.getItem('avm_admin');
    if (stored === 'true') setLoggedIn(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const admin = snap.docs.find(d => {
        const data = d.data();
        return data.username === loginForm.username && data.password === loginForm.password;
      });
      if (admin) {
        setLoggedIn(true);
        sessionStorage.setItem('avm_admin', 'true');
      } else {
        setLoginError('Invalid username or password.');
      }
    } catch {
      setLoginError('Unable to connect. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem('avm_admin');
  };

  if (!loggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full border border-slate-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Admin Portal</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to manage school content</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Username</label>
              <input type="text" value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Enter username" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Password</label>
              <input type="password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Enter password" />
            </div>
            {loginError && <div className="p-3 rounded-xl bg-error-500/10 text-error-600 text-sm font-medium">{loginError}</div>}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loginLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; icon: typeof Megaphone }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'notices', label: 'Notices', icon: Megaphone },
    { key: 'admissions', label: 'Admissions', icon: ClipboardList },
    { key: 'achievers', label: 'Achievers', icon: Trophy },
    { key: 'gallery', label: 'Gallery', icon: Camera },
    { key: 'events', label: 'Events', icon: Calendar },
  ];

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-primary-400" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-error-600 text-white text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                tab === t.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <Dashboard />}
        {tab === 'notices' && <ManageNotices />}
        {tab === 'admissions' && <ManageAdmissions />}
        {tab === 'achievers' && <ManageAchievers />}
        {tab === 'gallery' && <ManageGallery />}
        {tab === 'events' && <ManageEvents />}
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ notices: 0, admissions: 0, newAdmissions: 0, achievers: 0, media: 0, events: 0 });
  const [recentAdmissions, setRecentAdmissions] = useState<AdmissionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [n, a, ach, m, e] = await Promise.all([
          getDocs(collection(db, 'notices')),
          getDocs(collection(db, 'admissions')),
          getDocs(collection(db, 'achievers')),
          getDocs(collection(db, 'media')),
          getDocs(collection(db, 'events')),
        ]);
        const admissions = a.docs.map(d => ({ id: d.id, ...d.data() } as AdmissionType));
        setStats({
          notices: n.size, admissions: a.size,
          newAdmissions: admissions.filter(x => x.status === 'New').length,
          achievers: ach.size, media: m.size, events: e.size,
        });
        setRecentAdmissions(admissions.sort((x, y) => (y.createdAt || '').localeCompare(x.createdAt || '')).slice(0, 5));
      } catch { /* offline */ } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl shimmer" />)}</div>;

  const cards = [
    { label: 'Total Notices', value: stats.notices, icon: Megaphone, color: 'from-primary-500 to-primary-700' },
    { label: 'Admissions', value: stats.admissions, icon: ClipboardList, color: 'from-accent-500 to-accent-700' },
    { label: 'New Applications', value: stats.newAdmissions, icon: TrendingUp, color: 'from-secondary-500 to-secondary-700' },
    { label: 'Achievers', value: stats.achievers, icon: Trophy, color: 'from-orange-500 to-orange-700' },
    { label: 'Gallery Items', value: stats.media, icon: Camera, color: 'from-teal-500 to-teal-700' },
    { label: 'Events', value: stats.events, icon: Calendar, color: 'from-rose-500 to-rose-700' },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
              <c.icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800">{c.value}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Admission Applications</h3>
        {recentAdmissions.length > 0 ? (
          <div className="space-y-3">
            {recentAdmissions.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{a.studentName}</p>
                  <p className="text-xs text-slate-400">{a.classGrade} • {a.parentName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  a.status === 'New' ? 'bg-accent-100 text-accent-700' :
                  a.status === 'Contacted' ? 'bg-secondary-100 text-secondary-700' :
                  'bg-primary-100 text-primary-700'
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-slate-400 text-sm text-center py-4">No applications yet.</p>}
      </div>
    </div>
  );
}

function ManageNotices() {
  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (data: Partial<Notice>) => {
    if (editing?.id) {
      await updateDoc(doc(db, 'notices', editing.id), data as any);
    } else {
      await addDoc(collection(db, 'notices'), { ...data, createdAt: new Date().toISOString() } as any);
    }
    setShowForm(false); setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    await deleteDoc(doc(db, 'notices', id));
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Notices</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Notice
        </button>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl shimmer" />)}</div> :
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-semibold">{n.category}</span>
                  {n.isNew && <span className="px-2 py-0.5 rounded-md bg-error-500 text-white text-xs">New</span>}
                </div>
                <h3 className="text-sm font-semibold text-slate-800">{n.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{n.details}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(n); setShowForm(true); }} className="p-2 rounded-lg hover:bg-slate-100"><Edit2 className="w-4 h-4 text-slate-500" /></button>
                <button onClick={() => handleDelete(n.id!)} className="p-2 rounded-lg hover:bg-error-50"><Trash2 className="w-4 h-4 text-error-500" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-slate-400 py-8">No notices yet.</p>}
        </div>
      }
      {showForm && <NoticeForm notice={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function NoticeForm({ notice, onSave, onClose }: { notice: Notice | null; onSave: (d: Partial<Notice>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: notice?.title || '', category: notice?.category || 'Academics',
    date: notice?.date || '', isNew: notice?.isNew || false,
    details: notice?.details || '', downloadable: notice?.downloadable || false,
  });

  return (
    <Modal title={notice ? 'Edit Notice' : 'Add Notice'} onClose={onClose}>
      <div className="space-y-4">
        <input className="input" placeholder="Notice title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
            {['Admissions', 'Academics', 'Sports', 'Circular', 'Events'].map(c => <option key={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Date (e.g. 15 Oct 2026)" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
        </div>
        <textarea className="input" rows={4} placeholder="Notice details" value={form.details} onChange={e => setForm(p => ({ ...p, details: e.target.value }))} />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isNew} onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} /> Mark as New</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.downloadable} onChange={e => setForm(p => ({ ...p, downloadable: e.target.checked }))} /> Has Attachment</label>
        </div>
        <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {notice ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}

function ManageAdmissions() {
  const [items, setItems] = useState<AdmissionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdmissionType)));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'admissions', id), { status });
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    await deleteDoc(doc(db, 'admissions', id));
    fetch();
  };

  const filtered = items.filter(a =>
    a.studentName.toLowerCase().includes(search.toLowerCase()) ||
    a.parentName.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search)
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Admission Applications</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl shimmer" />)}</div> :
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800">{a.studentName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {a.phone}</span>
                    <span>{a.classGrade}{a.stream !== 'N/A' ? ` • ${a.stream}` : ''}</span>
                    {a.village && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.village}</span>}
                    {a.needBus && <span className="flex items-center gap-1 text-primary-600"><Bus className="w-3 h-3" /> Bus</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Parent: {a.parentName}</p>
                </div>
                <button onClick={() => handleDelete(a.id!)} className="p-2 rounded-lg hover:bg-error-50"><Trash2 className="w-4 h-4 text-error-500" /></button>
              </div>
              <div className="flex gap-2">
                {['New', 'Contacted', 'Admitted'].map(s => (
                  <button key={s} onClick={() => updateStatus(a.id!, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      a.status === s ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-400 py-8">No applications found.</p>}
        </div>
      }
    </div>
  );
}

function ManageAchievers() {
  const [items, setItems] = useState<Achiever[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Achiever | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'achievers'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Achiever)));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (data: Partial<Achiever>) => {
    if (editing?.id) await updateDoc(doc(db, 'achievers', editing.id), data as any);
    else await addDoc(collection(db, 'achievers'), { ...data, createdAt: new Date().toISOString() } as any);
    setShowForm(false); setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achiever?')) return;
    await deleteDoc(doc(db, 'achievers', id)); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Achievers</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Achiever
        </button>
      </div>
      {loading ? <div className="grid sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-40 rounded-xl shimmer" />)}</div> :
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 text-xs font-semibold">{a.category}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(a); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-100"><Edit2 className="w-3.5 h-3.5 text-slate-500" /></button>
                  <button onClick={() => handleDelete(a.id!)} className="p-1.5 rounded-lg hover:bg-error-50"><Trash2 className="w-3.5 h-3.5 text-error-500" /></button>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{a.name}</h3>
              <p className="text-xs text-slate-500">{a.title}</p>
              {a.scoreOrAward && <p className="text-xs text-primary-600 font-semibold mt-1">{a.scoreOrAward}</p>}
              {a.year && <p className="text-xs text-slate-400 mt-1">{a.year}</p>}
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-center text-slate-400 py-8">No achievers yet.</p>}
        </div>
      }
      {showForm && <AchieverForm achiever={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function AchieverForm({ achiever, onSave, onClose }: { achiever: Achiever | null; onSave: (d: Partial<Achiever>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: achiever?.name || '', title: achiever?.title || '',
    scoreOrAward: achiever?.scoreOrAward || '', category: achiever?.category || 'Board Topper',
    year: achiever?.year || '', imageUrl: achiever?.imageUrl || '',
  });
  return (
    <Modal title={achiever ? 'Edit Achiever' : 'Add Achiever'} onClose={onClose}>
      <div className="space-y-4">
        <input className="input" placeholder="Student name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <input className="input" placeholder="Achievement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
            {['Board Topper', 'Sports', 'Merit'].map(c => <option key={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Score or award" value={form.scoreOrAward} onChange={e => setForm(p => ({ ...p, scoreOrAward: e.target.value }))} />
        </div>
        <input className="input" placeholder="Year / Session" value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
        <input className="input" placeholder="Photo URL (optional)" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} />
        <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {achiever ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}

function ManageGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem)));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (data: Partial<MediaItem>) => {
    if (editing?.id) await updateDoc(doc(db, 'media', editing.id), data as any);
    else await addDoc(collection(db, 'media'), { ...data, createdAt: new Date().toISOString() } as any);
    setShowForm(false); setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return;
    await deleteDoc(doc(db, 'media', id)); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Gallery</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>
      {loading ? <div className="grid sm:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-40 rounded-xl shimmer" />)}</div> :
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(m => (
            <div key={m.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <div className="h-32 bg-slate-200 overflow-hidden">
                {m.mediaUrl.startsWith('data:') || m.mediaUrl.startsWith('http') ? (
                  <img src={m.mediaUrl} alt={m.title} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center"><Camera className="w-8 h-8 text-slate-400" /></div>}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">{m.category}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(m); setShowForm(true); }} className="p-1 rounded hover:bg-slate-100"><Edit2 className="w-3.5 h-3.5 text-slate-500" /></button>
                    <button onClick={() => handleDelete(m.id!)} className="p-1 rounded hover:bg-error-50"><Trash2 className="w-3.5 h-3.5 text-error-500" /></button>
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-700 line-clamp-1">{m.title}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-center text-slate-400 py-8">No media yet.</p>}
        </div>
      }
      {showForm && <MediaForm media={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function MediaForm({ media, onSave, onClose }: { media: MediaItem | null; onSave: (d: Partial<MediaItem>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: media?.title || '', type: media?.type || 'photo',
    mediaUrl: media?.mediaUrl || '', category: media?.category || 'Campus',
  });
  return (
    <Modal title={media ? 'Edit Media' : 'Add Media'} onClose={onClose}>
      <div className="space-y-4">
        <input className="input" placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <select className="input" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
            <option value="photo">Photo</option>
            <option value="video">Video</option>
          </select>
          <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
            {['Campus', 'Sports', 'Toppers', 'Celebrations', 'AnnualDay'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <textarea className="input" rows={3} placeholder="Image URL, data URL, or YouTube link" value={form.mediaUrl} onChange={e => setForm(p => ({ ...p, mediaUrl: e.target.value }))} />
        <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {media ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}

function ManageEvents() {
  const [items, setItems] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SchoolEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolEvent)));
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (data: Partial<SchoolEvent>) => {
    if (editing?.id) await updateDoc(doc(db, 'events', editing.id), data as any);
    else await addDoc(collection(db, 'events'), { ...data, createdAt: new Date().toISOString() } as any);
    setShowForm(false); setEditing(null); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await deleteDoc(doc(db, 'events', id)); fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Manage Events</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl shimmer" />)}</div> :
        <div className="space-y-3">
          {items.map(e => (
            <div key={e.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-semibold">{e.category}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${e.status === 'Upcoming' ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600'}`}>{e.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-800">{e.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{e.date} {e.venue && `• ${e.venue}`}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(e); setShowForm(true); }} className="p-2 rounded-lg hover:bg-slate-100"><Edit2 className="w-4 h-4 text-slate-500" /></button>
                <button onClick={() => handleDelete(e.id!)} className="p-2 rounded-lg hover:bg-error-50"><Trash2 className="w-4 h-4 text-error-500" /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-slate-400 py-8">No events yet.</p>}
        </div>
      }
      {showForm && <EventForm event={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function EventForm({ event, onSave, onClose }: { event: SchoolEvent | null; onSave: (d: Partial<SchoolEvent>) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    title: event?.title || '', date: event?.date || '', venue: event?.venue || '',
    description: event?.description || '', category: event?.category || 'Academic',
    status: event?.status || 'Upcoming', bannerUrl: event?.bannerUrl || '',
  });
  return (
    <Modal title={event ? 'Edit Event' : 'Add Event'} onClose={onClose}>
      <div className="space-y-4">
        <input className="input" placeholder="Event title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <input className="input" placeholder="Venue" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))}>
            {['Academic', 'Sports', 'Cultural', 'Celebration'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))}>
            <option>Upcoming</option><option>Completed</option>
          </select>
        </div>
        <textarea className="input" rows={3} placeholder="Event description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        <input className="input" placeholder="Banner image URL (optional)" value={form.bannerUrl} onChange={e => setForm(p => ({ ...p, bannerUrl: e.target.value }))} />
        <button onClick={() => onSave(form)} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {event ? 'Update' : 'Create'}
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
