'use client';

import React, { useState } from 'react';
import { Mail, Building2, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../../lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Candidate Support', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.submitContact(form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: 'Candidate Support', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Contact Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            We&apos;re Here to Support Your Career Journey
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Have a question about a job listing, employer onboarding, or technical assistance? Send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Candidate &amp; Member Help</p>
                <p className="text-sm font-bold text-gray-900">support@hireloop.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Employer Partnerships</p>
                <p className="text-sm font-bold text-gray-900">partnerships@hireloop.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Operating Hours</p>
                <p className="text-sm font-bold text-gray-900">Monday - Friday: 9am - 6pm EST</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Offices</p>
                <p className="text-sm font-bold text-gray-900">San Francisco, CA &amp; Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h3>
            <p className="text-xs text-gray-500 mb-6">Fill out the form below and we will get back to you shortly.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            {submitted ? (
              <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700">Thank you for contacting HireLoop. Our support team will reply to your email address shortly.</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-emerald-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Topic</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-white"
                  >
                    <option>Candidate Support</option>
                    <option>Employer Partnerships</option>
                    <option>Billing &amp; Subscriptions</option>
                    <option>Feature Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what you need help with..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>{submitting ? 'Sending...' : 'Submit Message'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
