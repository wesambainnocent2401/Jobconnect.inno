/**
 * JobConnect Kenya - Job Seeker Application Tracking System ('My Applications')
 *
 * Requirements:
 * - List of jobs the user has applied for, newest first
 * - Real-time status display:
 *     While open: "Applied", "Shortlisted", "Currently selected", "Currently not selected"
 *     When closed: "Selected", "Not selected", "Shortlisted"
 * - Passport photo preview
 * - Match score indicator (0-100) with skills/exp/edu breakdown
 * - "View Job" button to review job details
 * - Strict security: user only ever sees their own applications
 */

import React, { useState } from 'react';
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { Application, Job, User } from '../types';
import { store } from '../lib/storage';
import { formatKSh, formatNairobiDate, isJobCurrentlyOpen } from '../lib/kenyaData';
import { getApplicantDisplayStatus } from '../lib/scoring';

interface MyApplicationsPageProps {
  currentUser: User | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Guard: Must be logged in
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">
          Track Your Applications
        </h2>
        <p className="text-sm text-[#b9b09a] mb-6">
          Please sign in to your JobConnect job seeker account to view your active applications and track employer selection in real-time.
        </p>
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Sign In to Track Applications
        </button>
      </div>
    );
  }

  // Guard: Job seekers only
  if (currentUser.role !== 'jobseeker') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">
          Employer / Admin Account Active
        </h2>
        <p className="text-sm text-[#b9b09a] mb-6">
          You are currently signed in as an {currentUser.role}. The "My Applications" tracking view is reserved for job seekers.
        </p>
        <button
          type="button"
          onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'employer-dashboard')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Go to {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Applicant Dashboard'}
        </button>
      </div>
    );
  }

  // Securely query store: Only returns applications matching currentUser.id
  const myApplications = store.getMyApplications(currentUser.id);

  const toggleExpand = (appId: string) => {
    setExpandedAppId(prev => (prev === appId ? null : appId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            Candidate Application Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            My Applications
          </h1>
          <p className="text-sm text-[#b9b09a] mt-1">
            Track your job submissions, live automated qualification ranking, and employer shortlisting.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold-outline text-xs px-4 py-2 self-start md:self-auto"
        >
          Explore More Jobs
        </button>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-[#131216] border border-white/5 p-4 rounded-xl">
          <span className="text-xs text-[#b9b09a]">Total Submitted</span>
          <p className="text-2xl font-bold text-[#f3eee0] mt-0.5">{myApplications.length}</p>
        </div>

        <div className="bg-[#131216] border border-white/5 p-4 rounded-xl">
          <span className="text-xs text-emerald-400">Selected / In Top Rank</span>
          <p className="text-2xl font-bold text-emerald-400 mt-0.5">
            {myApplications.filter(a => a.status === 'selected').length}
          </p>
        </div>

        <div className="bg-[#131216] border border-white/5 p-4 rounded-xl">
          <span className="text-xs text-[#f5d77a]">Shortlisted by Employer</span>
          <p className="text-2xl font-bold text-[#f5d77a] mt-0.5">
            {myApplications.filter(a => a.status === 'shortlisted').length}
          </p>
        </div>

        <div className="bg-[#131216] border border-white/5 p-4 rounded-xl">
          <span className="text-xs text-amber-300">Under Review / Pending</span>
          <p className="text-2xl font-bold text-amber-300 mt-0.5">
            {myApplications.filter(a => a.status === 'pending' || a.status === 'not_selected').length}
          </p>
        </div>
      </div>

      {/* Automated Selection Rule Reminder */}
      <div className="mb-6 p-4 rounded-xl bg-[#141319] border border-[#d4af37]/30 flex items-start gap-3 text-xs text-[#f3eee0]">
        <Info className="w-5 h-5 text-[#f5d77a] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#f5d77a]">
            How JobConnect Automated Selection Works:
          </p>
          <p className="text-[#b9b09a] leading-relaxed">
            When more job seekers apply than available positions, our algorithm scores qualification match (skills 50%, experience 30%, education 20%) and automatically marks the top candidates as <strong>"Currently selected"</strong>. As other applicants apply or requirements update, statuses refresh automatically until the employer closes the job.
          </p>
        </div>
      </div>

      {/* Applications List */}
      {myApplications.length === 0 ? (
        <div className="card-gold p-12 text-center my-6">
          <div className="w-16 h-16 rounded-full bg-[#18171d] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#f3eee0] mb-2">
            No Applications Submitted Yet
          </h3>
          <p className="text-sm text-[#b9b09a] max-w-md mx-auto mb-6">
            You haven't applied for any positions yet. Browse open vacancies in Kenya and apply with your passport photograph.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            Find Open Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map(app => {
            const job = app.job;
            const isOpen = job ? isJobCurrentlyOpen(job.status, job.deadline) : false;
            const displayStatus = getApplicantDisplayStatus(app.status, isOpen);
            const isExpanded = expandedAppId === app.id;

            return (
              <div
                key={app.id}
                className="card-gold p-5 transition-all duration-200 hover:border-[#d4af37]/50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Applicant Photo & Job Info */}
                  <div className="flex items-start gap-4">
                    {/* Passport Photo */}
                    <div className="relative w-16 h-[82px] sm:w-20 sm:h-[103px] rounded-lg overflow-hidden border border-[#d4af37]/40 shrink-0 bg-neutral-900 shadow">
                      {app.photo_url ? (
                        <img
                          src={app.photo_url}
                          alt={`${app.full_name} passport photo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] text-center p-1">
                          No Photo
                        </div>
                      )}
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-[#f5d77a] text-center py-0.5">
                        Passport
                      </span>
                    </div>

                    {/* Job Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${displayStatus.badgeStyle}`}
                        >
                          {displayStatus.text}
                        </span>

                        {app.rank && app.total_applicants && (
                          <span className="text-[11px] text-[#f5d77a] font-medium bg-[#1a1921] px-2 py-0.5 rounded border border-[#d4af37]/20">
                            Rank #{app.rank} of {app.total_applicants}
                          </span>
                        )}

                        <span className="text-[11px] text-neutral-500">
                          Applied: {formatNairobiDate(app.created_at)}
                        </span>
                      </div>

                      <h3
                        onClick={() => job && onNavigate('job-details', job.id)}
                        className="font-serif text-lg font-bold text-[#f3eee0] hover:text-[#f5d77a] cursor-pointer transition-colors leading-snug"
                      >
                        {job ? job.title : 'Job Position'}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-[#b9b09a] mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-[#f5d77a] font-medium">
                          <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
                          {job ? job.company_name : 'Employer'}
                        </span>
                        {job && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                            {job.location}
                          </span>
                        )}
                        {job && (
                          <span className="text-neutral-500">
                            Pay: {formatKSh(job.salary)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Match Score Card & Quick Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                    {/* Score badge */}
                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-1.5 justify-start md:justify-end">
                        <Award className="w-4 h-4 text-[#d4af37]" />
                        <span className="text-xs text-[#b9b09a]">Qualification Match:</span>
                        <span className="font-bold text-base text-[#f5d77a]">
                          {app.match_score}/100
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {app.match_score >= 80 && (
                          <span className="text-emerald-400 font-medium">Excellent match</span>
                        )}
                        {app.match_score >= 60 && app.match_score < 80 && (
                          <span className="text-yellow-400 font-medium">Good match</span>
                        )}
                        {app.match_score >= 40 && app.match_score < 60 && (
                          <span className="text-amber-400 font-medium">Fair match</span>
                        )}
                        {app.match_score < 40 && (
                          <span className="text-neutral-400">Low match</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {/* Check if conversation/interview exists */}
                      {store.getConversationsForUser(currentUser.id).some(c => c.job_id === app.job_id) && (
                        <button
                          type="button"
                          onClick={() => {
                            const conv = store.getConversationsForUser(currentUser.id).find(c => c.job_id === app.job_id);
                            if (conv) onNavigate('messages', conv.id);
                          }}
                          className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-sm"
                          title="Chat with employer and view interview details"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Messages &amp; Interview</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(app.id)}
                        className="text-xs text-[#b9b09a] hover:text-[#f5d77a] flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800"
                      >
                        <span>{isExpanded ? 'Less' : 'Breakdown'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {job && (
                        <button
                          type="button"
                          onClick={() => onNavigate('job-details', job.id)}
                          className="btn-gold-outline text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <span>View Job</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Match Breakdown & Cover Note Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 bg-[#100f13]/60 rounded-lg p-4 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-2.5 rounded-lg bg-[#16151c] border border-white/5">
                        <span className="text-neutral-400">Skills Match (50 max):</span>
                        <p className="font-bold text-[#f5d77a] text-sm mt-0.5">
                          {app.score_breakdown?.skillsScore ?? '—'} / 50 pts
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          Applicant skills matched against job requirements.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#16151c] border border-white/5">
                        <span className="text-neutral-400">Experience (30 max):</span>
                        <p className="font-bold text-[#f5d77a] text-sm mt-0.5">
                          {app.score_breakdown?.experienceScore ?? '—'} / 30 pts
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {app.experience_years} years submitted.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#16151c] border border-white/5">
                        <span className="text-neutral-400">Education (20 max):</span>
                        <p className="font-bold text-[#f5d77a] text-sm mt-0.5">
                          {app.score_breakdown?.educationScore ?? '—'} / 20 pts
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          Level: {app.education}
                        </p>
                      </div>
                    </div>

                    {/* Cover Message Submitted */}
                    {app.cover_message && (
                      <div className="pt-2">
                        <span className="text-neutral-400 font-semibold block mb-1">
                          Cover Message to Employer:
                        </span>
                        <p className="text-neutral-300 italic bg-[#15141a] p-3 rounded-lg border border-neutral-800">
                          "{app.cover_message}"
                        </p>
                      </div>
                    )}

                    {/* Submitted details summary */}
                    <div className="flex items-center gap-4 text-neutral-400 pt-1 flex-wrap">
                      <span>Phone: <strong className="text-neutral-200">{app.phone}</strong></span>
                      <span>Email: <strong className="text-neutral-200">{app.email}</strong></span>
                      {app.portfolio_url && (
                        <span>Portfolio: <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-[#d4af37] underline">View Link</a></span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
