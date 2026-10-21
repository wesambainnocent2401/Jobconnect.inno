/**
 * JobConnect Kenya - Privacy Policy (Kenya Data Protection Act 2019 Compliant)
 */

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Trash2, Eye } from 'lucide-react';
import { store } from '../lib/storage';

interface PrivacyPolicyPageProps {
  onNavigate: (view: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const settings = store.getSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs text-[#b9b09a] hover:text-[#f5d77a] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="card-gold p-6 sm:p-10 space-y-6 text-sm text-[#f3eee0] leading-relaxed">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Data Protection Notice
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#b9b09a] mt-1">
            Pursuant to the Kenya Data Protection Act, No. 24 of 2019 (Office of the Data Protection Commissioner - ODPC).
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">1. What Personal Data We Collect</h2>
          <p className="text-[#b9b09a]">
            When you register and use JobConnect Kenya, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#b9b09a]">
            <li><strong>Identity & Contact Details:</strong> Full legal name, Kenyan mobile phone number, email address, and residential county/town.</li>
            <li><strong>Candidate Credentials:</strong> Highest level of education, fields of study, verified work experience years, skills inventory, and referee details.</li>
            <li><strong>Passport Photographs:</strong> Standard 7:9 ratio (350x450 JPEG) photographs required for candidate verification.</li>
            <li><strong>Transaction Records:</strong> Safaricom M-Pesa transaction reference codes and phone numbers for featured job listings.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">2. Why We Collect Data & How It Is Used</h2>
          <p className="text-[#b9b09a]">
            Your data is used strictly to provide automated qualification matching, enable employers to contact eligible candidates, verify candidate authenticity, and send status notifications regarding your applications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">3. Who Can See Your Information & Passport Photos</h2>
          <p className="text-[#b9b09a]">
            In strict adherence to KDPA principles:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#b9b09a]">
            <li><strong>Passport photographs are never public.</strong> Only the specific verified employer whose job you actively apply to, and platform system administrators, can view your passport photo and application credentials.</li>
            <li>Other job seekers and unauthorized third parties can never view your applications, scores, contact details, or photos.</li>
            <li>We do not sell, rent, or lease personal data to marketing brokers.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">4. Data Retention & Your Right to Deletion (Section 40 KDPA)</h2>
          <p className="text-[#b9b09a]">
            You have the absolute right under Kenyan law to access, rectify, or request immediate erasure of your personal data. You can exercise this directly by clicking the <strong>"Delete my account and data"</strong> button located in your Profile settings, or by emailing our Data Protection Officer. Deletion permanently erases your account, applications, and photos from our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">5. Security Safeguards</h2>
          <p className="text-[#b9b09a]">
            JobConnect implements robust encryption, rate-limiting, secure server-side role validation, and HTTP-only session safeguards to prevent unauthorized access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">6. Contact the Data Protection Officer</h2>
          <p className="text-[#b9b09a]">
            For privacy inquiries or compliance notices:
          </p>
          <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs space-y-1">
            <p>Email: <strong className="text-[#f5d77a]">{settings.supportEmail}</strong></p>
            <p>Phone: <strong className="text-[#f5d77a]">{settings.supportPhone}</strong></p>
            <p>Location: <span className="text-neutral-300">Nairobi, Kenya</span></p>
          </div>
        </section>
      </div>
    </div>
  );
};
