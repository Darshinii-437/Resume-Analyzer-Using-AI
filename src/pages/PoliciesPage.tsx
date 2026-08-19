import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  Tag, 
  HelpCircle,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { CompanyPolicy } from '../types';
import { queryRagPolicyWithAI } from '../services/api';

interface PoliciesPageProps {
  policies: CompanyPolicy[];
  onAddPolicy: (newPolicy: CompanyPolicy) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  policies,
  onAddPolicy,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive RAG query
  const [ragQuery, setRagQuery] = useState('');
  const [isQueryingRag, setIsQueryingRag] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<{ answer: string; relevantPolicyIds: string[] } | null>(null);

  // Add Policy State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CompanyPolicy['category']>('Compliance & Legal');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories = [
    'All',
    'Work Authorization & Visa',
    'Compensation & Bands',
    'Experience & Education',
    'DEI & Anti-Bias',
    'Remote & Relocation',
    'Compliance & Legal',
  ];

  const filteredPolicies = policies.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAskRag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setIsQueryingRag(true);
    try {
      const response = await queryRagPolicyWithAI(ragQuery, policies);
      setRagAnswer(response);
    } catch (err) {
      console.error('Failed to query RAG policy:', err);
    } finally {
      setIsQueryingRag(false);
    }
  };

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const policy: CompanyPolicy = {
      id: `pol-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      lastUpdated: new Date().toISOString().split('T')[0],
      isMandatory: true,
    };

    onAddPolicy(policy);
    setShowAddForm(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
              RAG Knowledge Base
            </span>
            <span className="text-xs text-slate-500 font-medium">{policies.length} Active Guidelines</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Company Hiring Policies & Compliance Standards
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            These rules are retrieved by the LLM (via RAG) during candidate screening to audit visa sponsorship, compensation ranges, and education equivalencies.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Policy Form' : 'Add New Policy Rule'}</span>
        </button>
      </div>

      {/* Interactive RAG Policy Assistant Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-6 rounded-2xl shadow-md border border-sky-800/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-wider text-xs">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Interactive RAG Policy Assistant</span>
          </div>
          <span className="text-xs text-slate-400">Strictly grounded on active guidelines</span>
        </div>

        <form onSubmit={handleAskRag} className="flex gap-2">
          <input
            type="text"
            value={ragQuery}
            onChange={(e) => setRagQuery(e.target.value)}
            placeholder="Ask anything (e.g. 'Can we sponsor visa for junior engineers?', 'What are our compensation caps for L6?')"
            className="flex-grow p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            type="submit"
            disabled={isQueryingRag || !ragQuery.trim()}
            className="px-5 py-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-2 text-xs flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isQueryingRag ? 'Searching...' : 'Ask Assistant'}</span>
          </button>
        </form>

        {ragAnswer && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/15 text-xs text-slate-100 space-y-2 mt-2">
            <strong className="text-sky-300 block">AI Policy Response:</strong>
            <p className="leading-relaxed whitespace-pre-line">{ragAnswer.answer}</p>
            {ragAnswer.relevantPolicyIds.length > 0 && (
              <div className="flex items-center gap-1.5 pt-2 text-[11px] text-sky-300">
                <span>Referenced Policy Citations:</span>
                {ragAnswer.relevantPolicyIds.map((id) => (
                  <span key={id} className="bg-sky-500/20 px-2 py-0.5 rounded text-white font-mono">
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Policy Form */}
      {showAddForm && (
        <form onSubmit={handleCreatePolicy} className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Create Custom Policy Guideline</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">Policy Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Remote Work Relocation Allowance"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Policy Text & Criteria</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Define official criteria, eligibility conditions, and exception requirements..."
              rows={4}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Tags (Comma-separated)</label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="visa, compensation, remote"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
            >
              Save Policy to Knowledge Base
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search policies or tags..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Policies Grid */}
      <div className="space-y-3">
        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{policy.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                    {policy.category}
                  </span>
                  {policy.isMandatory && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Mandatory Standard
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{policy.title}</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Updated: {policy.lastUpdated}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {policy.content}
            </p>

            {policy.tags?.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                <Tag className="w-3 h-3 text-slate-400" />
                {policy.tags.map((t, idx) => (
                  <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
