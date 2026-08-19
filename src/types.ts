export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff/Principal';
  minYearsExp: number;
  maxYearsExp: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  policyTier: string;
  status: 'Active' | 'Draft' | 'Filled' | 'Closed';
  createdAt: string;
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  year?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  durationYears?: number;
  highlights: string[];
  skillsUsed: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  currentCompany: string;
  totalYearsExp: number;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  certifications: string[];
  workAuthorization: 'US Citizen / Perm Resident' | 'H1B / Need Transfer' | 'Requires Sponsorship' | 'EU Citizen / Stamp 4' | 'Other';
  salaryExpectation?: string;
  appliedDate: string;
  targetJobId?: string;
  status: 'New' | 'Screened' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected';
  rawResumeText?: string;
  matchResults?: Record<string, CandidateMatchResult>; // jobId -> MatchResult
  recruiterNotes?: string;
  recruiterRating?: number;
}

export interface PolicyCitation {
  policyId: string;
  policyName: string;
  status: 'Compliant' | 'Warning' | 'Exception Needed';
  ruleExcerpt: string;
  note: string;
}

export interface InterviewQuestion {
  category: 'Technical' | 'Behavioral' | 'Architecture / System' | 'Leadership';
  question: string;
  reason: string;
  expectedSignals: string[];
}

export interface CandidateMatchResult {
  candidateId: string;
  jobId: string;
  overallScore: number; // 0 - 100
  breakdown: {
    skillsMatchScore: number;
    experienceMatchScore: number;
    educationCertScore: number;
    policyComplianceScore: number;
    semanticFitScore: number;
  };
  recommendation: 'Strong Hire' | 'Hire' | 'Potential / Further Review' | 'Not Recommended';
  confidence: number; // 0 - 100
  executiveSummary: string;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  bonusSkills: string[];
  keyStrengths: string[];
  identifiedGaps: string[];
  redFlags: string[];
  greenFlags: string[];
  policyCitations: PolicyCitation[];
  interviewQuestions: InterviewQuestion[];
  compensationFit: {
    candidateAsk: string;
    jobBand: string;
    alignmentStatus: 'Within Budget' | 'Slightly Above Budget' | 'Significantly High' | 'Below Budget';
    note: string;
  };
  analyzedAt: string;
}

export interface CompanyPolicy {
  id: string;
  category: 'Compliance & Legal' | 'Compensation & Bands' | 'Work Authorization & Visa' | 'Experience & Education' | 'DEI & Anti-Bias' | 'Remote & Relocation';
  title: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  isMandatory: boolean;
}

export interface BatchScreeningProgress {
  total: number;
  completed: number;
  currentCandidateName?: string;
  isProcessing: boolean;
}

export interface ComparisonReport {
  jobTitle: string;
  candidates: Array<{
    candidate: Candidate;
    matchResult?: CandidateMatchResult;
  }>;
  executiveComparisonSummary: string;
  topPickCandidateId: string;
  tradeoffAnalysis: string;
  skillMatrix: Array<{
    skill: string;
    isRequired: boolean;
    candidateSupport: Record<string, boolean>;
  }>;
}
