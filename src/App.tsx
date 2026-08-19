import React, { useState, useMemo, useEffect } from 'react';
import { JobDescription, Candidate, CompanyPolicy } from './types';
import { initialJobDescriptions, initialCandidates, initialCompanyPolicies } from './data/mockData';
import { Header } from './components/Header';
import { CandidateDossierModal } from './components/CandidateDossierModal';
import { ComparisonMatrixModal } from './components/ComparisonMatrixModal';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { JobManagerModal } from './components/JobManagerModal';
import { RagPolicyModal } from './components/RagPolicyModal';
import { DashboardPage } from './pages/DashboardPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { JobsPage } from './pages/JobsPage';
import { ComparePage } from './pages/ComparePage';
import { PoliciesPage } from './pages/PoliciesPage';
import { IngestPage } from './pages/IngestPage';
import { matchCandidateWithAI } from './services/api';

export default function App() {
  // Page Routing State
  const [activePage, setActivePage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['dashboard', 'candidates', 'jobs', 'compare', 'policies', 'ingest'].includes(hash)) {
      return hash;
    }
    return 'dashboard';
  });

  // Sync route with URL hash
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'candidates', 'jobs', 'compare', 'policies', 'ingest'].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Main Data States with Local Storage persistence
  const [jobs, setJobs] = useState<JobDescription[]>(() => {
    const saved = localStorage.getItem('tm_jobs');
    return saved ? JSON.parse(saved) : initialJobDescriptions;
  });

  const [selectedJobId, setSelectedJobId] = useState<string>(() => {
    return jobs[0]?.id || 'job-101';
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('tm_candidates');
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [policies, setPolicies] = useState<CompanyPolicy[]>(() => {
    const saved = localStorage.getItem('tm_policies');
    return saved ? JSON.parse(saved) : initialCompanyPolicies;
  });

  // Active Job helper
  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  // Global Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Candidate Selection for Comparison
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);

  // Modal Dialog States
  const [activeDossierCandidate, setActiveDossierCandidate] = useState<Candidate | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Batch Processing State
  const [isBatchScreening, setIsBatchScreening] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; name: string }>({
    current: 0,
    total: 0,
    name: '',
  });

  // Save changes to state and localStorage
  const updateCandidate = (updated: Candidate) => {
    const next = candidates.map((c) => (c.id === updated.id ? updated : c));
    setCandidates(next);
    localStorage.setItem('tm_candidates', JSON.stringify(next));
    if (activeDossierCandidate?.id === updated.id) {
      setActiveDossierCandidate(updated);
    }
  };

  const handleAddCandidate = (newCand: Candidate) => {
    const next = [newCand, ...candidates];
    setCandidates(next);
    localStorage.setItem('tm_candidates', JSON.stringify(next));
  };

  const handleAddJob = (newJob: JobDescription) => {
    const next = [newJob, ...jobs];
    setJobs(next);
    setSelectedJobId(newJob.id);
    localStorage.setItem('tm_jobs', JSON.stringify(next));
  };

  const handleUpdateJobStatus = (jobId: string, status: JobDescription['status']) => {
    const next = jobs.map((j) => (j.id === jobId ? { ...j, status } : j));
    setJobs(next);
    localStorage.setItem('tm_jobs', JSON.stringify(next));
  };

  const handleAddPolicy = (newPolicy: CompanyPolicy) => {
    const next = [newPolicy, ...policies];
    setPolicies(next);
    localStorage.setItem('tm_policies', JSON.stringify(next));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all jobs, candidates, and policies to sample test data?')) {
      setJobs(initialJobDescriptions);
      setSelectedJobId(initialJobDescriptions[0].id);
      setCandidates(initialCandidates);
      setPolicies(initialCompanyPolicies);
      setSelectedCompareIds([]);
      localStorage.removeItem('tm_jobs');
      localStorage.removeItem('tm_candidates');
      localStorage.removeItem('tm_policies');
    }
  };

  // Toggle candidate comparison
  const handleToggleCompare = (candidateId: string) => {
    setSelectedCompareIds((prev) =>
      prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );
  };

  // Single candidate AI match trigger
  const handleRunMatch = async (candidate: Candidate) => {
    if (!selectedJob) return;
    try {
      const matchResult = await matchCandidateWithAI(candidate, selectedJob, policies);
      const updated: Candidate = {
        ...candidate,
        status: candidate.status === 'New' ? 'Screened' : candidate.status,
        matchResults: {
          ...(candidate.matchResults || {}),
          [selectedJob.id]: matchResult,
        },
      };
      updateCandidate(updated);
    } catch (err) {
      console.error('Failed to screen candidate:', err);
    }
  };

  // Batch AI Screening trigger
  const handleBatchScreen = async () => {
    if (!selectedJob || isBatchScreening) return;
    setIsBatchScreening(true);
    const unMatched = candidates.filter((c) => !c.matchResults?.[selectedJob.id]);
    setBatchProgress({ current: 0, total: unMatched.length, name: '' });

    for (let i = 0; i < unMatched.length; i++) {
      const cand = unMatched[i];
      setBatchProgress({ current: i + 1, total: unMatched.length, name: cand.name });
      try {
        const result = await matchCandidateWithAI(cand, selectedJob, policies);
        const updated: Candidate = {
          ...cand,
          status: 'Screened',
          matchResults: {
            ...(cand.matchResults || {}),
            [selectedJob.id]: result,
          },
        };
        updateCandidate(updated);
      } catch (err) {
        console.error(`Failed to batch screen ${cand.name}:`, err);
      }
    }

    setIsBatchScreening(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* Top Multi-Page Navigation Header */}
      <Header
        jobs={jobs}
        candidates={candidates}
        policies={policies}
        selectedJob={selectedJob}
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenUpload={() => handleNavigate('ingest')}
        onOpenNewJob={() => setShowNewJobModal(true)}
        onOpenPolicies={() => handleNavigate('policies')}
        onResetData={handleResetData}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCompareCount={selectedCompareIds.length}
      />

      {/* Main Page Router View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        {activePage === 'dashboard' && (
          <DashboardPage
            jobs={jobs}
            candidates={candidates}
            policies={policies}
            selectedJob={selectedJob}
            onSelectJob={(job) => setSelectedJobId(job.id)}
            onNavigate={handleNavigate}
            onOpenUpload={() => handleNavigate('ingest')}
            onOpenNewJob={() => setShowNewJobModal(true)}
            onOpenDossier={(cand) => setActiveDossierCandidate(cand)}
            onToggleCompare={handleToggleCompare}
            selectedCompareIds={selectedCompareIds}
            onRunMatch={handleRunMatch}
            onStatusChange={(id, status) => {
              const c = candidates.find((cand) => cand.id === id);
              if (c) updateCandidate({ ...c, status });
            }}
            activeStatusFilter={filterStatus}
            onSelectStatusFilter={setFilterStatus}
          />
        )}

        {activePage === 'candidates' && (
          <CandidatesPage
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={(job) => setSelectedJobId(job.id)}
            candidates={candidates}
            policies={policies}
            onOpenUpload={() => handleNavigate('ingest')}
            onOpenNewJob={() => setShowNewJobModal(true)}
            onOpenDossier={(cand) => setActiveDossierCandidate(cand)}
            onToggleCompare={handleToggleCompare}
            selectedCompareIds={selectedCompareIds}
            onRunMatch={handleRunMatch}
            onBatchScreen={handleBatchScreen}
            isBatchScreening={isBatchScreening}
            batchProgress={batchProgress}
            onStatusChange={(id, status) => {
              const c = candidates.find((cand) => cand.id === id);
              if (c) updateCandidate({ ...c, status });
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            onOpenComparePage={() => handleNavigate('compare')}
          />
        )}

        {activePage === 'jobs' && (
          <JobsPage
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={(job) => setSelectedJobId(job.id)}
            onOpenNewJob={() => setShowNewJobModal(true)}
            candidates={candidates}
            onNavigateToCandidates={(job) => {
              setSelectedJobId(job.id);
              handleNavigate('candidates');
            }}
            onUpdateJobStatus={handleUpdateJobStatus}
          />
        )}

        {activePage === 'compare' && (
          <ComparePage
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={(job) => setSelectedJobId(job.id)}
            candidates={candidates}
            selectedCompareIds={selectedCompareIds}
            onToggleCompare={handleToggleCompare}
            onOpenDossier={(cand) => setActiveDossierCandidate(cand)}
            onClearCompare={() => setSelectedCompareIds([])}
          />
        )}

        {activePage === 'policies' && (
          <PoliciesPage
            policies={policies}
            onAddPolicy={handleAddPolicy}
          />
        )}

        {activePage === 'ingest' && (
          <IngestPage
            jobs={jobs}
            policies={policies}
            selectedJob={selectedJob}
            onCandidateAdded={handleAddCandidate}
            onNavigateToCandidates={() => handleNavigate('candidates')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} TalentMatch AI &bull; Intelligent Multi-Page Recruitment Platform</span>
          <span className="text-slate-400">Powered by Gemini ML Matcher & RAG Grounded Knowledge Engine</span>
        </div>
      </footer>

      {/* MODAL 1: Candidate Deep-Dive Dossier Modal */}
      {activeDossierCandidate && selectedJob && (
        <CandidateDossierModal
          candidate={activeDossierCandidate}
          job={selectedJob}
          policies={policies}
          onClose={() => setActiveDossierCandidate(null)}
          onUpdateCandidate={updateCandidate}
        />
      )}

      {/* MODAL 2: Comparison Matrix Modal */}
      {showCompareModal && selectedJob && (
        <ComparisonMatrixModal
          candidateIds={selectedCompareIds}
          candidates={candidates}
          job={selectedJob}
          onClose={() => setShowCompareModal(false)}
          onOpenDossier={(cand) => {
            setShowCompareModal(false);
            setActiveDossierCandidate(cand);
          }}
        />
      )}

      {/* MODAL 3: Resume Ingestion Modal */}
      {showUploadModal && (
        <ResumeUploadModal
          jobs={jobs}
          policies={policies}
          selectedJob={selectedJob}
          onClose={() => setShowUploadModal(false)}
          onCandidateAdded={handleAddCandidate}
        />
      )}

      {/* MODAL 4: Job Opening Manager Modal */}
      {showNewJobModal && (
        <JobManagerModal
          onClose={() => setShowNewJobModal(false)}
          onJobCreated={handleAddJob}
        />
      )}

      {/* MODAL 5: RAG Company Policies Modal */}
      {showPolicyModal && (
        <RagPolicyModal
          policies={policies}
          onClose={() => setShowPolicyModal(false)}
          onAddPolicy={handleAddPolicy}
        />
      )}
    </div>
  );
}
