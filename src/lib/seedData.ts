/**
 * Realistic Demo Seed Data for Kenyan Job Market
 */

import {
  AppNotification,
  Application,
  ChatMessage,
  Conversation,
  Interview,
  Job,
  PlatformSettings,
  Profile,
  User
} from '../types';

export const DEFAULT_ADMIN_EMAIL = 'wesambainnocent0@gmail.com';

export const INITIAL_SETTINGS: PlatformSettings = {
  featuredPrice7Days: 300,
  featuredPrice30Days: 1000,
  mpesaTillNumber: '849201',
  mpesaPaybillNumber: '522522',
  mpesaAccountNumber: 'JOBCONNECT',
  supportEmail: 'support@jobconnect.co.ke',
  supportPhone: '0710800205',
  emailNotificationsEnabled: true,
  darajaStkEnabled: true,
  adminEmail: DEFAULT_ADMIN_EMAIL
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Innocent Wesamba (Admin)',
    email: DEFAULT_ADMIN_EMAIL,
    phone: '+254 711 000 111',
    role: 'admin',
    created_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'user-emp-1',
    name: 'Safaricom Digital Services',
    email: 'careers@safardigital.ke',
    phone: '+254 722 000 222',
    role: 'employer',
    created_at: '2026-09-05T09:00:00Z'
  },
  {
    id: 'user-emp-2',
    name: 'Kilindini Coastal Logistics',
    email: 'hr@kilindinilogistics.co.ke',
    phone: '+254 733 000 333',
    role: 'employer',
    created_at: '2026-09-10T10:00:00Z'
  },
  {
    id: 'user-emp-3',
    name: 'Mara Serene Wildlife Lodges',
    email: 'talent@maraserenelodges.co.ke',
    phone: '+254 744 000 444',
    role: 'employer',
    created_at: '2026-09-12T11:00:00Z'
  },
  {
    id: 'user-alice',
    name: 'Alice Wanjiku',
    email: 'alice.wanjiku@gmail.com',
    phone: '+254 712 345 678',
    role: 'jobseeker',
    created_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'user-dan',
    name: 'Dan Kipchoge',
    email: 'dan.kipchoge@outlook.com',
    phone: '+254 722 345 678',
    role: 'jobseeker',
    created_at: '2026-09-16T13:00:00Z'
  },
  {
    id: 'user-bob',
    name: 'Bob Otieno',
    email: 'bob.otieno@yahoo.com',
    phone: '+254 733 345 678',
    role: 'jobseeker',
    created_at: '2026-09-17T14:00:00Z'
  },
  {
    id: 'user-cara',
    name: 'Cara Muthoni',
    email: 'cara.muthoni@gmail.com',
    phone: '+254 744 345 678',
    role: 'jobseeker',
    created_at: '2026-09-18T15:00:00Z'
  }
];

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof-alice',
    user_id: 'user-alice',
    location: 'Westlands, Nairobi',
    education: 'Diploma',
    field_of_study: 'Electrical & Electronics Engineering',
    skills: ['wiring', 'repair', 'circuit troubleshooting', 'safety protocols'],
    experience_years: 3,
    experience_details: '3 years doing commercial equipment maintenance and domestic wiring at Nairobi Power Grid Subcontractors.',
    portfolio_url: 'https://github.com/alicewanjiku-portfolio',
    referee_name: 'Eng. David Kariuki',
    referee_phone: '+254 720 111 222',
    referee_relationship: 'Former Maintenance Supervisor',
    updated_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'prof-dan',
    user_id: 'user-dan',
    location: 'Eldoret CBD, Uasin Gishu',
    education: 'Masters',
    field_of_study: 'MSc Applied Systems & Mechatronics',
    skills: ['repair', 'automation', 'diagnostics', 'python'],
    experience_years: 2,
    experience_details: '2 years diagnostic and repair specialist at Eldoret Agro-Processing plants.',
    portfolio_url: 'https://dankipchoge.tech',
    referee_name: 'Dr. Joseph Bett',
    referee_phone: '+254 722 333 444',
    referee_relationship: 'Head of Mechatronics Dept, Moi University',
    updated_at: '2026-09-16T13:00:00Z'
  },
  {
    id: 'prof-bob',
    user_id: 'user-bob',
    location: 'Kisumu Central',
    education: 'Degree',
    field_of_study: 'BSc Electrical Engineering',
    skills: ['wiring', 'cad', 'solar installation'],
    experience_years: 1,
    experience_details: '1 year as graduate trainee handling residential solar wiring in Lake Region.',
    portfolio_url: 'https://bobotieno.ke',
    referee_name: 'Florence Achieng',
    referee_phone: '+254 733 555 666',
    referee_relationship: 'Senior Project Engineer, SolarEdge Kisumu',
    updated_at: '2026-09-17T14:00:00Z'
  },
  {
    id: 'prof-cara',
    user_id: 'user-cara',
    location: 'Thika, Kiambu',
    education: 'Certificate',
    field_of_study: 'Building Services & Plumbing',
    skills: ['plumbing', 'pipe fitting'],
    experience_years: 0,
    experience_details: 'Recent graduate from Thika Technical Training Institute with hands-on pipe installation training.',
    referee_name: 'Mr. Peter Kamau',
    referee_phone: '+254 711 777 888',
    referee_relationship: 'Instructor at Thika TTI',
    updated_at: '2026-09-18T15:00:00Z'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    employer_id: 'user-emp-1',
    company_name: 'Safaricom Digital Services',
    company_email: 'careers@safardigital.ke',
    company_website: 'https://www.safaricom.co.ke',
    company_location: 'Westlands, Nairobi',
    company_description: 'Leading communications and mobile fintech innovation company in East Africa.',
    company_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    title: 'Electrical Field & Network Technician',
    location: 'Nairobi CBD',
    employment_type: 'Full-time',
    salary: 'KSh 65,000 - 85,000',
    positions: 2,
    deadline: '2026-11-30',
    min_education: 'Diploma',
    min_experience_years: 2,
    required_skills: ['wiring', 'repair'],
    certifications: 'ERC/EPRA Electrical License Class C or higher',
    description: 'We are seeking 2 detail-oriented Electrical Technicians to install, wire, inspect, and repair high-availability telecom power units and backup power systems across Nairobi cell sites.',
    responsibilities: '1. Execute preventative wiring and electrical maintenance across telecom distribution boards.\n2. Troubleshoot and conduct component-level repair on backup battery banks and inverter systems.\n3. Ensure stringent compliance with Kenyan EPRA safety protocols and Safaricom SLA targets.',
    benefits: 'Comprehensive medical insurance covering spouse & dependents, pension scheme, airtime allowance, annual performance bonus.',
    status: 'open',
    featured_until: '2026-11-20T23:59:59Z', // Featured
    created_at: '2026-10-01T09:00:00Z',
    applicant_count: 4
  },
  {
    id: 'job-2',
    employer_id: 'user-emp-2',
    company_name: 'Kilindini Coastal Logistics',
    company_email: 'hr@kilindinilogistics.co.ke',
    company_website: 'https://kilindinilogistics.co.ke',
    company_location: 'Mombasa Island',
    company_description: 'Premier freight forwarding, customs clearance, and container transport solutions across the Port of Mombasa and the Northern Corridor.',
    title: 'Fleet Logistics & Operations Coordinator',
    location: 'Mombasa Island',
    employment_type: 'Full-time',
    salary: 'KSh 50,000 - 70,000',
    positions: 1,
    deadline: '2026-12-15',
    min_education: 'Diploma',
    min_experience_years: 2,
    required_skills: ['fleet management', 'customs documentation', 'logistics dispatch', 'excel'],
    certifications: 'CILT Certificate or KRA Simba/KIMS clearance certificate is an advantage',
    description: 'Oversee daily container dispatch from Kilindini Port, coordinate long-distance trucks traversing to Nairobi and Malaba, and monitor vehicle telemetry.',
    responsibilities: '1. Schedule truck arrivals at port berths and coordinate container gate passes.\n2. Monitor fuel consumption and driver compliance via GPS tracking.\n3. Resolve border clearance delays with KRA and transit authorities.',
    benefits: 'Airtime stipend, transport to and from port terminal, overtime pay.',
    status: 'open',
    featured_until: '2026-11-15T23:59:59Z',
    created_at: '2026-10-05T10:30:00Z',
    applicant_count: 2
  },
  {
    id: 'job-3',
    employer_id: 'user-emp-1',
    company_name: 'Safaricom Digital Services',
    company_email: 'careers@safardigital.ke',
    company_website: 'https://www.safaricom.co.ke',
    company_location: 'Westlands, Nairobi',
    title: 'Junior React & Mobile Web Developer',
    location: 'Westlands, Nairobi',
    employment_type: 'Full-time',
    salary: 'KSh 90,000 - 130,000',
    positions: 3,
    deadline: '2026-11-25',
    min_education: 'Degree',
    min_experience_years: 1,
    required_skills: ['react', 'typescript', 'tailwind', 'git'],
    certifications: 'Relevant BSc Computer Science, Software Engineering or equivalent boot-camp certification',
    description: 'Join our merchant payment app team building fast, lightweight mobile web experiences tailored for Kenyans on 3G and 4G Android devices.',
    responsibilities: '1. Build responsive frontend views in React and TypeScript with accessible UI.\n2. Optimize bundle size and offline caching for slow mobile network conditions.\n3. Integrate RESTful backend APIs and Daraja M-Pesa merchant payment flows.',
    benefits: 'Hybrid work policy (2 days WFH), modern MacBook, health cover, stock purchase discounts.',
    status: 'open',
    created_at: '2026-10-10T14:00:00Z',
    applicant_count: 1
  },
  {
    id: 'job-4',
    employer_id: 'user-emp-3',
    company_name: 'Mara Serene Wildlife Lodges',
    company_email: 'talent@maraserenelodges.co.ke',
    company_website: 'https://serenahotels.com',
    company_location: 'Narok County',
    title: 'Safari Lodge Guest Relations & Front Desk Supervisor',
    location: 'Narok County',
    employment_type: 'Contract',
    salary: 'KSh 45,000 - 60,000',
    positions: 2,
    deadline: '2026-12-01',
    min_education: 'Certificate',
    min_experience_years: 1,
    required_skills: ['customer service', 'hotel management', 'communication', 'english'],
    certifications: 'Utalii College certification or Tourism Board certification',
    description: 'Welcome domestic and international eco-tourists to the world-renowned Maasai Mara, manage luxury tent bookings, and coordinate guided game drives.',
    responsibilities: '1. Handle seamless guest check-ins, briefings, and special dietary requests.\n2. Liaise with local Maasai community guides and safari drivers.\n3. Maintain front office billing and POS reconciliation.',
    benefits: 'On-site full board accommodation inside the reserve, safari vehicle excursions, laundry services.',
    status: 'open',
    created_at: '2026-10-12T08:00:00Z',
    applicant_count: 0
  },
  {
    id: 'job-5',
    employer_id: 'user-emp-2',
    company_name: 'Kilindini Coastal Logistics',
    company_email: 'hr@kilindinilogistics.co.ke',
    company_location: 'Nakuru Town',
    title: 'Heavy Commercial Vehicle Mechanic',
    location: 'Nakuru Town',
    employment_type: 'Full-time',
    salary: 'KSh 40,000 - 55,000',
    positions: 2,
    deadline: '2026-11-18',
    min_education: 'Certificate',
    min_experience_years: 3,
    required_skills: ['diesel engines', 'air brakes', 'repair', 'preventative maintenance'],
    description: 'Maintain prime mover trucks (Scania, Mercedes Actros) at our Nakuru regional transit depot along the Nairobi-Eldoret highway.',
    responsibilities: '1. Diagnose engine compression, gearbox and differential issues.\n2. Overhaul brake drums, turbochargers, and suspension springs.\n3. Conduct 24/7 roadside emergency breakdown repairs.',
    benefits: 'Overtime pay, workshop safety gear provided, tools allowance.',
    status: 'open',
    created_at: '2026-10-14T11:00:00Z',
    applicant_count: 0
  }
];

