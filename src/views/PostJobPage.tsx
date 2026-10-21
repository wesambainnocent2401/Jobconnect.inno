/**
 * Post & Edit Job View (Employers Only)
 * 
 * Form sections grouped into dark cards with gold headings:
 * 1. Company Information
 * 2. Job Information (Positions with automated selection hint)
 * 3. Candidate Requirements
 * 4. Job Details
 */

import React, { useState, useEffect } from 'react';
import { Building2, Briefcase, Award, FileText, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { EducationLevel, EmploymentType, Job, User } from '../types';
import { LocationInput } from '../components/LocationInput';
import { store } from '../lib/storage';
import { EDUCATION_HIERARCHY } from '../lib/scoring';

interface PostJobPageProps {
  currentUser: User | null;
  editJobId?: string | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const PostJobPage: React.FC<PostJobPageProps> = ({
  currentUser,
  editJobId,
  onNavigate,
  onOpenAuth
}) => {
  const existingJob = editJobId ? store.getJobById(editJobId) : null;

  // Form states
  const [companyName, setCompanyName] = useState(existingJob?.company_name || currentUser?.name || '');
  const [companyEmail, setCompanyEmail] = useState(existingJob?.company_email || currentUser?.email || '');
  const [companyWebsite, setCompanyWebsite] = useState(existingJob?.company_website || '');
  const [companyLocation, setCompanyLocation] = useState(existingJob?.company_location || 'Nairobi');
  const [companyDescription, setCompanyDescription] = useState(existingJob?.company_description || '');
  const [companyLogoUrl, setCompanyLogoUrl] = useState(existingJob?.company_logo_url || '');

  const [title, setTitle] = useState(existingJob?.title || '');
  const [location, setLocation] = useState(existingJob?.location || 'Nairobi CBD');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(existingJob?.employment_type || 'Full-time');
  const [salary, setSalary] = useState(existingJob?.salary || 'KSh 50,000 - 75,000');
  const [positions, setPositions] = useState<number>(existingJob?.positions ?? 1);
  const [deadline, setDeadline] = useState(existingJob?.deadline || '');

  const [minEducation, setMinEducation] = useState<EducationLevel>(existingJob?.min_education || 'Diploma');
  const [minExperienceYears, setMinExperienceYears] = useState<number>(existingJob?.min_experience_years ?? 1);
  const [requiredSkills, setRequiredSkills] = useState((existingJob?.required_skills || []).join(', '));
  const [certifications, setCertifications] = useState(existingJob?.certifications || '');

  const [description, setDescription] = useState(existingJob?.description || '');
  const [responsibilities, setResponsibilities] = useState(existingJob?.responsibilities || '');
  const [benefits, setBenefits] = useState(existingJob?.benefits || '');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Authentication & Role Check
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Employer Sign In Required</h2>
        <p className="text-sm text-[#b9b09a] mb-6">
          To post opportunities and receive automated candidate rankings, please sign in with an employer account.
        </p>
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Sign In as Employer
        </button>
      </div>
    );
  }

  if (currentUser.role === 'jobseeker') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Job Seeker Account</h2>
        <p className="text-sm text-[#b9b09a] mb-6">
          Posting jobs is reserved for registered employers. Please register or switch to an employer account.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Explore Open Vacancies
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !companyName.trim() || !description.trim()) {
      setError('Please fill in all required fields (Job Title, Company Name, and Description).');
      return;
    }

    if (positions < 1) {
      setError('Number of positions must be at least 1.');
      return;
    }

    const skillsArray = requiredSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (existingJob) {
      // Edit existing job
      const res = store.updateJob(existingJob.id, currentUser.id, {
        company_name: companyName.trim(),
        company_email: companyEmail.trim(),
        company_website: companyWebsite.trim() || undefined,
        company_location: companyLocation.trim(),
        company_description: companyDescription.trim() || undefined,
        company_logo_url: companyLogoUrl.trim() || undefined,
        title: title.trim(),
        location: location.trim(),
        employment_type: employmentType,
        salary: salary.trim() || undefined,
        positions: Number(positions),
        deadline: deadline || undefined,
        min_education: minEducation,
        min_experience_years: Number(minExperienceYears) || 0,
        required_skills: skillsArray,
        certifications: certifications.trim() || undefined,
        description: description.trim(),
        responsibilities: responsibilities.trim() || undefined,
        benefits: benefits.trim() || undefined
      });

      if (!res.success) {
        setError(res.message || 'Failed to update job.');
        return;
      }
    } else {
      // Create new job
      store.createJob({
        employer_id: currentUser.id,
        company_name: companyName.trim(),
        company_email: companyEmail.trim(),
        company_website: companyWebsite.trim() || undefined,
        company_location: companyLocation.trim(),
        company_description: companyDescription.trim() || undefined,
        company_logo_url: companyLogoUrl.trim() || undefined,
        title: title.trim(),
        location: location.trim(),
        employment_type: employmentType,
        salary: salary.trim() || undefined,
        positions: Number(positions),
        deadline: deadline || undefined,
        min_education: minEducation,
        min_experience_years: Number(minExperienceYears) || 0,
        required_skills: skillsArray,
        certifications: certifications.trim() || undefined,
        description: description.trim(),
        responsibilities: responsibilities.trim() || undefined,
        benefits: benefits.trim() || undefined,
        status: 'open'
      });
    }

    setSuccess(true);
    setTimeout(() => {
      onNavigate('my-jobs');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        type="button"
        onClick={() => onNavigate('my-jobs')}
        className="inline-flex items-center gap-1.5 text-xs text-[#b9b09a] hover:text-[#f5d77a] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Jobs</span>
      </button>

      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
          {existingJob ? 'Edit Job Posting' : 'Post a New Job Opportunity'}
        </h1>
        <p className="text-sm text-[#b9b09a] mt-1">
          Post your vacancy across Kenya. JobConnect automatically ranks candidates when more people apply than available positions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-3 text-xs text-rose-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-start gap-3 text-xs text-emerald-300">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{existingJob ? 'Job updated successfully!' : 'Job posted successfully! Redirecting to My Jobs...'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Company Information */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Building2 className="w-5 h-5 text-[#d4af37]" />
            1. Company Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Company / Organization Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Company Hiring Email *
              </label>
              <input
                type="email"
                required
                value={companyEmail}
                onChange={e => setCompanyEmail(e.target.value)}
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Company Website (Optional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={companyWebsite}
                onChange={e => setCompanyWebsite(e.target.value)}
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Headquarters / Office Location *
              </label>
              <LocationInput
                value={companyLocation}
                onChange={setCompanyLocation}
                placeholder="e.g. Westlands, Nairobi"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              About the Company (Brief)
            </label>
            <textarea
              rows={2}
              value={companyDescription}
              onChange={e => setCompanyDescription(e.target.value)}
              placeholder="Tell candidates what makes your organization great..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>
        </div>

        {/* Card 2: Job Information */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Briefcase className="w-5 h-5 text-[#d4af37]" />
            2. Job Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Electrical Field Technician"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Work Location (Kenyan County or Town) *
              </label>
              <LocationInput
                value={location}
                onChange={setLocation}
                placeholder="e.g. Nairobi CBD or Mombasa Island"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Employment Type *
              </label>
              <select
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value as EmploymentType)}
                className="input-gold w-full px-3 py-2 text-base"
              >
                <option value="Full-time" className="bg-neutral-900">Full-time</option>
                <option value="Part-time" className="bg-neutral-900">Part-time</option>
                <option value="Contract" className="bg-neutral-900">Contract</option>
                <option value="Internship" className="bg-neutral-900">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Salary / Pay (KSh)
              </label>
              <input
                type="text"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="e.g. KSh 60,000 - 80,000"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Number of Positions *
              </label>
              <input
                type="number"
                min="1"
                required
                value={positions}
                onChange={e => setPositions(parseInt(e.target.value) || 1)}
                className="input-gold w-full px-3 py-2 text-base"
              />
              <span className="text-[11px] text-[#f5d77a]/90 mt-1 block">
                💡 <em>If more people apply than this number, the best-qualified applicants are selected automatically.</em>
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Application Deadline (Optional, Nairobi Date)
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Candidate Requirements */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-[#d4af37]" />
            3. Candidate Requirements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Minimum Education Level *
              </label>
              <select
                value={minEducation}
                onChange={e => setMinEducation(e.target.value as EducationLevel)}
                className="input-gold w-full px-3 py-2 text-base"
              >
                {EDUCATION_HIERARCHY.map(level => (
                  <option key={level} value={level} className="bg-neutral-900">
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Minimum Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                required
                value={minExperienceYears}
                onChange={e => setMinExperienceYears(parseFloat(e.target.value) || 0)}
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Required Skills (Comma-separated) *
            </label>
            <input
              type="text"
              required
              value={requiredSkills}
              onChange={e => setRequiredSkills(e.target.value)}
              placeholder="e.g. wiring, repair"
              className="input-gold w-full px-3 py-2 text-base"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Hint: Enter skills separated by commas. Used by algorithm to match candidate skills (50 points).
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Required Certifications / Licenses (Optional)
            </label>
            <input
              type="text"
              value={certifications}
              onChange={e => setCertifications(e.target.value)}
              placeholder="e.g. EPRA License Class C or KRA Tax Compliance"
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>
        </div>

        {/* Card 4: Job Details */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <FileText className="w-5 h-5 text-[#d4af37]" />
            4. Job Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed overview of the role..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Key Responsibilities (Optional)
            </label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={e => setResponsibilities(e.target.value)}
              placeholder="1. Daily site inspection..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Benefits & Perks (Optional)
            </label>
            <textarea
              rows={2}
              value={benefits}
              onChange={e => setBenefits(e.target.value)}
              placeholder="Medical insurance, transport allowance..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('my-jobs')}
            className="btn-gold-outline flex-1 py-3 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-gold flex-1 py-3 text-sm font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>{existingJob ? 'Save Changes' : 'Publish Job Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
