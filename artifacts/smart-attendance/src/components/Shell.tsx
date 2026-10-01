import React, { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Menu, Search, Bell, ChevronDown, Check, MoreHorizontal, LogOut, CircleHelp,
  Fingerprint, ArrowRight, Camera, Sparkles, type LucideIcon,
} from 'lucide-react';
import type { Store, Role } from '../data';
import { dataService } from '../data';
import { mainNav, peopleNav, operationsNav, allNav, roles } from '../utils';
import { HelpModal } from './HelpModal';
import { BackgroundEffects } from './BackgroundEffects';
import { QrScannerModal } from './QrScannerModal';

interface ShellProps {
  store: Store;
  children: ReactNode;
  onToast: (message: string) => void;
}

export function Shell({ store, children, onToast }: ShellProps) {
  const [path, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [roleOpen, setRoleOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const unread = store.notifications.filter(n => !n.read).length;
  const active = allNav.find(item => item.href === path)?.href ?? (path.startsWith('/students/') ? '/students' : path);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('[data-testid="input-global-search"]');
        input?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navSection = (title: string, items: { label: string; href: string; icon: LucideIcon }[]) => (
    <div className="nav-section">
      <div className="nav-caption">{title}</div>
      {items.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`nav-link ${active === item.href ? 'is-active' : ''}`}
            data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
          >
            <Icon size={17} />
            <span>{item.label}</span>
            {item.href === '/notifications' && unread > 0 && <span className="nav-count">{unread}</span>}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="workspace">
      {/* Background cinematic lighting, floating particles & noise */}
      <BackgroundEffects />

      {mobileOpen && (
        <button
          className="mobile-shade"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          style={{ position: 'fixed', inset: 0, zIndex: 25, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: 0 }}
        />
      )}

      {/* Liquid Glass Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link href="/overview" className="brand-lockup" data-testid="link-brand">
          <span className="brand-symbol"><span /></span>
          <span>
            <strong>SMART ATTENDANCE</strong>
            <small>AI-NATIVE SAAS · CHARUSAT</small>
          </span>
        </Link>

        <div className="campus-switch">
          <div className="campus-monogram">CU</div>
          <div>
            <b>{store.settings.campus.split(' ')[0]} Campus</b>
            <small>CSPIT · DEPSTAR · CMPICA</small>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          {navSection('Core Platform', mainNav)}
          {navSection('Campus Directory', peopleNav)}
          {navSection('Security & Compliance', operationsNav)}

          <div className="nav-section">
            <div className="nav-caption">Student Quick Scan</div>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setScannerOpen(true);
              }}
              className="button button-primary"
              style={{ width: '100%', height: '36px', fontSize: '11px', gap: '6px' }}
              data-testid="link-nav-verify-attendance"
            >
              <Camera size={15} />
              <span>SCAN ATTENDANCE QR</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-bottom">
          <button
            type="button"
            className="help-card"
            style={{ width: '100%', cursor: 'pointer', textAlign: 'left' }}
            onClick={() => setHelpOpen(true)}
            data-testid="button-help-center"
          >
            <div className="help-icon"><CircleHelp size={16} /></div>
            <div>
              <b>Anti-Proxy Architecture</b>
              <span>Zero-Trust Protocol</span>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          <button
            className="profile-row"
            onClick={() => setRoleOpen(!roleOpen)}
            data-testid="button-role-menu"
            aria-expanded={roleOpen}
          >
            <span className="avatar avatar-sidebar">{store.currentUser.avatar}</span>
            <span className="profile-copy">
              <b>{store.currentUser.name}</b>
              <small>{store.currentUser.role}</small>
            </span>
            <MoreHorizontal size={18} style={{ color: 'var(--text-muted)' }} />
          </button>

          {roleOpen && (
            <div className="role-menu">
              <div className="role-menu-label">Switch Workspace Role</div>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    dataService.switchRole(role);
                    setRoleOpen(false);
                    onToast(`Switched perspective to ${role}`);
                  }}
                  data-testid={`button-switch-role-${role.toLowerCase()}`}
                >
                  <span>{role === 'Administrator' ? 'Dean / Admin' : role}</span>
                  {store.currentUser.role === role && <Check size={14} style={{ color: '#00d2ff' }} />}
                </button>
              ))}
              <button className="signout-item" onClick={() => setLocation('/login')}>
                <LogOut size={14} /> Exit session
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="main-column">
        {/* Liquid Glass Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              data-testid="button-open-navigation"
              style={{ color: '#ffffff' }}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span>CHARUSAT</span>
              <span className="breadcrumb-slash">/</span>
              <b>{allNav.find(item => item.href === active)?.label ?? (path.startsWith('/students/') ? 'Student Profile' : 'Workspace')}</b>
            </div>
          </div>

          <div className="topbar-right">
            {/* Quick SCAN QR pill button for instant access anywhere on mobile/desktop */}
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="button button-primary"
              style={{ height: '34px', padding: '0 14px', fontSize: '11px', gap: '6px' }}
              title="Open Camera QR Scanner"
            >
              <Camera size={14} />
              <span>SCAN QR</span>
            </button>

            <form
              className="top-search"
              onSubmit={e => {
                e.preventDefault();
                if (search.trim()) setLocation(`/students?search=${encodeURIComponent(search.trim())}`);
              }}
            >
              <Search size={14} />
              <input
                aria-label="Search students by ID or name"
                placeholder="Search students (e.g. 22DCSE001)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                data-testid="input-global-search"
              />
              <kbd>⌘ K</kbd>
            </form>

            <Link
              href="/notifications"
              className="top-icon-wrap"
              aria-label={`Notifications, ${unread} unread`}
              data-testid="link-top-notifications"
            >
              <Bell size={16} />
              {unread > 0 && <i />}
            </Link>

            <button
              className="top-user"
              onClick={() => setRoleOpen(!roleOpen)}
              data-testid="button-top-user"
              aria-label="User menu"
            >
              <span className="avatar">{store.currentUser.avatar}</span>
              <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </header>

        <main className="content-area">
          <div className="page-enter">{children}</div>
        </main>

        <footer className="app-footer" style={{ borderTop: '1px solid var(--glass-border)', padding: '16px 40px', color: 'var(--text-muted)', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(12, 16, 22, 0.5)', backdropFilter: 'blur(10px)' }}>
          <span>CHARUSAT · Charotar University of Science & Technology · NAAC A+ Accredited</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 8px #00d2ff' }} />
            15s Dynamic Rotating QR · FIDO2 WebAuthn Passkeys · Active Anti-Proxy Protection
          </span>
        </footer>
      </div>

      {/* Global 3D QR Scanner Modal callable from any page */}
      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        store={store}
        onSuccess={(msg) => onToast(msg)}
      />

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