// Sample passport photo placeholder (clean data URI)
const SAMPLE_PASSPORT_ALICE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450"><rect width="350" height="450" fill="%231a2332"/><circle cx="175" cy="170" r="80" fill="%23d4af37"/><path d="M70 390 C70 280 280 280 280 390 Z" fill="%23223145"/><text x="175" y="420" font-family="sans-serif" font-size="16" fill="%23f5d77a" text-anchor="middle">Alice Wanjiku (Passport Photo)</text></svg>';

const SAMPLE_PASSPORT_DAN = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450"><rect width="350" height="450" fill="%23192e27"/><circle cx="175" cy="170" r="80" fill="%23f5d77a"/><path d="M70 390 C70 280 280 280 280 390 Z" fill="%23133626"/><text x="175" y="420" font-family="sans-serif" font-size="16" fill="%23f5d77a" text-anchor="middle">Dan Kipchoge (Passport Photo)</text></svg>';

const SAMPLE_PASSPORT_BOB = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450"><rect width="350" height="450" fill="%232d1f33"/><circle cx="175" cy="170" r="80" fill="%23e8be48"/><path d="M70 390 C70 280 280 280 280 390 Z" fill="%233a1e45"/><text x="175" y="420" font-family="sans-serif" font-size="16" fill="%23f5d77a" text-anchor="middle">Bob Otieno (Passport Photo)</text></svg>';

