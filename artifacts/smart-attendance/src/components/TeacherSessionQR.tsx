import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, Users, ShieldCheck, QrCode, KeyRound, Radio,
  Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Maximize2
} from 'lucide-react';
import type { Session, Store } from '../data';
import { DynamicQrCode } from '../components';
import { classLabel, getTeacher, getClass, presentCount } from '../utils';

interface TeacherSessionQRProps {
  session: Session;
  store: Store;
  onEndSession?: () => void;
}

export function TeacherSessionQR({ session, store, onEndSession }: TeacherSessionQRProps) {
  const [now, setNow] = useState(Date.now());
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  // Elapsed Session Time
  const startTime = new Date(session.start).getTime();
  const elapsedMinutes = Math.max(0, Math.floor((now - startTime) / 60000));
  const elapsedSeconds = Math.max(0, Math.floor(((now - startTime) % 60000) / 1000));
  const formattedElapsed = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')}`;

  const room = getClass(store, session.classId);

  return (
    <div className={`teacher-qr-presentation-glass ${isFullScreen ? 'is-fullscreen' : ''}`}>
      {/* Top Banner with Active Session Indicator */}
      <div className="qr-presentation-top">
        <div className="active-session-pill">
          <span className="pulsing-live-orb" />
          <span>ACTIVE ATTENDANCE SESSION</span>
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

      {/* Main 3D Stage: Big Central QR + Countdown Ring + Security Code */}
      <div className="qr-3d-stage">
        {/* Left Telemetry Cluster */}
        <div className="qr-telemetry-column">
          <div className="telemetry-glass-card">
            <span className="telemetry-label">LIVE ATTENDANCE</span>
            <div className="telemetry-big-number">
              <strong>{presentRecords.length}</strong>
              <small>/ {totalEnrolled}</small>
            </div>
            <div className="telemetry-track">
              <span style={{ width: `${Math.round((presentRecords.length / totalEnrolled) * 100)}%` }} />
            </div>
            <span className="telemetry-pct-note">
              {Math.round((presentRecords.length / totalEnrolled) * 100)}% verified presence
            </span>
          </div>

          <div className="telemetry-states-grid">
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
              <span>Review</span>
              <strong>{reviewRecords.length}</strong>
            </div>
          </div>
        </div>

        {/* Center: Large Cinematic Rotating QR Presentation Area */}
        <div className="central-qr-display-box">
          <div className="qr-halo-glow" />
          
          {/* Animated 15-Second Progress Ring */}
          <div className="qr-frame-wrapper">
            <svg className="rotation-countdown-ring" viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="46" />
              <circle
                className="ring-progress"
                cx="50"
                cy="50"
                r="46"
                style={{
                  strokeDasharray: 289,
                  strokeDashoffset: 289 - (289 * progressPercent) / 100,
                }}
              />
            </svg>

            {/* QR Code Matrix */}
            <div className="qr-code-embed">
              <DynamicQrCode code={`${session.id}:${dynamicCode}`} size={220} logoText="CHARUSAT" />
            </div>
          </div>

          {/* 15s Countdown Display */}
          <div className="rotation-epoch-tag">
            <RefreshCw size={13} className="spin-slow" />
            <span>Rotates in <strong>{secondsRemaining}s</strong></span>
          </div>

          {/* 6-Character Synchronized Security Code */}
          <div className="security-code-billboard">
            <small>6-DIGIT SYNCHRONIZED CODE</small>
            <div className="code-digits-large">
              {dynamicCode}
            </div>
            <span className="code-disclaimer">Projected for in-person students in room {room?.room || '204'}</span>
          </div>
        </div>

        {/* Right: Live Activity Stream */}
        <div className="live-activity-stream-column">
          <div className="activity-stream-card">
            <div className="stream-header">
              <span className="stream-dot" />
              <h4>Live Check-In Telemetry</h4>
            </div>

            <div className="stream-list">
              {session.attendanceRecords.length ? (
                session.attendanceRecords.slice(-5).reverse().map(record => {
                  const student = store.students.find(s => s.id === record.studentId);
                  return (
                    <div key={record.id} className="stream-item">
                      <div className="stream-avatar">
                        {student?.name.split(' ').map(n => n[0]).join('') || 'ST'}
                      </div>
                      <div className="stream-item-info">
                        <b>{student?.name || 'Verified Student'}</b>
                        <small>{student?.studentId || '22DCSE'} · {record.verificationMethod || 'Passkey'}</small>
                      </div>
                      <span className="badge badge-green">Present</span>
                    </div>
                  );
                })
              ) : (
                <div className="stream-empty">
                  <QrCode size={24} className="text-cyan" />
                  <p>Awaiting first student scan...</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Session Controls */}
          {onEndSession && (
            <button
              onClick={onEndSession}
              className="button button-danger full-width end-session-btn"
            >
              Conclude Attendance Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
