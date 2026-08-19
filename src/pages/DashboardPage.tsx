import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Award,
  Zap,
  Plus,
  BarChart3,
  Clock
} from 'lucide-react';
import { Candidate, JobDescription, CompanyPolicy, CandidateMatchResult } from '../types';
import { PipelineHealthCard } from '../components/PipelineHealthCard';
import { CandidateCard } from '../components/CandidateCard';

interface DashboardPageProps {
  jobs: JobDescription[];
  candidates: Candidate[];
  policies: CompanyPolicy[];
  selectedJob: JobDescription | null;
  onSelectJob: (job: JobDescription) => void;
  onNavigate: (page: string) => void;
  onOpenUpload: () => void;
  onOpenNewJob: () => void;
  onOpenDossier: (candidate: Candidate) => void;
  onToggleCompare: (candidateId: string) => void;
  selectedCompareIds: string[];
  onRunMatch: (candidate: Candidate) => void;
  onStatusChange: (id: string, status: Candidate['status']) => void;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  jobs,
  candidates,
  policies,
  selectedJob,
  onSelectJob,
  onNavigate,
  onOpenUpload,
  onOpenNewJob,
  onOpenDossier,
  onToggleCompare,
  selectedCompareIds,
  onRunMatch,
  onStatusChange,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  // Aggregate stats across all jobs
  const totalCandidates = candidates.length;
  const screenedCandidates = candidates.filter((c) => Object.keys(c.matchResults || {}).length > 0);
  const strongHires = candidates.filter((c) =>
    (Object.values(c.matchResults || {}) as CandidateMatchResult[]).some((m) => m.recommendation === 'Strong Hire')
  );
  const activeJobs = jobs.filter((j) => j.status === 'Active');

  // Top candidates for active role
  const topCandidatesForRole = selectedJob
    ? candidates
        .filter((c) => c.matchResults?.[selectedJob.id]?.overallScore !== undefined)
        .sort(
          (a, b) =>
            (b.matchResults?.[selectedJob.id]?.overallScore || 0) -
            (a.matchResults?.[selectedJob.id]?.overallScore || 0)
        )
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Executive AI Command Center
            </span>
            <span className="text-xs text-slate-400">&bull; Real-time ML Evaluation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Talent Acquisition & Screening Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Automated resume parsing, ML match evaluation, and RAG-grounded company policy compliance.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Resumes</span>
          </button>

          <button
            onClick={onOpenNewJob}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Job Role</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('candidates')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Talent Pool</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalCandidates}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{screenedCandidates.length} AI Screened</span>
            <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
              View Pool &rarr;
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('jobs')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Active Job Openings</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>{jobs.length} Total Roles</span>
            <span className="text-sky-600 font-semibold flex items-center gap-0.5">
              Manage Roles &rarr;
            </span>
          </div>
        </div>

        <div 
          onClick={() => {
            onSelectStatusFilter('Screened');
            onNavigate('candidates');
          }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Strong Hire Matches</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{strongHires.length}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>90%+ Fit Candidates</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              Review &rarr;
            </span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('policies')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px]">RAG Policy Rules</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{policies.length}</div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>100% Grounded</span>
            <span className="text-purple-600 font-semibold flex items-center gap-0.5">
              Ask Assistant &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Primary Funnel & Pipeline Health Summary Card */}
      <PipelineHealthCard
        candidates={candidates}
        selectedJob={selectedJob}
        activeStatusFilter={activeStatusFilter}
        onSelectStatusFilter={(status) => {
          onSelectStatusFilter(status);
          onNavigate('candidates');
        }}
      />

      {/* 2-Column Split: Top Candidates for Role & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Candidates for Active Job */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Top Candidates for {selectedJob?.title || 'Active Role'}
              </h2>
              <p className="text-xs text-slate-500">
                Highest scoring applicants evaluated by Gemini ML matching
              </p>
            </div>

            <button
              onClick={() => onNavigate('candidates')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({candidates.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedJob && topCandidatesForRole.length > 0 ? (
            <div className="space-y-3">
              {topCandidatesForRole.map((candidate) => (
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
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">No candidates screened yet for this job.</p>
              <button
                onClick={() => onNavigate('candidates')}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Go to Candidate Screening Tab &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Feature Navigation & RAG Policy Highlights */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Recruitment Quick Navigation
            </h3>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => onNavigate('candidates')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-indigo-600">Candidate Screening Studio</div>
                  <div className="text-[11px] text-slate-500">Filter, search, & batch evaluate talent</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onNavigate('compare')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-indigo-600">Candidate Comparison Matrix</div>
                  <div className="text-[11px] text-slate-500">Side-by-side gap & tradeoff synthesis</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onNavigate('jobs')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-indigo-600">Job Requisitions Studio</div>
                  <div className="text-[11px] text-slate-500">Draft JDs with Gemini AI in 1-click</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => onNavigate('policies')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-indigo-600">RAG Company Policies</div>
                  <div className="text-[11px] text-slate-500">Ask policy assistant with citations</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
          </div>

          {/* RAG Knowledge Quick Alert Card */}
          <div className="bg-sky-50 p-5 rounded-2xl border border-sky-200 space-y-2.5">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Hiring Policy Compliance</span>
            </div>
            <p className="text-xs text-sky-800 leading-relaxed">
              Every candidate score is cross-checked against {policies.length} active company guidelines including compensation bands, remote work policies, and visa sponsorship rules.
            </p>
            <button
              onClick={() => onNavigate('policies')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Query Policy Assistant &rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
