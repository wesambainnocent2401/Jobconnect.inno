/**
 * Employer 'My Jobs' Management View
 */

import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { Job, User } from '../types';
import { store } from '../lib/storage';
import { formatNairobiDate, formatKSh, isJobCurrentlyOpen } from '../lib/kenyaData';

interface MyJobsPageProps {
  currentUser: User | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login') => void;
  onFeatureJob: (jobId: string) => void;
}

export const MyJobsPage: React.FC<MyJobsPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
  onFeatureJob
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Employer Sign In Required</h2>
        <p className="text-sm text-[#b9b09a] mb-6">Please log in to manage your posted jobs.</p>
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

  const jobs = store.getEmployerJobs(currentUser.id);

  const handleToggleStatus = (jobId: string) => {
    store.toggleJobStatus(jobId, currentUser.id);
  };

  const handleDelete = (jobId: string) => {
    store.deleteJob(jobId, currentUser.id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
            Employer Management Console
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            My Posted Jobs
          </h1>
          <p className="text-sm text-[#b9b09a] mt-1">
            Manage your company listings, monitor applicants, and track automated ranking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('employer-dashboard')}
            className="btn-gold-outline text-xs px-4 py-2.5"
          >
            <Layers className="w-4 h-4" />
            <span>Applicant Rankings</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('post-job')}
            className="btn-gold text-xs px-4 py-2.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card-gold p-12 text-center">
          <Briefcase className="w-12 h-12 text-[#d4af37] mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-[#f3eee0] mb-2">
            No Jobs Posted Yet
          </h3>
          <p className="text-xs text-[#b9b09a] max-w-sm mx-auto mb-6">
            Post your first opportunity to receive ranked candidate applications.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('post-job')}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            Post a Job Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => {
            const isOpen = isJobCurrentlyOpen(job.status, job.deadline);
            const isFeatured = job.featured_until && new Date(job.featured_until) > new Date();

            return (
              <div
                key={job.id}
                className="card-gold p-5 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Job Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {/* Status indicator */}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                          isOpen
                            ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                            : 'border-neutral-600 text-neutral-400 bg-neutral-900'
                        }`}
                      >
                        {isOpen ? 'Open' : job.status === 'closed' ? 'Closed' : 'Expired'}
                      </span>

                      {isFeatured && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-gradient-to-r from-[#f5d77a] to-[#d4af37] text-black flex items-center gap-1">
                          <Star className="w-3 h-3 fill-black" />
                          Featured
                        </span>
                      )}

                      <span className="text-xs text-neutral-500">
                        Posted: {formatNairobiDate(job.created_at)}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#f3eee0]">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-[#b9b09a] mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                        {job.location}
                      </span>
                      <span>Type: <strong className="text-[#f5d77a]">{job.employment_type}</strong></span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                        <strong>{job.positions}</strong> {job.positions === 1 ? 'position' : 'positions'}
                      </span>
                      <span className="flex items-center gap-1 text-[#f5d77a]">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        Deadline: {formatNairobiDate(job.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Applicants Metric */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 bg-neutral-900/40 sm:bg-transparent rounded-lg">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#b9b09a] block">Applicants</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#f5d77a]">
                        {job.applicant_count || 0}
                      </span>
                    </div>
                    {job.applicant_count && job.applicant_count > job.positions ? (
                      <span className="text-[10px] text-emerald-400 font-medium">
                        Auto-selection Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500">
                        Needs {Math.max(0, job.positions - (job.applicant_count || 0))} more for auto-pick
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    {/* View Ranked Applicants */}
                    <button
                      type="button"
                      onClick={() => onNavigate('employer-dashboard', job.id)}
                      className="btn-gold-outline text-xs px-3 py-2"
                      title="View and shortlist candidates"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Applicants ({job.applicant_count || 0})</span>
                    </button>

                    {/* Promote / Feature Job */}
                    {!isFeatured && isOpen && (
                      <button
                        type="button"
                        onClick={() => onFeatureJob(job.id)}
                        className="btn-gold text-xs px-3 py-2"
                        title="Promote with M-Pesa"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Feature</span>
                      </button>
                    )}

                    {/* Close / Reopen */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job.id)}
                      className="text-xs px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#b9b09a]"
                    >
                      {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => onNavigate('edit-job', job.id)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#d4af37]"
                      title="Edit Job Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(job.id)}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-500/40 text-rose-400"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirmId === job.id && (
                  <div className="mt-4 p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Are you sure you want to permanently delete this job and all associated applications?</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1 text-xs text-neutral-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Yes, Delete
                      </button>
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
