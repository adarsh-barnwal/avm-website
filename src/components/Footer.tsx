import { GraduationCap, MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react';
import type { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Adarsh Vidya Mandir</h3>
                <p className="text-xs text-slate-400">Sr. Sec. School, Palwal</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Nurturing young minds with quality education, strong values, and a commitment to excellence since our founding.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', page: 'home' as Page },
                { label: 'Notices', page: 'notices' as Page },
                { label: 'Admissions', page: 'admission' as Page },
                { label: 'Achievers', page: 'achievers' as Page },
                { label: 'Gallery', page: 'gallery' as Page },
                { label: 'Events', page: 'events' as Page },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-sm text-slate-400 hover:text-secondary-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-400" />
                <span>Meerpur Kaurali, Palwal, Haryana</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary-400" />
                <span>info@adarshvidyamandir.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Affiliation</h4>
            <p className="text-sm text-slate-400 mb-2">
              Affiliated with Haryana Board of School Education (HBSE)
            </p>
            <p className="text-sm text-slate-400">
              Classes: Nursery to 12th<br />
              Streams: Science, Commerce, Arts
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-error-500 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Adarsh Vidya Mandir Sr. Sec. School. All rights reserved.
          </p>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs text-slate-500 hover:text-secondary-400 transition-colors"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </footer>
  );
}
