import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, Users, ShieldCheck, QrCode, KeyRound, Radio,
  Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Maximize2,
  Copy, Check, UserCheck, Flame
} from 'lucide-react';
import type { Session, Store } from '../data';
import { dataService } from '../data';
import { DynamicQrCode } from '../components';
import { classLabel, getTeacher, getClass } from '../utils';

interface TeacherSessionQRProps {
  session: Session;
  store: Store;
  onEndSession?: () => void;
}

export function TeacherSessionQR({ session, store, onEndSession }: TeacherSessionQRProps) {
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [lastCheckInStudent, setLastCheckInStudent] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ROTATION_SECONDS = 15;
  const epoch = Math.floor(now / (ROTATION_SECONDS * 1000));
  const secondsRemaining = ROTATION_SECONDS - Math.floor((now / 1000) % ROTATION_SECONDS);
  const progressPercent = ((ROTATION_SECONDS - secondsRemaining) / ROTATION_SECONDS) * 100;

  // Dynamic code shifts every 15 seconds
  const dynamicCode = useMemo(() => {
    const base = Number(session.code.replace(/\s/g, '')) || 482917;
    const shifted = ((base + epoch * 173) % 900000) + 100000;
    return String(shifted).replace(/(\d{3})(\d{3})/, '$1 $2');
  }, [session.code, epoch]);

  // Telemetry counts
  const enrolledStudents = store.students.filter(s => s.classId === session.classId);
  const totalEnrolled = enrolledStudents.length || 50;
  const presentRecords = session.attendanceRecords.filter(r => r.status === 'Present');
  const lateRecords = session.attendanceRecords.filter(r => r.status === 'Late');
  const reviewRecords = store.securityEvents.filter(e => e.status === 'Needs review');
  const pendingCount = Math.max(0, totalEnrolled - presentRecords.length - lateRecords.length);
  const attendanceRate = Math.round((presentRecords.length / totalEnrolled) * 100);

  // Elapsed Session Time
  const startTime = new Date(session.start).getTime();
  const elapsedMinutes = Math.max(0, Math.floor((now - startTime) / 60000));
  const elapsedSeconds = Math.max(0, Math.floor(((now - startTime) % 60000) / 1000));
  const formattedElapsed = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')}`;

  const room = getClass(store, session.classId);

  // Payload encoded into QR Code for student scanners: format "CHARUSAT:sessionId:code"
  const qrPayload = `CHARUSAT:${session.id}:${dynamicCode.replace(/\s/g, '')}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(dynamicCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate a student scanning from the teacher screen for instant testing
  const handleSimulateStudentScan = () => {
    const checkedInIds = new Set(session.attendanceRecords.map(r => r.studentId));
    const nextStudent = enrolledStudents.find(s => !checkedInIds.has(s.id)) || store.students.find(s => !checkedInIds.has(s.id));
    if (nextStudent) {
      dataService.confirmStudentPresence(session.id, nextStudent.id, 'QR + Rotating Code');
      setLastCheckInStudent(nextStudent.name);
      setTimeout(() => setLastCheckInStudent(null), 3000);
    }
  };

  return (
    <div className="teacher-qr-presentation-glass">
      {/* Top Banner with Active Session Indicator */}
      <div className="qr-presentation-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="active-session-pill">
            <span className="pulsing-live-orb" />
            <span>ACTIVE ATTENDANCE WINDOW</span>
          </div>
          {lastCheckInStudent && (
            <div className="badge badge-green" style={{ animation: 'pulse 1s infinite' }}>
              <UserCheck size={13} /> {lastCheckInStudent} just checked in!
            </div>
          )}
        </div>

        <div className="session-cohort-meta">
          <strong>{classLabel(store, session.classId)}</strong>
          <span>Room {room?.room || 'CSPIT Lab 204'} · Instructor: {getTeacher(store, session.teacherId)?.name || 'Prof. Trushit Upadhyaya'}</span>
        </div>

        <div className="session-timer-badge">
          <Clock size={15} />
          <span>Elapsed: <strong>{formattedElapsed}</strong></span>
        </div>
      </div>

      {/* Main 3-Column Layout:
          1. Dedicated Timer & Rotation Aside Column (completely separated from QR)
          2. Clean Central QR Code Card (no overlapping rings or text)
          3. Live Attendance Telemetry & Roster Stream
      */}
      <div className="qr-stage-layout">
        {/* LEFT COLUMN: DEDICATED COUNTDOWN TIMER & ROTATION CLOCK (PUT ASIDE) */}
        <div className="timer-aside-card">
          <div className="timer-card-header">
            <Clock size={16} className="text-cyan" />
            <h4>Dynamic Epoch Timer</h4>
          </div>

          {/* Large Circular Countdown Timer Gauge (Aside from QR) */}
          <div className="timer-gauge-container">
            <svg className="timer-circle-svg" viewBox="0 0 120 120">
              <circle className="timer-circle-bg" cx="60" cy="60" r="50" />
              <circle
                className="timer-circle-meter"
                cx="60"
                cy="60"
                r="50"
                style={{
                  strokeDasharray: 314,
                  strokeDashoffset: 314 - (314 * progressPercent) / 100,
                }}
              />
            </svg>
            <div className="timer-gauge-center">
              <span className="timer-gauge-number">{secondsRemaining}</span>
              <span className="timer-gauge-unit">SECONDS</span>
            </div>
          </div>

          <div className="timer-status-box">
            <div className="timer-status-row">
              <RefreshCw size={13} className="spin-slow text-cyan" />
              <span>Rotates every <strong>15s</strong></span>
            </div>
            <p className="timer-status-hint">
              Anti-screenshot replay protection. Scanners must capture the live epoch.
            </p>
          </div>

          <div className="timer-stats-list">
            <div className="timer-stat-row">
              <span>Session Duration:</span>
              <b>{formattedElapsed}</b>
            </div>
            <div className="timer-stat-row">
              <span>Epoch Counter:</span>
              <code>#{epoch % 1000}</code>
            </div>
            <div className="timer-stat-row">
              <span>Room Location:</span>
              <b>{room?.room || 'Room 204'}</b>
            </div>
          </div>

          {/* Quick simulation button for demonstration */}
          <button
            type="button"
            onClick={handleSimulateStudentScan}
            className="button button-secondary full-width"
            style={{ marginTop: '12px', fontSize: '11px', gap: '6px' }}
            title="Simulate a student scanning attendance right now"
          >
            <Sparkles size={14} className="text-cyan" />
            <span>+ Simulate Student Scan</span>
          </button>
        </div>

        {/* CENTER COLUMN: CLEAN, HIGH-CONTRAST QR CODE (100% UNOBSTRUCTED) */}
        <div className="qr-presentation-stage">
          <div className="qr-card-hero">
            <div className="qr-header-strip">
              <span className="qr-pill-label">SCAN WITH SMARTPHONE CAMERA OR APP</span>
            </div>

            {/* Clean QR Code Container with High-Contrast White Surface & Quiet Zone */}
            <div className="qr-clean-view">
              <DynamicQrCode code={qrPayload} size={240} logoText="CHARUSAT" />
            </div>

            <div className="qr-instructions-strip">
              <span>Align viewfinder with QR code. Rotates automatically every 15s.</span>
            </div>

            {/* 6-Character Synchronized Security Code Billboard */}
            <div className="security-code-billboard">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                <small>6-DIGIT SYNCHRONIZED CODE</small>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="copy-code-btn"
                  title="Copy code to clipboard"
                >
                  {copied ? <Check size={13} color="#00e699" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="code-digits-large">
                {dynamicCode}
              </div>

              <span className="code-disclaimer">
                Can also be entered manually in student portal if camera is unavailable
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE ATTENDANCE ROSTER & TELEMETRY STREAM */}
        <div className="live-attendance-column">
          <div className="live-counter-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="telemetry-label">LIVE ATTENDANCE</span>
              <span className="badge badge-teal" style={{ fontSize: '10px' }}>
                <span className="pulsing-live-orb mini" /> Real-Time
              </span>
            </div>

            <div className="telemetry-big-number">
              <strong>{presentRecords.length}</strong>
              <small>/ {totalEnrolled} Enrolled</small>
            </div>

            <div className="telemetry-track">
              <span style={{ width: `${attendanceRate}%` }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
              <span style={{ color: '#00e699', fontWeight: 600 }}>{attendanceRate}% Checked In</span>
              <span style={{ color: 'var(--text-muted)' }}>{pendingCount} Awaiting</span>
            </div>

            <div className="telemetry-states-grid" style={{ marginTop: '12px' }}>
              <div className="state-badge-item present">
                <span>Present</span>
                <strong>{presentRecords.length}</strong>
              </div>
              <div className="state-badge-item late">
                <span>Late</span>
                <strong>{lateRecords.length}</strong>
              </div>
              <div className="state-badge-item pending">
                <span>Pending</span>
                <strong>{pendingCount}</strong>
              </div>
              <div className="state-badge-item review">
                <span>Flagged</span>
                <strong>{reviewRecords.length}</strong>
              </div>
            </div>
          </div>

          {/* Live Check-in Activity Feed */}
          <div className="activity-stream-card" style={{ marginTop: '14px', flex: 1 }}>
            <div className="stream-header">
              <span className="stream-dot" />
              <h4>Live Student Check-Ins ({presentRecords.length})</h4>
            </div>

            <div className="stream-list custom-scroll" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {session.attendanceRecords.length ? (
                session.attendanceRecords.slice().reverse().map(record => {
                  const student = store.students.find(s => s.id === record.studentId);
                  return (
                    <div key={record.id} className="stream-item">
                      <div className="stream-avatar">
                        {student?.name.split(' ').map(n => n[0]).join('') || 'ST'}
                      </div>
                      <div className="stream-item-info">
                        <b>{student?.name || 'Verified Student'}</b>
                        <small>{student?.studentId || '22DCSE'} · {new Date(record.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</small>
                      </div>
                      <span className="badge badge-green">Present</span>
                    </div>
                  );
                })
              ) : (
                <div className="stream-empty">
                  <QrCode size={24} className="text-cyan" />
                  <p>Awaiting student check-ins...</p>
                  <small style={{ color: 'var(--text-muted)' }}>Scans will appear here instantly</small>
                </div>
              )}
            </div>
          </div>

          {onEndSession && (
            <button
              type="button"
              onClick={onEndSession}
              className="button button-danger full-width end-session-btn"
              style={{ marginTop: '14px' }}
            >
              Conclude Attendance Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