const SAMPLE_PASSPORT_CARA = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450"><rect width="350" height="450" fill="%232c2518"/><circle cx="175" cy="170" r="80" fill="%23c49726"/><path d="M70 390 C70 280 280 280 280 390 Z" fill="%2342331c"/><text x="175" y="420" font-family="sans-serif" font-size="16" fill="%23f5d77a" text-anchor="middle">Cara Muthoni (Passport Photo)</text></svg>';

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-alice-1',
    job_id: 'job-1',
    applicant_id: 'user-alice',
    full_name: 'Alice Wanjiku',
    email: 'alice.wanjiku@gmail.com',
    phone: '+254 712 345 678',
    education: 'Diploma',
    experience_years: 3,
    skills: ['wiring', 'repair', 'circuit troubleshooting', 'safety protocols'],
    portfolio_url: 'https://github.com/alicewanjiku-portfolio',
    cover_message: 'I have 3 years of hands-on experience wiring telecommunication power cabinets and repairing power backups. I am eager to contribute to Safaricom network uptime.',
    photo_url: SAMPLE_PASSPORT_ALICE,
    status: 'selected',
    match_score: 100,
    score_breakdown: {
      skillsScore: 50,
      experienceScore: 30,
      educationScore: 20
    },
    rank: 1,
    total_applicants: 4,
    created_at: '2026-10-02T10:00:00Z'
  },
  {
    id: 'app-dan-1',
    job_id: 'job-1',
    applicant_id: 'user-dan',
    full_name: 'Dan Kipchoge',
    email: 'dan.kipchoge@outlook.com',
    phone: '+254 722 345 678',
    education: 'Masters',
    experience_years: 2,
    skills: ['repair', 'automation', 'diagnostics'],
    portfolio_url: 'https://dankipchoge.tech',
    cover_message: 'With an MSc in Applied Mechatronics and 2 years diagnostic repair experience, I excel in rapid electrical fault resolution.',
    photo_url: SAMPLE_PASSPORT_DAN,
    status: 'selected',
    match_score: 75,
    score_breakdown: {
      skillsScore: 25,
      experienceScore: 30,
      educationScore: 20
    },
    rank: 2,
    total_applicants: 4,
    created_at: '2026-10-02T11:00:00Z'
  },
  {
    id: 'app-bob-1',
    job_id: 'job-1',
    applicant_id: 'user-bob',
    full_name: 'Bob Otieno',
    email: 'bob.otieno@yahoo.com',
    phone: '+254 733 345 678',
    education: 'Degree',
    experience_years: 1,
    skills: ['wiring', 'cad'],
    portfolio_url: 'https://bobotieno.ke',
    cover_message: 'Degree graduate in Electrical Engineering with commercial wiring background ready to learn and execute.',
    photo_url: SAMPLE_PASSPORT_BOB,
    status: 'not_selected',
    match_score: 60,
    score_breakdown: {
      skillsScore: 25,
      experienceScore: 15,
      educationScore: 20
    },
    rank: 3,
    total_applicants: 4,
    created_at: '2026-10-02T12:00:00Z'
  },
  {
    id: 'app-cara-1',
    job_id: 'job-1',
    applicant_id: 'user-cara',
    full_name: 'Cara Muthoni',
    email: 'cara.muthoni@gmail.com',
    phone: '+254 744 345 678',
    education: 'Certificate',
    experience_years: 0,
    skills: ['plumbing'],
    cover_message: 'Dedicated building maintenance technician looking forward to transitioning into electrical infrastructure.',
    photo_url: SAMPLE_PASSPORT_CARA,
    status: 'not_selected',
    match_score: 10,
    score_breakdown: {
      skillsScore: 0,
      experienceScore: 0,
      educationScore: 10
    },
    rank: 4,
    total_applicants: 4,
    created_at: '2026-10-02T13:00:00Z'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    conversation_id: 'conv-alice-safaricom',
    job_id: 'job-1',
    job_title: 'Electrical Field & Network Technician',
    employer_id: 'user-emp-1',
    employer_name: 'Safaricom Digital Services',
    applicant_id: 'user-alice',
    applicant_name: 'Alice Wanjiku',
    applicant_phone: '+254 712 345 678',
    scheduled_date: '2026-10-28',
    scheduled_time: '10:00 AM',
    format: 'video',
    location_or_link: 'Google Meet: meet.google.com/saf-elec-interview',
    notes: 'Technical panel interview covering commercial equipment wiring, power distribution units, and EPRA compliance.',
    status: 'scheduled',
    created_at: '2026-10-18T10:00:00Z'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-alice-safaricom',
    job_id: 'job-1',
    job_title: 'Electrical Field & Network Technician',
    employer_id: 'user-emp-1',
    employer_name: 'Safaricom Digital Services',
    applicant_id: 'user-alice',
    applicant_name: 'Alice Wanjiku',
    applicant_photo: SAMPLE_PASSPORT_ALICE,
    last_message: 'Hi Alice! Your qualification score ranked #1 for our Electrical Technician position. We have scheduled an interview for you.',
    last_message_at: '2026-10-18T10:05:00Z',
    interview: INITIAL_INTERVIEWS[0],
    created_at: '2026-10-18T09:45:00Z'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-alice-safaricom',
    sender_id: 'user-emp-1',
    sender_name: 'Safaricom Digital Services',
    sender_role: 'employer',
    text: 'Hello Alice, we reviewed your verified application and 3 years experience at Nairobi Power Grid. Your profile scored 100/100 on our qualification match.',
    created_at: '2026-10-18T09:45:00Z'
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-alice-safaricom',
    sender_id: 'user-alice',
    sender_name: 'Alice Wanjiku',
    sender_role: 'jobseeker',
    text: 'Thank you very much! I am thrilled about this opportunity and ready to discuss how I can maintain telecom power uptime.',
    created_at: '2026-10-18T09:50:00Z'
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-alice-safaricom',
    sender_id: 'user-emp-1',
    sender_name: 'Safaricom Digital Services',
    sender_role: 'employer',
    text: 'Hi Alice! Your qualification score ranked #1 for our Electrical Technician position. We have scheduled an interview for you on 28 Oct 2026 at 10:00 AM EAT via Google Meet.',
    created_at: '2026-10-18T10:05:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'user-alice',
    title: 'Interview Scheduled: Safaricom Digital Services',
    message: 'You have been invited for a Technical Panel Interview for Electrical Field & Network Technician on 28 Oct 2026 at 10:00 AM.',
    type: 'interview_invite',
    link_view: 'messages',
    link_param: 'conv-alice-safaricom',
    is_read: false,
    created_at: '2026-10-18T10:05:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'user-alice',
    title: 'Application Ranked #1 (Selected)',
    message: 'Your application for Electrical Field & Network Technician is currently ranked #1 of 4 with a 100/100 qualification score!',
    type: 'status_update',
    link_view: 'my-applications',
    is_read: false,
    created_at: '2026-10-02T10:05:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'user-alice',
    title: 'New Matching Job in Nairobi CBD',
    message: 'Safaricom Digital Services posted a job requiring your skills ("wiring, repair"): Electrical Field & Network Technician (KSh 65,000 - 85,000).',
    type: 'job_match',
    link_view: 'job-details',
    link_param: 'job-1',
    is_read: true,
    created_at: '2026-10-01T09:05:00Z'
  },
  {
    id: 'notif-4',
    user_id: 'user-dan',
    title: 'Application Ranked #2 (Selected)',
    message: 'Your application for Electrical Field & Network Technician has been selected in the top 2 positions (Score 75/100).',
    type: 'status_update',
    link_view: 'my-applications',
    is_read: false,
    created_at: '2026-10-02T11:05:00Z'
  }
];

