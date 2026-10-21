/**
 * Employer Dashboard View: Ranked Candidates by Job Group
 * 
 * Implements:
 * - Applications grouped by job (newest first)
 * - Applicants ordered by algorithmic rank
 * - Passport photo preview
 * - Match score breakdown
 * - Manual Shortlist button (does not override automated ranking)
 * - Strict employer access restriction
 */

import React, { useState } from 'react';
import {
  Users,
  Award,
  Star,
  CheckCircle,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Calendar,
  Info,
  Shield,
  Filter
} from 'lucide-react';
import { Job, User, Application } from '../types';
import { store } from '../lib/storage';
import { formatNairobiDate, formatKSh } from '../lib/kenyaData';
import { getApplicantDisplayStatus } from '../lib/scoring';

interface EmployerDashboardPageProps {
  currentUser: User | null;
  targetJobId?: string | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const EmployerDashboardPage: React.FC<EmployerDashboardPageProps> = ({
  currentUser,
  targetJobId,
  onNavigate,
  onOpenAuth
}) => {
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>(targetJobId || 'all');
  const [expandedApplicantId, setExpandedApplicantId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Sign In Required</h2>
        <p className="text-sm text-[#b9b09a] mb-6">Please log in with your employer account.</p>
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Get jobs belonging to this employer (or all if admin)
  const employerJobs = currentUser.role === 'admin'
    ? store.getAllJobs()
    : store.getEmployerJobs(currentUser.id);

  // Group applications by job
  const jobGroups = employerJobs
    .filter(job => selectedJobFilter === 'all' || job.id === selectedJobFilter)
    .map(job => {
      const apps = store.getEmployerJobApplications(currentUser.id, job.id);
      return {
        job,
        applications: apps
      };
    });

  const handleToggleShortlist = (appId: string) => {
    store.toggleShortlist(appId, currentUser.id);
  };

  const toggleExpand = (id: string) => {
    setExpandedApplicantId(prev => (prev === id ? null : id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            Employer Recruitment Intelligence
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            Ranked Applicant Dashboard
          </h1>
          <p className="text-sm text-[#b9b09a] mt-1">
            Candidates ranked automatically by qualification score, skills match, and verified experience.
          </p>
        </div>

        {/* Filter by Job Dropdown */}
        {employerJobs.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#d4af37]" />
            <select
              value={selectedJobFilter}
              onChange={e => setSelectedJobFilter(e.target.value)}
              className="input-gold px-3 py-2 text-xs"
            >
              <option value="all" className="bg-neutral-900">All My Jobs ({employerJobs.length})</option>
              {employerJobs.map(j => (
                <option key={j.id} value={j.id} className="bg-neutral-900">
                  {j.title} ({j.applicant_count || 0})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {jobGroups.length === 0 ? (
        <div className="card-gold p-12 text-center">
          <Users className="w-12 h-12 text-[#d4af37] mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-[#f3eee0] mb-2">No Active Listings</h3>
          <p className="text-xs text-[#b9b09a] max-w-sm mx-auto mb-6">
            Post a job to begin receiving and ranking candidates automatically.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('post-job')}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {jobGroups.map(({ job, applications }) => {
            const hasMoreThanPositions = applications.length > job.positions;

            return (
              <div key={job.id} className="card-gold p-6 sm:p-8">
                {/* Job Header Summary */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-[#f5d77a] bg-[#1c1b22] px-2.5 py-0.5 rounded border border-[#d4af37]/30">
                        {job.employment_type}
                      </span>
                      <span className="text-xs text-neutral-400">
                        Posted {formatNairobiDate(job.created_at)}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f3eee0]">
                      {job.title}
                    </h2>
                    <p className="text-xs text-[#b9b09a] mt-0.5">
                      {job.company_name} · {job.location} · {formatKSh(job.salary)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-center">
                      <span className="text-neutral-400 block">Positions</span>
                      <span className="font-bold text-base text-[#f3eee0]">{job.positions}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-center">
                      <span className="text-neutral-400 block">Applicants</span>
                      <span className="font-bold text-base text-[#f5d77a]">{applications.length}</span>
                    </div>
                  </div>
                </div>

                {/* Automatic Selection Note */}
                <div className="my-4 p-3.5 rounded-lg bg-[#141319] border border-[#d4af37]/25 flex items-start gap-2.5 text-xs">
                  <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <p className="text-[#b9b09a] leading-relaxed">
                    {hasMoreThanPositions ? (
                      <>
                        <strong className="text-emerald-400">Automatic Selection Active:</strong> Because {applications.length} candidates applied for {job.positions} {job.positions === 1 ? 'position' : 'positions'}, the system has automatically selected the top {job.positions} ranked applicants based on qualification match. You may also manually shortlist candidates below.
                      </>
                    ) : (
                      <>
                        <strong className="text-[#f5d77a]">All Applicants Pending:</strong> You currently have {applications.length} applicant{applications.length === 1 ? '' : 's'} for {job.positions} positions. Automated selection triggers automatically once more candidates apply than available positions.
                      </>
                    )}
                  </p>
                </div>

                {/* Ranked Applicants List */}
                {applications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#b9b09a]">
                    No candidates have applied for this job yet. Candidates will be ranked here in real time as they apply.
                  </div>
                ) : (
                  <div className="space-y-4 mt-6">
                    {applications.map(app => {
                      const displayStatus = getApplicantDisplayStatus(app.status, job.status === 'open');
                      const isExpanded = expandedApplicantId === app.id;
                      const isShortlisted = app.status === 'shortlisted';

                      return (
                        <div
                          key={app.id}
                          className={`p-4 sm:p-5 rounded-xl border transition-all ${
                            isShortlisted
                              ? 'bg-[#1b1912] border-[#f5d77a]/60 shadow-lg'
                              : app.status === 'selected'
                              ? 'bg-[#131714] border-emerald-500/40'
                              : 'bg-[#121115] border-white/5'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            {/* Passport Photo & Main Info */}
                            <div className="flex items-start gap-4">
                              {/* 7:9 Passport Photo */}
                              <div className="relative w-16 h-[82px] sm:w-20 sm:h-[103px] rounded-lg overflow-hidden border border-[#d4af37]/50 shadow shrink-0 bg-neutral-900">
                                {app.photo_url ? (
                                  <img
                                    src={app.photo_url}
                                    alt={app.full_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">
                                    No Photo
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-xs font-bold text-[#f5d77a] bg-[#221f15] px-2 py-0.5 rounded border border-[#d4af37]/30">
                                    Rank #{app.rank} of {app.total_applicants}
                                  </span>

                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${displayStatus.badgeStyle}`}
                                  >
                                    {displayStatus.text}
                                  </span>

                                  {isShortlisted && (
                                    <span className="text-[11px] text-[#f5d77a] font-bold flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-[#f5d77a]" />
                                      Shortlisted
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-serif text-lg font-bold text-[#f3eee0]">
                                  {app.full_name}
                                </h3>

                                <div className="flex items-center gap-3 text-xs text-[#b9b09a] mt-1.5 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="w-3.5 h-3.5 text-[#d4af37]" />
                                    {app.education}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
                                    {app.experience_years} years experience
                                  </span>
                                </div>

                                {/* Skills */}
                                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                                  {app.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-[#b9b09a] border border-neutral-800"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Score & Actions */}
                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                              <div className="text-left md:text-right">
                                <div className="flex items-center gap-1.5 justify-start md:justify-end">
                                  <Award className="w-4 h-4 text-[#d4af37]" />
                                  <span className="font-bold text-lg text-[#f5d77a]">
                                    {app.match_score}/100
                                  </span>
                                </div>
                                <span className="text-[10px] text-neutral-400">
                                  {app.match_score >= 80 ? 'Excellent Match' : app.match_score >= 60 ? 'Good Match' : app.match_score >= 40 ? 'Fair Match' : 'Low Match'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const conv = store.startOrGetConversation(job.id, currentUser.id, app.applicant_id);
                                    onNavigate('messages', conv.id);
                                  }}
                                  className="btn-gold text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-sm"
                                  title="Open direct chat and schedule interview"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  <span>Message &amp; Interview</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleShortlist(app.id)}
                                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                                    isShortlisted
                                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                                      : 'btn-gold-outline text-xs'
                                  }`}
                                >
                                  {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleExpand(app.id)}
                                  className="text-xs p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
                                  title="View full cover message and contact"
                                >
                                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-white/10 text-xs space-y-3 bg-[#0d0c10] p-4 rounded-lg">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <span className="text-neutral-400 font-semibold block mb-1">
                                    Direct Candidate Contact:
                                  </span>
                                  <div className="space-y-1 text-neutral-200">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                                      <a href={`tel:${app.phone}`} className="hover:underline">{app.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                                      <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                                    </div>
                                    {app.portfolio_url && (
                                      <div className="flex items-center gap-2">
                                        <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                                        <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-[#d4af37] hover:underline">
                                          Candidate Portfolio
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <span className="text-neutral-400 font-semibold block mb-1">
                                    Match Score Detail:
                                  </span>
                                  <div className="text-neutral-300 space-y-0.5">
                                    <p>Skills Match: <strong>{app.score_breakdown?.skillsScore ?? 0}</strong> / 50 pts</p>
                                    <p>Experience: <strong>{app.score_breakdown?.experienceScore ?? 0}</strong> / 30 pts</p>
                                    <p>Education: <strong>{app.score_breakdown?.educationScore ?? 0}</strong> / 20 pts</p>
                                  </div>
                                </div>
                              </div>

                              {app.cover_message && (
                                <div className="pt-2 border-t border-white/5">
                                  <span className="text-neutral-400 font-semibold block mb-1">
                                    Cover Message:
                                  </span>
                                  <p className="italic text-neutral-300 bg-neutral-900/60 p-3 rounded-lg border border-neutral-800">
                                    "{app.cover_message}"
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
