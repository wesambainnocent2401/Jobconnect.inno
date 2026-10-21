/**
 * JobConnect Kenya - Client-Side Data Store & Application State Manager
 * 
 * Provides robust offline-first persistence with localStorage, automatic initialization
 * with realistic Kenyan seed data, role-based access checks, and immediate reactivity.
 */

import {
  AppNotification,
  Application,
  ChatMessage,
  Conversation,
  Interview,
  InterviewFormat,
  InterviewStatus,
  Job,
  Payment,
  PlatformSettings,
  Profile,
  User,
  UserRole
} from '../types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_INTERVIEWS,
  INITIAL_JOBS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_SETTINGS,
  INITIAL_USERS
} from './seedData';
import { calculateMatchScore, rankAndSelectApplications } from './scoring';
import { isJobCurrentlyOpen } from './kenyaData';

const STORAGE_KEYS = {
  USERS: 'jobconnect_users_v1',
  PROFILES: 'jobconnect_profiles_v1',
  JOBS: 'jobconnect_jobs_v1',
  APPLICATIONS: 'jobconnect_applications_v1',
  PAYMENTS: 'jobconnect_payments_v1',
  SETTINGS: 'jobconnect_settings_v1',
  CONVERSATIONS: 'jobconnect_conversations_v1',
  MESSAGES: 'jobconnect_messages_v1',
  INTERVIEWS: 'jobconnect_interviews_v1',
  NOTIFICATIONS: 'jobconnect_notifications_v1',
  CURRENT_USER_ID: 'jobconnect_current_user_id_v1'
};

