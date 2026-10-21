/**
 * JobConnect Kenya - Main Application Component
 */

import React, { useState, useEffect } from 'react';
import { store } from './lib/storage';
import { User } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomePage } from './views/HomePage';
import { MyApplicationsPage } from './views/MyApplicationsPage';
import { JobDetailsPage } from './views/JobDetailsPage';
import { PostJobPage } from './views/PostJobPage';
import { MyJobsPage } from './views/MyJobsPage';
import { EmployerDashboardPage } from './views/EmployerDashboardPage';
import { MessagesPage } from './views/MessagesPage';
import { ProfilePage } from './views/ProfilePage';
import { AdminDashboardPage } from './views/AdminDashboardPage';
import { TermsPage } from './views/TermsPage';
import { PrivacyPolicyPage } from './views/PrivacyPolicyPage';
import { NotFoundPage } from './views/NotFoundPage';

// Modals
import { AuthModal } from './views/AuthModal';
import { FeaturedPaymentModal } from './views/FeaturedPaymentModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(store.getAllUsers());
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [featureModalJobId, setFeatureModalJobId] = useState<string | null>(null);

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
      setAllUsers(store.getAllUsers());
    });
    return unsubscribe;
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    store.logout();
    handleNavigate('home');
  };

  const handleSwitchUser = (userId: string) => {
    store.setCurrentUser(userId);
    const user = store.getCurrentUser();
    if (user?.role === 'jobseeker' && currentView === 'employer-dashboard') {
      handleNavigate('my-applications');
    } else if (user?.role === 'employer' && currentView === 'my-applications') {
      handleNavigate('employer-dashboard');
    }
  };

  // Active applications count for Job Seeker badge
  const activeAppCount = currentUser && currentUser.role === 'jobseeker'
    ? store.getMyApplications(currentUser.id).length
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-[#f3eee0]">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        activeApplicationCount={activeAppCount}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'my-applications' && (
          <MyApplicationsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'job-details' && viewParam && (
          <JobDetailsPage
            jobId={viewParam}
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'post-job' && (
          <PostJobPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'edit-job' && (
          <PostJobPage
            currentUser={currentUser}
            editJobId={viewParam}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'my-jobs' && (
          <MyJobsPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
            onFeatureJob={jobId => setFeatureModalJobId(jobId)}
          />
        )}

        {currentView === 'employer-dashboard' && (
          <EmployerDashboardPage
            currentUser={currentUser}
            targetJobId={viewParam}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'messages' && (
          <MessagesPage
            currentUser={currentUser}
            initialConversationId={viewParam}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardPage
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'terms' && (
          <TermsPage onNavigate={handleNavigate} />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}

        {currentView === 'not-found' && (
          <NotFoundPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {}}
          onNavigateToTerms={() => handleNavigate('terms')}
          onNavigateToPrivacy={() => handleNavigate('privacy')}
        />
      )}

      {featureModalJobId && (
        <FeaturedPaymentModal
          jobId={featureModalJobId}
          onClose={() => setFeatureModalJobId(null)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
