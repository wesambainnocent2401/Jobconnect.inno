/**
 * Responsive Navigation Bar with Shiny Gold Theme and Role-Based Menus
 */

import React, { useState } from 'react';
import {
  Menu,
  X,
  Briefcase,
  User as UserIcon,
  PlusCircle,
  FileText,
  Shield,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Logo } from './Logo';
import { NotificationDropdown } from './NotificationDropdown';
import { User, UserRole } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  activeApplicationCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onSwitchUser,
  allUsers,
  activeApplicationCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchDropdownOpen, setSwitchDropdownOpen] = useState(false);

  const handleNav = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0b0f]/90 backdrop-blur-md border-b border-[#d4af37]/25 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="cursor-pointer flex items-center"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                  : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
              }`}
            >
              Explore Jobs
            </button>

            {/* Job Seeker Navigation */}
            {currentUser?.role === 'jobseeker' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('my-applications')}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'my-applications'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>My Applications</span>
                  {activeApplicationCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#d4af37] text-black">
                      {activeApplicationCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('messages')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'messages'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>Messages &amp; Interviews</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'profile'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>Profile</span>
                </button>
              </>
            )}

            {/* Employer Navigation */}
            {currentUser?.role === 'employer' && (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('post-job')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'post-job'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>Post a Job</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('my-jobs')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'my-jobs'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#d4af37]" />
                  <span>My Jobs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('employer-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'employer-dashboard'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#d4af37]" />
                  <span>Ranked Applicants</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('messages')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentView === 'messages'
                      ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                      : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                  <span>Messages &amp; Interviews</span>
                </button>
              </>
            )}

            {/* Admin Navigation */}
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                onClick={() => handleNav('admin-dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  currentView === 'admin-dashboard'
                    ? 'text-[#f5d77a] bg-[#d4af37]/15 border border-[#d4af37]/30'
                    : 'text-[#f3eee0] hover:text-[#f5d77a] hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4 text-[#f5d77a]" />
                <span className="font-semibold text-[#f5d77a]">Admin Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action / Profile Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSwitchDropdownOpen(!switchDropdownOpen)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-[#d4af37]/30 text-[#b9b09a] hover:text-[#f5d77a] flex items-center gap-1"
                title="Switch persona to test Job Seeker, Employer or Admin role"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Demo Roles</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {switchDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#141318] border border-[#d4af37]/40 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    Quick Persona Switch:
                  </div>
                  {allUsers.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        onSwitchUser(u.id);
                        setSwitchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#d4af37]/15 transition-colors ${
                        currentUser?.id === u.id ? 'text-[#f5d77a] font-semibold bg-[#d4af37]/10' : 'text-[#f3eee0]'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-neutral-400 capitalize">{u.role}</div>
                      </div>
                      {currentUser?.id === u.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <NotificationDropdown
              currentUser={currentUser}
              onNavigate={handleNav}
            />

            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#f3eee0] leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-[#f5d77a] capitalize mt-0.5">
                    {currentUser.role === 'jobseeker' ? 'Job Seeker' : currentUser.role}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="btn-gold-outline text-xs px-4 py-2"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="btn-gold text-xs px-4 py-2"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Bar: Notifications + Menu Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <NotificationDropdown
              currentUser={currentUser}
              onNavigate={handleNav}
            />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#f3eee0] hover:text-[#f5d77a] hover:bg-neutral-900"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111015] border-b border-[#d4af37]/30 px-4 pt-3 pb-6 space-y-2">
          {currentUser && (
            <div className="p-3 mb-2 bg-[#18171e] rounded-xl border border-[#d4af37]/20 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-[#f3eee0]">{currentUser.name}</p>
                <p className="text-xs text-[#f5d77a] capitalize">{currentUser.role}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentView === 'home' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
            }`}
          >
            Explore Jobs
          </button>

          {currentUser?.role === 'jobseeker' && (
            <>
              <button
                type="button"
                onClick={() => handleNav('my-applications')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  currentView === 'my-applications' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  My Applications
                </span>
                {activeApplicationCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#d4af37] text-black">
                    {activeApplicationCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleNav('messages')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'messages' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                Messages &amp; Interviews
              </button>
              <button
                type="button"
                onClick={() => handleNav('profile')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'profile' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <UserIcon className="w-4 h-4 text-[#d4af37]" />
                My Profile
              </button>
            </>
          )}

          {currentUser?.role === 'employer' && (
            <>
              <button
                type="button"
                onClick={() => handleNav('post-job')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'post-job' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-[#d4af37]" />
                Post a Job
              </button>
              <button
                type="button"
                onClick={() => handleNav('my-jobs')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'my-jobs' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <Briefcase className="w-4 h-4 text-[#d4af37]" />
                My Jobs
              </button>
              <button
                type="button"
                onClick={() => handleNav('employer-dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'employer-dashboard' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#d4af37]" />
                Ranked Applicants
              </button>
              <button
                type="button"
                onClick={() => handleNav('messages')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  currentView === 'messages' ? 'text-[#f5d77a] bg-[#d4af37]/15' : 'text-[#f3eee0]'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-[#d4af37]" />
                Messages &amp; Interviews
              </button>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleNav('admin-dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 text-[#f5d77a] ${
                currentView === 'admin-dashboard' ? 'bg-[#d4af37]/20 font-bold' : ''
              }`}
            >
              <Shield className="w-4 h-4 text-[#f5d77a]" />
              Admin Dashboard
            </button>
          )}

          {!currentUser && (
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="btn-gold-outline w-full py-2.5 text-sm"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenAuth('register');
                  setMobileMenuOpen(false);
                }}
                className="btn-gold w-full py-2.5 text-sm"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Quick role switcher for mobile */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-[11px] text-[#d4af37] font-semibold uppercase mb-2">
              Test Personas:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {allUsers.slice(0, 4).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onSwitchUser(u.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left p-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-[#f3eee0] truncate"
                >
                  <div className="truncate font-medium">{u.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-[#f5d77a]">{u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
