import React, { useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  Users, 
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { Candidate, JobDescription, CompanyPolicy } from '../types';
import { parseResumeWithAI, matchCandidateWithAI } from '../services/api';

interface IngestPageProps {
  jobs: JobDescription[];
  policies: CompanyPolicy[];
  selectedJob: JobDescription | null;
  onCandidateAdded: (newCandidate: Candidate) => void;
  onNavigateToCandidates: () => void;
}

export const IngestPage: React.FC<IngestPageProps> = ({
  jobs,
  policies,
  selectedJob,
  onCandidateAdded,
  onNavigateToCandidates,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'preset'>('file');
  const [targetJobId, setTargetJobId] = useState<string>(selectedJob?.id || jobs[0]?.id || '');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentIngested, setRecentIngested] = useState<Candidate[]>([]);

  // Preset sample candidates
  const samplePresets = [
    {
      title: 'Senior AI Engineer Resume (Sample)',
      name: 'Dr. Lucas Vance',
      text: `DR. LUCAS VANCE
lucas.vance@ai-systems.io | +1 (415) 778-9012 | San Francisco, CA | US Citizen

SUMMARY
Senior AI & Systems Engineer with 6 years of experience building production RAG platforms, fine-tuning LLMs, and architecting high-throughput TypeScript/Node.js backends.

EXPERIENCE
Cortex Intelligence | Lead AI Solutions Engineer (2022 - Present)
- Architected enterprise vector search system using Pinecone, PostgreSQL, and Gemini models.
- Built interactive recruiter and search dashboards with React, TypeScript, and Tailwind CSS.
- Optimized latency by 35% using streaming tokens and distributed caching.

Vanguard Tech | Software Engineer (2020 - 2022)
- Built Node.js and GraphQL microservices deployed on Docker/Kubernetes.

EDUCATION
Ph.D. in Computational Science, Stanford University (2016 - 2020)
B.S. in Computer Science, UC San Diego (2012 - 2016)

SKILLS
TypeScript, React, Node.js, LLM Integration (Gemini/OpenAI), Vector Databases (Pinecone/Chroma), PostgreSQL, RAG Architecture, Docker / Kubernetes, Python / FastAPI
Salary Expectation: $190,000 / year`,
    },
    {
      title: 'DevOps & SRE Engineer Resume (Sample)',
      name: 'Maya Lin',
      text: `MAYA LIN
maya.lin@cloudsec.dev | +1 (206) 912-3344 | Seattle, WA | US Citizen

SUMMARY
Lead Cloud Infrastructure Architect with 9 years designing enterprise Kubernetes clusters, Terraform modules, and CI/CD pipelines across AWS and Google Cloud Platform.

EXPERIENCE
Skyline Cloud Systems | Staff Infrastructure Architect (2021 - Present)
- Designed zero-trust Kubernetes clusters handling 20,000 requests/second.
- Standardized Terraform Infrastructure as Code for 40+ engineering teams.
- Led SOC2 audit compliance.

EDUCATION
B.S. in Computer Engineering, University of Illinois (2013 - 2017)

SKILLS & CERTS
Kubernetes, Terraform, Google Cloud Platform (GCP), AWS, Docker, CI/CD (GitHub Actions), Security & IAM Compliance, CKA Certified
Salary Expectation: $230,000 / year`,
    },
    {
      title: 'Junior Web Developer Resume (Sample)',
      name: 'Jordan Rivera',
      text: `JORDAN RIVERA
jordan.rivera@webcraft.net | +1 (312) 555-0912 | Chicago, IL | US Citizen

SUMMARY
Junior Web Developer with 2 years of frontend experience in React, JavaScript, and CSS. Looking to transition to full-stack engineering and learn AI technologies.

EXPERIENCE
Pixel Wave Media | Junior Frontend Developer (2024 - Present)
- Developed responsive marketing pages using React and Tailwind CSS.
- Assisted backend team with basic Express CRUD endpoints.

EDUCATION
B.A. in Graphic Design, Columbia College Chicago (2020 - 2024)

SKILLS
JavaScript, React, HTML, CSS, Tailwind CSS, Node.js, Git
Salary Expectation: $115,000 / year`,
    },
  ];

  const handleProcessResume = async (resumeText: string, customFileName?: string) => {
    if (!resumeText.trim()) {
      setErrorMsg('Please provide resume text or upload a valid file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProcessStep('Extracting structured profile data with Gemini AI...');

    try {
      const parsedCandidate = await parseResumeWithAI(resumeText, customFileName || fileName);

      const candidateId = `cand-${Date.now()}`;
      const targetJob = jobs.find((j) => j.id === targetJobId) || jobs[0];

      const fullCandidate: Candidate = {
        id: candidateId,
        name: parsedCandidate.name || 'Extracted Candidate',
        email: parsedCandidate.email || 'candidate@example.com',
        phone: parsedCandidate.phone || '+1 (555) 012-3456',
        location: parsedCandidate.location || 'United States',
        currentTitle: parsedCandidate.currentTitle || 'Software Professional',
        currentCompany: parsedCandidate.currentCompany || 'Technology Enterprise',
        totalYearsExp: parsedCandidate.totalYearsExp || 3,
        summary: parsedCandidate.summary || 'Extracted candidate summary.',
        education: parsedCandidate.education || [
          { degree: 'B.S. in Computer Science', field: 'Computer Science', institution: 'University', year: '2021' }
        ],
        experience: parsedCandidate.experience || [],
        skills: parsedCandidate.skills || ['TypeScript', 'React', 'Node.js'],
        certifications: parsedCandidate.certifications || [],
        workAuthorization: (parsedCandidate.workAuthorization as Candidate['workAuthorization']) || 'US Citizen / Perm Resident',
        salaryExpectation: parsedCandidate.salaryExpectation || '$150,000 / year',
        appliedDate: new Date().toISOString().split('T')[0],
        targetJobId: targetJob?.id,
        status: 'Screened',
        rawResumeText: resumeText,
        matchResults: {},
      };

      if (targetJob) {
        setProcessStep(`Matching candidate against ${targetJob.title} with RAG policies...`);
        const matchResult = await matchCandidateWithAI(fullCandidate, targetJob, policies);
        fullCandidate.matchResults = {
          [targetJob.id]: matchResult,
        };
      }

      onCandidateAdded(fullCandidate);
      setRecentIngested([fullCandidate, ...recentIngested]);
      setPastedText('');
      setFileName('');
      setProcessStep('Candidate screened and added to pipeline successfully!');
    } catch (err: any) {
      console.error('Failed to parse & screen resume:', err);
      setErrorMsg(err.message || 'Failed to process resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setPastedText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
              Intake Workbench
            </span>
            <span className="text-xs text-slate-500 font-medium">Automatic ML & Policy Screening</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Resume Ingestion & Auto-Screening Studio
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Upload candidate resumes or test sample profiles to immediately parse structured attributes and evaluate match fitness against active job openings.
          </p>
        </div>

        <button
          onClick={onNavigateToCandidates}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Users className="w-4 h-4" />
          <span>View Talent Pool &rarr;</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ingestion Input Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Target Job Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Target Job Opening for Immediate Match Evaluation:
            </label>
            <select
              value={targetJobId}
              onChange={(e) => setTargetJobId(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.department} ({job.experienceLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('file')}
              className={`pb-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'file'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Upload Document (.pdf / .docx / .txt)
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'text'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Paste Raw Resume Text
            </button>
            <button
              onClick={() => setActiveTab('preset')}
              className={`pb-3 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'preset'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Load Sample Profile Preset
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <label
                htmlFor="resume-file-input-page"
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 p-10 rounded-2xl flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {fileName ? fileName : 'Click to select or drag and drop candidate resume'}
                  </span>
                  <span className="text-xs text-slate-500">Supports PDF, DOCX, TXT, and Markdown documents</span>
                </div>
                <input
                  id="resume-file-input-page"
                  type="file"
                  accept=".txt,.pdf,.docx,.doc,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {pastedText && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">Parsed Document Preview:</span>
                  <p className="text-slate-600 line-clamp-4 font-mono text-[11px] bg-white p-2.5 rounded border border-slate-200">
                    {pastedText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Raw Text */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Paste Full Resume Text:</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the candidate's resume text, employment history, education, skills, and contact details..."
                rows={10}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          )}

          {/* Tab 3: Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">Select a pre-configured candidate profile to test AI screening immediately:</p>
              <div className="space-y-2">
                {samplePresets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPastedText(preset.text);
                      setFileName(`${preset.name} Resume.txt`);
                      setActiveTab('text');
                    }}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{preset.title}</div>
                      <div className="text-[11px] text-slate-500">{preset.name}</div>
                    </div>
                    <span className="text-xs text-indigo-600 font-semibold">Load Preset &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-2 text-indigo-900">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{processStep}</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          <button
            onClick={() => handleProcessResume(pastedText, fileName)}
            disabled={isProcessing || !pastedText.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Processing with Gemini AI...' : 'Parse & Screen Candidate Now'}</span>
          </button>
        </div>

        {/* Right 1 Col: Ingested In This Session Stream */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Ingested In This Session ({recentIngested.length})
            </h3>
          </div>

          {recentIngested.length > 0 ? (
            <div className="space-y-3">
              {recentIngested.map((c) => {
                const match = targetJobId ? c.matchResults?.[targetJobId] : Object.values(c.matchResults || {})[0];
                return (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                      {match && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {match.overallScore}% Fit
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{c.currentTitle} &bull; {c.totalYearsExp} yrs exp</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No candidates ingested in this session yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
