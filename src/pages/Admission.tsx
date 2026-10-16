import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Admission as AdmissionType } from '../types';
import { ClipboardList, CheckCircle2, User, Phone, MapPin, Bus, Loader2 } from 'lucide-react';

const classes = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const streams = ['N/A', 'Science', 'Commerce', 'Arts'];

export default function Admission() {
  const [form, setForm] = useState({
    studentName: '', parentName: '', phone: '', classGrade: '',
    stream: 'N/A', village: '', needBus: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.parentName || !form.phone || !form.classGrade) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const data: Omit<AdmissionType, 'id'> = {
        ...form,
        status: 'New',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'admissions'), data);
      setSuccess(true);
      setForm({ studentName: '', parentName: '', phone: '', classGrade: '', stream: 'N/A', village: '', needBus: false });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center mx-auto mb-6 animate-scaleIn">
            <CheckCircle2 className="w-10 h-10 text-accent-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Application Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for your interest. Our team will contact you soon with further details about the admission process.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn min-h-screen">
      <div className="bg-gradient-to-br from-primary-800 to-primary-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-8 h-8 text-secondary-400" />
            <h1 className="text-3xl font-extrabold text-white">Online Admission</h1>
          </div>
          <p className="text-blue-200">Fill out the form below to apply for admission</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-100 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Student Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={form.studentName}
                onChange={e => handleChange('studentName', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Enter student's full name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Parent/Guardian Name *</label>
            <input
              type="text"
              value={form.parentName}
              onChange={e => handleChange('parentName', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              placeholder="Enter parent or guardian name"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Contact Number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Class Applying For *</label>
              <select
                value={form.classGrade}
                onChange={e => handleChange('classGrade', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                <option value="">Select class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Stream (11th/12th only)</label>
              <select
                value={form.stream}
                onChange={e => handleChange('stream', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
              >
                {streams.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Village / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={form.village}
                onChange={e => handleChange('village', e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                placeholder="Enter village or address"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={form.needBus}
              onChange={e => handleChange('needBus', e.target.checked)}
              className="w-5 h-5 rounded accent-primary-600"
            />
            <Bus className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-slate-700">I need school bus transport facility</span>
          </label>

          {error && (
            <div className="p-3 rounded-xl bg-error-500/10 text-error-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
