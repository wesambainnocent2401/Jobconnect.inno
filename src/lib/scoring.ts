/**
 * JobConnect Kenya - Match Scoring & Automated Selection Engine
 *
 * Implements the deterministic matching and ranking algorithm:
 * - Skills (50 pts): substring bidirectional match, case-insensitive
 * - Experience (30 pts): full if meets min, else 30 * (applicant / required)
 * - Education (20 pts): 20 if >= required, 10 if 1 level below, 0 otherwise
 * - Automatic selection when applicants > positions
 * - Tie-breaker: Experience > Education > Earlier application
 */

import { Application, ApplicationStatus, EducationLevel, Job } from '../types';

export const EDUCATION_HIERARCHY: EducationLevel[] = [
  'Any',
  'Primary School',
  'Secondary School',
  'Certificate',
  'Diploma',
  'Degree',
  'Masters',
  'PhD'
];

export function getEducationRank(level: EducationLevel): number {
  const index = EDUCATION_HIERARCHY.indexOf(level);
  return index >= 0 ? index : 0;
}

export interface ScoreCalculationResult {
  totalScore: number; // 0 - 100
  skillsScore: number; // 0 - 50
  experienceScore: number; // 0 - 30
  educationScore: number; // 0 - 20
  label: 'Excellent match' | 'Good match' | 'Fair match' | 'Low match';
}

/**
 * Calculates match score between applicant attributes and job requirements
 */
export function calculateMatchScore(
  applicant: {
    skills: string[] | string;
    experience_years: number;
    education: EducationLevel;
  },
  job: {
    required_skills: string[] | string;
    min_experience_years: number;
    min_education: EducationLevel;
  }
): ScoreCalculationResult {
  // Normalize skills arrays
  const applicantSkills = (Array.isArray(applicant.skills) 
    ? applicant.skills 
    : (applicant.skills || '').split(',')
  ).map(s => s.trim().toLowerCase()).filter(Boolean);

  const jobRequiredSkills = (Array.isArray(job.required_skills)
    ? job.required_skills
    : (job.required_skills || '').split(',')
  ).map(s => s.trim().toLowerCase()).filter(Boolean);

  // 1. SKILLS (50 points)
  // "the share of the job's required skills that the applicant has
  // (a skill counts when the applicant's skill contains it or it contains the applicant's skill, ignoring capital letters).
  // If the job lists no skills, give all 50."
  let skillsScore = 50;
  if (jobRequiredSkills.length > 0) {
    let matchedCount = 0;
    for (const reqSkill of jobRequiredSkills) {
      const hasMatch = applicantSkills.some(appSkill => 
        appSkill.includes(reqSkill) || reqSkill.includes(appSkill)
      );
      if (hasMatch) {
        matchedCount++;
      }
    }
    skillsScore = (matchedCount / jobRequiredSkills.length) * 50;
  }

  // 2. EXPERIENCE (30 points)
  // "full marks when the applicant meets the minimum years;
  // otherwise 30 x (applicant years / required years). If none is required, give all 30."
  let experienceScore = 30;
  const minExp = job.min_experience_years || 0;
  const appExp = applicant.experience_years || 0;
  if (minExp > 0) {
    if (appExp >= minExp) {
      experienceScore = 30;
    } else {
      experienceScore = 30 * (appExp / minExp);
    }
  }

  // 3. EDUCATION (20 points)
  // "use the order Any, Primary School, Secondary School, Certificate, Diploma, Degree, Masters, PhD.
  // 20 points when the applicant's level is equal to or higher than required,
  // 10 points when exactly one level below, otherwise 0.
  // If the job says Any, give all 20."
  let educationScore = 20;
  const reqEdu = job.min_education || 'Any';
  const appEdu = applicant.education || 'Any';

  if (reqEdu !== 'Any') {
    const reqRank = getEducationRank(reqEdu);
    const appRank = getEducationRank(appEdu);

    if (appRank >= reqRank) {
      educationScore = 20;
    } else if (appRank === reqRank - 1) {
      educationScore = 10;
    } else {
      educationScore = 0;
    }
  }

  const rawTotal = skillsScore + experienceScore + educationScore;
  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  let label: 'Excellent match' | 'Good match' | 'Fair match' | 'Low match';
  if (totalScore >= 80) {
    label = 'Excellent match';
  } else if (totalScore >= 60) {
    label = 'Good match';
  } else if (totalScore >= 40) {
    label = 'Fair match';
  } else {
    label = 'Low match';
  }

  return {
    totalScore,
    skillsScore: Math.round(skillsScore * 10) / 10,
    experienceScore: Math.round(experienceScore * 10) / 10,
    educationScore: Math.round(educationScore * 10) / 10,
    label
  };
}

