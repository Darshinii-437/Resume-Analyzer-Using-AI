import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, Award, ShieldCheck, DollarSign, Clock, Check, HelpCircle } from 'lucide-react';
import { Candidate, JobDescription } from '../types';
import { compareCandidatesWithAI } from '../services/api';

interface ComparisonMatrixModalProps {
  candidateIds: string[];
  candidates: Candidate[];
  job: JobDescription;
  onClose: () => void;
  onOpenDossier: (candidate: Candidate) => void;
}

export const ComparisonMatrixModal: React.FC<ComparisonMatrixModalProps> = ({
  candidateIds,
  candidates,
  job,
  onClose,
  onOpenDossier,
}) => {
  const selectedCandidates = candidates.filter((c) => candidateIds.includes(c.id));
  const [aiReport, setAiReport] = useState<{
    topPickCandidateId: string;
    executiveComparisonSummary: string;
    tradeoffAnalysis: string;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    if (selectedCandidates.length >= 2) {
      setIsLoadingAi(true);
      compareCandidatesWithAI(selectedCandidates, job)
        .then((res) => setAiReport(res))
        .catch((err) => console.error('Failed to compare candidates:', err))
        .finally(() => setIsLoadingAi(false));
    }
  }, [candidateIds, job]);

  // Extract all unique skills across required skills and candidate skills
  const allRequiredSkills = job.requiredSkills || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold">Candidate Side-by-Side Comparison Matrix</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating {selectedCandidates.length} candidates for <strong>{job.title}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 bg-slate-50/50">
          
          {/* AI Executive Comparison & Tradeoff Summary */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Comparative Synthesis & Top Pick</span>
              </div>
              {isLoadingAi && (
                <span className="text-xs text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Generating comparative analysis...
                </span>
              )}
            </div>

            {aiReport ? (
              <div className="space-y-3 text-xs">
                <p className="text-slate-100 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  <strong className="text-white block mb-1">Executive Summary:</strong>
                  {aiReport.executiveComparisonSummary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <span className="text-amber-300 font-bold block mb-1">Tradeoff Analysis:</span>
                    <p className="text-slate-200">{aiReport.tradeoffAnalysis}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col justify-center">
                    <span className="text-emerald-300 font-bold block mb-1">AI Top Recommendation:</span>
                    <span className="text-sm font-extrabold text-white">
                      {selectedCandidates.find((c) => c.id === aiReport.topPickCandidateId)?.name || aiReport.topPickCandidateId}
                    </span>
                  </div>
                </div>
              </div>
            ) : !isLoadingAi ? (
              <p className="text-xs text-slate-300">Select at least 2 candidates to generate synthesis.</p>
            ) : null}
          </div>

          {/* Side-by-Side Comparison Grid Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5 w-48 sticky left-0 bg-slate-100 z-10">Evaluation Metric</th>
                  {selectedCandidates.map((cand) => (
                    <th key={cand.id} className="p-3.5 min-w-[200px] border-l border-slate-200">
                      <div className="space-y-1">
                        <button
                          onClick={() => onOpenDossier(cand)}
                          className="font-bold text-slate-900 hover:text-indigo-600 text-sm text-left block"
                        >
                          {cand.name}
                        </button>
                        <div className="text-[11px] text-slate-500 font-normal">{cand.currentTitle}</div>
                        
                        {cand.matchResults?.[job.id] && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {cand.matchResults[job.id].overallScore}% Match ({cand.matchResults[job.id].recommendation})
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Overall Score */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Overall Match Score
                  </td>
                  {selectedCandidates.map((cand) => {
                    const score = cand.matchResults?.[job.id]?.overallScore;
                    return (
                      <td key={cand.id} className="p-3.5 border-l border-slate-100 font-bold text-slate-800">
                        {score !== undefined ? `${score}%` : 'Not Screened'}
                      </td>
                    );
                  })}
                </tr>

                {/* Experience & Seniority */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Experience & Seniority
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900">{cand.totalYearsExp} Years</span>
                      <div className="text-slate-500 text-[11px]">{cand.currentCompany || 'N/A'}</div>
                    </td>
                  ))}
                </tr>

                {/* Compensation Ask */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Salary Expectation
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700">
                      <span className="font-bold text-emerald-700">{cand.salaryExpectation || 'Flexible'}</span>
                      <div className="text-slate-500 text-[11px]">Band: ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k</div>
                    </td>
                  ))}
                </tr>

                {/* Work Authorization */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Work Authorization
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3 text-sky-600" />
                        {cand.workAuthorization}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Skills Matrix Section Header */}
                <tr className="bg-indigo-50/50">
                  <td colSpan={selectedCandidates.length + 1} className="p-2.5 px-3.5 font-bold text-indigo-900 text-[11px] uppercase tracking-wider">
                    Required Technical Skills Matrix
                  </td>
                </tr>

                {/* Skill Matrix Rows */}
                {allRequiredSkills.map((skill, sIdx) => (
                  <tr key={sIdx} className="hover:bg-slate-50/50">
                    <td className="p-3 sticky left-0 bg-white z-10 font-medium text-slate-700 border-r border-slate-100">
                      {skill}
                    </td>
                    {selectedCandidates.map((cand) => {
                      const candSkills = (cand.skills || []).map((s) => s.toLowerCase());
                      const hasSkill = candSkills.some((cs) => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs));
                      return (
                        <td key={cand.id} className="p-3 border-l border-slate-100">
                          {hasSkill ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-[11px]">Supported</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-normal">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <span className="text-[11px]">Missing</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Action Buttons Row */}
                <tr className="bg-slate-50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Actions
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100">
                      <button
                        onClick={() => onOpenDossier(cand)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Open Dossier
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
