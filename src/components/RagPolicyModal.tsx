import React, { useState } from 'react';
import { X, ShieldCheck, Search, Sparkles, Plus, BookOpen, CheckCircle2, AlertCircle, HelpCircle, Tag } from 'lucide-react';
import { CompanyPolicy } from '../types';
import { queryRagPolicyWithAI } from '../services/api';

interface RagPolicyModalProps {
  policies: CompanyPolicy[];
  onClose: () => void;
  onAddPolicy: (newPolicy: CompanyPolicy) => void;
}

export const RagPolicyModal: React.FC<RagPolicyModalProps> = ({
  policies,
  onClose,
  onAddPolicy,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive RAG query
  const [ragQuery, setRagQuery] = useState('');
  const [isQueryingRag, setIsQueryingRag] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<{ answer: string; relevantPolicyIds: string[] } | null>(null);

  // New Policy Form State
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Company Hiring Policies & RAG Knowledge Base</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {policies.length} Active Rules
                </span>
              </div>
              <p className="text-xs text-slate-400">Standard criteria cited during AI candidate screening & policy audits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 bg-slate-50/50 text-xs">
          
          {/* Interactive RAG Assistant Query Box */}
          <div className="bg-gradient-to-br from-slate-900 to-sky-950 text-white p-5 rounded-2xl shadow-md border border-sky-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sky-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                Ask RAG Policy Assistant
              </span>
              <span className="text-[11px] text-slate-400">Grounded strictly on company guidelines</span>
            </div>

            <form onSubmit={handleAskRag} className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="e.g. Do we sponsor H-1B transfers for senior engineers? What are our salary limits?"
                className="flex-grow p-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                disabled={isQueryingRag || !ragQuery.trim()}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isQueryingRag ? 'Searching...' : 'Ask RAG'}</span>
              </button>
            </form>

            {ragAnswer && (
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/15 text-xs text-slate-100 space-y-2 mt-2">
                <p className="leading-relaxed whitespace-pre-line">{ragAnswer.answer}</p>
                {ragAnswer.relevantPolicyIds.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-sky-300">
                    <span>Referenced Policies:</span>
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

          {/* Policy Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Add Policy Rule'}</span>
            </button>
          </div>

          {/* Add New Policy Form */}
          {showAddForm && (
            <form onSubmit={handleCreatePolicy} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Create Custom Policy Guideline</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Policy Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Remote Work Relocation Allowance"
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Policy Text & Criteria</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Define official criteria, eligibility conditions, and exception requirements..."
                  rows={3}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="visa, compensation, remote"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Policy to Knowledge Base
                </button>
              </div>
            </form>
          )}

          {/* List of Policies */}
          <div className="space-y-3">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{policy.id}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        {policy.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{policy.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Updated: {policy.lastUpdated}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {policy.content}
                </p>

                {policy.tags?.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {policy.tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close Knowledge Base
          </button>
        </div>

      </div>
    </div>
  );
};
