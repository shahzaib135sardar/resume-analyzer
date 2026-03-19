import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0F', color: '#F1F5F9' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        height: '64px',
        backgroundColor: '#12121A',
        borderBottom: '1px solid #1E1E2E',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#6366F1',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: 'white'
          }}>
            R
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#F1F5F9' }}>Resume</div>
            <div style={{ fontSize: '12px', color: '#6366F1', fontWeight: 600 }}>AI</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(99,102,241,0.15)',
            color: '#6366F1',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 600
          }}>
            Powered by Gemini
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#94A3B8', 
              textDecoration: 'none', 
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            style={{
              ':hover': {
                color: '#F1F5F9',
                backgroundColor: 'rgba(99,102,241,0.1)'
              }
            }}
          >
            Analyze
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 500, color: '#F1F5F9' }}>{user.name}</span>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#6366F1',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e: any) => e.target.style.backgroundColor = '#4F46E5'}
                onMouseOut={(e: any) => e.target.style.backgroundColor = '#6366F1'}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              style={{
                backgroundColor: '#6366F1',
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e: any) => e.target.style.backgroundColor = '#4F46E5'}
              onMouseOut={(e: any) => e.target.style.backgroundColor = '#6366F1'}
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: '64px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        height: '64px',
        backgroundColor: '#0A0A0F',
        borderTop: '1px solid #1E1E2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#475569',
        fontSize: '14px'
      }}>
        © 2024 ResumeAI. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
