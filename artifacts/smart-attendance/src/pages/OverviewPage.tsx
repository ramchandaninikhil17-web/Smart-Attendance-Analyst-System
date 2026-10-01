import React, { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import {
  Activity, Users, Clock3, AlertTriangle, ArrowRight, ArrowUpRight, Download, Plus,
  Sparkles, BookOpen, CalendarDays, Fingerprint, ShieldCheck, Send, CheckCircle2,
  Radio, Play, ShieldAlert, Award, Camera, RefreshCw, KeyRound, Check
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Store, Student, ClassRoom, Subject } from '../data';
import { dataService } from '../data';
import { Badge, Button, Card, EmptyState, Modal, PageHeader } from '../components';
import { QrScannerModal } from '../components/QrScannerModal';
import { RecoveryCalculator } from '../components/RecoveryCalculator';
import { SecurityPipeline } from '../components/SecurityPipeline';
import { TeacherSessionQR } from '../components/TeacherSessionQR';
import {
  presentCount, classLabel, getTeacher, getClass, initials, formatGreetingName,
  toneForStatus, fmtDate, fmtTime, attendanceColors,
} from '../utils';

export function MetricCard({
  label, value, detail, detailTone = 'neutral', icon, mark, warn = false,
}: {
  label: string; value: string; detail: ReactNode; detailTone?: 'good' | 'neutral'; icon: ReactNode; mark: string; warn?: boolean;
}) {
  return (
    <Card tilt className={`metric-card ${warn ? 'metric-warning' : ''}`}>
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-mark">{mark}</span>
      </div>
      <div>
        <span className="metric-label">{label}</span>
        <strong className="metric-value">{value}</strong>
      </div>
      <span className={`metric-detail ${detailTone === 'good' ? 'detail-good' : ''}`}>{detail}</span>
    </Card>
  );
}

export function OverviewPage({ store, onToast }: { store: Store; onToast: (msg: string) => void }) {
  if (store.currentUser.role === 'Student') {
    return <StudentDashboard store={store} onToast={onToast} />;
  }

  if (store.currentUser.role === 'Teacher') {
    return <TeacherDashboard store={store} onToast={onToast} />;
  }

  return <AdminDashboard store={store} onToast={onToast} />;
}

/* ==========================================================================
   ADMIN DASHBOARD (EXECUTIVE OVERVIEW)
   ========================================================================== */
function AdminDashboard({ store, onToast }: { store: Store; onToast: (msg: string) => void }) {
  const live = store.sessions.find(s => s.status === 'Live');
  const present = store.sessions.reduce((n, s) => n + presentCount(s), 0);
  const possible = store.sessions.reduce((n, s) => n + s.attendanceRecords.length, 0);
  const rate = possible ? Math.round((present / possible) * 100) : 88;
  const threshold = store.settings.attendanceThreshold || 75;

  const trend = [
    { day: 'Mon', value: 83 },
    { day: 'Tue', value: 87 },
    { day: 'Wed', value: 82 },
    { day: 'Thu', value: 89 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 92 },
    { day: 'Today', value: rate },
  ];

  const atRisk = store.students.filter(s => s.attendancePercent < threshold).slice(0, 4);
  const distribution = [
    { name: 'Present', value: present || 68, color: '#00d2ff' },
    { name: 'Late', value: 8, color: '#ffaa00' },
    { name: 'Absent', value: 10, color: '#ff4d4d' },
    { name: 'Excused', value: 4, color: '#3D81E3' },
  ];

  const greetingName = formatGreetingName(store.currentUser.name);

  return (
    <div className="page-stack page-enter">
      <PageHeader
        eyebrow="CAMPUS ATTENDANCE INTELLIGENCE"
        title={`Executive Overview, ${greetingName}.`}
        description="Comprehensive real-time telemetry across CSPIT, DEPSTAR, and CMPICA with hardware FIDO2 anti-proxy enforcement."
        actions={
          <>
            <Link href="/reports" className="button button-secondary" data-testid="link-overview-report">
              <Download size={15} /> Export Audit Report
            </Link>
            <Link href="/sessions" className="button button-primary" data-testid="link-start-session">
              <Plus size={15} /> Launch Classroom Session
            </Link>
          </>
        }
      />

      {/* 6 KPI Glass Cards as explicitly specified */}
      <section className="metric-grid admin-6-grid">
        <MetricCard
          label="Total Students"
          value={String(store.students.length)}
          detail={<><ArrowUpRight size={13} /> Across 4 engineering batches</>}
          detailTone="good"
          icon={<Users size={18} />}
          mark="01"
        />
        <MetricCard
          label="Total Teachers"
          value={String(store.teachers.length)}
          detail="CSPIT · DEPSTAR · CMPICA"
          icon={<BookOpen size={18} />}
          mark="02"
        />
        <MetricCard
          label="Active Sessions"
          value={String(store.sessions.filter(s => s.status === 'Live').length)}
          detail={live ? `${classLabel(store, live.classId)} is live` : 'No live sessions right now'}
          icon={<Radio size={18} />}
          mark="03"
        />
        <MetricCard
          label="Average Attendance"
          value={`${rate}%`}
          detail={<><ArrowUpRight size={13} /> +3.8% above required threshold</>}
          detailTone="good"
          icon={<Activity size={18} />}
          mark="04"
        />
        <MetricCard
          label="Students Below Threshold"
          value={String(store.students.filter(s => s.attendancePercent < threshold).length)}
          detail={`Below ${threshold}% CHARUSAT minimum`}
          icon={<AlertTriangle size={18} />}
          mark="05"
          warn
        />
        <MetricCard
          label="Security Events"
          value={String(store.securityEvents.length)}
          detail={`${store.securityEvents.filter(e => e.status === 'Needs review').length} require faculty review`}
          icon={<ShieldAlert size={18} />}
          mark="06"
        />
      </section>

      {/* Charts Section */}
      <div className="dashboard-grid">
        {/* Attendance Trend Chart */}
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">CAMPUS-WIDE WEEK AT A GLANCE</span>
              <h2>Verified Attendance Trend</h2>
            </div>
            <Badge tone="green">+3.8% vs last week</Badge>
          </div>
          <div className="chart-summary">
            <strong>{rate}%</strong>
            <span>average verified presence across departments</span>
            <span className="trend-positive"><ArrowUpRight size={14} /> Healthy</span>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminTrendGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00d2ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.5)' }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255, 255, 255, 0.5)' }} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(0, 210, 255, 0.25)',
                    backgroundColor: 'rgba(14, 18, 25, 0.95)',
                    color: '#ffffff',
                    fontSize: 12,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Present Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00d2ff"
                  strokeWidth={2.5}
                  fill="url(#adminTrendGlow)"
                  activeDot={{ r: 6, fill: '#00d2ff', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-foot">
            <span><i className="legend-dot teal" />Daily Verified In-Class Presence</span>
            <span>CHARUSAT Minimum Regulation: {threshold}%</span>
          </div>
        </Card>

        {/* Attendance Mix Donut Chart */}
        <Card className="distribution-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">TODAY · ALL LECTURES & LABS</span>
              <h2>Presence Distribution</h2>
            </div>
            <Link href="/analytics" className="text-link">Full Analytics <ArrowRight size={13} /></Link>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="value" innerRadius={64} outerRadius={82} startAngle={90} endAngle={-270} paddingAngle={4} stroke="none">
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    fontSize: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(14, 18, 25, 0.95)',
                    color: '#ffffff',
                  }}
                  formatter={(value: number, name: string) => [`${value} students`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{rate}%</strong>
              <span>Verified</span>
            </div>
          </div>
          <div className="mix-legend">
            {distribution.map(x => (
              <div key={x.name}>
                <span className="legend-dot" style={{ background: x.color }} />
                <span>{x.name}</span>
                <b>{x.value}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Lower Dashboard Section */}
      <div className="dashboard-grid dashboard-lower">
        {/* Live Sessions Roster */}
        <Card className="sessions-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">CLASSROOM ROSTER</span>
              <h2>Active Lecture Sessions</h2>
            </div>
            <Link href="/sessions" className="text-link">All Sessions <ArrowRight size={13} /></Link>
          </div>

          {store.sessions.filter(s => s.status === 'Live').length === 0 ? (
            <EmptyState
              title="No active sessions right now"
              body="Faculty can initiate sessions to project the rotating 15s dynamic QR code and FIDO2 passkey verification."
              action={
                <Link href="/sessions" className="button button-primary">
                  <Plus size={15} /> Launch Lecture Session
                </Link>
              }
            />
          ) : (
            store.sessions.filter(s => s.status === 'Live').map(session => (
              <div className="live-session-row" key={session.id}>
                <span className="session-live-indicator"><i /></span>
                <div className="live-session-name">
                  <b>{classLabel(store, session.classId)}</b>
                  <small>{getTeacher(store, session.teacherId)?.name} · Started {fmtTime(session.start)}</small>
                </div>
                <div className="live-session-count">
                  <b>{presentCount(session)}</b>
                  <small>confirmed</small>
                </div>
                <Link href="/session/live" className="icon-button compact-arrow" aria-label="Open live session">
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))
          )}
        </Card>

        {/* Low-Attendance Radar */}
        <Card className="risk-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">EARLY SUPPORT RADAR</span>
              <h2>Students Below Threshold</h2>
            </div>
            <Badge tone="amber">
              {store.students.filter(s => s.attendancePercent < threshold).length} students
            </Badge>
          </div>
          <p className="card-intro">These students are below the {threshold}% CHARUSAT minimum threshold.</p>

          {atRisk.length ? (
            atRisk.map(s => (
              <Link href={`/students/${s.id}`} key={s.id} className="risk-student-row">
                <span className="avatar avatar-small">{initials(s.name)}</span>
                <div className="risk-student-copy">
                  <b>{s.name}</b>
                  <small>{classLabel(store, s.classId)} · {s.studentId}</small>
                </div>
                <div className="risk-meter">
                  <div style={{ width: `${s.attendancePercent}%`, background: '#ffaa00' }} />
                </div>
                <strong style={{ color: '#ffaa00' }}>{s.attendancePercent}%</strong>
                <ArrowRight size={13} />
              </Link>
            ))
          ) : (
            <EmptyState title="No students flagged" body="All enrolled students are meeting or exceeding the 75% requirement." />
          )}

          <Link href="/students" className="text-link risk-link">View complete roster <ArrowRight size={13} /></Link>
        </Card>
      </div>

      {/* Multi-Layer Security Architecture Visualization */}
      <SecurityPipeline />
    </div>
  );
}

/* ==========================================================================
   TEACHER DASHBOARD (WORKSPACE & CENTRAL DYNAMIC QR)
   ========================================================================== */
function TeacherDashboard({ store, onToast }: { store: Store; onToast: (msg: string) => void }) {
  const currentTeacher = store.teachers.find(t => t.email === store.currentUser.email) || store.teachers[1]; // Prof. Trushit Upadhyaya
  const activeSession = store.sessions.find(s => (s.status === 'Live' || s.status === 'Paused') && s.teacherId === currentTeacher.id) || store.sessions.find(s => s.status === 'Live');
  
  const [startModal, setStartModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(store.classes[0]?.id || 'c1');

  const handleStartAttendance = () => {
    dataService.addSession(selectedClass, currentTeacher.id);
    setStartModal(false);
    onToast(`New attendance session launched for ${classLabel(store, selectedClass)}!`);
  };

  const handleEndAttendance = () => {
    if (activeSession) {
      dataService.endSession(activeSession.id);
      onToast('Attendance session successfully concluded & records committed.');
    }
  };

  const teacherClasses = store.classes.filter(c => currentTeacher.classes.includes(c.id));
  const teacherSubjects = store.subjects.filter(s => s.teacherId === currentTeacher.id || s.classIds.some(cid => currentTeacher.classes.includes(cid)));
  const securityEvents = store.securityEvents.slice(0, 3);

  return (
    <div className="page-stack page-enter">
      {/* Teacher Workspace Header */}
      <PageHeader
        eyebrow="FACULTY WORKSPACE & OPERATIONS"
        title={`Welcome, ${currentTeacher.name}.`}
        description={`${currentTeacher.department} · ${currentTeacher.institute} · Real-time attendance orchestration & live anti-proxy verification.`}
        actions={
          activeSession ? (
            <div className="active-session-pill">
              <span className="pulsing-live-orb" />
              <span>ACTIVE SESSION IN PROGRESS</span>
            </div>
          ) : (
            <button
              onClick={() => setStartModal(true)}
              className="button button-primary"
              data-testid="btn-start-attendance"
            >
              <Play size={16} /> START ATTENDANCE
            </button>
          )
        }
      />

      {/* CENTRAL 3D QR PRESENTATION AREA WHEN SESSION IS ACTIVE */}
      {activeSession ? (
        <TeacherSessionQR
          session={activeSession}
          store={store}
          onEndSession={handleEndAttendance}
        />
      ) : (
        <Card className="teacher-start-cta-card" style={{ padding: '36px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(14, 22, 34, 0.8) 0%, rgba(11, 37, 81, 0.35) 100%)', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(0, 210, 255, 0.15)', border: '1px solid rgba(0, 210, 255, 0.3)', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: '#00d2ff' }}>
            <Radio size={28} />
          </div>
          <h2 style={{ font: '800 24px var(--app-font-display)', color: '#ffffff', margin: '0 0 8px' }}>
            Ready to Begin Today's Lecture?
          </h2>
          <p style={{ maxWidth: '520px', margin: '0 auto 24px', color: 'rgba(255, 255, 255, 0.65)', fontSize: '13px' }}>
            Click below to initiate a synchronized attendance epoch. This will project the 15-second rotating dynamic QR code and FIDO2 passkey challenge.
          </p>
          <button
            onClick={() => setStartModal(true)}
            className="button button-primary"
            style={{ height: '48px', padding: '0 28px', fontSize: '14px', borderRadius: '12px' }}
          >
            <Play size={16} /> START ATTENDANCE NOW
          </button>
        </Card>
      )}

      {/* Today's Classes & Subject Analytics Grid */}
      <div className="dashboard-grid">
        {/* Today's Classes Card */}
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">COURSE TIMETABLE</span>
              <h2>Today's Scheduled Classes</h2>
            </div>
            <Badge tone="blue">{teacherClasses.length} Cohorts</Badge>
          </div>

          <div style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
            {teacherClasses.map(cls => (
              <div
                key={cls.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <b style={{ color: '#ffffff', fontSize: '13px', display: 'block' }}>{cls.name}</b>
                  <small style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                    Section {cls.section} · Room {cls.room} · Semester {cls.semester}
                  </small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge badge-green">Scheduled</span>
                  <button
                    onClick={() => {
                      setSelectedClass(cls.id);
                      handleStartAttendance();
                    }}
                    className="button button-secondary"
                    style={{ height: '32px', fontSize: '11px', padding: '0 12px' }}
                  >
                    Launch <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Analytics Card */}
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">SUBJECT COMPLIANCE</span>
              <h2>Subject Analytics</h2>
            </div>
            <Link href="/analytics" className="text-link">Full View <ArrowRight size={13} /></Link>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {teacherSubjects.slice(0, 4).map(sub => (
              <div key={sub.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>{sub.name} ({sub.code})</span>
                  <span style={{ color: '#00d2ff', fontWeight: 700 }}>86% avg</span>
                </div>
                <div style={{ height: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '86%', background: 'linear-gradient(90deg, #00d2ff, #3D81E3)', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Regulation Threshold: 75%</span>
            <span style={{ color: '#00e699' }}>✓ All Subjects Compliant</span>
          </div>
        </Card>
      </div>

      {/* Security Events Overview */}
      <Card style={{ padding: '20px 24px' }}>
        <div className="card-head" style={{ marginBottom: '14px' }}>
          <div>
            <span className="eyebrow">SECURITY REPUTATION RADAR</span>
            <h2>Recent Anti-Proxy Alerts</h2>
          </div>
          <Link href="/security" className="text-link">View Security Console <ArrowRight size={13} /></Link>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {securityEvents.map(evt => (
            <div
              key={evt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={16} style={{ color: evt.severity === 'High' ? '#ff4d4d' : '#ffaa00' }} />
                <div>
                  <b style={{ color: '#ffffff', fontSize: '12px', display: 'block' }}>{evt.event}</b>
                  <small style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{evt.reason} · {fmtDate(evt.time)}</small>
                </div>
              </div>
              <Badge tone={evt.severity === 'High' ? 'red' : 'amber'}>{evt.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Start Session Modal */}
      <Modal
        open={startModal}
        onClose={() => setStartModal(false)}
        title="Launch Attendance Session"
        description="Select the classroom cohort to display the synchronized 15-second dynamic QR code."
        footer={
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <Button variant="secondary" onClick={() => setStartModal(false)}>Cancel</Button>
            <Button onClick={handleStartAttendance} style={{ flex: 1 }}>Start Session Now</Button>
          </div>
        }
      >
        <div style={{ display: 'grid', gap: '14px', padding: '12px 0' }}>
          <label className="glass-form-label">
            <span>Classroom Cohort</span>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="glass-input"
            >
              {store.classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} - Sec {c.section} (Room {c.room})</option>
              ))}
            </select>
          </label>
        </div>
      </Modal>
    </div>
  );
}

/* ==========================================================================
   STUDENT DASHBOARD (HIGH-PRIORITY STUDENT ONLY EXPERIENCE)
   ========================================================================== */
function StudentDashboard({ store, onToast }: { store: Store; onToast: (msg: string) => void }) {
  // Student MUST only see their own information!
  const currentStudent: Student = store.students.find(s => s.email === store.currentUser.email) || store.students[0];
  const activeSession = store.sessions.find(s => s.status === 'Live' || s.status === 'Paused');
  const threshold = store.settings.attendanceThreshold || 75;

  const currentPct = currentStudent.attendancePercent;
  const isBelow = currentPct < threshold;

  // Student's own personal attendance records
  const myRecentSessions = store.sessions.filter(session =>
    session.attendanceRecords.some(record => record.studentId === currentStudent.id)
  );

  // Student's subjects
  const studentClass = getClass(store, currentStudent.classId);
  const mySubjects = store.subjects.filter(s => s.classIds.includes(currentStudent.classId));

  // State for opening 3D QR Scanner Modal
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="page-stack page-enter">
      {/* Welcome Banner with Overall Attendance & Prominent SCAN QR CTA */}
      <div className="student-hero-banner card">
        <div className="student-hero-content">
          <span className="eyebrow">CHARUSAT STUDENT IDENTITY · {currentStudent.studentId}</span>
          <h1>Welcome, {currentStudent.name}</h1>
          <p>
            {studentClass ? `${studentClass.name} (Sec ${studentClass.section}) · Room ${studentClass.room}` : 'CSPIT Computer Engineering'}
          </p>
        </div>

        <div className="student-kpi-stack">
          {/* Big Attendance Metric */}
          <div className="student-attendance-stat-box">
            <span className="stat-big-pct">{currentPct}%</span>
            <span className="stat-subtitle">Overall Attendance</span>
            <span className="stat-classes-attended">41 / 50 Classes Attended</span>
          </div>

          {/* LARGE PRIMARY ACTION: [ SCAN QR ] */}
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="button button-primary scan-qr-hero-btn"
            data-testid="btn-scan-qr-hero"
          >
            <Camera size={20} />
            <span>SCAN QR</span>
          </button>
        </div>
      </div>

      {/* Active Session Notification Card if lecture is currently Live */}
      {activeSession && (
        <Card style={{ padding: '16px 20px', background: 'rgba(0, 210, 255, 0.08)', border: '1px solid rgba(0, 210, 255, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="cyan-dot-pulse" />
            <div>
              <strong style={{ color: '#ffffff', fontSize: '14px', display: 'block' }}>
                Lecture in Progress: {classLabel(store, activeSession.classId)}
              </strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                Instructor is broadcasting rotating 15s challenge. Tap to verify attendance now.
              </span>
            </div>
          </div>
          <button
            onClick={() => setScannerOpen(true)}
            className="button button-primary"
            style={{ height: '36px', padding: '0 16px', fontSize: '12px' }}
          >
            <Camera size={15} /> Verify Presence Now
          </button>
        </Card>
      )}

      {/* Dynamic Recovery Calculator & Warning System (Only for this student!) */}
      <RecoveryCalculator student={currentStudent} store={store} />

      {/* My Subjects Grid & Attendance History */}
      <div className="dashboard-grid">
        {/* My Subjects Breakdown */}
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">COHORT CURRICULUM</span>
              <h2>My Subjects</h2>
            </div>
            <Badge tone="blue">{mySubjects.length} Courses</Badge>
          </div>

          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {mySubjects.map((sub, idx) => {
              // Deterministic subject percentages for realistic student analytics
              const subjectPcts = [82, 71, 88, 86, 92];
              const pct = subjectPcts[idx % subjectPcts.length];
              const isSubBelow = pct < threshold;

              return (
                <div
                  key={sub.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: isSubBelow ? '1px solid rgba(255, 170, 0, 0.3)' : '1px solid var(--glass-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <b style={{ color: '#ffffff', fontSize: '12.5px' }}>{sub.name}</b>
                      <small style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'block' }}>{sub.code} · {sub.credits} Credits</small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ font: '700 14px var(--app-font-mono)', color: isSubBelow ? '#ffaa00' : '#00d2ff' }}>
                        {pct}%
                      </span>
                      {isSubBelow && (
                        <span className="badge badge-amber" title="Attendance below 75% required threshold">
                          ⚠ Low
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: isSubBelow ? '#ffaa00' : 'linear-gradient(90deg, #00d2ff, #3D81E3)', borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Student's Own Verified Attendance History */}
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">IMMUTABLE ATTESTATION LEDGER</span>
              <h2>My Attendance History</h2>
            </div>
            <Link href="/attendance" className="text-link">Full History <ArrowRight size={13} /></Link>
          </div>

          <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
            {myRecentSessions.length ? (
              myRecentSessions.slice(0, 5).map(session => {
                const record = session.attendanceRecords.find(r => r.studentId === currentStudent.id);
                return (
                  <div
                    key={session.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', display: 'grid', placeItems: 'center', color: '#00d2ff' }}>
                        <Fingerprint size={16} />
                      </div>
                      <div>
                        <b style={{ color: '#ffffff', fontSize: '12px', display: 'block' }}>{classLabel(store, session.classId)}</b>
                        <small style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                          {fmtDate(session.start)} · {fmtTime(session.start)} · {record?.verificationMethod || 'Passkey'}
                        </small>
                      </div>
                    </div>
                    <Badge tone={record?.status ? toneForStatus(record.status) : 'green'}>
                      {record?.status || 'Present'}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <EmptyState title="No recorded sessions yet" body="Your attendance will populate here after your first in-class check-in." />
            )}
          </div>
        </Card>
      </div>

      {/* Multi-Layer Trust Pipeline Visualization */}
      <SecurityPipeline />

      {/* 3D QR Scanner Modal Experience */}
      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        store={store}
        onSuccess={(msg) => onToast(msg)}
      />
    </div>
  );
}
