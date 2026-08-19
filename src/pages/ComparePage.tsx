import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Check, 
  X, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Award, 
  TrendingUp, 
  HelpCircle,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Candidate, JobDescription } from '../types';
import { compareCandidatesWithAI } from '../services/api';

interface ComparePageProps {
  jobs: JobDescription[];
  selectedJob: JobDescription | null;
  onSelectJob: (job: JobDescription) => void;
  candidates: Candidate[];
  selectedCompareIds: string[];
  onToggleCompare: (candidateId: string) => void;
  onOpenDossier: (candidate: Candidate) => void;
  onClearCompare: () => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  candidates,
  selectedCompareIds,
  onToggleCompare,
  onOpenDossier,
  onClearCompare,
}) => {
  const [aiReport, setAiReport] = useState<{
    topPickCandidateId: string;
    executiveComparisonSummary: string;
    tradeoffAnalysis: string;
  } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const selectedCandidates = candidates.filter((c) => selectedCompareIds.includes(c.id));

  // Trigger AI Comparative Synthesis whenever selected candidates change (min 2)
  useEffect(() => {
    if (selectedCandidates.length >= 2 && selectedJob) {
      setIsLoadingAi(true);
      compareCandidatesWithAI(selectedCandidates, selectedJob)
        .then((res) => setAiReport(res))
        .catch((err) => console.error('Failed to compare candidates:', err))
        .finally(() => setIsLoadingAi(false));
    } else {
      setAiReport(null);
    }
  }, [selectedCompareIds, selectedJob]);

  const allRequiredSkills = selectedJob?.requiredSkills || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              Comparative Analysis Studio
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedCandidates.length} Selected to Compare</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Candidate Side-by-Side Evaluation Matrix
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Compare candidate skill matrices, experience trajectories, budget asks, and AI tradeoff summaries.
          </p>
        </div>

        {/* Role Switcher */}
        {selectedJob && (
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 pl-2">Role:</span>
            <select
              value={selectedJob.id}
              onChange={(e) => {
                const found = jobs.find((j) => j.id === e.target.value);
                if (found) onSelectJob(found);
              }}
              className="text-xs font-bold bg-white p-2 rounded-lg border border-slate-300 text-slate-900 cursor-pointer focus:ring-1 focus:ring-indigo-500"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Candidate Selector Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Candidates to Compare (2 - 4 recommended):
          </span>
          {selectedCompareIds.length > 0 && (
            <button
              onClick={onClearCompare}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold cursor-pointer"
            >
              Clear Selection
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {candidates.map((cand) => {
            const isSelected = selectedCompareIds.includes(cand.id);
            const score = selectedJob ? cand.matchResults?.[selectedJob.id]?.overallScore : undefined;

            return (
              <button
                key={cand.id}
                onClick={() => onToggleCompare(cand.id)}
                className={`p-2.5 rounded-xl border transition-all text-xs text-left min-w-[170px] cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{cand.name}</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="w-3.5 h-3.5 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{cand.currentTitle}</div>
                {score !== undefined && (
                  <div className="text-[10px] font-bold text-emerald-700 mt-1">
                    {score}% Match Fit
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Comparison Area */}
      {selectedCandidates.length >= 2 && selectedJob ? (
        <div className="space-y-6">
          {/* AI Executive Comparison & Tradeoff Synthesis Banner */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-indigo-800/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Gemini Comparative AI Synthesis & Top Candidate Pick</span>
              </div>
              {isLoadingAi && (
                <span className="text-xs text-indigo-200 flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Generating tradeoff synthesis...
                </span>
              )}
            </div>

            {aiReport ? (
              <div className="space-y-4 text-xs">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-indigo-200 block text-xs uppercase tracking-wider">Comparative Executive Rationale:</strong>
                  <p className="text-slate-100 leading-relaxed">{aiReport.executiveComparisonSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-amber-300 font-bold block uppercase tracking-wider text-[11px]">Tradeoff Analysis:</span>
                    <p className="text-slate-200 leading-relaxed">{aiReport.tradeoffAnalysis}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                    <span className="text-emerald-300 font-bold block uppercase tracking-wider text-[11px]">AI Top Recommendation:</span>
                    <span className="text-base font-extrabold text-white mt-1">
                      {selectedCandidates.find((c) => c.id === aiReport.topPickCandidateId)?.name || aiReport.topPickCandidateId}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Highest holistic alignment with job requirements, experience, and budget band.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Side-by-Side Detailed Data Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-4 w-48 sticky left-0 bg-slate-100 z-10">Evaluation Metric</th>
                  {selectedCandidates.map((cand) => (
                    <th key={cand.id} className="p-4 min-w-[220px] border-l border-slate-200">
                      <div className="space-y-1.5">
                        <button
                          onClick={() => onOpenDossier(cand)}
                          className="font-bold text-slate-900 hover:text-indigo-600 text-sm text-left block"
                        >
                          {cand.name}
                        </button>
                        <div className="text-[11px] text-slate-500 font-normal">{cand.currentTitle}</div>
                        
                        {cand.matchResults?.[selectedJob.id] && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {cand.matchResults[selectedJob.id].overallScore}% Match ({cand.matchResults[selectedJob.id].recommendation})
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
                    const score = cand.matchResults?.[selectedJob.id]?.overallScore;
                    return (
                      <td key={cand.id} className="p-3.5 border-l border-slate-100 font-bold text-slate-900">
                        {score !== undefined ? `${score}%` : 'Not Screened'}
                      </td>
                    );
                  })}
                </tr>

                {/* Score Breakdown Mini Bars */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Skills vs Experience Fit
                  </td>
                  {selectedCandidates.map((cand) => {
                    const breakdown = cand.matchResults?.[selectedJob.id]?.breakdown;
                    return (
                      <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700 space-y-1.5">
                        {breakdown ? (
                          <>
                            <div className="flex justify-between text-[11px]">
                              <span>Skills:</span>
                              <span className="font-bold">{breakdown.skillsMatchScore}%</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span>Experience:</span>
                              <span className="font-bold">{breakdown.experienceMatchScore}%</span>
                            </div>
                          </>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Experience */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Total Experience
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900">{cand.totalYearsExp} Years</span>
                      <div className="text-slate-500 text-[11px]">{cand.currentCompany || 'N/A'}</div>
                    </td>
                  ))}
                </tr>

                {/* Salary Expectation */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-semibold text-slate-700 sticky left-0 bg-white z-10 border-r border-slate-100">
                    Salary Expectation
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-3.5 border-l border-slate-100 text-slate-700">
                      <span className="font-bold text-emerald-700">{cand.salaryExpectation || 'Flexible'}</span>
                      <div className="text-slate-500 text-[11px]">Approved Band: ${(selectedJob.salaryRange.min / 1000).toFixed(0)}k - ${(selectedJob.salaryRange.max / 1000).toFixed(0)}k</div>
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

                {/* Required Skills Matrix Section */}
                <tr className="bg-indigo-50/60">
                  <td colSpan={selectedCandidates.length + 1} className="p-2.5 px-3.5 font-bold text-indigo-900 text-[11px] uppercase tracking-wider">
                    Required Technical Skills Coverage Matrix
                  </td>
                </tr>

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

                {/* Action Row */}
                <tr className="bg-slate-50">
                  <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10 border-r border-slate-100">
                    Candidate Actions
                  </td>
                  {selectedCandidates.map((cand) => (
                    <td key={cand.id} className="p-4 border-l border-slate-100">
                      <button
                        onClick={() => onOpenDossier(cand)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer text-center"
                      >
                        Inspect Dossier &rarr;
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Select at least 2 candidates to compare</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click on candidate cards in the ribbon above to add them to the side-by-side comparison table and unlock Gemini AI comparative tradeoff synthesis.
          </p>
        </div>
      )}
    </div>
  );
};
