/**
 * JobConnect Kenya - Terms of Use
 */

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { store } from '../lib/storage';

interface TermsPageProps {
  onNavigate: (view: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
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
            <Shield className="w-4 h-4" />
            Legal Agreement
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            Terms of Use
          </h1>
          <p className="text-xs text-[#b9b09a] mt-1">
            Last updated: October 2026 · Governing law: Laws of the Republic of Kenya
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">1. Acceptance of Terms</h2>
          <p className="text-[#b9b09a]">
            Welcome to JobConnect Kenya. By accessing or registering an account on our platform as either a Job Seeker or an Employer, you agree to be legally bound by these Terms of Use and our Privacy Policy in compliance with Kenyan laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">2. Candidate Profiles & Applications</h2>
          <p className="text-[#b9b09a]">
            Job seekers warrant that all submitted details, including educational qualifications, years of experience, skills, and passport photographs, are truthful and authentic. Submitting falsified academic certificates or fraudulent credentials violates Kenyan penal provisions and leads to immediate account termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">3. Automated Qualification Matching & Selection</h2>
          <p className="text-[#b9b09a]">
            JobConnect uses a deterministic algorithm to rank candidate qualifications based on job requirements (Skills up to 50 points, Experience up to 30 points, Education up to 20 points). While automated selection assists employers in identifying high-aptitude candidates when applications exceed vacancies, final hiring decisions, interviews, and contracts remain exclusively between the employer and the candidate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">4. Employer Obligations & Fair Practice</h2>
          <p className="text-[#b9b09a]">
            Employers agree not to charge any interview, application, or processing fees to candidates. Under Kenyan labour laws, charging job seekers recruitment fees is illegal. Listings that violate this will be removed and reported to Kenyan authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">5. Payments & M-Pesa Services</h2>
          <p className="text-[#b9b09a]">
            Featured job placements are paid via Safaricom M-Pesa Till or Daraja STK Push. Fees paid for featured job slots are non-refundable once the promotion is activated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a]">6. Contact & Disputes</h2>
          <p className="text-[#b9b09a]">
            For legal inquiries, contact our compliance team at <strong>{settings.supportEmail}</strong> or call <strong>{settings.supportPhone}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
