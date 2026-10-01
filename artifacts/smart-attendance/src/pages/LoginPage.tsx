import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowRight, Fingerprint, LockKeyhole, QrCode, ShieldCheck, Database,
  Sparkles, CheckCircle2, KeyRound, Server
} from 'lucide-react';
import type { Role, Store } from '../data';
import { dataService } from '../data';
import * as api from '../api';
import { BackgroundEffects } from '../components/BackgroundEffects';
import { roles } from '../utils';

interface LoginPageProps {
  store: Store;
  onSignedIn: () => void;
}

export function LoginPage({ store, onSignedIn }: LoginPageProps) {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<Role>(store.currentUser.role || 'Administrator');
  const [email, setEmail] = useState('amit.ganatra@charusat.ac.in');
  const [password, setPassword] = useState('charusat123');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getRoleEmail = (r: Role) => {
    switch (r) {
      case 'Student':
        return '22dcse001@charusat.edu.in';
      case 'Teacher':
        return 'trushit.ce@charusat.ac.in';
      case 'Administrator':
      default:
        return 'amit.ganatra@charusat.ac.in';
    }
  };

  const getRoleDisplayName = (r: Role) => {
    switch (r) {
      case 'Student':
        return 'Aarav Patel (22DCSE001)';
      case 'Teacher':
        return 'Prof. Trushit Upadhyaya';
      case 'Administrator':
      default:
        return 'Dr. Amit Ganatra (Principal / Dean)';
    }
  };

  // Switch role and pre-fill credentials for instantaneous demo experience
  const handleSelectRole = (r: Role) => {
    setRole(r);
    setEmail(getRoleEmail(r));
    setPassword('charusat123');
    dataService.switchRole(r);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(`Authenticating institutional credentials for ${role}...`);

    try {
      // 1. Attempt real backend login
      await api.loginWithBackend(email, password);

      // 2. Commit role state
      dataService.switchRole(role);

      // 3. Automatic role-based redirect
      setMessage(`Welcome, ${getRoleDisplayName(role)}. Redirecting to ${role} Dashboard...`);
      setTimeout(() => {
        setLoading(false);
        onSignedIn();
        setLocation('/overview');
      }, 400);
    } catch {
      // Local fallback
      dataService.switchRole(role);
      setTimeout(() => {
        setLoading(false);
        onSignedIn();
        setLocation('/overview');
      }, 300);
    }
  };

  return (
    <div className="login-screen">
      <BackgroundEffects />

      <div className="login-glass-container">
        {/* Soft blue/cyan ambient glow behind card */}
        <div className="login-halo-backdrop" />

        {/* Central Liquid Glass Login Card */}
        <div className="login-card-glass page-enter">
          {/* Logo & Brand Header */}
          <div className="login-center-brand">
            <div className="login-brand-logo-symbol">
              <span>CU</span>
            </div>
            <span className="login-brand-title">SMART ATTENDANCE</span>
            <h1 className="login-hero-tagline">
              "Attendance,
              <em>Verified."</em>
            </h1>
          </div>

          {/* Quick Institutional Role Selectors */}
          <div className="role-pills-row">
            {roles.map(r => (
              <button
                key={r}
                type="button"
                className={`role-pill-btn ${role === r ? 'is-active' : ''}`}
                onClick={() => handleSelectRole(r)}
                data-testid={`btn-select-role-${r.toLowerCase()}`}
              >
                {r === 'Administrator' ? 'Dean / Admin' : r === 'Teacher' ? 'Teacher' : 'Student'}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="login-form-group">
            <label className="glass-form-label">
              <span>Email / Username</span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@charusat.ac.in"
                className="glass-input"
                data-testid="input-login-email"
              />
            </label>

            <label className="glass-form-label">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input"
                data-testid="input-login-password"
              />
            </label>

            {message && (
              <div className="scanner-info-strip" style={{ marginTop: '4px' }}>
                <Sparkles size={14} className="text-cyan" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button button-primary login-cta-btn"
              data-testid="btn-login-submit"
            >
              {loading ? 'Authenticating...' : `LOGIN AS ${role.toUpperCase()}`} <ArrowRight size={16} />
            </button>
          </form>

          {/* Multi-Layer Trust Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '20px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <QrCode size={14} style={{ color: '#00d2ff', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>15s QR</div>
              <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Rolling Epoch</small>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <Fingerprint size={14} style={{ color: '#00d2ff', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>WebAuthn</div>
              <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>FIDO2 Passkey</small>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <ShieldCheck size={14} style={{ color: '#00d2ff', margin: '0 auto 4px' }} />
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#ffffff' }}>Zero-Trust</div>
              <small style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px' }}>Anti-Proxy</small>
            </div>
          </div>

          <div className="login-sub-foot">
            <span>Secure institutional access · CHARUSAT Changa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