class Store {
  private users: User[] = [];
  private profiles: Profile[] = [];
  private jobs: Job[] = [];
  private applications: Application[] = [];
  private payments: Payment[] = [];
  private conversations: Conversation[] = [];
  private messages: ChatMessage[] = [];
  private interviews: Interview[] = [];
  private notifications: AppNotification[] = [];
  private settings: PlatformSettings = INITIAL_SETTINGS;
  private currentUserId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const storedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedConvs = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      const storedMsgs = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      const storedInts = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const storedCurrentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      this.profiles = storedProfiles ? JSON.parse(storedProfiles) : [...INITIAL_PROFILES];
      this.jobs = storedJobs ? JSON.parse(storedJobs) : [...INITIAL_JOBS];
      this.applications = storedApps ? JSON.parse(storedApps) : [...INITIAL_APPLICATIONS];
      this.payments = storedPayments ? JSON.parse(storedPayments) : [];
      this.settings = storedSettings ? JSON.parse(storedSettings) : { ...INITIAL_SETTINGS };
      this.conversations = storedConvs ? JSON.parse(storedConvs) : [...INITIAL_CONVERSATIONS];
      this.messages = storedMsgs ? JSON.parse(storedMsgs) : [...INITIAL_MESSAGES];
      this.interviews = storedInts ? JSON.parse(storedInts) : [...INITIAL_INTERVIEWS];
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];
      
      // Default to Alice Wanjiku (Job seeker) so the user immediately sees working applications in My Applications!
      this.currentUserId = storedCurrentUserId || 'user-alice';

      this.saveAll();
    } catch (err) {
      console.warn('Could not initialize from localStorage, using in-memory seed', err);
      this.users = [...INITIAL_USERS];
      this.profiles = [...INITIAL_PROFILES];
      this.jobs = [...INITIAL_JOBS];
      this.applications = [...INITIAL_APPLICATIONS];
      this.payments = [];
      this.settings = { ...INITIAL_SETTINGS };
      this.conversations = [...INITIAL_CONVERSATIONS];
      this.messages = [...INITIAL_MESSAGES];
      this.interviews = [...INITIAL_INTERVIEWS];
      this.notifications = [...INITIAL_NOTIFICATIONS];
      this.currentUserId = 'user-alice';
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveAll();
    this.listeners.forEach(fn => fn());
  }

  private saveAll() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(this.conversations));
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages));
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(this.interviews));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      if (this.currentUserId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      }
    } catch {
      // ignore storage quota issues
    }
  }

  // --- AUTHENTICATION & USERS ---
  public getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.users.find(u => u.id === this.currentUserId) || null;
  }

  public setCurrentUser(userId: string | null) {
    this.currentUserId = userId;
    this.notify();
  }

  public register(data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string;
  }): { success: boolean; message?: string; user?: User } {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = this.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Role check: if email matches ADMIN_EMAIL setting, elevate to admin
    const role = cleanEmail === this.settings.adminEmail.toLowerCase() ? 'admin' : data.role;

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      role,
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);

    // Create an empty profile if job seeker
    if (role === 'jobseeker') {
      const newProfile: Profile = {
        id: `prof-${Date.now()}`,
        user_id: newUser.id,
        location: '',
        education: 'Any',
        field_of_study: '',
        skills: [],
        experience_years: 0,
        experience_details: '',
        updated_at: new Date().toISOString()
      };
      this.profiles.push(newProfile);
    }

    this.currentUserId = newUser.id;
    this.notify();
    return { success: true, user: newUser };
  }

  public login(email: string): { success: boolean; message?: string; user?: User } {
    const cleanEmail = email.trim().toLowerCase();
    let user = this.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // For convenience during testing: if the user enters the configured admin email, create it!
      if (cleanEmail === this.settings.adminEmail.toLowerCase()) {
        user = {
          id: `user-admin-${Date.now()}`,
          name: 'System Administrator',
          email: cleanEmail,
          phone: '+254 700 000 000',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        this.users.push(user);
      } else {
        return { success: false, message: 'Invalid email or password.' };
      }
    }

    this.currentUserId = user.id;
    this.notify();
    return { success: true, user };
  }

  public logout() {
    this.currentUserId = null;
    this.notify();
  }

  public deleteAccount(userId: string): boolean {
    this.users = this.users.filter(u => u.id !== userId);
    this.profiles = this.profiles.filter(p => p.user_id !== userId);
    this.applications = this.applications.filter(a => a.applicant_id !== userId);
    if (this.currentUserId === userId) {
      this.currentUserId = null;
    }
    this.notify();
    return true;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  // --- PROFILES ---
  public getProfile(userId: string): Profile | null {
    return this.profiles.find(p => p.user_id === userId) || null;
  }

  public saveProfile(userId: string, data: Partial<Profile>): Profile {
    let profile = this.profiles.find(p => p.user_id === userId);
    if (!profile) {
      profile = {
        id: `prof-${Date.now()}`,
        user_id: userId,
        location: '',
        education: 'Any',
        field_of_study: '',
        skills: [],
        experience_years: 0,
        experience_details: '',
        updated_at: new Date().toISOString(),
        ...data
      };
      this.profiles.push(profile);
    } else {
      Object.assign(profile, data, { updated_at: new Date().toISOString() });
    }
    this.notify();
    return profile;
  }

  // --- JOBS ---
  public getAllJobs(): Job[] {
    // Recalculate applicant count for each job
    return this.jobs.map(job => ({
      ...job,
      applicant_count: this.applications.filter(a => a.job_id === job.id).length
    }));
  }

  public getPublicJobs(): Job[] {
    return this.getAllJobs()
      .filter(job => isJobCurrentlyOpen(job.status, job.deadline))
      .sort((a, b) => {
        // Featured jobs appear first
        const now = new Date().toISOString();
        const aFeatured = a.featured_until && a.featured_until > now ? 1 : 0;
        const bFeatured = b.featured_until && b.featured_until > now ? 1 : 0;
        if (aFeatured !== bFeatured) {
          return bFeatured - aFeatured;
        }
        // Newest first
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }

  public getEmployerJobs(employerId: string): Job[] {
    return this.getAllJobs()
      .filter(j => j.employer_id === employerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getJobById(id: string): Job | undefined {
    const job = this.jobs.find(j => j.id === id);
    if (!job) return undefined;
    return {
      ...job,
      applicant_count: this.applications.filter(a => a.job_id === job.id).length
    };
  }

  public createJob(jobData: Omit<Job, 'id' | 'created_at' | 'applicant_count'>): Job {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
      applicant_count: 0
    };
    this.jobs.unshift(newJob);

    // Trigger instant notifications for candidates whose profile skills match required skills
    if (newJob.required_skills && newJob.required_skills.length > 0) {
      const jobSkills = newJob.required_skills.map(s => s.toLowerCase());
      this.profiles.forEach(p => {
        const candidateSkills = (p.skills || []).map(s => s.toLowerCase());
        const hasOverlap = candidateSkills.some(cs =>
          jobSkills.some(js => cs.includes(js) || js.includes(cs))
        );
        if (hasOverlap) {
          this.createNotification({
            user_id: p.user_id,
            title: `New Matching Job in ${newJob.location}`,
            message: `${newJob.company_name} just posted "${newJob.title}" (${newJob.salary || 'Competitive Pay'}) matching your skills.`,
            type: 'job_match',
            link_view: 'job-details',
            link_param: newJob.id
          });
        }
      });
    }

    this.notify();
    return newJob;
  }

  public updateJob(jobId: string, employerId: string, updates: Partial<Job>): { success: boolean; message?: string } {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found.' };

    const currentUser = this.getCurrentUser();
    if (job.employer_id !== employerId && currentUser?.role !== 'admin') {
      return { success: false, message: 'You are not authorized to edit this job.' };
    }

    Object.assign(job, updates);

    // Prompt 3: "Automatic selection updated instantly when employer changes positions or requirements"
    this.recalculateJobSelection(jobId);

    this.notify();
    return { success: true };
  }

  public deleteJob(jobId: string, employerId: string): { success: boolean; message?: string } {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found.' };

    const currentUser = this.getCurrentUser();
    if (job.employer_id !== employerId && currentUser?.role !== 'admin') {
      return { success: false, message: 'Unauthorized to delete this job.' };
    }

    this.jobs = this.jobs.filter(j => j.id !== jobId);
    this.applications = this.applications.filter(a => a.job_id !== jobId);
    this.payments = this.payments.filter(p => p.job_id !== jobId);
    this.notify();
    return { success: true };
  }

  public toggleJobStatus(jobId: string, employerId: string): { success: boolean; newStatus?: 'open' | 'closed' } {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return { success: false };

    const currentUser = this.getCurrentUser();
    if (job.employer_id !== employerId && currentUser?.role !== 'admin') {
      return { success: false };
    }

    job.status = job.status === 'open' ? 'closed' : 'open';
    this.recalculateJobSelection(jobId);
    this.notify();
    return { success: true, newStatus: job.status };
  }

  // --- APPLICATIONS & TRACKING SYSTEM ---
  
  /**
   * Fetch applications for the currently logged in job seeker.
   * Secure: Job seekers can NEVER view other applicants' data.
   */
  public getMyApplications(jobSeekerId: string): Array<Application & { job?: Job }> {
    const apps = this.applications
      .filter(a => a.applicant_id === jobSeekerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return apps.map(app => {
      const job = this.jobs.find(j => j.id === app.job_id);
      return {
        ...app,
        job
      };
    });
  }

  /**
   * Fetch applications for an employer's specific job or all employer's jobs.
   * Ranked according to match score & tie-breaking algorithm.
   */
  public getEmployerJobApplications(employerId: string, jobId?: string): Array<Application & { job?: Job }> {
    const currentUser = this.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    // Get jobs belonging to employer
    const empJobs = isAdmin 
      ? this.jobs 
      : this.jobs.filter(j => j.employer_id === employerId);
    const validJobIds = new Set(empJobs.map(j => j.id));

    let apps = this.applications.filter(a => validJobIds.has(a.job_id));
    if (jobId) {
      apps = apps.filter(a => a.job_id === jobId);
    }

    return apps.map(app => ({
      ...app,
      job: this.jobs.find(j => j.id === app.job_id)
    }));
  }

  /**
   * Submit an application for a job
   */
  public applyForJob(data: {
    job_id: string;
    applicant_id: string;
    full_name: string;
    email: string;
    phone: string;
    education: any;
    experience_years: number;
    skills: string[];
    portfolio_url?: string;
    cover_message: string;
    photo_url: string;
  }): { success: boolean; message: string; application?: Application } {
    const job = this.jobs.find(j => j.id === data.job_id);
    if (!job) {
      return { success: false, message: 'Job not found.' };
    }

    if (!isJobCurrentlyOpen(job.status, job.deadline)) {
      return { success: false, message: 'This job is no longer accepting applications.' };
    }

    // Check duplicate: one application per person per job
    const alreadyApplied = this.applications.some(
      a => a.job_id === data.job_id && a.applicant_id === data.applicant_id
    );
    if (alreadyApplied) {
      return { success: false, message: 'You have already applied for this position.' };
    }

    // Calculate score
    const scoreCalc = calculateMatchScore(
      {
        skills: data.skills,
        experience_years: data.experience_years,
        education: data.education
      },
      job
    );

    const newApp: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      job_id: data.job_id,
      applicant_id: data.applicant_id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      education: data.education,
      experience_years: data.experience_years,
      skills: data.skills,
      portfolio_url: data.portfolio_url,
      cover_message: data.cover_message,
      photo_url: data.photo_url,
      status: 'pending',
      match_score: scoreCalc.totalScore,
      score_breakdown: {
        skillsScore: scoreCalc.skillsScore,
        experienceScore: scoreCalc.experienceScore,
        educationScore: scoreCalc.educationScore
      },
      created_at: new Date().toISOString()
    };

    this.applications.push(newApp);

    // Automatically recalculate ranking & selection for this job immediately!
    this.recalculateJobSelection(data.job_id);

    // Notify the employer about the new applicant
    this.createNotification({
      user_id: job.employer_id,
      title: `New Applicant: ${data.full_name}`,
      message: `${data.full_name} applied for "${job.title}" with qualification match score ${scoreCalc.totalScore}/100.`,
      type: 'status_update',
      link_view: 'employer-dashboard',
      link_param: job.id
    });

    this.notify();
    return {
      success: true,
      message: 'Your application and passport photo have been submitted successfully!',
      application: newApp
    };
  }

  /**
   * Employer shortlists or un-shortlists an applicant manually
   */
  public toggleShortlist(applicationId: string, employerId: string): { success: boolean; status?: string } {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return { success: false };

    const job = this.jobs.find(j => j.id === app.job_id);
    if (!job) return { success: false };

    const currentUser = this.getCurrentUser();
    if (job.employer_id !== employerId && currentUser?.role !== 'admin') {
      return { success: false };
    }

    if (app.status === 'shortlisted') {
      // Revert to automated rank
      app.status = 'pending';
    } else {
      app.status = 'shortlisted';

      // Send instant notification to applicant
      this.createNotification({
        user_id: app.applicant_id,
        title: `Congratulations! Shortlisted by ${job.company_name}`,
        message: `Your profile for "${job.title}" has been shortlisted! The employer can now initiate direct interview messaging.`,
        type: 'status_update',
        link_view: 'my-applications',
        link_param: job.id
      });
    }

    this.recalculateJobSelection(job.id);
    this.notify();
    return { success: true, status: app.status };
  }

  /**
   * Recalculates selection and ranks all applications for a given job
   */
  public recalculateJobSelection(jobId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) return;

    const jobApps = this.applications.filter(a => a.job_id === jobId);
    if (jobApps.length === 0) return;

    // Refresh scores if job requirements changed
    const updatedWithScores = jobApps.map(app => {
      const calc = calculateMatchScore(
        {
          skills: app.skills,
          experience_years: app.experience_years,
          education: app.education
        },
        job
      );
      return {
        ...app,
        match_score: calc.totalScore,
        score_breakdown: {
          skillsScore: calc.skillsScore,
          experienceScore: calc.experienceScore,
          educationScore: calc.educationScore
        }
      };
    });

    const ranked = rankAndSelectApplications(updatedWithScores, job);

    // Update in main applications array
    ranked.forEach(r => {
      const index = this.applications.findIndex(a => a.id === r.id);
      if (index >= 0) {
        this.applications[index] = r;
      }
    });
  }

  // --- PAYMENTS & M-PESA FEATURED JOBS ---
  public submitFeaturedPayment(data: {
    job_id: string;
    duration_days: number;
    amount: number;
    mpesa_code: string;
    phone_number: string;
    payment_method: 'till_manual' | 'daraja_stk';
  }): { success: boolean; message: string; payment?: Payment } {
    const cleanCode = data.mpesa_code.trim().toUpperCase();

    // Check duplicate M-Pesa transaction code
    const duplicate = this.payments.some(p => p.mpesa_code.toUpperCase() === cleanCode);
    if (duplicate) {
      return { success: false, message: 'This M-Pesa transaction code has already been used.' };
    }

    const job = this.jobs.find(j => j.id === data.job_id);
    if (!job) return { success: false, message: 'Job not found.' };

    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not authenticated.' };

    const isAutoStk = data.payment_method === 'daraja_stk';

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      job_id: data.job_id,
      job_title: job.title,
      employer_id: currentUser.id,
      employer_name: currentUser.name,
      duration_days: data.duration_days,
      amount: data.amount,
      mpesa_code: cleanCode,
      phone_number: data.phone_number,
      payment_method: data.payment_method,
      status: isAutoStk ? 'approved' : 'waiting_approval',
      created_at: new Date().toISOString(),
      approved_at: isAutoStk ? new Date().toISOString() : undefined
    };

    this.payments.unshift(newPayment);

    // If STK or approved, feature the job immediately
    if (newPayment.status === 'approved') {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + data.duration_days);
      job.featured_until = expiry.toISOString();
    }

    this.notify();
    return {
      success: true,
      message: isAutoStk 
        ? 'M-Pesa STK payment confirmed! Your job is now Featured.' 
        : 'M-Pesa payment submitted for verification. Admin will review and activate.',
      payment: newPayment
    };
  }

  public approvePayment(paymentId: string): { success: boolean; message?: string } {
    const payment = this.payments.find(p => p.id === paymentId);
    if (!payment) return { success: false, message: 'Payment not found.' };

    payment.status = 'approved';
    payment.approved_at = new Date().toISOString();

    const job = this.jobs.find(j => j.id === payment.job_id);
    if (job) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + payment.duration_days);
      job.featured_until = expiry.toISOString();
    }

    this.notify();
    return { success: true };
  }

  public rejectPayment(paymentId: string): { success: boolean } {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'rejected';
      this.notify();
    }
    return { success: true };
  }

  public getAllPayments(): Payment[] {
    return [...this.payments];
  }

  public getEmployerPayments(employerId: string): Payment[] {
    return this.payments.filter(p => p.employer_id === employerId);
  }

  // --- SETTINGS ---
  public getSettings(): PlatformSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
    this.settings = { ...this.settings, ...updates };
    this.notify();
    return { ...this.settings };
  }

  // --- NOTIFICATIONS SYSTEM ---
  public createNotification(data: {
    user_id: string;
    title: string;
    message: string;
    type: any;
    link_view: string;
    link_param?: string;
  }): AppNotification {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user_id: data.user_id,
      title: data.title,
      message: data.message,
      type: data.type,
      link_view: data.link_view,
      link_param: data.link_param,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    this.notify();
    return newNotif;
  }

  public getNotifications(userId: string): AppNotification[] {
    return this.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getUnreadNotificationCount(userId: string): number {
    return this.notifications.filter(n => n.user_id === userId && !n.is_read).length;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.notify();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    this.notify();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  // --- DIRECT MESSAGING & INTERVIEWS ---
  public getConversationsForUser(userId: string): Conversation[] {
    return this.conversations
      .filter(c => c.applicant_id === userId || c.employer_id === userId)
      .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
  }

  public getConversationById(convId: string): Conversation | undefined {
    return this.conversations.find(c => c.id === convId);
  }

  public getMessages(conversationId: string): ChatMessage[] {
    return this.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public startOrGetConversation(jobId: string, employerId: string, applicantId: string): Conversation {
    let conv = this.conversations.find(
      c => c.job_id === jobId && c.employer_id === employerId && c.applicant_id === applicantId
    );

    if (!conv) {
      const job = this.jobs.find(j => j.id === jobId);
      const employer = this.users.find(u => u.id === employerId);
      const applicant = this.users.find(u => u.id === applicantId);
      const app = this.applications.find(a => a.job_id === jobId && a.applicant_id === applicantId);

      conv = {
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        job_id: jobId,
        job_title: job ? job.title : 'Job Opportunity',
        employer_id: employerId,
        employer_name: employer ? employer.name : 'Employer',
        applicant_id: applicantId,
        applicant_name: applicant ? applicant.name : 'Candidate',
        applicant_photo: app?.photo_url,
        last_message: 'Interview session initiated.',
        last_message_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      this.conversations.unshift(conv);

      // Welcome initial message
      const firstMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversation_id: conv.id,
        sender_id: employerId,
        sender_name: conv.employer_name,
        sender_role: 'employer',
        text: `Hello ${conv.applicant_name}, thank you for your interest in the ${conv.job_title} position. We would like to connect with you regarding your application.`,
        created_at: new Date().toISOString()
      };
      this.messages.push(firstMsg);

      // Notify the applicant
      this.createNotification({
        user_id: applicantId,
        title: `Direct Message from ${conv.employer_name}`,
        message: `${conv.employer_name} initiated an interview conversation for "${conv.job_title}".`,
        type: 'new_message',
        link_view: 'messages',
        link_param: conv.id
      });

      this.notify();
    }

    return conv;
  }

  public sendMessage(conversationId: string, text: string, senderId: string): ChatMessage | null {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return null;

    const sender = this.users.find(u => u.id === senderId);
    if (!sender) return null;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: sender.name,
      sender_role: sender.role,
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    this.messages.push(newMsg);
    conv.last_message = newMsg.text;
    conv.last_message_at = newMsg.created_at;

    // Send instant notification to the recipient
    const recipientId = senderId === conv.employer_id ? conv.applicant_id : conv.employer_id;
    this.createNotification({
      user_id: recipientId,
      title: `New message from ${sender.name}`,
      message: newMsg.text.length > 80 ? `${newMsg.text.slice(0, 80)}...` : newMsg.text,
      type: 'new_message',
      link_view: 'messages',
      link_param: conversationId
    });

    this.notify();
    return newMsg;
  }

  public scheduleInterview(data: {
    conversation_id: string;
    job_id: string;
    scheduled_date: string;
    scheduled_time: string;
    format: InterviewFormat;
    location_or_link: string;
    notes?: string;
  }): Interview | null {
    const conv = this.conversations.find(c => c.id === data.conversation_id);
    if (!conv) return null;

    const applicant = this.users.find(u => u.id === conv.applicant_id);

    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      conversation_id: data.conversation_id,
      job_id: data.job_id,
      job_title: conv.job_title,
      employer_id: conv.employer_id,
      employer_name: conv.employer_name,
      applicant_id: conv.applicant_id,
      applicant_name: conv.applicant_name,
      applicant_phone: applicant?.phone || '',
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time,
      format: data.format,
      location_or_link: data.location_or_link,
      notes: data.notes,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };

    this.interviews.unshift(newInterview);
    conv.interview = newInterview;

    // Also post an automated system chat message
    const interviewText = `📅 **Interview Scheduled**\n• Date: ${data.scheduled_date}\n• Time: ${data.scheduled_time} (Africa/Nairobi)\n• Format: ${data.format === 'in_person' ? 'In-Person' : data.format === 'video' ? 'Google Meet / Video' : 'Phone Call'}\n• Location/Link: ${data.location_or_link}${data.notes ? `\n• Notes: ${data.notes}` : ''}`;
    
    this.messages.push({
      id: `msg-int-${Date.now()}`,
      conversation_id: conv.id,
      sender_id: conv.employer_id,
      sender_name: conv.employer_name,
      sender_role: 'employer',
      text: interviewText,
      created_at: new Date().toISOString()
    });

    conv.last_message = `Interview scheduled for ${data.scheduled_date} at ${data.scheduled_time}`;
    conv.last_message_at = new Date().toISOString();

    // Trigger instant interview invite notification for the candidate
    this.createNotification({
      user_id: conv.applicant_id,
      title: `Interview Invitation: ${conv.job_title}`,
      message: `${conv.employer_name} scheduled an interview on ${data.scheduled_date} at ${data.scheduled_time}. Tap to view details and confirm attendance.`,
      type: 'interview_invite',
      link_view: 'messages',
      link_param: conv.id
    });

    this.notify();
    return newInterview;
  }

  public updateInterviewStatus(interviewId: string, status: InterviewStatus, notes?: string): Interview | null {
    const int = this.interviews.find(i => i.id === interviewId);
    if (!int) return null;

    int.status = status;
    int.updated_at = new Date().toISOString();
    if (notes) int.notes = notes;

    const conv = this.conversations.find(c => c.id === int.conversation_id);
    if (conv) {
      conv.interview = { ...int };
      
      // Auto-message in conversation
      const statusLabel = status === 'confirmed' ? 'Candidate confirmed attendance'
        : status === 'completed' ? 'Interview marked as completed'
        : status === 'cancelled' ? 'Interview was cancelled'
        : 'Interview status updated';

      this.messages.push({
        id: `msg-status-${Date.now()}`,
        conversation_id: conv.id,
        sender_id: 'system',
        sender_name: 'JobConnect Interview System',
        sender_role: 'admin',
        text: `📌 *Interview Status Update:* ${statusLabel}.`,
        created_at: new Date().toISOString()
      });

      conv.last_message = `Interview ${status}`;
      conv.last_message_at = new Date().toISOString();

      // Notify the other party
      const notifyTarget = status === 'confirmed' ? int.employer_id : int.applicant_id;
      this.createNotification({
        user_id: notifyTarget,
        title: `Interview Update: ${int.job_title}`,
        message: `${int.applicant_name} has ${status} the scheduled interview for ${int.scheduled_date}.`,
        type: 'interview_invite',
        link_view: 'messages',
        link_param: conv.id
      });
    }

    this.notify();
    return int;
  }

  public getInterviewsForUser(userId: string): Interview[] {
    return this.interviews
      .filter(i => i.applicant_id === userId || i.employer_id === userId)
      .sort((a, b) => new Date(`${b.scheduled_date}T00:00:00`).getTime() - new Date(`${a.scheduled_date}T00:00:00`).getTime());
  }

  // Reset to demo state
  public resetToDemo() {
    this.users = [...INITIAL_USERS];
    this.profiles = [...INITIAL_PROFILES];
    this.jobs = [...INITIAL_JOBS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.payments = [];
    this.conversations = [...INITIAL_CONVERSATIONS];
    this.messages = [...INITIAL_MESSAGES];
    this.interviews = [...INITIAL_INTERVIEWS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.settings = { ...INITIAL_SETTINGS };
    this.currentUserId = 'user-alice';
    this.notify();
  }
}

export const store = new Store();
