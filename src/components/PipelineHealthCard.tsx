import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  BarChart2, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  UserCheck,
  Award,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip, Cell } from 'recharts';
import { Candidate, JobDescription } from '../types';

interface PipelineHealthCardProps {
  candidates: Candidate[];
  selectedJob: JobDescription | null;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const PipelineHealthCard: React.FC<PipelineHealthCardProps> = ({
  candidates,
  selectedJob,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const [scope, setScope] = useState<'job' | 'all'>('job');
  const [isExpanded, setIsExpanded] = useState(true);

  // Relevant candidates based on scope
  const targetCandidates = useMemo(() => {
    if (scope === 'all' || !selectedJob) {
      return candidates;
    }
    // Filter candidates for this job or with match results for this job
    return candidates.filter((c) => c.targetJobId === selectedJob.id || !!c.matchResults?.[selectedJob.id]);
  }, [candidates, selectedJob, scope]);

  // Funnel stage counts
  const stageStats = useMemo(() => {
    const total = targetCandidates.length;
    const screened = targetCandidates.filter((c) => c.status !== 'New' || (selectedJob && !!c.matchResults?.[selectedJob.id])).length;
    const qualified = targetCandidates.filter((c) => {
      if (selectedJob && c.matchResults?.[selectedJob.id]) {
        const score = c.matchResults[selectedJob.id].overallScore;
        return score >= 70;
      }
      return c.status === 'Screened' || c.status === 'Interviewing' || c.status === 'Offered' || c.status === 'Hired';
    }).length;
    const interviewing = targetCandidates.filter((c) => c.status === 'Interviewing' || c.status === 'Offered' || c.status === 'Hired').length;
    const offered = targetCandidates.filter((c) => c.status === 'Offered' || c.status === 'Hired').length;
    const hired = targetCandidates.filter((c) => c.status === 'Hired').length;

    // Conversion rates
    const screenRate = total > 0 ? Math.round((screened / total) * 100) : 0;
    const interviewRate = screened > 0 ? Math.round((interviewing / screened) * 100) : 0;
    const offerRate = interviewing > 0 ? Math.round((offered / interviewing) * 100) : 0;
    const hireRate = offered > 0 ? Math.round((hired / offered) * 100) : 0;

    // Average Match Score of candidates in pipeline
    const scores = targetCandidates
      .map((c) => selectedJob ? c.matchResults?.[selectedJob.id]?.overallScore : undefined)
      .filter((s): s is number => typeof s === 'number');
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return {
      total,
      screened,
      qualified,
      interviewing,
      offered,
      hired,
      screenRate,
      interviewRate,
      offerRate,
      hireRate,
      avgScore,
    };
  }, [targetCandidates, selectedJob]);

  // Funnel Data formatted for visualization
  const funnelStages = [
    {
      id: 'All',
      name: '1. Total Applicants',
      value: stageStats.total,
      displayCount: stageStats.total,
      color: '#4f46e5', // Indigo 600
      bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      conversionLabel: 'Base (100%)',
    },
    {
      id: 'Screened',
      name: '2. AI Screened',
      value: stageStats.screened,
      displayCount: stageStats.screened,
      color: '#0ea5e9', // Sky 500
      bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
      conversionLabel: `${stageStats.screenRate}% of Total`,
    },
    {
      id: 'Interviewing',
      name: '3. Interview Loop',
      value: stageStats.interviewing,
      displayCount: stageStats.interviewing,
      color: '#8b5cf6', // Purple 500
      bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
      conversionLabel: `${stageStats.interviewRate}% of Screened`,
    },
    {
      id: 'Offered',
      name: '4. Offer Extended',
      value: stageStats.offered,
      displayCount: stageStats.offered,
      color: '#f59e0b', // Amber 500
      bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
      conversionLabel: `${stageStats.offerRate}% of Interviews`,
    },
    {
      id: 'Hired',
      name: '5. Hired / Accepted',
      value: stageStats.hired,
      displayCount: stageStats.hired,
      color: '#10b981', // Emerald 500
      bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      conversionLabel: `${stageStats.hireRate}% Acceptance`,
    },
  ];

  // Pipeline Health Diagnosis
  const getPipelineHealthNote = () => {
    if (stageStats.total === 0) {
      return { status: 'Empty', text: 'No applicants in pipeline yet. Ingest resumes to begin screening.', color: 'text-slate-500' };
    }
    if (stageStats.screened < stageStats.total) {
      return {
        status: 'Action Required',
        text: `${stageStats.total - stageStats.screened} candidate(s) awaiting AI match evaluation.`,
        color: 'text-indigo-600 font-bold',
      };
    }
    if (stageStats.hired >= 1) {
      return { status: 'Optimal', text: 'Target hire secured. Pipeline moving efficiently.', color: 'text-emerald-700 font-bold' };
    }
    if (stageStats.interviewing === 0 && stageStats.screened > 0) {
      return { status: 'Bottleneck', text: 'Screened candidates ready to be scheduled for interview rounds.', color: 'text-amber-700 font-bold' };
    }
    return { status: 'Active', text: 'Candidates progressing through evaluation and interview loops.', color: 'text-sky-700 font-bold' };
  };

  const healthNote = getPipelineHealthNote();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200">
      {/* Top Header Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Hiring Pipeline Health & Funnel Analytics</h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Stage conversions, drop-offs, and throughput metrics for recruiter decision-making
            </p>
          </div>
        </div>

        {/* Scope Toggle & Expand Action */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="inline-flex p-0.5 bg-slate-200/70 rounded-xl text-xs">
            <button
              onClick={() => setScope('job')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                scope === 'job'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Role ({selectedJob?.title ? selectedJob.title.split(' ')[0] : 'Role'})
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                scope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Openings
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Funnel' : 'Expand Funnel'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          {/* Key Pipeline KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Total Ingestion</span>
                <Users className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div className="text-xl font-bold text-slate-900">{stageStats.total}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stageStats.screened} screened ({stageStats.screenRate}%)
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Interview Conversion</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="text-xl font-bold text-purple-600">{stageStats.interviewRate}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stageStats.interviewing} candidate(s) in loop
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Offer Acceptance</span>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-600">
                {stageStats.offered > 0 ? `${stageStats.hireRate}%` : 'N/A'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {stageStats.hired} hired of {stageStats.offered} offered
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span className="font-medium">Avg Match Quality</span>
                <Award className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-900">{stageStats.avgScore}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Across screened applicants
              </div>
            </div>
          </div>

          {/* Stepped Visual Funnel Pipeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pipeline Stage Conversion Funnel (Click Stage to Filter Candidates)
              </span>
              <span className="text-[11px] text-slate-400">
                Active Filter: <strong className="text-indigo-600">{activeStatusFilter}</strong>
              </span>
            </div>

            {/* Visual Funnel Cards with Flow Connectors */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
              {funnelStages.map((stage, idx) => {
                const isSelected = activeStatusFilter === stage.id || (stage.id === 'All' && activeStatusFilter === 'All');
                const maxVal = Math.max(stageStats.total, 1);
                const widthPercent = Math.max(Math.round((stage.value / maxVal) * 100), 8);

                return (
                  <div
                    key={stage.id}
                    onClick={() => onSelectStatusFilter(stage.id)}
                    className={`relative p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-600 truncate">{stage.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-slate-900">{stage.displayCount}</span>
                        <span className="text-[11px] text-slate-500">candidates</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {/* Visual Funnel Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: stage.color,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-medium">{stage.conversionLabel}</span>
                        <span className="text-slate-400 font-mono">{widthPercent}%</span>
                      </div>
                    </div>

                    {/* Arrow connector between stages on desktop */}
                    {idx < funnelStages.length - 1 && (
                      <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none group-hover:text-indigo-400 transition-colors">
                        &rarr;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recruiter Intelligence & Pipeline Health Diagnosis */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <div>
                <span className="text-slate-500">Pipeline Diagnosis: </span>
                <span className={healthNote.color}>{healthNote.text}</span>
              </div>
            </div>

            {activeStatusFilter !== 'All' && (
              <button
                onClick={() => onSelectStatusFilter('All')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-start sm:self-auto cursor-pointer"
              >
                Clear Stage Filter (Show All)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
