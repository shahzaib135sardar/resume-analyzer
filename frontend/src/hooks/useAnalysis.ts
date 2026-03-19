import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, getJobStatus } from '../services/api';
import type { ResumeAnalysis, AnalysisJobStatus } from '../types';

type AnalysisPhase = 
  | 'idle'
  | 'uploading'
  | 'polling'
  | { done: true; result: ResumeAnalysis }
  | { error: true; message: string };

export const useAnalysis = () => {
  const [phase, setPhase] = useState<AnalysisPhase>('idle');
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    setPhase('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sessionStorage.removeItem('analysisResult');
  }, []);

  const analyze = useCallback(async (file: File, jobDescription?: string) => {
    try {
      setPhase('uploading');
      const response = await uploadResume(file, jobDescription);
      const { jobId } = response.data;

      setPhase('polling');
      
      const checkStatus = async () => {
        try {
          const statusResponse = await getJobStatus(jobId);
          const status = statusResponse.data;

          if (status.status === 'completed') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPhase({ done: true, result: status.result! });
            sessionStorage.setItem('analysisResult', JSON.stringify(status.result));
            return;
          }

          if (status.status === 'failed') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPhase({ error: true, message: status.error || 'Analysis failed' });
            return;
          }

          // Update UI with progress
          (setPhase as any)(`polling-${status.progress}-${status.step}`);
          
        } catch (error) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase({ error: true, message: 'Connection error' });
        }
      };

      // Initial check
      await checkStatus();
      
      // Poll every 1.5s
      intervalRef.current = setInterval(checkStatus, 1500);

    } catch (error) {
      setPhase({ error: true, message: 'Upload failed' });
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase && typeof phase === 'object' && 'done' in phase && phase.done) {
      navigate('/dashboard');
    }
  }, [phase, navigate]);


  return { phase, analyze, reset };
};
