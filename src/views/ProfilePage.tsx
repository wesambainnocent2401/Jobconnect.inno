/**
 * Job Seeker Profile Management View
 * 
 * Sections:
 * 1. Personal Information (Kenyan phone, location autocomplete)
 * 2. Education (Primary to PhD, field of study)
 * 3. Skills (comma-separated for matching)
 * 4. Work Experience (years & details)
 * 5. Portfolio Link
 * 6. Reference (referee name, phone, relationship)
 * 7. Kenya Data Protection Act: "Delete my account and data" with confirmation
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Award,
  Link2,
  Users2,
  Trash2,
  Check,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { EducationLevel, Profile, User } from '../types';
import { store } from '../lib/storage';
import { LocationInput } from '../components/LocationInput';
import { EDUCATION_HIERARCHY } from '../lib/scoring';

interface ProfilePageProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const profile = currentUser ? store.getProfile(currentUser.id) : null;

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(profile?.location || 'Westlands, Nairobi');
  const [education, setEducation] = useState<EducationLevel>(profile?.education || 'Diploma');
  const [fieldOfStudy, setFieldOfStudy] = useState(profile?.field_of_study || '');
  const [skills, setSkills] = useState((profile?.skills || []).join(', '));
  const [experienceYears, setExperienceYears] = useState(profile?.experience_years ?? 2);
  const [experienceDetails, setExperienceDetails] = useState(profile?.experience_details || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolio_url || '');

  const [refereeName, setRefereeName] = useState(profile?.referee_name || '');
  const [refereePhone, setRefereePhone] = useState(profile?.referee_phone || '');
  const [refereeRelationship, setRefereeRelationship] = useState(profile?.referee_relationship || '');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Sign In Required</h2>
        <p className="text-sm text-[#b9b09a] mb-6">Please log in to manage your job seeker profile.</p>
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    store.saveProfile(currentUser.id, {
      location,
      education,
      field_of_study: fieldOfStudy.trim(),
      skills: skillsArray,
      experience_years: Number(experienceYears) || 0,
      experience_details: experienceDetails.trim(),
      portfolio_url: portfolioUrl.trim() || undefined,
      referee_name: refereeName.trim() || undefined,
      referee_phone: refereePhone.trim() || undefined,
      referee_relationship: refereeRelationship.trim() || undefined
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteAccount = () => {
    store.deleteAccount(currentUser.id);
    onNavigate('home');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 border-b border-[#d4af37]/20 pb-6">
        <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
          Candidate Portal
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
          Job Seeker Profile
        </h1>
        <p className="text-sm text-[#b9b09a] mt-1">
          Keep your credentials up to date. These details automatically pre-fill all job applications and determine your match ranking.
        </p>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile saved successfully! Job applications will use your updated qualifications.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Personal Information */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <UserIcon className="w-5 h-5 text-[#d4af37]" />
            1. Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Full Legal Name</label>
              <input
                type="text"
                disabled
                value={name}
                className="input-gold w-full px-3 py-2 text-base opacity-75 cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Account name</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="input-gold w-full px-3 py-2 text-base opacity-75 cursor-not-allowed"
              />
              <span className="text-[10px] text-neutral-500 mt-1 block">Used for application notifications</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Phone Number (Kenyan) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Current Location (Kenyan County or Town) *
              </label>
              <LocationInput
                value={location}
                onChange={setLocation}
                placeholder="e.g. Westlands, Nairobi"
                required
              />
            </div>
          </div>
        </div>

        {/* Card 2: Education */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <GraduationCap className="w-5 h-5 text-[#d4af37]" />
            2. Education
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Highest Qualification Attained *
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
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Field of Study / Course
              </label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={e => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Electrical Engineering or Accounting"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Skills */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Award className="w-5 h-5 text-[#d4af37]" />
            3. Skills
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Skills (Comma-separated) *
            </label>
            <input
              type="text"
              required
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. wiring, repair, diagnostics, python"
              className="input-gold w-full px-3 py-2 text-base"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Enter each skill separated by commas. These are directly compared against job required skills (counts up to 50 match points).
            </span>
          </div>
        </div>

        {/* Card 4: Work Experience */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Briefcase className="w-5 h-5 text-[#d4af37]" />
            4. Work Experience
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Total Relevant Experience (Years) *
            </label>
            <input
              type="number"
              min="0"
              max="40"
              step="0.5"
              required
              value={experienceYears}
              onChange={e => setExperienceYears(parseFloat(e.target.value) || 0)}
              className="input-gold w-full px-3 py-2 text-base max-w-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Experience Details & Previous Employers
            </label>
            <textarea
              rows={3}
              value={experienceDetails}
              onChange={e => setExperienceDetails(e.target.value)}
              placeholder="Brief summary of duties and companies you have worked with..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>
        </div>

        {/* Card 5: Portfolio */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Link2 className="w-5 h-5 text-[#d4af37]" />
            5. Portfolio / Work Samples
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Portfolio URL / GitHub / LinkedIn (Optional)
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={e => setPortfolioUrl(e.target.value)}
              placeholder="https://..."
              className="input-gold w-full px-3 py-2 text-base"
            />
          </div>
        </div>

        {/* Card 6: Reference */}
        <div className="card-gold p-6 sm:p-8 space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2 border-b border-white/10 pb-3">
            <Users2 className="w-5 h-5 text-[#d4af37]" />
            6. Professional Reference
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Referee Name</label>
              <input
                type="text"
                value={refereeName}
                onChange={e => setRefereeName(e.target.value)}
                placeholder="e.g. Eng. David Kariuki"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Referee Phone</label>
              <input
                type="tel"
                value={refereePhone}
                onChange={e => setRefereePhone(e.target.value)}
                placeholder="+254 722 000 000"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Relationship</label>
              <input
                type="text"
                value={refereeRelationship}
                onChange={e => setRefereeRelationship(e.target.value)}
                placeholder="e.g. Former Supervisor"
                className="input-gold w-full px-3 py-2 text-base"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete my account and data</span>
          </button>

          <button
            type="submit"
            className="btn-gold px-8 py-3 text-sm font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Delete Account Modal (Kenya Data Protection Act Compliance) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141318] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-[#f3eee0]">
                Delete Account and All Data?
              </h3>
            </div>

            <p className="text-xs text-[#b9b09a] leading-relaxed">
              In accordance with Section 40 of the <strong>Kenya Data Protection Act 2019</strong>, deleting your account permanently erases your profile, uploaded passport photographs, and all submitted job applications from our records.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn-gold-outline text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow"
              >
                Yes, Permanently Delete My Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
