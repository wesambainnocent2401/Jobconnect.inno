/**
 * JobCard Component with Luxury Gold Left Border & Kenyan Market Details
 */

import React from 'react';
import { Calendar, MapPin, Briefcase, Users, Star, ArrowRight } from 'lucide-react';
import { Job } from '../types';
import { formatKSh, formatNairobiDate } from '../lib/kenyaData';

interface JobCardProps {
  job: Job;
  onViewJob: (jobId: string) => void;
  showEmployerControls?: boolean;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  onToggleStatus?: (jobId: string) => void;
  onFeature?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onViewJob,
  showEmployerControls = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onFeature
}) => {
  const isFeatured = job.featured_until && new Date(job.featured_until) > new Date();

  return (
    <div
      className={`card-gold relative p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between ${
        isFeatured ? 'border-[#d4af37]/60 ring-1 ring-[#d4af37]/30' : ''
      }`}
    >
      <div>
        {/* Top Header: Badge, Status, and Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-[#f5d77a] to-[#d4af37] text-neutral-950 shadow-sm">
                <Star className="w-3 h-3 fill-neutral-950" />
                Featured
              </span>
            )}
            <span className="text-xs font-medium text-[#b9b09a] uppercase tracking-wider">
              {job.employment_type}
            </span>
          </div>

          <span className="text-xs text-[#b9b09a] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            Apply before: {formatNairobiDate(job.deadline)}
          </span>
        </div>

        {/* Title and Company */}
        <h3
          onClick={() => onViewJob(job.id)}
          className="font-serif text-lg md:text-xl font-bold text-[#f3eee0] hover:text-[#f5d77a] cursor-pointer transition-colors leading-snug"
        >
          {job.title}
        </h3>

        <p className="text-sm font-medium text-[#f5d77a] mt-1 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-[#d4af37]" />
          {job.company_name}
        </p>

        {/* Location & Positions & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-[#b9b09a]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
            <span>
              {job.positions} {job.positions === 1 ? 'position' : 'positions'}
              {job.applicant_count !== undefined && (
                <span className="text-[#f5d77a] font-medium ml-1">
                  ({job.applicant_count} applied)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Salary */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-neutral-500">Pay: </span>
            <span className="text-[#f3eee0] font-semibold">{formatKSh(job.salary)}</span>
          </div>
          {job.min_education && (
            <span className="text-[11px] text-[#b9b09a] bg-neutral-900/60 px-2 py-0.5 rounded border border-neutral-800">
              Min: {job.min_education}
            </span>
          )}
        </div>

        {/* Required Skills Badges */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3">
            {job.required_skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-[#18171d] text-[#b9b09a] border border-[#d4af37]/20"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 3 && (
              <span className="text-[10px] text-neutral-500">
                +{job.required_skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        {showEmployerControls ? (
          <div className="flex items-center gap-2 flex-wrap w-full justify-between">
            <div className="flex items-center gap-1.5">
              {onToggleStatus && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(job.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                    job.status === 'open'
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40'
                      : 'border-neutral-600 text-neutral-400 bg-neutral-900 hover:bg-neutral-800'
                  }`}
                >
                  {job.status === 'open' ? 'Status: Open' : 'Status: Closed'}
                </button>
              )}
              {onFeature && !isFeatured && (
                <button
                  type="button"
                  onClick={() => onFeature(job.id)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-[#d4af37]/10 hover:bg-[#d4af37]/20 text-[#f5d77a] border border-[#d4af37]/30 flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  Feature Job
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(job.id)}
                  className="text-xs text-[#d4af37] hover:underline"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(job.id)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => onViewJob(job.id)}
                className="btn-gold-outline text-xs px-3 py-1.5"
              >
                View
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-neutral-500">
              Automated smart matching enabled
            </span>
            <button
              type="button"
              onClick={() => onViewJob(job.id)}
              className="btn-gold text-xs px-4 py-2"
            >
              <span>View Job</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
