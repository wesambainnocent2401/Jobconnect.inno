/**
 * Job Details Page with Full Job Overview, WhatsApp Share, and Pre-filled Application Form
 */

import React, { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Award,
  Clock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Shield,
  Send
} from 'lucide-react';
import { Job, User, EducationLevel } from '../types';
import { store } from '../lib/storage';
import { formatKSh, formatNairobiDate, isJobCurrentlyOpen } from '../lib/kenyaData';
import { EDUCATION_HIERARCHY } from '../lib/scoring';
import { WhatsAppShareButton } from '../components/WhatsAppShareButton';
import { PassportPhotoCropper } from '../components/PassportPhotoCropper';
import { SEOJobPosting } from '../components/SEOJobPosting';

interface JobDetailsPageProps {
  jobId: string;
  currentUser: User | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({
  jobId,
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const job = store.getJobById(jobId);
  const isOpen = job ? isJobCurrentlyOpen(job.status, job.deadline) : false;

  // Check if currently logged in user already applied
  const existingApps = currentUser ? store.getMyApplications(currentUser.id) : [];
  const existingApp = existingApps.find(a => a.job_id === jobId);

  // Profile data for pre-fill
  const profile = currentUser ? store.getProfile(currentUser.id) : null;

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [education, setEducation] = useState<EducationLevel>(profile?.education || 'Diploma');
  const [experienceYears, setExperienceYears] = useState<number>(profile?.experience_years ?? 1);
  const [skills, setSkills] = useState<string>((profile?.skills || []).join(', '));
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url || '');
  const [coverMessage, setCoverMessage] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      if (profile) {
        if (profile.education && profile.education !== 'Any') setEducation(profile.education);
        if (profile.experience_years !== undefined) setExperienceYears(profile.experience_years);
        if (profile.skills && profile.skills.length > 0) setSkills(profile.skills.join(', '));
        if (profile.portfolio_url) setPortfolioUrl(profile.portfolio_url);
      }
    }
  }, [currentUser, profile]);

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Job Not Found</h2>
        <p className="text-sm text-[#b9b09a] mb-6">The job you are looking for does not exist or has been removed.</p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold px-6 py-2.5 text-sm"
        >
          Back to Open Jobs
        </button>
      </div>
    );
  }

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    if (currentUser.role !== 'jobseeker') {
      setSubmitError('Employers cannot submit job applications. Please sign in with a job seeker account.');
      return;
    }

    if (!photoUrl) {
      setSubmitError('A passport-size photo (350x450 JPEG) is required to apply for this job.');
      return;
    }

    if (!coverMessage.trim()) {
      setSubmitError('Please provide a brief statement on why you are suitable for this position.');
      return;
    }

    setSubmitting(true);

    const skillsArray = skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const result = store.applyForJob({
      job_id: job.id,
      applicant_id: currentUser.id,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      education,
      experience_years: Number(experienceYears) || 0,
      skills: skillsArray,
      portfolio_url: portfolioUrl.trim() || undefined,
      cover_message: coverMessage.trim(),
      photo_url: photoUrl
    });

    setSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
      // Automatically redirect to My Applications after brief moment
      setTimeout(() => {
        onNavigate('my-applications');
      }, 1500);
    } else {
      setSubmitError(result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Schema.org JobPosting for Google Jobs */}
      <SEOJobPosting job={job} />

      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs text-[#b9b09a] hover:text-[#f5d77a] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all jobs</span>
      </button>

      {/* Main Job Header Card */}
      <div className="card-gold p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company_name}
                className="w-16 h-16 rounded-xl object-cover border border-[#d4af37]/30 bg-neutral-900 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#1d1b24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#1a1921] text-[#f5d77a] border border-[#d4af37]/30">
                  {job.employment_type}
                </span>

                {isOpen ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                    Open for Applications
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-neutral-900 text-neutral-400 border border-neutral-700">
                    Applications Closed
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f3eee0]">
                {job.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-[#b9b09a] mt-1.5 flex-wrap">
                <span className="text-[#f5d77a] font-medium flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-[#d4af37]" />
                  {job.company_name}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  {job.location}
                </span>
                {job.company_website && (
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1"
                  >
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
            <WhatsAppShareButton job={job} />
          </div>
        </div>

        {/* Key Job Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#100f13] border border-white/5 text-xs">
          <div>
            <span className="text-[#b9b09a] block">Monthly Pay</span>
            <span className="font-semibold text-sm sm:text-base text-[#f5d77a] mt-0.5 block">
              {formatKSh(job.salary)}
            </span>
          </div>

          <div>
            <span className="text-[#b9b09a] block">Positions Available</span>
            <span className="font-semibold text-sm sm:text-base text-[#f3eee0] mt-0.5 block">
              {job.positions} {job.positions === 1 ? 'vacancy' : 'vacancies'}
            </span>
          </div>

          <div>
            <span className="text-[#b9b09a] block">Min Qualification</span>
            <span className="font-semibold text-sm sm:text-base text-[#f3eee0] mt-0.5 block">
              {job.min_education}
            </span>
          </div>

          <div>
            <span className="text-[#b9b09a] block">Deadline (Nairobi)</span>
            <span className="font-semibold text-sm sm:text-base text-[#f3eee0] mt-0.5 block">
              {formatNairobiDate(job.deadline)}
            </span>
          </div>
        </div>

        {/* Job Selection Algorithm Hint */}
        <div className="mt-4 p-3 rounded-lg bg-[#d4af37]/5 border border-[#d4af37]/20 flex items-start gap-2.5 text-xs text-[#f3eee0]">
          <Award className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <p className="text-[#b9b09a]">
            <strong>Merit-Based Selection Notice:</strong> If more candidates apply than the {job.positions} open {job.positions === 1 ? 'position' : 'positions'}, JobConnect automatically scores qualification criteria (skills, years of experience, and education level) and ranks the top candidates for the employer.
          </p>
        </div>

        {/* Detailed Description */}
        <div className="mt-8 space-y-6 text-sm text-[#f3eee0] leading-relaxed">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-2">Job Description</h3>
            <p className="whitespace-pre-line text-[#b9b09a]">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div>
              <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-2">Key Responsibilities</h3>
              <p className="whitespace-pre-line text-[#b9b09a]">{job.responsibilities}</p>
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-2">Benefits & Compensation</h3>
              <p className="whitespace-pre-line text-[#b9b09a]">{job.benefits}</p>
            </div>
          )}

          {/* Candidate Requirements */}
          <div className="pt-4 border-t border-white/5">
            <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-3">Requirements & Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                <span className="text-neutral-400 block mb-1">Required Skills:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {job.required_skills && job.required_skills.length > 0 ? (
                    job.required_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#18171d] text-[#f5d77a] border border-[#d4af37]/30">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-500">None specified (all applicants awarded 50 pts)</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800">
                <span className="text-neutral-400 block mb-1">Experience & Education:</span>
                <p className="text-neutral-200">
                  Minimum <strong>{job.min_experience_years} years</strong> experience required.
                </p>
                <p className="text-neutral-200 mt-1">
                  Education Level: <strong>{job.min_education}</strong> or above.
                </p>
                {job.certifications && (
                  <p className="text-neutral-400 mt-1">Certifications: {job.certifications}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Area */}
      <div id="apply-section" className="card-gold p-6 sm:p-8">
        <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f5d77a]">
              Apply for this Position
            </h2>
            <p className="text-xs text-[#b9b09a] mt-0.5">
              Profile details are automatically pre-filled. Attach your verified 7:9 passport photo.
            </p>
          </div>
          <span className="text-xs text-neutral-400">1 Application per Job</span>
        </div>

        {/* State 1: Job Closed or Expired */}
        {!isOpen ? (
          <div className="p-6 text-center bg-neutral-900/60 border border-neutral-800 rounded-xl">
            <Clock className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-neutral-300">
              This job is no longer accepting applications
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              The application deadline has passed or the employer has closed the position.
            </p>
          </div>
        ) : existingApp ? (
          /* State 2: Already Applied */
          <div className="p-6 bg-[#16151c] border border-emerald-500/40 rounded-xl">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-emerald-400">
                  You Have Already Applied
                </h3>
                <p className="text-xs text-[#b9b09a] mt-1 leading-relaxed">
                  Your application and passport photo were submitted on {formatNairobiDate(existingApp.created_at)}. Your current qualification match score is <strong className="text-[#f5d77a]">{existingApp.match_score}/100</strong>.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('my-applications')}
                    className="btn-gold text-xs px-4 py-2"
                  >
                    Track in My Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !currentUser ? (
          /* State 3: Not Logged In */
          <div className="p-6 bg-neutral-900/80 border border-[#d4af37]/30 rounded-xl text-center">
            <Shield className="w-10 h-10 text-[#d4af37] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-1">
              Sign In to Apply
            </h3>
            <p className="text-xs text-[#b9b09a] max-w-md mx-auto mb-5">
              To apply for this opportunity with your passport photo and track your automated selection ranking, please sign in or register for free.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="btn-gold-outline text-xs px-5 py-2.5"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="btn-gold text-xs px-5 py-2.5"
              >
                Create Candidate Account
              </button>
            </div>
          </div>
        ) : currentUser.role !== 'jobseeker' ? (
          /* State 4: Logged in as Employer or Admin */
          <div className="p-6 bg-neutral-900/80 border border-amber-500/30 rounded-xl text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="font-serif text-base font-bold text-amber-300">
              Employer Account Detected
            </h3>
            <p className="text-xs text-[#b9b09a] mt-1">
              You are signed in as an {currentUser.role}. Employers cannot submit job applications. Please use a job seeker account to apply.
            </p>
          </div>
        ) : (
          /* State 5: Active Job Seeker Application Form */
          <form onSubmit={handleApplySubmit} className="space-y-6">
            {submitError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-start gap-2.5 text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Application submitted successfully! Redirecting to My Applications...</span>
              </div>
            )}

            {/* Passport Photo Upload & Crop (Required) */}
            <div className="p-4 bg-[#111015] border border-[#d4af37]/30 rounded-xl">
              <label className="block text-xs font-semibold text-[#f5d77a] mb-1">
                Passport-Size Photograph (Required) *
              </label>
              <p className="text-[11px] text-[#b9b09a] mb-3">
                Strict Kenya standard 7:9 ratio (350x450 JPEG). Protected by Kenya Data Protection Act 2019 — visible only to you and the employer.
              </p>
              <PassportPhotoCropper
                value={photoUrl}
                onChange={url => setPhotoUrl(url)}
                required={true}
              />
            </div>

            {/* Contact Details Pre-filled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input-gold w-full px-3 py-2 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Phone Number (Kenyan Format) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input-gold w-full px-3 py-2 text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-gold w-full px-3 py-2 text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Portfolio / Work Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  className="input-gold w-full px-3 py-2 text-base"
                />
              </div>
            </div>

            {/* Qualifications for Scoring */}
            <div className="p-4 bg-[#111015] border border-white/5 rounded-xl space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#f5d77a]">
                Qualification Matching Criteria
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#b9b09a] mb-1">
                    Highest Education Attained *
                  </label>
                  <select
                    value={education}
                    onChange={e => setEducation(e.target.value as EducationLevel)}
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
                  <label className="block text-xs font-medium text-[#b9b09a] mb-1">
                    Total Work Experience (Years) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    required
                    value={experienceYears}
                    onChange={e => setExperienceYears(parseFloat(e.target.value) || 0)}
                    className="input-gold w-full px-3 py-2 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#b9b09a] mb-1">
                  Relevant Skills (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  placeholder="e.g. wiring, repair, diagnostics"
                  className="input-gold w-full px-3 py-2 text-base"
                />
                <span className="text-[11px] text-neutral-500 mt-0.5 block">
                  Job requires: {job.required_skills?.join(', ') || 'Any skills'}
                </span>
              </div>
            </div>

            {/* Why are you suitable */}
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Why are you suitable for this job? *
              </label>
              <textarea
                required
                rows={4}
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value)}
                placeholder="Explain your relevant achievements, availability, and why you are the best fit for this role..."
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || submitSuccess}
                className="btn-gold w-full py-3 text-sm font-semibold"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Application & Passport Photo'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
