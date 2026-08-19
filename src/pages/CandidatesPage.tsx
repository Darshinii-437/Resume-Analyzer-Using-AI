import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  Search, 
  UploadCloud, 
  ShieldCheck, 
  Award,
  Layers,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Candidate, JobDescription, CompanyPolicy } from '../types';
import { CandidateCard } from '../components/CandidateCard';
import { JobSelector } from '../components/JobSelector';

interface CandidatesPageProps {
  jobs: JobDescription[];
  selectedJob: JobDescription | null;
  onSelectJob: (job: JobDescription) => void;
  candidates: Candidate[];
  policies: CompanyPolicy[];
  onOpenUpload: () => void;
  onOpenNewJob: () => void;
  onOpenDossier: (candidate: Candidate) => void;
  onToggleCompare: (candidateId: string) => void;
  selectedCompareIds: string[];
  onRunMatch: (candidate: Candidate) => void;
  onBatchScreen: () => void;
  isBatchScreening: boolean;
  batchProgress: { current: number; total: number; name: string };
  onStatusChange: (id: string, status: Candidate['status']) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  onOpenComparePage: () => void;
}

export const CandidatesPage: React.FC<CandidatesPageProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  candidates,
  policies,
  onOpenUpload,
  onOpenNewJob,
  onOpenDossier,
  onToggleCompare,
  selectedCompareIds,
  onRunMatch,
  onBatchScreen,
  isBatchScreening,
  batchProgress,
  onStatusChange,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  onOpenComparePage,
}) => {
  const [filterScoreTier, setFilterScoreTier] = useState<string>('All');
  const [filterExp, setFilterExp] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'name' | 'date'>('score');

  // Filter & Sort
  const filteredCandidates = useMemo(() => {
    if (!selectedJob) return [];

    return candidates
      .filter((cand) => {
        // Search filter
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          cand.name.toLowerCase().includes(q) ||
          cand.currentTitle.toLowerCase().includes(q) ||
          cand.skills.some((s) => s.toLowerCase().includes(q)) ||
          cand.location.toLowerCase().includes(q);

        if (!matchesSearch) return false;

        // Status filter
        if (filterStatus !== 'All' && cand.status !== filterStatus) return false;

        // Score filter
        const score = cand.matchResults?.[selectedJob.id]?.overallScore;
        if (filterScoreTier === 'Strong (90%+)') {
          if (score === undefined || score < 90) return false;
        } else if (filterScoreTier === 'Good (75-89%)') {
          if (score === undefined || score < 75 || score >= 90) return false;
        } else if (filterScoreTier === 'Potential (60-74%)') {
          if (score === undefined || score < 60 || score >= 75) return false;
        } else if (filterScoreTier === 'Unscreened') {
          if (score !== undefined) return false;
        }

        // Experience filter
        if (filterExp === '5+ years' && cand.totalYearsExp < 5) return false;
        if (filterExp === '8+ years' && cand.totalYearsExp < 8) return false;
        if (filterExp === '10+ years' && cand.totalYearsExp < 10) return false;

        return true;
      })
      .sort((a, b) => {
        const scoreA = a.matchResults?.[selectedJob.id]?.overallScore ?? -1;
        const scoreB = b.matchResults?.[selectedJob.id]?.overallScore ?? -1;

        if (sortBy === 'score') return scoreB - scoreA;
        if (sortBy === 'experience') return b.totalYearsExp - a.totalYearsExp;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      });
  }, [candidates, selectedJob, searchQuery, filterScoreTier, filterStatus, filterExp, sortBy]);

  const screenedCount = candidates.filter((c) => selectedJob && c.matchResults?.[selectedJob.id]).length;
  const strongHireCount = candidates.filter((c) => selectedJob && c.matchResults?.[selectedJob.id]?.recommendation === 'Strong Hire').length;
  const unscreenedCount = candidates.filter((c) => selectedJob && !c.matchResults?.[selectedJob.id]).length;

  return (
    <div className="space-y-6">
      {/* Selected Job Description Selector & Spec Header */}
      <JobSelector
        jobs={jobs}
        selectedJob={selectedJob}
        onSelectJob={onSelectJob}
        onOpenNewJob={onOpenNewJob}
      />

      {/* Screening Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Candidate Counts & Batch Screening */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">
              {filteredCandidates.length} Candidates
            </span>
            <span className="text-xs text-slate-400">
              ({screenedCount} screened &bull; <strong className="text-emerald-700">{strongHireCount} Strong Hires</strong>)
            </span>
          </div>

          {unscreenedCount > 0 && (
            <button
              onClick={onBatchScreen}
              disabled={isBatchScreening}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isBatchScreening ? 'animate-spin' : ''}`} />
              <span>
                {isBatchScreening
                  ? `Screening (${batchProgress.current}/${batchProgress.total})...`
                  : `Batch Screen ${unscreenedCount} Unscreened with AI`}
              </span>
            </button>
          )}
        </div>

        {/* Right: Filters & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Score Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterScoreTier}
              onChange={(e) => setFilterScoreTier(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Scores</option>
              <option value="Strong (90%+)">Strong (90%+)</option>
              <option value="Good (75-89%)">Good (75-89%)</option>
              <option value="Potential (60-74%)">Potential (60-74%)</option>
              <option value="Unscreened">Unscreened</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Stages</option>
              <option value="New">New</option>
              <option value="Screened">Screened</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Exp Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <select
              value={filterExp}
              onChange={(e) => setFilterExp(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">Any Experience</option>
              <option value="5+ years">5+ Years</option>
              <option value="8+ years">8+ Years</option>
              <option value="10+ years">10+ Years</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="score">Match Score (High to Low)</option>
              <option value="experience">Years Experience</option>
              <option value="name">Candidate Name</option>
              <option value="date">Applied Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batch In-Progress Banner */}
      {isBatchScreening && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-2 text-indigo-900 animate-pulse">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              Screening candidate {batchProgress.current} of {batchProgress.total}: {batchProgress.name}
            </span>
            <span className="font-mono">
              {Math.round((batchProgress.current / batchProgress.total) * 100)}%
            </span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Candidate Cards Grid List */}
      {selectedJob && filteredCandidates.length > 0 ? (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              job={selectedJob}
              isSelectedForCompare={selectedCompareIds.includes(candidate.id)}
              onToggleCompare={onToggleCompare}
              onOpenDossier={onOpenDossier}
              onRunMatch={onRunMatch}
              onStatusChange={onStatusChange}
              isMatching={false}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No candidates match the selected criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or upload new candidate resumes to screen for this position.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setFilterScoreTier('All');
              onFilterStatusChange('All');
              setFilterExp('All');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-100 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Floating Bottom Comparison Bar (when 2+ candidates are checked) */}
      {selectedCompareIds.length >= 2 && selectedJob && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{selectedCompareIds.length} Candidates Selected</span>
          </div>

          <div className="h-4 w-px bg-slate-700" />

          <button
            onClick={onOpenComparePage}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Compare Side-by-Side &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
