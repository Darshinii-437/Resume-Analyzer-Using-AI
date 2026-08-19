import React, { useState } from 'react';
import { X, Sparkles, Briefcase, Plus, Trash2, CheckCircle2, DollarSign, MapPin, Layers } from 'lucide-react';
import { JobDescription } from '../types';
import { generateJobDescriptionWithAI } from '../services/api';

interface JobManagerModalProps {
  onClose: () => void;
  onJobCreated: (newJob: JobDescription) => void;
}

export const JobManagerModal: React.FC<JobManagerModalProps> = ({
  onClose,
  onJobCreated,
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering & AI Platform');
  const [location, setLocation] = useState('San Francisco, CA (or Remote US)');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [experienceLevel, setExperienceLevel] = useState<'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff/Principal'>('Senior');
  const [minYearsExp, setMinYearsExp] = useState(5);
  const [maxYearsExp, setMaxYearsExp] = useState(10);
  const [salaryMin, setSalaryMin] = useState(160000);
  const [salaryMax, setSalaryMax] = useState(210000);
  const [policyTier, setPolicyTier] = useState('Engineering L5 (Senior Tier)');
  
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['TypeScript', 'React', 'Node.js', 'LLM Integration', 'PostgreSQL']);
  
  const [preferredSkillsInput, setPreferredSkillsInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState<string[]>(['Vector Databases', 'RAG Architecture', 'Docker / Kubernetes']);
  
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Auto-generate JD with Gemini
  const handleAiGenerate = async () => {
    if (!title.trim()) {
      alert('Please enter a Job Title first to auto-generate the description.');
      return;
    }

    setIsGeneratingAi(true);
    try {
      const generated = await generateJobDescriptionWithAI({
        title,
        department,
        experienceLevel,
        minYearsExp,
        maxYearsExp,
        keySkills: requiredSkills,
        workplaceType,
        location,
        salaryMin,
        salaryMax,
      });

      if (generated.description) setDescription(generated.description);
      if (generated.requiredSkills) setRequiredSkills(generated.requiredSkills);
      if (generated.preferredSkills) setPreferredSkills(generated.preferredSkills);
      if (generated.responsibilities) setResponsibilities(generated.responsibilities);
      if (generated.qualifications) setQualifications(generated.qualifications);
      if (generated.policyTier) setPolicyTier(generated.policyTier);
    } catch (err) {
      console.error('Failed to generate JD:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const addRequiredSkill = () => {
    if (requiredSkillsInput.trim() && !requiredSkills.includes(requiredSkillsInput.trim())) {
      setRequiredSkills([...requiredSkills, requiredSkillsInput.trim()]);
      setRequiredSkillsInput('');
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const addPreferredSkill = () => {
    if (preferredSkillsInput.trim() && !preferredSkills.includes(preferredSkillsInput.trim())) {
      setPreferredSkills([...preferredSkills, preferredSkillsInput.trim()]);
      setPreferredSkillsInput('');
    }
  };

  const removePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob: JobDescription = {
      id: `job-${Date.now()}`,
      title,
      department,
      location,
      workplaceType,
      experienceLevel,
      minYearsExp: Number(minYearsExp),
      maxYearsExp: Number(maxYearsExp),
      salaryRange: {
        min: Number(salaryMin),
        max: Number(salaryMax),
        currency: 'USD',
      },
      requiredSkills,
      preferredSkills,
      description: description || `We are looking for an experienced ${title} to join our team.`,
      responsibilities: responsibilities.length ? responsibilities : ['Design, build, and deliver high-impact software systems.'],
      qualifications: qualifications.length ? qualifications : [`${minYearsExp}+ years of verified industry experience in relevant stack.`],
      policyTier,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onJobCreated(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create New Job Opening</h2>
              <p className="text-xs text-slate-400">Define role criteria, required competencies, budget bands & RAG policy tier</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-grow space-y-5 bg-slate-50/50 text-xs">
          
          {/* Top Quick AI Generator banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-indigo-950 block text-xs">Want Gemini to draft the complete Job Description?</span>
              <span className="text-[11px] text-indigo-700">Enter a Job Title below and click "Auto-Generate with Gemini AI".</span>
            </div>
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGeneratingAi || !title.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingAi ? 'Generating JD...' : 'Auto-Generate with AI'}</span>
            </button>
          </div>

          {/* Core Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Machine Learning Engineer"
                required
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Engineering & AI Platform"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            </div>
          </div>

          {/* Level, Experience & Workplace */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Junior">Junior (1-3 yrs)</option>
                <option value="Mid">Mid-Level (3-5 yrs)</option>
                <option value="Senior">Senior (5-8 yrs)</option>
                <option value="Lead">Lead (7-12 yrs)</option>
                <option value="Staff/Principal">Staff / Principal (10+ yrs)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Min - Max Years Exp</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={minYearsExp}
                  onChange={(e) => setMinYearsExp(Number(e.target.value))}
                  className="w-1/2 p-2.5 bg-white border border-slate-300 rounded-xl text-center"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={maxYearsExp}
                  onChange={(e) => setMaxYearsExp(Number(e.target.value))}
                  className="w-1/2 p-2.5 bg-white border border-slate-300 rounded-xl text-center"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Workplace Type</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Salary Budget & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Base Salary Range (USD)</label>
              <div className="flex items-center gap-2">
                <div className="relative w-1/2">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="5000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full pl-6 p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <span className="text-slate-400 font-bold">-</span>
                <div className="relative w-1/2">
                  <span className="absolute left-2.5 top-2.5 text-slate-400">$</span>
                  <input
                    type="number"
                    step="5000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full pl-6 p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Location / Hub</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (or Remote US)"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Required Skills Tag Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Required Skills (Competency Matrix)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requiredSkillsInput}
                onChange={(e) => setRequiredSkillsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRequiredSkill())}
                placeholder="Add skill (e.g. TypeScript, PyTorch, Kubernetes) and press Enter"
                className="flex-grow p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addRequiredSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-800 font-medium rounded-lg border border-indigo-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeRequiredSkill(skill)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills Tag Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Preferred / Bonus Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredSkillsInput}
                onChange={(e) => setPreferredSkillsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
                placeholder="Add preferred skill (e.g. Vector DBs, SOC2) and press Enter"
                className="flex-grow p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {preferredSkills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 font-medium rounded-lg border border-slate-200"
                >
                  + {skill}
                  <button
                    type="button"
                    onClick={() => removePreferredSkill(skill)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Job Description Overview</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide role background, mission statement, team impact..."
              rows={3}
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* RAG Policy Tier */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Company Policy & Hiring Tier</label>
            <input
              type="text"
              value={policyTier}
              onChange={(e) => setPolicyTier(e.target.value)}
              placeholder="e.g. Engineering L5 (Senior Tier)"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

        </form>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Publish Job Opening
          </button>
        </div>

      </div>
    </div>
  );
};
