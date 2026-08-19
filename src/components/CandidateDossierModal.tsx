import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MessageSquare, 
  Mail, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  Star, 
  Send,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { Candidate, JobDescription, CompanyPolicy, CandidateMatchResult } from '../types';
import { generateEmailWithAI, matchCandidateWithAI } from '../services/api';

interface CandidateDossierModalProps {
  candidate: Candidate;
  job: JobDescription;
  policies: CompanyPolicy[];
  onClose: () => void;
  onUpdateCandidate: (updated: Candidate) => void;
}

export const CandidateDossierModal: React.FC<CandidateDossierModalProps> = ({
  candidate,
  job,
  policies,
  onClose,
  onUpdateCandidate,
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'policy' | 'interview' | 'email' | 'resume'>('match');
  const [isReAnalyzing, setIsReAnalyzing] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState(candidate.recruiterNotes || '');
  const [recruiterRating, setRecruiterRating] = useState<number>(candidate.recruiterRating || 0);

  // Email Generator State
  const [emailType, setEmailType] = useState('Interview Invitation');
  const [emailTone, setEmailTone] = useState('Warm & Encouraging');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const matchResult = candidate.matchResults?.[job.id];

  // Re-run AI analysis
  const handleReScreen = async () => {
    setIsReAnalyzing(true);
    try {
      const result = await matchCandidateWithAI(candidate, job, policies);
      const updated: Candidate = {
        ...candidate,
        status: 'Screened',
        matchResults: {
          ...(candidate.matchResults || {}),
          [job.id]: result,
        },
      };
      onUpdateCandidate(updated);
    } catch (err) {
      console.error('Failed to re-screen candidate:', err);
    } finally {
      setIsReAnalyzing(false);
    }
  };

  // Save Recruiter Notes & Rating
  const handleSaveNotes = () => {
    const updated: Candidate = {
      ...candidate,
      recruiterNotes,
      recruiterRating,
    };
    onUpdateCandidate(updated);
  };

  // Generate Email
  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    try {
      const email = await generateEmailWithAI({
        candidate,
        jobDescription: job,
        emailType,
        tone: emailTone,
      });
      setGeneratedEmail(email);
    } catch (err) {
      console.error('Failed to generate email:', err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const score = matchResult?.overallScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-teal-400 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                {candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-white">{candidate.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                    Applying for: {job.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {candidate.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    {candidate.currentTitle} {candidate.currentCompany ? `@ ${candidate.currentCompany}` : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {candidate.totalYearsExp} Years Experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    {candidate.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    {candidate.workAuthorization}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Score Badge & Close */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {score !== undefined && (
                <div className="text-right bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-700">
                  <div className="text-xs text-slate-400 font-medium">Match Score</div>
                  <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1 justify-end">
                    <Sparkles className="w-4 h-4" />
                    <span>{score}%</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-semibold">{matchResult?.recommendation}</div>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-t border-slate-800/80 pt-3 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('match')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'match'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Suitability & Match Fit</span>
            </button>

            <button
              onClick={() => setActiveTab('policy')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'policy'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RAG Policy Compliance ({matchResult?.policyCitations?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tailored Interview Rubric</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Outreach & Email Drafter</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume & Recruiter Notes</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 bg-slate-50/50">
          
          {/* TAB 1: AI Suitability & Match Fit */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              {matchResult ? (
                <>
                  {/* Executive Summary Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900">Executive Fit & Decision Summary</h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {matchResult.confidence}% AI Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {matchResult.executiveSummary}
                    </p>
                  </div>

                  {/* Multi-Dimensional Score Breakdown */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      Multi-Dimensional Scoring Breakdown
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 mb-1">Skills Match</div>
                        <div className="text-xl font-extrabold text-indigo-600">{matchResult.breakdown.skillsMatchScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.skillsMatchScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 mb-1">Experience Trajectory</div>
                        <div className="text-xl font-extrabold text-emerald-600">{matchResult.breakdown.experienceMatchScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.experienceMatchScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 mb-1">Education & Certs</div>
                        <div className="text-xl font-extrabold text-sky-600">{matchResult.breakdown.educationCertScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.educationCertScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 mb-1">RAG Policy Fit</div>
                        <div className="text-xl font-extrabold text-amber-600">{matchResult.breakdown.policyComplianceScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.policyComplianceScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <div className="text-[11px] text-slate-500 mb-1">Semantic Role Fit</div>
                        <div className="text-xl font-extrabold text-purple-600">{matchResult.breakdown.semanticFitScore}%</div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.semanticFitScore}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills Alignment Matrix */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Detailed Skills Alignment Matrix
                    </h3>

                    {/* Matched Skills */}
                    <div>
                      <span className="text-xs font-semibold text-slate-700 block mb-2">
                        Matched Required & Preferred Skills ({matchResult.matchedSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matchedSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Required Skills */}
                    {matchResult.missingRequiredSkills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-rose-700 block mb-2">
                          Missing Job Requirements ({matchResult.missingRequiredSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.missingRequiredSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bonus Candidate Skills */}
                    {matchResult.bonusSkills.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-slate-600 block mb-2">
                          Additional Value-Add Competencies ({matchResult.bonusSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.bonusSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key Strengths & Identified Gaps (2 columns) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Key Candidate Strengths ({matchResult.keyStrengths.length})
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {matchResult.keyStrengths.map((str, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Gaps */}
                    <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Identified Gaps & Growth Areas ({matchResult.identifiedGaps.length})
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {matchResult.identifiedGaps.map((gap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Compensation & Budget Fit Card */}
                  {matchResult.compensationFit && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        Compensation & Budget Calibration
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-slate-500 block text-[11px]">Candidate Ask</span>
                          <span className="font-bold text-slate-800 text-sm">{matchResult.compensationFit.candidateAsk}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-slate-500 block text-[11px]">Approved Job Band</span>
                          <span className="font-bold text-slate-800 text-sm">{matchResult.compensationFit.jobBand}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                          <span className="text-slate-500 block text-[11px]">Budget Status</span>
                          <span className="font-bold text-emerald-700 text-sm">{matchResult.compensationFit.alignmentStatus}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-lg">
                        {matchResult.compensationFit.note}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-bounce" />
                  <h3 className="text-base font-bold text-slate-900">No Screening Analysis Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click the button below to have Gemini evaluate this candidate against the job description and company hiring policies.
                  </p>
                  <button
                    onClick={handleReScreen}
                    disabled={isReAnalyzing}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isReAnalyzing ? 'Analyzing Candidate with AI...' : 'Run AI Match Evaluation'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RAG Policy Compliance & Knowledge Base Citations */}
          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                      Retrieval-Augmented Generation (RAG) Policy Check
                    </h3>
                    <p className="text-xs text-sky-800 mt-1">
                      Candidate qualifications, residency, work authorization, and salary expectations were cross-referenced against active company hiring standards.
                    </p>
                  </div>
                </div>
              </div>

              {matchResult?.policyCitations && matchResult.policyCitations.length > 0 ? (
                <div className="space-y-3">
                  {matchResult.policyCitations.map((citation, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase">Policy Citation #{i + 1}</span>
                          <h4 className="text-sm font-bold text-slate-900">{citation.policyName}</h4>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                            citation.status === 'Compliant'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : citation.status === 'Warning'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {citation.status}
                        </span>
                      </div>

                      {/* Rule Excerpt */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-400 font-semibold text-[11px] block mb-1">Company Standard Excerpt:</span>
                        <p className="text-slate-700 italic">"{citation.ruleExcerpt}"</p>
                      </div>

                      {/* RAG Note */}
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">Compliance Audit Note: </span>
                        {citation.note}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  Run AI Screen to generate automated policy citations.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Tailored Interview Rubric */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    AI-Generated Targeted Interview Questions
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Customized to Candidate's Specific Gaps & Strengths</span>
                </div>
                <p className="text-xs text-slate-600">
                  These questions are dynamically generated by Gemini to probe candidate depth in critical areas where the resume is either exceptionally strong or shows a potential gap.
                </p>
              </div>

              {matchResult?.interviewQuestions && matchResult.interviewQuestions.length > 0 ? (
                <div className="space-y-3">
                  {matchResult.interviewQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {q.category} Question #{i + 1}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900">
                        {q.question}
                      </p>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-800">Recruiter Rationale: </span>
                        {q.reason}
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                          Expected Positive Signals:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {q.expectedSignals.map((signal, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  Run AI Screen to generate tailored interview rubrics.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Outreach & Email Drafter */}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Personalized Candidate Communication Drafter
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Purpose</label>
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Interview Invitation">Interview Invitation (Initial Round)</option>
                      <option value="Technical Deep-Dive Loop">Technical Deep-Dive / Onsite Loop</option>
                      <option value="Job Offer">Formal Written Job Offer</option>
                      <option value="Polite Rejection">Polite & Respectful Rejection</option>
                      <option value="Clarification Request">Experience / Visa Clarification Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
                    <select
                      value={emailTone}
                      onChange={(e) => setEmailTone(e.target.value)}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Warm & Encouraging">Warm & Encouraging</option>
                      <option value="Professional & Direct">Professional & Direct</option>
                      <option value="Executive & High-Impact">Executive & High-Impact</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateEmail}
                  disabled={isGeneratingEmail}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingEmail ? 'Drafting Personalized Email...' : 'Generate Personalized Email Draft'}</span>
                </button>
              </div>

              {generatedEmail && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Draft Preview</span>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700">Subject: </span>
                    <span className="text-slate-900 font-bold">{generatedEmail.subject}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                    {generatedEmail.body}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Resume Details & Recruiter Notes */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              {/* Recruiter Evaluation Notes & Rating */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    Recruiter Rating & Private Notes
                  </h3>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRecruiterRating(star)}
                        className="p-1 text-slate-300 hover:text-amber-400 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= recruiterRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  placeholder="Add private recruiter notes, phone screen impressions, or team feedback here..."
                  rows={3}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Extracted Work Experience Timeline */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Work Experience History
                </h3>

                <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-4">
                  {candidate.experience.map((exp, i) => (
                    <div key={i} className="relative space-y-1.5">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-sm" />
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <h4 className="text-xs font-bold text-slate-900">{exp.role}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">{exp.period}</span>
                      </div>
                      <div className="text-xs font-semibold text-indigo-600">{exp.company}</div>
                      
                      <ul className="space-y-1 text-xs text-slate-600 pt-1">
                        {exp.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {exp.skillsUsed?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5">
                          {exp.skillsUsed.map((s, sIdx) => (
                            <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Credentials */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Education & Certifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {candidate.education.map((edu, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.institution} {edu.year ? `(${edu.year})` : ''}</div>
                      {edu.field && <div className="text-indigo-600 text-[11px] mt-0.5">{edu.field}</div>}
                    </div>
                  ))}
                </div>

                {candidate.certifications?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-600 block mb-1.5">Verified Certifications</span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.certifications.map((cert, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw Resume Text Viewer */}
              {candidate.rawResumeText && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raw Resume Document Text</h3>
                  <pre className="text-[11px] bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap font-mono max-h-60">
                    {candidate.rawResumeText}
                  </pre>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Candidate Pipeline Status:</span>
            <select
              value={candidate.status}
              onChange={(e) => {
                const updated: Candidate = { ...candidate, status: e.target.value as Candidate['status'] };
                onUpdateCandidate(updated);
              }}
              className="text-xs font-bold py-1 px-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="New">New</option>
              <option value="Screened">Screened</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReScreen}
              disabled={isReAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isReAnalyzing ? 'Re-evaluating with AI...' : 'Re-Run AI Analysis'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
