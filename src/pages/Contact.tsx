import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'test'), { ...form, type: 'contact', createdAt: new Date().toISOString() });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      // offline
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: 'Meerpur Kaurali, Palwal, Haryana' },
    { icon: Phone, label: 'Phone', value: '+91 99999 99999' },
    { icon: Mail, label: 'Email', value: 'info@adarshvidyamandir.in' },
    { icon: Clock, label: 'Office Hours', value: 'Mon - Sat: 8:00 AM - 3:00 PM' },
  ];

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-primary-800 to-primary-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-secondary-400" />
            <h1 className="text-3xl font-extrabold text-white">Contact Us</h1>
          </div>
          <p className="text-blue-200">Get in touch with us for any queries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map(info => (
                <div key={info.label} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">{info.label}</h3>
                    <p className="text-sm text-slate-500">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {sent ? (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center">
                <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-4">We'll get back to you as soon as possible.</p>
                <button onClick={() => setSent(false)} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Send a Message</h2>
                <p className="text-sm text-slate-500 mb-4">Fill out the form and we'll respond shortly.</p>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Your Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Enter your name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    placeholder="Enter your email" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                    placeholder="Type your message here" />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
