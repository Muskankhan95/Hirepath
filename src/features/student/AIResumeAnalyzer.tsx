import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAIResumeMatch } from '../../hooks/useAIResumeMatch';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Input';
import { AIInsightCard } from '../../components/shared/AIInsightCard';
import { isGeminiConfigured, setCustomGeminiKey } from '../../config/gemini';
import {
  Sparkles,
  Key,
  Cpu,
  FileText,
  Building,
  CheckCircle,
  Lightbulb,
  Copy,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export const AIResumeAnalyzer: React.FC = () => {
  const { studentProfile, jobDrives } = useAuth();
  const { isLoading, analysis, runAnalysis } = useAIResumeMatch();

  const [selectedDriveId, setSelectedDriveId] = useState<string>(
    jobDrives[0]?.id || 'drv_01'
  );
  const [resumeText, setResumeText] = useState<string>(
    studentProfile?.resumeParsedText || ''
  );
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');

  const targetDrive = jobDrives.find((d) => d.id === selectedDriveId) || jobDrives[0];

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Please provide resume text to analyze');
      return;
    }
    if (!targetDrive) {
      toast.error('Select a target job drive');
      return;
    }
    await runAnalysis(resumeText, targetDrive);
  };

  const handleSaveApiKey = () => {
    setCustomGeminiKey(customKeyInput.trim());
    setShowApiKeyModal(false);
    toast.success('Gemini API key updated!');
  };

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    toast.success(`Copied "${kw}" to clipboard`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-navy-900 text-white p-6 sm:p-8 shadow-xl border border-violet-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> Gemini 2.0 AI Engine
              </span>
              <span className="text-xs text-indigo-200">
                {isGeminiConfigured ? 'Live API Active' : 'Intelligent Parser Ready'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Resume Matcher & ATS Scoring
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-200 max-w-xl">
              Screen your resume against active campus drive algorithms. Discover keyword alignment, strengths, and role fit recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowApiKeyModal(!showApiKeyModal)}
              leftIcon={<Key className="w-4 h-4 text-violet-600" />}
              className="bg-white text-slate-900"
            >
              Configure API Key
            </Button>
          </div>
        </div>

        {/* API Key Dropdown/Drawer */}
        {showApiKeyModal && (
          <div className="mt-4 p-4 rounded-2xl bg-navy-950/80 border border-violet-500/30 text-xs space-y-3">
            <p className="text-indigo-200">
              Optional: Enter your Google Gemini API key to make live LLM requests. If left blank, our built-in intelligent heuristic engine simulates high-precision ATS scoring automatically!
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                className="flex-1 rounded-xl bg-navy-900 border border-slate-700 px-3 py-1.5 text-xs text-white"
              />
              <Button variant="primary" size="sm" onClick={handleSaveApiKey}>
                Save Key
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Drive Selection & Resume Text */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target Drive Selector */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-500" />
                Target Placement Drive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500/20"
              >
                {jobDrives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.companyName} — {d.title} ({d.ctc})
                  </option>
                ))}
              </select>

              {targetDrive && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Role:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {targetDrive.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CTC Offered:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {targetDrive.ctc}
                    </span>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {targetDrive.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Text Input */}
          <Card glass>
            <CardHeader className="pb-3 flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                Resume Content
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResumeText(studentProfile?.resumeParsedText || '')}
                className="text-[11px]"
              >
                Reset to Saved Resume
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={12}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text resume, projects, and skills..."
                className="font-mono text-xs leading-relaxed"
              />

              <Button
                variant="gradient"
                size="lg"
                isLoading={isLoading}
                onClick={handleAnalyze}
                leftIcon={<Sparkles className="w-4 h-4 text-yellow-300" />}
                className="w-full"
              >
                Scan with Gemini AI
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 Cols): AI Analysis Scorecard */}
        <div className="lg:col-span-7 space-y-5">
          {analysis ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              <AIInsightCard analysis={analysis} targetRole={targetDrive?.title} />

              {/* Actionable Keyword Insertion Helper */}
              {analysis.missingKeywords.length > 0 && (
                <Card glass>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      Click-to-Copy Keywords for Resume Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Recruiting ATS filters automatically discard resumes that lack these core technologies. Click to copy and weave them into your project descriptions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw) => (
                        <button
                          key={kw}
                          onClick={() => copyKeyword(kw)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-all group"
                        >
                          <span>+ {kw}</span>
                          <Copy className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Role Suggestions */}
              {analysis.suggestedRoles && (
                <Card glass>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-brand-500" />
                      Alternative Campus Roles That Fit Your Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {analysis.suggestedRoles.map((roleName, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{roleName}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card glass className="p-8 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Resume Analysis Run Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5">
                Select a target placement drive from the left panel and click "Scan with Gemini AI" to unlock comprehensive ATS matching, strengths, and keywords.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAnalyze}
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="mt-5"
              >
                Analyze Current Resume
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
