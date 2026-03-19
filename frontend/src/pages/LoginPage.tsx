import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email, name, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#12121A',
        border: '1px solid #1E1E2E',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#6366F1',
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            R
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F1F5F9', marginBottom: '4px' }}>ResumeAI</div>
          <div style={{ color: '#94A3B8', fontSize: '14px' }}>Professional Resume Analysis</div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          marginBottom: '32px',
          backgroundColor: '#1A1A2E',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #2D2D3F'
        }}>
          <button
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '14px 20px',
              backgroundColor: isRegister ? 'transparent' : '#6366F1',
              color: isRegister ? '#94A3B8' : 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '14px 20px',
              backgroundColor: isRegister ? '#6366F1' : 'transparent',
              color: isRegister ? 'white' : '#94A3B8',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          {isRegister && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  backgroundColor: '#0A0A0F',
                  border: '1px solid #1E1E2E',
                  color: '#F1F5F9',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366F1'}
                onBlur={(e) => e.target.style.borderColor = '#1E1E2E'}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                width: '100%',
                backgroundColor: '#0A0A0F',
                border: '1px solid #1E1E2E',
                color: '#F1F5F9',
                padding: '14px 16px',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366F1'}
              onBlur={(e) => e.target.style.borderColor = '#1E1E2E'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#94A3B8', fontSize: '14px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                backgroundColor: '#0A0A0F',
                border: '1px solid #1E1E2E',
                color: '#F1F5F9',
                padding: '14px 16px',
                borderRadius: '10px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366F1'}
              onBlur={(e) => e.target.style.borderColor = '#1E1E2E'}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#6366F1',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e: any) => !loading && (e.target.style.backgroundColor = '#4F46E5')}
            onMouseOut={(e: any) => !loading && (e.target.style.backgroundColor = '#6366F1')}
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link 
            to={isRegister ? '/' : '/login'}
            style={{
              color: '#6366F1',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px'
            }}
            onMouseOver={(e: any) => e.target.style.opacity = '0.8'}
            onMouseOut={(e: any) => e.target.style.opacity = '1'}
          >
            {isRegister ? 'Continue without account' : 'Create Account'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
