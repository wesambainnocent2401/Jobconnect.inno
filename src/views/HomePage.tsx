/**
 * JobConnect Kenya - Home Page View
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Briefcase,
  UserCheck,
  Building,
  Target,
  Sparkles,
  Filter,
  X,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Job, EmploymentType } from '../types';
import { Logo } from '../components/Logo';
import { JobCard } from '../components/JobCard';
import { store } from '../lib/storage';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCounty, setSelectedCounty] = useState<string>('All');

  const allJobs = store.getPublicJobs();

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Type filter
      if (selectedType !== 'All' && job.employment_type !== selectedType) {
        return false;
      }

      // County filter
      if (selectedCounty !== 'All' && !job.location.toLowerCase().includes(selectedCounty.toLowerCase())) {
        return false;
      }

      // Live search query matching title, company, place, or skills
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company_name.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesSkills = (job.required_skills || []).some(s => s.toLowerCase().includes(q));

        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkills) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, searchQuery, selectedType, selectedCounty]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedCounty('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'All' || selectedCounty !== 'All';

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. Cover Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden text-center">
        {/* Subtle blurred warm-gold background orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center mb-6">
            <Logo size="xl" showText={false} />
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="shine-title">JobConnect</span>
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-[#f5d77a] mb-6">
            Find Opportunities. Build Your Future.
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#b9b09a] mb-8 leading-relaxed">
            Kenya's smart merit-based employment ecosystem. When multiple applicants apply, our automated qualification engine highlights the top candidates. Fast, lightweight, and tailored for mobile.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#explore-jobs"
              className="btn-gold px-8 py-3 text-base w-full sm:w-auto"
            >
              <span>Find Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => onNavigate('post-job')}
              className="btn-gold-outline px-8 py-3 text-base w-full sm:w-auto"
            >
              <Briefcase className="w-4 h-4" />
              <span>Post a Job</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Why Choose JobConnect Section (4 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77a] mb-2">
            Why Choose JobConnect?
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b09a]">
            Empowering Kenya's workforce with transparent hiring and real career advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="card-gold p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-2">
                Find Opportunities
              </h3>
              <p className="text-xs text-[#b9b09a] leading-relaxed">
                Discover verified career vacancies across Nairobi, Mombasa, Kisumu, Eldoret, Nakuru, and all 47 Kenyan counties.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#f5d77a] font-medium">
              Daily verified vacancies
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-gold p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-2">
                Build Your Profile
              </h3>
              <p className="text-xs text-[#b9b09a] leading-relaxed">
                Add your education, verified skills, and compliant 7:9 passport photograph to stand out in automated shortlists.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#f5d77a] font-medium">
              Instant 1-click apply
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-gold p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-2">
                Connect with Employers
              </h3>
              <p className="text-xs text-[#b9b09a] leading-relaxed">
                Direct connections to top organizations, SMEs, government contractors, and international companies in East Africa.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#f5d77a] font-medium">
              Transparent live rankings
            </div>
          </div>

          {/* Card 4 */}
          <div className="card-gold p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-2">
                Recruit Talent
              </h3>
              <p className="text-xs text-[#b9b09a] leading-relaxed">
                No more sorting through thousands of resumes. Our deterministic score automatically surfaces the best-qualified applicants.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#f5d77a] font-medium">
              Automated selection engine
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Jobs Section */}
      <section id="explore-jobs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-[#d4af37]" />
              Kenya Job Marketplace
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f3eee0]">
              Explore Open Opportunities
            </h2>
          </div>

          <div className="text-xs font-semibold text-[#f5d77a]">
            {filteredJobs.length === 1 ? '1 job found' : `${filteredJobs.length} jobs found`}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="card-gold p-4 sm:p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-[#d4af37] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Job title, company, skills, or place..."
                className="input-gold w-full pl-9 pr-3 py-2.5 text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Employment Type Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="input-gold w-full px-3 py-2.5 text-base"
              >
                <option value="All" className="bg-neutral-900">All Employment Types</option>
                <option value="Full-time" className="bg-neutral-900">Full-time</option>
                <option value="Part-time" className="bg-neutral-900">Part-time</option>
                <option value="Contract" className="bg-neutral-900">Contract</option>
                <option value="Internship" className="bg-neutral-900">Internship</option>
              </select>
            </div>

            {/* Regional Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCounty}
                onChange={e => setSelectedCounty(e.target.value)}
                className="input-gold w-full px-3 py-2.5 text-base"
              >
                <option value="All" className="bg-neutral-900">All Kenyan Locations</option>
                <option value="Nairobi" className="bg-neutral-900">Nairobi</option>
                <option value="Mombasa" className="bg-neutral-900">Mombasa</option>
                <option value="Kisumu" className="bg-neutral-900">Kisumu</option>
                <option value="Nakuru" className="bg-neutral-900">Nakuru</option>
                <option value="Eldoret" className="bg-neutral-900">Eldoret</option>
                <option value="Kiambu" className="bg-neutral-900">Kiambu / Thika</option>
                <option value="Narok" className="bg-neutral-900">Narok / Maasai Mara</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-[#b9b09a]">Active filters applied</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[#f5d77a] hover:underline flex items-center gap-1 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="card-gold p-12 text-center my-6">
            <Briefcase className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-1">
              No matching jobs found
            </h3>
            <p className="text-xs text-[#b9b09a] max-w-sm mx-auto mb-4">
              We couldn't find any open positions matching your search. Try resetting your search terms or filters.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn-gold-outline text-xs px-4 py-2"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onViewJob={id => onNavigate('job-details', id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Ready to Get Started? Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="card-gold p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f5d77a] mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-sm text-[#b9b09a] max-w-lg mx-auto mb-8 leading-relaxed">
              Join thousands of Kenyan professionals and top recruiting employers on JobConnect. Create your free account in under 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="btn-gold px-8 py-3 text-sm font-semibold w-full sm:w-auto"
              >
                Create an Account
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="btn-gold-outline px-8 py-3 text-sm font-semibold w-full sm:w-auto"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
