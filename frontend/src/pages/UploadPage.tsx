import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAnalysis } from '../hooks/useAnalysis';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const { phase, analyze } = useAnalysis();
  const { user } = useAuth();
  const navigate = useNavigate();


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a PDF resume');
      return;
    }
    try {
      await analyze(file, jobDescription || undefined);
    } catch (err) {
      setError('Failed to start analysis');
    }
  };

  const getPhaseInfo = () => {
    if (typeof phase === 'string') {
      if (phase === 'uploading') return { title: 'Uploading...', progress: 25, step: 'Sending to server' };
      if (phase === 'polling') return { title: 'Analyzing...', progress: 50, step: 'AI processing' };
    }
    
    // Parse polling progress from phase string
    if (typeof phase === 'string' && phase.startsWith('polling-')) {
      const [, progressStr, step] = phase.split('-');
      const progress = parseInt(progressStr) || 50;
      return { title: 'Analyzing...', progress, step: step || 'Processing' };
    }

    return null;
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div style={{ 
      padding: '40px 24px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px'
    }}>
      {/* Hero */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'rgba(99,102,241,0.15)',
          color: '#6366F1',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          AI-POWERED ANALYSIS
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          color: '#F1F5F9',
          letterSpacing: '-2px',
          margin: '24px 0 16px 0',
          lineHeight: 1.1
        }}>
          Analyze Your Resume with AI
        </h1>
        <p style={{ fontSize: '18px', color: '#94A3B8', lineHeight: 1.6 }}>
          Get instant feedback on clarity, skills, formatting and job match. Powered by Google's Gemini AI.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
        {/* Upload Card */}
        <div style={{
          backgroundColor: '#12121A',
          border: '1px solid #1E1E2E',
          borderRadius: '16px',
          padding: '32px',
          width: '100%',
          maxWidth: '600px'
        }}>
          <div 
            {...getRootProps()} 
            style={{
              border: isDragActive ? '2px dashed #6366F1' : '2px dashed #2D2D3F',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: isDragActive ? 'rgba(99,102,241,0.05)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ':hover': {
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99,102,241,0.03)'
              }
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '48px' }}>📄</span>
                <div style={{ fontWeight: 600, color: '#F1F5F9' }}>{file.name}</div>
                <div style={{ color: '#94A3B8', fontSize: '14px' }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  style={{
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    color: '#EF4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>📤</span>
                <div style={{ fontSize: '20px', color: '#94A3B8', marginBottom: '8px' }}>
                  Drop your PDF resume here
                </div>
                <div style={{ color: '#475569', fontSize: '14px' }}>
                  PDF format · Max 10MB
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', color: '#94A3B8', fontSize: '14px' }}>
              Job Description (optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description to check skill match..."
              style={{
                width: '100%',
                backgroundColor: '#0A0A0F',
                border: '1px solid #1E1E2E',
                color: '#F1F5F9',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontFamily: 'monospace',
                minHeight: '120px',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#1E1E2E';
              }}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444',
              borderRadius: '10px',
              padding: '12px',
              marginTop: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || phaseInfo !== null}
            style={{
              width: '100%',
              backgroundColor: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: file && !phaseInfo ? 'pointer' : 'not-allowed',
              marginTop: '24px',
              transition: 'all 0.2s',
              opacity: !file || phaseInfo ? 0.6 : 1
            }}
            onMouseOver={(e: any) => {
              if (file && !phaseInfo) {
                e.target.style.backgroundColor = '#4F46E5';
              }
            }}
            onMouseOut={(e: any) => {
              e.target.style.backgroundColor = '#6366F1';
            }}
          >
            {phaseInfo ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>

        {/* Loading Overlay */}
        {phaseInfo && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '48px 24px',
            backgroundColor: 'rgba(18,18,26,0.8)',
            borderRadius: '16px',
            border: '1px solid #1E1E2E',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #1E1E2E',
              borderTop: '4px solid #6366F1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F1F5F9' }}>
              {phaseInfo.title}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '14px' }}>
              {phaseInfo.step}
            </div>
            
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <div style={{
                backgroundColor: '#1E1E2E',
                height: '6px',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: '#6366F1',
                  height: '100%',
                  borderRadius: '3px',
                  width: `${phaseInfo.progress}%`,
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            <div style={{ color: '#475569', fontSize: '12px' }}>
              Step 1 of 5: {phaseInfo.step}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;

