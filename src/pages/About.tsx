import { GraduationCap, BookOpen, Trophy, Bus, Heart, Target, Eye, Users } from 'lucide-react';
import type { Page } from '../types';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const values = [
    { icon: Target, title: 'Our Mission', desc: 'To provide holistic education that empowers students with knowledge, skills, and values to become responsible citizens.' },
    { icon: Eye, title: 'Our Vision', desc: 'To be a center of academic excellence, nurturing future leaders who contribute positively to society.' },
    { icon: Heart, title: 'Our Values', desc: 'Integrity, respect, discipline, and a commitment to continuous learning and growth.' },
  ];

  const facilities = [
    { icon: BookOpen, title: 'Well-Stocked Library' },
    { icon: Trophy, title: 'Sports Ground' },
    { icon: Users, title: 'Smart Classrooms' },
    { icon: Bus, title: 'Transport Service' },
  ];

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-primary-800 to-primary-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-8 h-8 text-secondary-400" />
            <h1 className="text-3xl font-extrabold text-white">About Our School</h1>
          </div>
          <p className="text-blue-200">Learn about our journey, mission, and commitment to education</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Adarsh Vidya Mandir Sr. Sec. School</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Located in Meerpur Kaurali, Palwal, Haryana, Adarsh Vidya Mandir Senior Secondary School
              is a premier educational institution affiliated with the Haryana Board of School Education (HBSE).
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              We offer education from Nursery to 12th standard with Science, Commerce, and Arts streams
              at the senior secondary level. Our experienced faculty and modern facilities ensure that
              every student receives quality education in a nurturing environment.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We are committed to academic excellence, character development, and preparing our students
              to face the challenges of tomorrow with confidence and competence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {facilities.map((f, i) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center animate-scaleIn" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-3">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {values.map((val, i) => (
            <div key={val.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
                <val.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{val.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl p-8 lg:p-12 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-4">Want to know more?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Explore our achievements, events, and gallery, or apply for admission today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => onNavigate('achievers')} className="px-6 py-3 rounded-xl bg-secondary-500 text-white font-semibold hover:bg-secondary-600 transition-colors">
              View Achievers
            </button>
            <button onClick={() => onNavigate('admission')} className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-colors">
              Apply for Admission
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