/**
 * Ranks and applies automatic selection to applications for a job.
 * 
 * Rules:
 * - Rank by match score (highest first).
 * - Break ties by:
 *     1. more years of experience
 *     2. higher education level
 *     3. who applied first (earlier created_at)
 * - Only when there are MORE applicants than positions:
 *     the top "positions" applicants get status 'selected' and everyone else 'not_selected'.
 *     Otherwise every applicant stays 'pending'.
 * - Never override an applicant the employer has manually shortlisted ('shortlisted').
 */
export function rankAndSelectApplications(
  applications: Application[],
  job: Job
): Application[] {
  if (!applications || applications.length === 0) return [];

  // Sort according to tie-breaking rules
  const sorted = [...applications].sort((a, b) => {
    // 1. Match score
    if (b.match_score !== a.match_score) {
      return b.match_score - a.match_score;
    }
    // 2. Experience years
    if (b.experience_years !== a.experience_years) {
      return b.experience_years - a.experience_years;
    }
    // 3. Education level
    const eduDiff = getEducationRank(b.education) - getEducationRank(a.education);
    if (eduDiff !== 0) {
      return eduDiff;
    }
    // 4. Who applied first (created_at timestamp)
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const positions = Math.max(1, job.positions || 1);
  const total = sorted.length;
  const hasMoreThanPositions = total > positions;

  return sorted.map((app, index) => {
    const rank = index + 1;
    let newStatus = app.status;

    // "Never override an applicant the employer has manually shortlisted"
    if (app.status !== 'shortlisted') {
      if (hasMoreThanPositions) {
        if (rank <= positions) {
          newStatus = 'selected';
        } else {
          newStatus = 'not_selected';
        }
      } else {
        newStatus = 'pending';
      }
    }

    return {
      ...app,
      rank,
      total_applicants: total,
      status: newStatus
    };
  });
}

/**
 * Returns user-facing status label for an applicant:
 * - While job is open: "Applied", "Shortlisted", "Currently selected", "Currently not selected"
 * - When job is closed/expired: "Selected", "Not selected", "Shortlisted", "Under Review"
 */
export function getApplicantDisplayStatus(
  status: ApplicationStatus,
  isJobOpen: boolean
): { text: string; color: string; badgeStyle: string } {
  if (isJobOpen) {
    switch (status) {
      case 'shortlisted':
        return { text: 'Shortlisted', color: '#f5d77a', badgeStyle: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/30' };
      case 'selected':
        return { text: 'Currently selected', color: '#10b981', badgeStyle: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30' };
      case 'not_selected':
        return { text: 'Currently not selected', color: '#ef4444', badgeStyle: 'border-rose-500/40 text-rose-400 bg-rose-950/30' };
      case 'pending':
      default:
        return { text: 'Applied', color: '#d4af37', badgeStyle: 'border-amber-500/40 text-amber-300 bg-amber-950/30' };
    }
  } else {
    switch (status) {
      case 'shortlisted':
        return { text: 'Shortlisted', color: '#f5d77a', badgeStyle: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/30' };
      case 'selected':
        return { text: 'Selected', color: '#10b981', badgeStyle: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40 font-semibold' };
      case 'not_selected':
        return { text: 'Not selected', color: '#9ca3af', badgeStyle: 'border-gray-600/40 text-gray-400 bg-gray-900/40' };
      case 'pending':
      default:
        return { text: 'Under Review', color: '#d4af37', badgeStyle: 'border-amber-500/40 text-amber-300 bg-amber-950/30' };
    }
  }
}

/**
 * Run Acceptance Test specified in Prompt 3:
 *
 * Job requires skills "wiring, repair", 2 years, minimum education Diploma, 2 positions.
 * - Alice: Diploma, 3 years, skills "wiring, repair" -> score 100
 * - Dan: Masters, 2 years, skills "repair" -> score 75
 * - Bob: Degree, 1 year, skills "wiring" -> score 60
 * - Cara: Certificate, 0 years, skills "plumbing" -> score 10
 * Ranking must be Alice, Dan, Bob, Cara.
 * With 2 positions: Alice & Dan = selected, Bob & Cara = not_selected.
 * With 5 positions: all four stay pending.
 */
export function runAcceptanceTest(): {
  success: boolean;
  results: Array<{
    name: string;
    expectedScore: number;
    actualScore: number;
    scorePassed: boolean;
    rank2PositionsStatus: ApplicationStatus;
    rank5PositionsStatus: ApplicationStatus;
  }>;
  orderPassed: boolean;
  positions2Passed: boolean;
  positions5Passed: boolean;
} {
  const testJob: Job = {
    id: 'test-job',
    employer_id: 'emp-1',
    company_name: 'Kenya Power Engineering',
    company_email: 'jobs@kpe.co.ke',
    company_location: 'Nairobi',
    title: 'Electrical Field Technician',
    location: 'Nairobi',
    employment_type: 'Full-time',
    positions: 2,
    min_education: 'Diploma',
    min_experience_years: 2,
    required_skills: ['wiring', 'repair'],
    description: 'Electrical maintenance',
    status: 'open',
    created_at: new Date().toISOString()
  };

  const testApplicants = [
    {
      id: 'app-alice',
      job_id: 'test-job',
      applicant_id: 'user-alice',
      full_name: 'Alice',
      email: 'alice@example.ke',
      phone: '0712345678',
      education: 'Diploma' as EducationLevel,
      experience_years: 3,
      skills: ['wiring', 'repair'],
      cover_message: 'Experienced electrical tech',
      photo_url: '',
      status: 'pending' as ApplicationStatus,
      match_score: 0,
      created_at: '2026-10-01T10:00:00Z'
    },
    {
      id: 'app-dan',
      job_id: 'test-job',
      applicant_id: 'user-dan',
      full_name: 'Dan',
      email: 'dan@example.ke',
      phone: '0722345678',
      education: 'Masters' as EducationLevel,
      experience_years: 2,
      skills: ['repair'],
      cover_message: 'Masters holder with repair background',
      photo_url: '',
      status: 'pending' as ApplicationStatus,
      match_score: 0,
      created_at: '2026-10-01T11:00:00Z'
    },
    {
      id: 'app-bob',
      job_id: 'test-job',
      applicant_id: 'user-bob',
      full_name: 'Bob',
      email: 'bob@example.ke',
      phone: '0733345678',
      education: 'Degree' as EducationLevel,
      experience_years: 1,
      skills: ['wiring'],
      cover_message: 'Degree holder in engineering',
      photo_url: '',
      status: 'pending' as ApplicationStatus,
      match_score: 0,
      created_at: '2026-10-01T12:00:00Z'
    },
    {
      id: 'app-cara',
      job_id: 'test-job',
      applicant_id: 'user-cara',
      full_name: 'Cara',
      email: 'cara@example.ke',
      phone: '0744345678',
      education: 'Certificate' as EducationLevel,
      experience_years: 0,
      skills: ['plumbing'],
      cover_message: 'Starting career in plumbing',
      photo_url: '',
      status: 'pending' as ApplicationStatus,
      match_score: 0,
      created_at: '2026-10-01T13:00:00Z'
    }
  ];

  // Calculate scores
  const appsWithScores = testApplicants.map(app => {
    const calc = calculateMatchScore(app, testJob);
    return {
      ...app,
      match_score: calc.totalScore
    };
  });

  // Rank with 2 positions
  const ranked2 = rankAndSelectApplications(appsWithScores, { ...testJob, positions: 2 });

  // Rank with 5 positions
  const ranked5 = rankAndSelectApplications(appsWithScores, { ...testJob, positions: 5 });

  const expectedScores: Record<string, number> = {
    Alice: 100,
    Dan: 75,
    Bob: 60,
    Cara: 10
  };

  const results = ranked2.map(app => {
    const expected = expectedScores[app.full_name];
    const scorePassed = app.match_score === expected;
    const appInRank5 = ranked5.find(a => a.full_name === app.full_name);
    return {
      name: app.full_name,
      expectedScore: expected,
      actualScore: app.match_score,
      scorePassed,
      rank2PositionsStatus: app.status,
      rank5PositionsStatus: appInRank5 ? appInRank5.status : ('pending' as ApplicationStatus)
    };
  });

  const orderNames = ranked2.map(a => a.full_name);
  const orderPassed = orderNames.join(',') === 'Alice,Dan,Bob,Cara';

  const aliceApp2 = ranked2.find(a => a.full_name === 'Alice');
  const danApp2 = ranked2.find(a => a.full_name === 'Dan');
  const bobApp2 = ranked2.find(a => a.full_name === 'Bob');
  const caraApp2 = ranked2.find(a => a.full_name === 'Cara');

  const positions2Passed =
    aliceApp2?.status === 'selected' &&
    danApp2?.status === 'selected' &&
    bobApp2?.status === 'not_selected' &&
    caraApp2?.status === 'not_selected';

  const positions5Passed = ranked5.every(a => a.status === 'pending');

  const allScoresPassed = results.every(r => r.scorePassed);
  const overallSuccess = orderPassed && positions2Passed && positions5Passed && allScoresPassed;

  return {
    success: overallSuccess,
    results,
    orderPassed,
    positions2Passed,
    positions5Passed
  };
}
