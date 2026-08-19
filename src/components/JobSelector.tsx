import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ShieldCheck, CheckCircle2, ChevronDown } from 'lucide-react';
import { JobDescription } from '../types';

interface JobSelectorProps {
  jobs: JobDescription[];
  selectedJob: JobDescription | null;
  onSelectJob: (job: JobDescription) => void;
  onOpenNewJob: () => void;
}

export const JobSelector: React.FC<JobSelectorProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onOpenNewJob,
}) => {
  if (!selectedJob) return null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Job Selection Dropdown & Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Active Screening Role
            </span>
            <span className="text-xs text-slate-500 font-medium">{selectedJob.department}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              {selectedJob.status}
            </span>
          </div>

          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={selectedJob.id}
              onChange={(e) => {
                const found = jobs.find((j) => j.id === e.target.value);
                if (found) onSelectJob(found);
              }}
              className="appearance-none w-full sm:min-w-[340px] text-xl font-bold text-slate-900 bg-transparent border-b-2 border-indigo-600 pb-1 pr-8 focus:outline-none cursor-pointer hover:text-indigo-900 transition-colors"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.experienceLevel})
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-0 top-1 text-slate-400 pointer-events-none" />
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl pt-0.5">
            {selectedJob.description}
          </p>
        </div>

        {/* Quick Spec Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-3 pt-2 lg:pt-0">
          <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl min-w-[130px]">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Experience</span>
            </div>
            <span className="text-xs font-semibold text-slate-800">
              {selectedJob.minYearsExp} - {selectedJob.maxYearsExp} Years ({selectedJob.experienceLevel})
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl min-w-[130px]">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-0.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Salary Band</span>
            </div>
            <span className="text-xs font-semibold text-slate-800">
              ${(selectedJob.salaryRange.min / 1000).toFixed(0)}k - ${(selectedJob.salaryRange.max / 1000).toFixed(0)}k {selectedJob.salaryRange.currency}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl min-w-[130px]">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Workplace</span>
            </div>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              {selectedJob.workplaceType} ({selectedJob.location})
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-xl min-w-[130px]">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Policy Tier</span>
            </div>
            <span className="text-xs font-semibold text-slate-800 truncate block">
              {selectedJob.policyTier || 'Standard (L5)'}
            </span>
          </div>
        </div>
      </div>

      {/* Required Skills Pill List */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 mr-1">Required Skills:</span>
        {selectedJob.requiredSkills.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
          >
            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
            {skill}
          </span>
        ))}
        {selectedJob.preferredSkills.length > 0 && (
          <>
            <span className="text-xs font-medium text-slate-400 mx-1">| Preferred:</span>
            {selectedJob.preferredSkills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs font-normal bg-indigo-50/60 text-indigo-700 border border-indigo-100"
              >
                + {skill}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
