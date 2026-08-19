import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  ChevronRight,
  Edit3,
  Check,
  Building2
} from 'lucide-react';
import { JobDescription, Candidate } from '../types';

interface JobsPageProps {
  jobs: JobDescription[];
  selectedJob: JobDescription | null;
  onSelectJob: (job: JobDescription) => void;
  onOpenNewJob: () => void;
  candidates: Candidate[];
  onNavigateToCandidates: (job: JobDescription) => void;
  onUpdateJobStatus: (jobId: string, status: JobDescription['status']) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onOpenNewJob,
  candidates,
  onNavigateToCandidates,
  onUpdateJobStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Paused' | 'Closed'>('All');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(selectedJob?.id || jobs[0]?.id || null);

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'All') return true;
    return j.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              Role Requisitions
            </span>
            <span className="text-xs text-slate-500 font-medium">{jobs.length} Total Openings</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Job Descriptions & Hiring Requisitions
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Configure competency matrices, compensation bands, required years of experience, and RAG policy tiers for each open role.
          </p>
        </div>

        <button
          onClick={onOpenNewJob}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Job with Gemini AI</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 text-xs">
        {(['All', 'Active', 'Paused', 'Closed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab} Roles ({tab === 'All' ? jobs.length : jobs.filter((j) => j.status === tab).length})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isExpanded = expandedJobId === job.id;
          const isSelected = selectedJob?.id === job.id;
          const roleCandidates = candidates.filter((c) => c.targetJobId === job.id || !!c.matchResults?.[job.id]);
          const strongHires = roleCandidates.filter((c) => c.matchResults?.[job.id]?.recommendation === 'Strong Hire');

          return (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Job Card Top Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {job.department}
                      </span>
                      
                      {/* Status Dropdown */}
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateJobStatus(job.id, e.target.value as JobDescription['status'])}
                        className={`text-[11px] font-bold py-0.5 px-2.5 rounded-full border cursor-pointer ${
                          job.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : job.status === 'Paused'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Closed">Closed</option>
                      </select>

                      {isSelected && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Active Screening Target
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {job.title} ({job.experienceLevel})
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {job.minYearsExp} - {job.maxYearsExp} yrs exp
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        ${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k {job.salaryRange.currency}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {job.workplaceType} ({job.location})
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                        {job.policyTier}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Applicant Stats */}
                  <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
                    <div className="text-right bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl">
                      <div className="text-[11px] text-slate-500 font-medium">Candidates In Loop</div>
                      <div className="text-sm font-bold text-slate-900">
                        {roleCandidates.length} applicants ({strongHires.length} Strong Hires)
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectJob(job);
                        onNavigateToCandidates(job);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Screen Candidates</span>
                    </button>

                    <button
                      onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title={isExpanded ? 'Hide Specs' : 'View Full Specs'}
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Role Details */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
                    {/* Job Description Text */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                      <strong className="block text-slate-900 font-semibold mb-1">Role Mission & Overview:</strong>
                      {job.description}
                    </div>

                    {/* Required Skills Matrix */}
                    <div>
                      <span className="font-semibold text-slate-700 block mb-2">Required Skills ({job.requiredSkills.length})</span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((skill, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preferred Skills */}
                    {job.preferredSkills.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-600 block mb-2">Preferred / Value-Add Skills</span>
                        <div className="flex flex-wrap gap-1.5">
                          {job.preferredSkills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responsibilities & Qualifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {job.responsibilities?.length > 0 && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-2">Core Responsibilities</span>
                          <ul className="space-y-1.5 text-slate-600">
                            {job.responsibilities.map((r, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.qualifications?.length > 0 && (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-900 block mb-2">Target Qualifications</span>
                          <ul className="space-y-1.5 text-slate-600">
                            {job.qualifications.map((q, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
