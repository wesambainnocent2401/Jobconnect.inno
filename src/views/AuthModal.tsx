/**
 * Authentication Modal: Register (with Terms checkbox & password rules) & Login
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { store } from '../lib/storage';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
  onNavigateToTerms: () => void;
  onNavigateToPrivacy: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess,
  onNavigateToTerms,
  onNavigateToPrivacy
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [role, setRole] = useState<UserRole>('jobseeker');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy to continue.');
      return;
    }

    const res = store.register({
      name,
      email,
      phone,
      role,
      password
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = store.login(email);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.message || 'Invalid credentials.');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141318] border border-[#d4af37]/45 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h3 className="font-serif text-2xl font-bold text-[#f5d77a]">
            {mode === 'login' && 'Sign in to JobConnect'}
            {mode === 'register' && 'Create your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-[#b9b09a] mt-1">
            {mode === 'login' && 'Enter your credentials to access your applications or jobs.'}
            {mode === 'register' && 'Join Kenya’s automated job-matching platform.'}
            {mode === 'forgot' && 'Enter your account email to receive a password reset link.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {mode === 'forgot' ? (
          <div>
            {forgotSent ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-emerald-300">Password Reset Link Sent</p>
                <p className="text-xs text-neutral-300">
                  A one-time reset link valid for 1 hour has been simulated for <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="btn-gold text-xs px-4 py-2 mt-2"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. name@example.co.ke"
                    className="input-gold w-full px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-neutral-400 hover:underline"
                  >
                    Back to Sign In
                  </button>
                  <button type="submit" className="btn-gold text-xs px-5 py-2">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.co.ke"
                  className="input-gold w-full pl-9 pr-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#f5d77a]">Password *</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#d4af37] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#d4af37] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-gold w-full pl-9 pr-10 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-gold w-full py-2.5 text-sm font-semibold mt-2">
              Sign In
            </button>

            <div className="text-center pt-3 border-t border-white/5 text-xs text-[#b9b09a]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
                className="text-[#f5d77a] font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Account Type Radio Selector */}
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1.5">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className={`p-2.5 rounded-lg border cursor-pointer text-center text-xs font-semibold flex items-center justify-center gap-2 ${
                  role === 'jobseeker'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                    : 'border-white/10 bg-neutral-900 text-neutral-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="jobseeker"
                    checked={role === 'jobseeker'}
                    onChange={() => setRole('jobseeker')}
                    className="hidden"
                  />
                  <span>Job Seeker</span>
                </label>

                <label className={`p-2.5 rounded-lg border cursor-pointer text-center text-xs font-semibold flex items-center justify-center gap-2 ${
                  role === 'employer'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                    : 'border-white/10 bg-neutral-900 text-neutral-400'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="employer"
                    checked={role === 'employer'}
                    onChange={() => setRole('employer')}
                    className="hidden"
                  />
                  <span>Employer / Recruiter</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                {role === 'employer' ? 'Company or Recruiter Name *' : 'Full Legal Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={role === 'employer' ? 'e.g. Kilindini Logistics Ltd' : 'e.g. Alice Wanjiku'}
                className="input-gold w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@mail.ke"
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+254 7..."
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Password (min 8 chars) *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <input
                type="checkbox"
                id="show-pass-toggle"
                checked={showPassword}
                onChange={e => setShowPassword(e.target.checked)}
                className="accent-[#d4af37]"
              />
              <label htmlFor="show-pass-toggle" className="cursor-pointer">
                Show passwords
              </label>
            </div>

            {/* Terms of Use & Privacy Policy Agreement Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-xs text-neutral-300">
              <input
                type="checkbox"
                id="agree-terms-toggle"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="accent-[#d4af37] mt-0.5 shrink-0"
              />
              <label htmlFor="agree-terms-toggle" className="cursor-pointer leading-tight">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToTerms();
                  }}
                  className="text-[#f5d77a] underline hover:text-white"
                >
                  Terms of Use
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToPrivacy();
                  }}
                  className="text-[#f5d77a] underline hover:text-white"
                >
                  Privacy Policy
                </button>{' '}
                under Kenya Data Protection Act 2019.
              </label>
            </div>

            <button type="submit" className="btn-gold w-full py-2.5 text-sm font-semibold mt-2">
              Create Account
            </button>

            <div className="text-center pt-2 border-t border-white/5 text-xs text-[#b9b09a]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-[#f5d77a] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
