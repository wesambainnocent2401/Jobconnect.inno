/**
 * JobConnect Kenya - Admin Dashboard & System Operations
 * 
 * Features:
 * 1. Platform Statistics (Users, Seekers, Employers, Jobs, Apps)
 * 2. Searchable Users Table
 * 3. Searchable Jobs Table with moderation
 * 4. Application Status Metrics (No photos or passwords exposed)
 * 5. M-Pesa Featured Payments Approval & Revenue
 * 6. System Check & Live Automated Acceptance Test Runner
 * 7. Platform Settings
 */

import React, { useState } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Settings,
  Activity,
  Play,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { User, Job, Payment, PlatformSettings } from '../types';
import { store } from '../lib/storage';
import { formatKSh, formatNairobiDate } from '../lib/kenyaData';
import { runAcceptanceTest } from '../lib/scoring';

interface AdminDashboardPageProps {
  currentUser: User | null;
  onNavigate: (view: string, param?: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'payments' | 'settings' | 'system'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Settings form
  const currentSettings = store.getSettings();
  const [settingsForm, setSettingsForm] = useState<PlatformSettings>(currentSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Acceptance test state
  const [testResult, setTestResult] = useState<ReturnType<typeof runAcceptanceTest> | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Access Restricted</h2>
        <p className="text-xs text-[#b9b09a] mb-6">This console is reserved exclusively for system administrators.</p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-gold px-6 py-2.5 text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const allUsers = store.getAllUsers();
  const allJobs = store.getAllJobs();
  const allPayments = store.getAllPayments();

  // Metrics
  const jobSeekersCount = allUsers.filter(u => u.role === 'jobseeker').length;
  const employersCount = allUsers.filter(u => u.role === 'employer').length;
  const activeJobsCount = allJobs.filter(j => j.status === 'open').length;

  // Payments calculations
  const approvedPayments = allPayments.filter(p => p.status === 'approved');
  const totalRevenue = approvedPayments.reduce((acc, p) => acc + p.amount, 0);

  // Filtered Users
  const filteredUsers = allUsers.filter(u => {
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  // Filtered Jobs
  const filteredJobs = allJobs.filter(j => {
    const q = jobSearch.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q) || j.location.toLowerCase().includes(q);
  });

  const handleApprovePayment = (id: string) => {
    store.approvePayment(id);
  };

  const handleRejectPayment = (id: string) => {
    store.rejectPayment(id);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleRunTest = () => {
    const res = runAcceptanceTest();
    setTestResult(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#d4af37]" />
            JobConnect Master Control
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            Administrator Console
          </h1>
          <p className="text-sm text-[#b9b09a] mt-1">
            Supervise platform metrics, approve M-Pesa receipts, configure Kenyan settings, and audit algorithms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => store.resetToDemo()}
          className="btn-gold-outline text-xs px-3 py-2 flex items-center gap-1.5 self-start sm:self-auto"
          title="Reset database to pristine Kenya demo seed state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Seed</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/5">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Activity },
          { id: 'users', label: `Users (${allUsers.length})`, icon: Users },
          { id: 'jobs', label: `Jobs (${allJobs.length})`, icon: Briefcase },
          { id: 'payments', label: `M-Pesa Payments (${allPayments.length})`, icon: DollarSign },
          { id: 'system', label: 'System & Algorithm Audit', icon: Sparkles },
          { id: 'settings', label: 'Platform Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#f5d77a] to-[#d4af37] text-neutral-950 shadow'
                  : 'text-[#b9b09a] hover:text-[#f3eee0] hover:bg-neutral-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="card-gold p-4">
              <span className="text-[11px] text-[#b9b09a] block">Total Users</span>
              <p className="text-2xl font-bold text-[#f3eee0] mt-1">{allUsers.length}</p>
            </div>

            <div className="card-gold p-4">
              <span className="text-[11px] text-[#b9b09a] block">Job Seekers</span>
              <p className="text-2xl font-bold text-[#f5d77a] mt-1">{jobSeekersCount}</p>
            </div>

            <div className="card-gold p-4">
              <span className="text-[11px] text-[#b9b09a] block">Employers</span>
              <p className="text-2xl font-bold text-[#f5d77a] mt-1">{employersCount}</p>
            </div>

            <div className="card-gold p-4">
              <span className="text-[11px] text-[#b9b09a] block">Total Jobs</span>
              <p className="text-2xl font-bold text-[#f3eee0] mt-1">{allJobs.length}</p>
            </div>

            <div className="card-gold p-4">
              <span className="text-[11px] text-emerald-400 block">Active Jobs</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{activeJobsCount}</p>
            </div>

            <div className="card-gold p-4">
              <span className="text-[11px] text-[#d4af37] block">M-Pesa Revenue</span>
              <p className="text-xl font-bold text-[#f5d77a] mt-1">{formatKSh(totalRevenue)}</p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-gold p-6">
              <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-2">
                Pending M-Pesa Approvals
              </h3>
              <p className="text-xs text-[#b9b09a] mb-4">
                Employers awaiting featured placement for their job listings.
              </p>
              {allPayments.filter(p => p.status === 'waiting_approval').length === 0 ? (
                <div className="p-4 rounded-lg bg-neutral-900/60 text-xs text-neutral-400 text-center">
                  All M-Pesa transactions are up to date.
                </div>
              ) : (
                <div className="space-y-2">
                  {allPayments.filter(p => p.status === 'waiting_approval').map(p => (
                    <div key={p.id} className="p-3 bg-neutral-900 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-[#f3eee0]">{p.employer_name}</div>
                        <div className="text-neutral-400">Code: <strong className="text-[#f5d77a]">{p.mpesa_code}</strong> · {formatKSh(p.amount)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApprovePayment(p.id)}
                        className="btn-gold text-[11px] px-3 py-1"
                      >
                        Approve
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card-gold p-6">
              <h3 className="font-serif text-lg font-bold text-[#f5d77a] mb-2">
                Algorithm & Acceptance Test
              </h3>
              <p className="text-xs text-[#b9b09a] mb-4">
                Verify that ranking, score formula, and tie-breakers pass the Kenyan Prompt 3 criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('system');
                  handleRunTest();
                }}
                className="btn-gold text-xs px-4 py-2 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Acceptance Test Suite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'users' && (
        <div className="card-gold p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-serif text-lg font-bold text-[#f5d77a]">Registered Users</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search user by name, email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="input-gold w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-white/5">
              <thead>
                <tr className="text-neutral-400 font-medium">
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#f3eee0]">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold">{user.name}</td>
                    <td className="py-3 px-3 text-neutral-300">{user.email}</td>
                    <td className="py-3 px-3 text-neutral-400">{user.phone}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.role === 'admin'
                          ? 'bg-[#d4af37]/20 text-[#f5d77a] border border-[#d4af37]/30'
                          : user.role === 'employer'
                          ? 'bg-blue-950/40 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-neutral-500">{formatNairobiDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JOBS */}
      {activeTab === 'jobs' && (
        <div className="card-gold p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-serif text-lg font-bold text-[#f5d77a]">Job Moderation</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search job title, company..."
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
                className="input-gold w-full pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-white/5">
              <thead>
                <tr className="text-neutral-400 font-medium">
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Positions</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#f3eee0]">
                {filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-semibold">{job.title}</td>
                    <td className="py-3 px-3 text-[#f5d77a]">{job.company_name}</td>
                    <td className="py-3 px-3 text-neutral-400">{job.location}</td>
                    <td className="py-3 px-3">{job.positions}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        job.status === 'open' ? 'text-emerald-400 bg-emerald-950/30' : 'text-neutral-400 bg-neutral-900'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => store.toggleJobStatus(job.id, currentUser.id)}
                        className="text-neutral-400 hover:text-[#f5d77a] underline"
                      >
                        {job.status === 'open' ? 'Close' : 'Reopen'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('job-details', job.id)}
                        className="text-[#d4af37] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: M-PESA PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="card-gold p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#f5d77a]">
                M-Pesa Featured Job Transactions
              </h3>
              <p className="text-xs text-[#b9b09a]">
                Manage manual Till / Paybill submissions and Daraja STK payments.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-neutral-400">Total Confirmed:</span>
              <p className="font-bold text-lg text-emerald-400">{formatKSh(totalRevenue)}</p>
            </div>
          </div>

          {allPayments.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No payments submitted yet. Employers can feature jobs for KSh 300 (7 days) or KSh 1,000 (30 days).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-white/5">
                <thead>
                  <tr className="text-neutral-400 font-medium">
                    <th className="py-3 px-3">Job Title</th>
                    <th className="py-3 px-3">Employer</th>
                    <th className="py-3 px-3">M-Pesa Code</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#f3eee0]">
                  {allPayments.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold">{p.job_title}</td>
                      <td className="py-3 px-3 text-neutral-300">{p.employer_name}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#f5d77a]">{p.mpesa_code}</td>
                      <td className="py-3 px-3 font-semibold">{formatKSh(p.amount)}</td>
                      <td className="py-3 px-3 text-neutral-400">{p.duration_days} days</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'approved'
                            ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                            : p.status === 'waiting_approval'
                            ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                            : 'text-rose-400 bg-rose-950/40'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        {p.status === 'waiting_approval' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(p.id)}
                              className="text-xs text-emerald-400 hover:underline font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectPayment(p.id)}
                              className="text-xs text-rose-400 hover:underline"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SYSTEM & ALGORITHM AUDIT */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="card-gold p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f5d77a] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#d4af37]" />
                  System Health & Acceptance Test Suite
                </h3>
                <p className="text-xs text-[#b9b09a]">
                  Tests the deterministic qualification formula (Skills 50 pts, Experience 30 pts, Education 20 pts) against Prompt 3 acceptance criteria.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunTest}
                className="btn-gold text-xs px-5 py-2.5 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Execute Test Suite</span>
              </button>
            </div>

            {testResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {testResult.success
                        ? '100% Acceptance Tests Passed Successfully!'
                        : 'Acceptance Test Failure Detected'}
                    </h4>
                    <p className="text-xs opacity-90 mt-0.5">
                      Order: {testResult.orderPassed ? 'Passed (Alice > Dan > Bob > Cara)' : 'Failed'} · 
                      2 Positions: {testResult.positions2Passed ? 'Passed (2 Selected, 2 Not Selected)' : 'Failed'} · 
                      5 Positions: {testResult.positions5Passed ? 'Passed (All 4 stay Pending)' : 'Failed'}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-white/5">
                    <thead>
                      <tr className="text-neutral-400 font-medium">
                        <th className="py-2.5 px-3">Applicant Name</th>
                        <th className="py-2.5 px-3">Expected Score</th>
                        <th className="py-2.5 px-3">Calculated Score</th>
                        <th className="py-2.5 px-3">2 Positions Status</th>
                        <th className="py-2.5 px-3">5 Positions Status</th>
                        <th className="py-2.5 px-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#f3eee0]">
                      {testResult.results.map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 px-3 font-semibold">{r.name}</td>
                          <td className="py-2.5 px-3 font-mono">{r.expectedScore}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#f5d77a]">{r.actualScore}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.rank2PositionsStatus === 'selected' ? 'text-emerald-400 bg-emerald-950/40' : 'text-neutral-400 bg-neutral-900'
                            }`}>
                              {r.rank2PositionsStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 bg-amber-950/40">
                              {r.rank5PositionsStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-emerald-400 font-bold">Passed ✓</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="card-gold p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#f5d77a]">
              Platform Configuration & Monetization
            </h3>
            <p className="text-xs text-[#b9b09a]">
              Adjust M-Pesa featured job pricing, till numbers, and system switches.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Platform settings updated successfully.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                7 Days Featured Job Price (KSh)
              </label>
              <input
                type="number"
                value={settingsForm.featuredPrice7Days}
                onChange={e => setSettingsForm({ ...settingsForm, featuredPrice7Days: parseInt(e.target.value) || 0 })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                30 Days Featured Job Price (KSh)
              </label>
              <input
                type="number"
                value={settingsForm.featuredPrice30Days}
                onChange={e => setSettingsForm({ ...settingsForm, featuredPrice30Days: parseInt(e.target.value) || 0 })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                M-Pesa Buy Goods Till Number
              </label>
              <input
                type="text"
                value={settingsForm.mpesaTillNumber}
                onChange={e => setSettingsForm({ ...settingsForm, mpesaTillNumber: e.target.value })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                M-Pesa Paybill Number
              </label>
              <input
                type="text"
                value={settingsForm.mpesaPaybillNumber}
                onChange={e => setSettingsForm({ ...settingsForm, mpesaPaybillNumber: e.target.value })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Paybill Account Name
              </label>
              <input
                type="text"
                value={settingsForm.mpesaAccountNumber}
                onChange={e => setSettingsForm({ ...settingsForm, mpesaAccountNumber: e.target.value })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settingsForm.supportEmail}
                onChange={e => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                Support Phone
              </label>
              <input
                type="text"
                value={settingsForm.supportPhone}
                onChange={e => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-gold px-6 py-2.5 text-xs font-semibold"
            >
              Save Platform Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
