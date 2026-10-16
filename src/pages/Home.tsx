import { useEffect, useState } from 'react';
import {
  collection, query, orderBy, limit, getDocs, where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Notice, SchoolEvent, Page } from '../types';
import {
  GraduationCap, BookOpen, Trophy, Bus, ArrowRight, Calendar,
  Megaphone, Award, Users, Library, FlaskConical, Calculator,
  Palette, ChevronRight, CheckCircle2,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noticeQ = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(5));
        const noticeSnap = await getDocs(noticeQ);
        const noticeData = noticeSnap.docs.map(d => ({ id: d.id, ...d.data() } as Notice));
        setNotices(noticeData);

        const eventQ = query(
          collection(db, 'events'),
          where('status', '==', 'Upcoming'),
        );
        const eventSnap = await getDocs(eventQ);
        const eventData = eventSnap.docs
          .map(d => ({ id: d.id, ...d.data() } as SchoolEvent))
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
          .slice(0, 3);
        setEvents(eventData);
      } catch {
        // offline or empty
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: BookOpen, title: 'Quality Education', desc: 'Nursery to 12th with experienced faculty', color: 'from-primary-500 to-primary-700' },
    { icon: FlaskConical, title: 'Science Stream', desc: 'Physics, Chemistry, Biology labs', color: 'from-accent-500 to-accent-700' },
    { icon: Calculator, title: 'Commerce Stream', desc: 'Accountancy, Business Studies, Economics', color: 'from-secondary-500 to-secondary-700' },
    { icon: Palette, title: 'Arts Stream', desc: 'Humanities with diverse subject choices', color: 'from-rose-500 to-rose-700' },
    { icon: Trophy, title: 'Sports & Games', desc: 'Inter-school competitions and athletics', color: 'from-orange-500 to-orange-700' },
    { icon: Bus, title: 'Transport Facility', desc: 'Bus service covering nearby villages', color: 'from-teal-500 to-teal-700' },
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Students' },
    { icon: GraduationCap, value: '30+', label: 'Teachers' },
    { icon: Award, value: '15+', label: 'Years' },
    { icon: Trophy, value: '50+', label: 'Awards' },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6 border border-white/20">
                <CheckCircle2 className="w-4 h-4 text-accent-400" />
                HBSE Affiliated School
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
                Adarsh Vidya Mandir<br />
                <span className="text-secondary-400">Sr. Sec. School</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-xl">
                Empowering students from Nursery to 12th with quality education in
                Science, Commerce, and Arts streams. Located in Meerpur Kaurali, Palwal, Haryana.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('admission')}
                  className="px-6 py-3 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  Apply for Admission
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/20 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all animate-scaleIn"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <stat.icon className="w-8 h-8 text-secondary-400 mb-3" />
                  <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 mb-3">
              Why Choose Us?
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Comprehensive education with modern facilities and dedicated faculty
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-primary-200 animate-fadeIn"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notices & Events */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Notices */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-primary-600" />
                  Latest Notices
                </h2>
                <button
                  onClick={() => onNavigate('notices')}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-xl shimmer" />
                  ))
                ) : notices.length > 0 ? (
                  notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-primary-200 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => onNavigate('notices')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                              {notice.category}
                            </span>
                            {notice.isNew && (
                              <span className="px-2 py-0.5 rounded-md bg-error-500 text-white text-xs font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{notice.title}</h3>
                          {notice.date && <p className="text-xs text-slate-400 mt-1">{notice.date}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No notices available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-accent-600" />
                  Upcoming Events
                </h2>
                <button
                  onClick={() => onNavigate('events')}
                  className="text-sm text-accent-600 font-medium hover:text-accent-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-xl shimmer" />
                  ))
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-accent-50 rounded-xl p-4 border border-accent-100 hover:border-accent-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => onNavigate('events')}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-accent-200 text-accent-800 text-xs font-medium">
                          {event.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-primary-100 text-primary-700 text-xs font-medium">
                          {event.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">{event.title}</h3>
                      {event.venue && <p className="text-xs text-slate-500 mt-1">{event.venue}</p>}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    No upcoming events.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Library className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Join Our School?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Apply online for admission today. Our team will contact you with all the details.
          </p>
          <button
            onClick={() => onNavigate('admission')}
            className="px-8 py-4 rounded-xl bg-secondary-500 text-white font-bold hover:bg-secondary-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
          >
            Start Admission Application
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
