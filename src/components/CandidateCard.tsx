import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Candidate, JobDescription } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  job: JobDescription;
  isSelectedForCompare: boolean;
  onToggleCompare: (candidateId: string) => void;
  onOpenDossier: (candidate: Candidate) => void;
  onRunMatch: (candidate: Candidate) => void;
  onStatusChange: (candidateId: string, status: Candidate['status']) => void;
  isMatching: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  job,
  isSelectedForCompare,
  onToggleCompare,
  onOpenDossier,
  onRunMatch,
  onStatusChange,
  isMatching,
}) => {
  const matchResult = candidate.matchResults?.[job.id];
  const overallScore = matchResult?.overallScore;

  // Score Badge Color styling
  const getScoreStyle = (score?: number) => {
    if (!score) return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' };
    if (score >= 90) return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300', text: 'text-emerald-700', badge: 'bg-emerald-600 text-white' };
    if (score >= 75) return { bg: 'bg-blue-50 text-blue-700 border-blue-300', text: 'text-blue-700', badge: 'bg-blue-600 text-white' };
    if (score >= 60) return { bg: 'bg-amber-50 text-amber-700 border-amber-300', text: 'text-amber-700', badge: 'bg-amber-600 text-white' };
    return { bg: 'bg-rose-50 text-rose-700 border-rose-300', text: 'text-rose-700', badge: 'bg-rose-600 text-white' };
  };

  const scoreStyle = getScoreStyle(overallScore);

  // Policy Compliance Summary
  const policyStatusCount = matchResult?.policyCitations?.reduce(
    (acc, cur) => {
      if (cur.status === 'Compliant') acc.compliant++;
      else acc.warning++;
      return acc;
    },
    { compliant: 0, warning: 0 }
  ) || { compliant: 0, warning: 0 };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        isSelectedForCompare
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="p-5">
        {/* Top Header: Checkbox, Name, Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Compare Checkbox */}
            <input
              type="checkbox"
              checked={isSelectedForCompare}
              onChange={() => onToggleCompare(candidate.id)}
              className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              title="Select to compare candidates side-by-side"
            />

            {/* Avatar / Initials */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
              {candidate.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>

            {/* Details */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onOpenDossier(candidate)}
                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-base text-left cursor-pointer"
                >
                  {candidate.name}
                </button>
                
                {/* Status Dropdown */}
                <select
                  value={candidate.status}
                  onChange={(e) => onStatusChange(candidate.id, e.target.value as Candidate['status'])}
                  className="text-[11px] font-semibold py-0.5 px-2 bg-slate-100 border border-slate-200 rounded-md text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="New">New</option>
                  <option value="Screened">Screened</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offered">Offered</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-800">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.currentTitle} {candidate.currentCompany ? `at ${candidate.currentCompany}` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.totalYearsExp} yrs exp
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Match Radial/Pill Score */}
          <div className="flex flex-col items-end flex-shrink-0">
            {overallScore !== undefined ? (
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreStyle.bg}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{overallScore}% Match</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-1 text-right">
                  {matchResult?.recommendation}
                </div>
              </div>
            ) : (
              <button
                onClick={() => onRunMatch(candidate)}
                disabled={isMatching}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Run AI Screen</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Match Overview (if analyzed) */}
        {matchResult ? (
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
            {/* Executive Summary */}
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
              <span className="font-semibold text-slate-800">AI Summary: </span>
              {matchResult.executiveSummary}
            </p>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Skills Fit</span>
                  <span className="font-semibold text-slate-800">{matchResult.breakdown.skillsMatchScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.skillsMatchScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Experience</span>
                  <span className="font-semibold text-slate-800">{matchResult.breakdown.experienceMatchScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.experienceMatchScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>Education/Cert</span>
                  <span className="font-semibold text-slate-800">{matchResult.breakdown.educationCertScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.educationCertScore}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between text-slate-500 mb-1">
                  <span>RAG Policy</span>
                  <span className="font-semibold text-slate-800">{matchResult.breakdown.policyComplianceScore}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${matchResult.breakdown.policyComplianceScore}%` }} />
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skills chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
              <span className="text-slate-400 font-medium text-[11px] mr-1">Skills:</span>
              {matchResult.matchedSkills.slice(0, 4).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skill}
                </span>
              ))}
              {matchResult.missingRequiredSkills.slice(0, 2).map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200/80"
                >
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  Missing: {skill}
                </span>
              ))}
              {matchResult.matchedSkills.length > 4 && (
                <span className="text-[11px] text-slate-400">
                  +{matchResult.matchedSkills.length - 4} more
                </span>
              )}
            </div>

            {/* RAG Policy & Compensation Badges */}
            <div className="flex items-center justify-between gap-2 pt-2 text-xs flex-wrap">
              <div className="flex items-center gap-3">
                {/* Policy Compliance Pill */}
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>
                    RAG Policy:{' '}
                    {policyStatusCount.warning > 0 ? (
                      <span className="text-amber-700 font-semibold">{policyStatusCount.warning} Warning</span>
                    ) : (
                      <span className="text-emerald-700 font-semibold">100% Compliant</span>
                    )}
                  </span>
                </div>

                {/* Salary Ask */}
                {candidate.salaryExpectation && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-600">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ask: <strong className="text-slate-800">{candidate.salaryExpectation}</strong></span>
                  </div>
                )}
              </div>

              {/* View Deep Dossier Action */}
              <button
                onClick={() => onOpenDossier(candidate)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group-hover:translate-x-0.5"
              >
                <span>View Full Candidate Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Candidate submitted on {candidate.appliedDate}. Ready for screening.</span>
            <button
              onClick={() => onOpenDossier(candidate)}
              className="text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
            >
              View Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
