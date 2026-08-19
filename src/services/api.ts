import { Candidate, JobDescription, CompanyPolicy, CandidateMatchResult } from '../types';

export async function parseResumeWithAI(resumeText: string, fileName?: string): Promise<Partial<Candidate>> {
  const response = await fetch('/api/parse-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, fileName }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Parse failed' }));
    throw new Error(err.error || 'Failed to parse resume');
  }

  return response.json();
}

export async function matchCandidateWithAI(
  candidate: Candidate,
  jobDescription: JobDescription,
  companyPolicies: CompanyPolicy[]
): Promise<CandidateMatchResult> {
  const response = await fetch('/api/match-candidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate, jobDescription, companyPolicies }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Match failed' }));
    throw new Error(err.error || 'Failed to match candidate');
  }

  return response.json();
}

export async function generateJobDescriptionWithAI(params: {
  title: string;
  department: string;
  experienceLevel: string;
  minYearsExp: number;
  maxYearsExp: number;
  keySkills: string[];
  workplaceType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
}): Promise<Partial<JobDescription>> {
  const response = await fetch('/api/generate-jd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'JD generation failed' }));
    throw new Error(err.error || 'Failed to generate job description');
  }

  return response.json();
}

export async function compareCandidatesWithAI(
  candidates: Candidate[],
  jobDescription: JobDescription
): Promise<{ topPickCandidateId: string; executiveComparisonSummary: string; tradeoffAnalysis: string }> {
  const response = await fetch('/api/compare-candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidates, jobDescription }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Comparison failed' }));
    throw new Error(err.error || 'Failed to compare candidates');
  }

  return response.json();
}

export async function generateEmailWithAI(params: {
  candidate: Candidate;
  jobDescription: JobDescription;
  emailType: string;
  tone: string;
}): Promise<{ subject: string; body: string }> {
  const response = await fetch('/api/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Email generation failed' }));
    throw new Error(err.error || 'Failed to generate email');
  }

  return response.json();
}

export async function queryRagPolicyWithAI(
  query: string,
  policies: CompanyPolicy[]
): Promise<{ answer: string; relevantPolicyIds: string[] }> {
  const response = await fetch('/api/rag-policy-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, policies }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'RAG query failed' }));
    throw new Error(err.error || 'Failed to query RAG policies');
  }

  return response.json();
}
