import { useState, useCallback } from 'react';
import { JobDrive, AIAnalysisResult } from '../types';
import { analyzeResumeWithGemini } from '../config/gemini';
import { toast } from 'sonner';

export function useAIResumeMatch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const runAnalysis = useCallback(
    async (resumeText: string, jobDrive: JobDrive): Promise<AIAnalysisResult | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await analyzeResumeWithGemini(resumeText, jobDrive);
        setAnalysis(result);
        toast.success(`AI Resume Match scored: ${result.matchScore}%`);
        return result;
      } catch (err: any) {
        const msg = err?.message || 'Failed to analyze resume with AI';
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    isLoading,
    error,
    analysis,
    runAnalysis,
    resetAnalysis,
  };
}
