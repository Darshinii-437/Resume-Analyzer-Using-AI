import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  Users, 
  Search, 
  PlusCircle, 
  Award,
  LayoutDashboard,
  Layers,
  UploadCloud,
  ArrowUpDown
} from 'lucide-react';
import { JobDescription, Candidate, CompanyPolicy, CandidateMatchResult } from '../types';

interface HeaderProps {
  jobs: JobDescription[];
  candidates: Candidate[];
  policies: CompanyPolicy[];
  selectedJob: JobDescription | null;
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenUpload: () => void;
  onOpenNewJob: () => void;
  onOpenPolicies: () => void;
  onResetData: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCompareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  jobs,
  candidates,
  policies,
  selectedJob,
  activePage,
  onNavigate,
  onOpenUpload,
  onOpenNewJob,
  onOpenPolicies,
  onResetData,
  searchQuery,
  onSearchChange,
  selectedCompareCount,
}) => {
  // Calculate aggregate metrics
  const totalScreened = candidates.filter((c) => selectedJob ? c.matchResults?.[selectedJob.id] : Object.keys(c.matchResults || {}).length > 0).length;
  
  const scores = candidates
    .map((c) => {
      if (selectedJob && c.matchResults?.[selectedJob.id]) {
        return c.matchResults[selectedJob.id].overallScore;
      }
      const allResults = Object.values(c.matchResults || {}) as CandidateMatchResult[];
      return allResults.length > 0 ? allResults[0]?.overallScore : undefined;
    })
    .filter((s): s is number => typeof s === 'number');
  
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard & Funnel', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidate Screening', icon: Users, badge: candidates.length },
    { id: 'jobs', label: 'Job Openings', icon: Briefcase, badge: jobs.filter(j => j.status === 'Active').length },
    { id: 'compare', label: 'Compare Matrix', icon: Layers, badge: selectedCompareCount > 0 ? selectedCompareCount : undefined },
    { id: 'policies', label: 'RAG Policies', icon: ShieldCheck, badge: policies.length },
    { id: 'ingest', label: 'Resume Ingestion', icon: UploadCloud },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors cursor-pointer text-left"
                >
                  TalentMatch AI
                </button>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-400/30">
                  Multi-Page App
                </span>
              </div>
              <p className="text-[11px] text-slate-400">ML Resume Parsing &bull; RAG Policy Grounding &bull; Pipeline Health</p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="hidden xl:flex items-center gap-5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Open Roles</span>
                <span className="font-semibold text-slate-100">{jobs.filter(j => j.status === 'Active').length} Active</span>
              </div>
            </div>
            <div className="h-5 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Candidates</span>
                <span className="font-semibold text-slate-100">{candidates.length} ({totalScreened} Screened)</span>
              </div>
            </div>
            <div className="h-5 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-medium">Avg Match</span>
                <span className="font-semibold text-slate-100">{avgScore > 0 ? `${avgScore}%` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative min-w-[170px] sm:min-w-[210px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search candidates, skills..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset to default test data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation Page Tabs Bar */}
        <div className="flex items-center gap-1 mt-3.5 overflow-x-auto border-t border-slate-800/80 pt-2 text-xs">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
