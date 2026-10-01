import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  Activity, AlertTriangle, CalendarDays, ArrowUpRight, Send,
  TrendingUp, BookOpen, Clock, ShieldCheck, CheckCircle2, ArrowRight
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell
} from 'recharts';
import type { Store, Student } from '../data';
import { Badge, Button, Card, PageHeader, SelectField } from '../components';
import { RecoveryCalculator } from '../components/RecoveryCalculator';
import { classLabel, initials, fmtDate, fmtTime, toneForStatus } from '../utils';
import { MetricCard } from './OverviewPage';

interface AnalyticsPageProps {
  store: Store;
  toast: (message: string) => void;
}

export function AnalyticsPage({ store, toast }: AnalyticsPageProps) {
  if (store.currentUser.role === 'Student') {
    return <StudentAnalyticsView store={store} toast={toast} />;
  }

  return <InstitutionalAnalyticsView store={store} toast={toast} />;
}

/* ==========================================================================
   STUDENT ATTENDANCE ANALYTICS (EXPLICIT USER SPECIFICATION)
   ========================================================================== */
function StudentAnalyticsView({ store, toast }: AnalyticsPageProps) {
  const currentStudent: Student = store.students.find(s => s.email === store.currentUser.email) || store.students[0];
  const threshold = store.settings.attendanceThreshold || 75;
  const currentPct = currentStudent.attendancePercent;
  const isOverallBelow = currentPct < threshold;

  const [activeTab, setActiveTab] = useState<'analytics' | 'recovery'>('analytics');

  // Total class statistics
  const totalClasses = 50;
  const classesAttended = Math.round((currentPct / 100) * totalClasses);
  const classesMissed = totalClasses - classesAttended;
  const lateRecords = 3;

  // Real student subjects
  const studentSubjects = [
    { name: 'Database Management Systems', code: 'DBMS', pct: 82, attended: 21, total: 26 },
    { name: 'Computer Networks & Security', code: 'Computer Nets', pct: 71, attended: 17, total: 24, warn: true },
    { name: 'Java Enterprise Architecture', code: 'Java', pct: 88, attended: 22, total: 25 },
    { name: 'Software Engineering Principles', code: 'Software Eng', pct: 85, attended: 22, total: 26 },
  ];

  const studentTrend = [
    { week: 'Wk 1', pct: 85 },
    { week: 'Wk 2', pct: 88 },
    { week: 'Wk 3', pct: 80 },
    { week: 'Wk 4', pct: 84 },
    { week: 'Wk 5', pct: 79 },
    { week: 'Wk 6', pct: currentPct },
  ];

  const myHistory = store.sessions
    .filter(s => s.attendanceRecords.some(r => r.studentId === currentStudent.id))
    .slice(0, 6);

  return (
    <div className="page-stack page-enter">
      <PageHeader
        eyebrow="STUDENT ATTENDANCE & ACADEMIC AUDIT"
        title="Personal Attendance Analytics"
        description={`Comprehensive presence metrics, course-wise threshold compliance, and dynamic recovery modeling for ${currentStudent.name} (${currentStudent.studentId}).`}
      />

      {/* Warning Card if Overall or Any Subject is Below 75% */}
      {studentSubjects.some(s => s.pct < threshold) && (
        <Card style={{ padding: '20px 24px', background: 'rgba(255, 170, 0, 0.08)', border: '1px solid rgba(255, 170, 0, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 170, 0, 0.15)', display: 'grid', placeItems: 'center', color: '#ffaa00' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <strong style={{ color: '#ffffff', fontSize: '15px', display: 'block' }}>
                ⚠ Attendance below required threshold (75%)
              </strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Computer Networks (71%) is currently below CHARUSAT academic eligibility requirement.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recovery')}
            className="button button-primary"
            style={{ height: '38px', background: 'linear-gradient(135deg, #ffaa00, #ff8800)', color: '#000000', fontWeight: 700 }}
          >
            VIEW RECOVERY PLAN <ArrowRight size={15} />
          </button>
        </Card>
      )}

      {/* 4 Core Summary KPI Cards */}
      <section className="metric-grid">
        <MetricCard
          label="Overall Verified Percentage"
          value={`${currentPct}%`}
          detail={isOverallBelow ? `Below ${threshold}% required minimum` : 'Meets CHARUSAT standard'}
          detailTone={isOverallBelow ? 'neutral' : 'good'}
          icon={<Activity size={18} />}
          mark="01"
          warn={isOverallBelow}
        />
        <MetricCard
          label="Classes Attended"
          value={`${classesAttended} / ${totalClasses}`}
          detail="Confirmed classroom presence"
          icon={<CheckCircle2 size={18} />}
          mark="02"
        />
        <MetricCard
          label="Classes Missed"
          value={String(classesMissed)}
          detail="Total unexcused absences"
          icon={<Clock size={18} />}
          mark="03"
        />
        <MetricCard
          label="Late / Partial Records"
          value={String(lateRecords)}
          detail="Grace period arrivals"
          icon={<AlertTriangle size={18} />}
          mark="04"
        />
      </section>

      {/* Switch between Analytics View & Recovery Calculator View */}
      {activeTab === 'recovery' ? (
        <div className="page-enter">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="eyebrow">RECOVERY SIMULATION ACTIVE</span>
            <button onClick={() => setActiveTab('analytics')} className="button button-secondary">
              ← Return to Subject Breakdown
            </button>
          </div>
          <RecoveryCalculator student={currentStudent} store={store} />
        </div>
      ) : (
        <>
          {/* Subject-Wise Attendance Breakdown Table/Cards */}
          <div className="dashboard-grid">
            {/* Subject-wise Cards as specified */}
            <Card className="chart-card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">COURSE PERFORMANCE</span>
                  <h2>Subject-Wise Attendance</h2>
                </div>
                <Badge tone="blue">4 Subjects</Badge>
              </div>

              <div style={{ display: 'grid', gap: '14px', marginTop: '18px' }}>
                {studentSubjects.map(sub => {
                  const isWarn = sub.pct < threshold;
                  return (
                    <div
                      key={sub.code}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: isWarn ? '1px solid rgba(255, 170, 0, 0.35)' : '1px solid var(--glass-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ color: '#ffffff', fontSize: '14px', display: 'block' }}>
                            {sub.name}
                          </strong>
                          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                            Code: {sub.code} · {sub.attended} of {sub.total} sessions attended
                          </small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ font: '800 20px var(--app-font-display)', color: isWarn ? '#ffaa00' : '#00d2ff' }}>
                            {sub.pct}%
                          </span>
                          {isWarn ? (
                            <span className="badge badge-amber" title="Below 75% required threshold">
                              ⚠ Low Threshold
                            </span>
                          ) : (
                            <span className="badge badge-green">Good</span>
                          )}
                        </div>
                      </div>

                      <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${sub.pct}%`,
                            background: isWarn ? '#ffaa00' : 'linear-gradient(90deg, #00d2ff, #3D81E3)',
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Attendance Trend Chart */}
            <Card className="chart-card">
              <div className="card-head">
                <div>
                  <span className="eyebrow">SEMESTER PROGRESSION</span>
                  <h2>Attendance Trend</h2>
                </div>
                <Badge tone="teal">Weekly Rolling</Badge>
              </div>

              <div className="chart-area" style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studentTrendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#00d2ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                    <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        backgroundColor: 'rgba(14, 18, 25, 0.95)',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        color: '#ffffff',
                        fontSize: 12,
                      }}
                      formatter={(val: number) => [`${val}%`, 'Attendance']}
                    />
                    <Area type="monotone" dataKey="pct" stroke="#00d2ff" strokeWidth={2.5} fill="url(#studentTrendFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Regulation Threshold: 75%</span>
                <button onClick={() => setActiveTab('recovery')} className="text-link">
                  Open Recovery Calculator <ArrowRight size={13} />
                </button>
              </div>
            </Card>
          </div>

          {/* Attendance History Ledger */}
          <Card className="table-card" style={{ padding: '24px' }}>
            <div className="card-head" style={{ marginBottom: '16px' }}>
              <div>
                <span className="eyebrow">VERIFIED SESSION RECORDS</span>
                <h2>Recent Attendance History</h2>
              </div>
              <span className="badge badge-teal">FIDO2 Hardware Attested</span>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Lecture Cohort</th>
                    <th>Verification Method</th>
                    <th>Cryptographic Nonce</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myHistory.map(session => {
                    const rec = session.attendanceRecords.find(r => r.studentId === currentStudent.id);
                    return (
                      <tr key={session.id}>
                        <td>
                          <b>{fmtDate(session.start)}</b>
                          <small style={{ display: 'block', color: 'var(--text-muted)' }}>{fmtTime(session.start)}</small>
                        </td>
                        <td>
                          <b>{classLabel(store, session.classId)}</b>
                        </td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00d2ff' }}>
                            <ShieldCheck size={14} /> {rec?.verificationMethod || 'Passkey (WebAuthn)'}
                          </span>
                        </td>
                        <td>
                          <code style={{ font: '10px var(--app-font-mono)', color: 'var(--text-muted)' }}>
                            0x{session.code.replace(/\s/g, '')}8f...2a
                          </code>
                        </td>
                        <td>
                          <Badge tone={rec?.status ? toneForStatus(rec.status) : 'green'}>
                            {rec?.status || 'Present'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ==========================================================================
   INSTITUTIONAL / ADMIN ANALYTICS VIEW
   ========================================================================== */
function InstitutionalAnalyticsView({ store }: AnalyticsPageProps) {
  const [period, setPeriod] = useState('Last 7 days');
  const [classId, setClassId] = useState('all');

  const scoped = store.students.filter(s => classId === 'all' || s.classId === classId);
  const averageRate = scoped.length ? Math.round(scoped.reduce((n, s) => n + s.attendancePercent, 0) / scoped.length) : 88;

  const classData = store.classes.map(c => {
    const students = store.students.filter(s => s.classId === c.id);
    return {
      name: c.name.split(' ').slice(0, 2).join(' '),
      average: students.length ? Math.round(students.reduce((n, s) => n + s.attendancePercent, 0) / students.length) : 0,
      threshold: store.settings.attendanceThreshold,
    };
  });

  const week = [
    { day: 'Mon', rate: 84 },
    { day: 'Tue', rate: 88 },
    { day: 'Wed', rate: 82 },
    { day: 'Thu', rate: 90 },
    { day: 'Fri', rate: 89 },
    { day: 'Sat', rate: 93 },
    { day: 'Today', rate: averageRate },
  ];

  return (
    <div className="page-stack page-enter">
      <PageHeader
        eyebrow="CHARUSAT ANALYTICS & COMPLIANCE"
        title="Institutional Attendance Intelligence"
        description="Comprehensive analytics on attendance trends, cohort comparisons, course benchmarks, and early warning radar across CSPIT, DEPSTAR, and CMPICA."
        actions={
          <div className="filter-bar">
            <SelectField value={period} onChange={setPeriod} label="Date range">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Current Semester</option>
            </SelectField>
            <SelectField value={classId} onChange={setClassId} label="Filter by class">
              <option value="all">All cohorts</option>
              {store.classes.map(c => <option key={c.id} value={c.id}>{c.name} · {c.section}</option>)}
            </SelectField>
          </div>
        }
      />

      <div className="analytics-kpis">
        <MetricCard
          label="Average Verified Presence"
          value={`${averageRate}%`}
          detail={<><ArrowUpRight size={14} /> +4.2% vs prior period</>}
          detailTone="good"
          icon={<Activity size={18} />}
          mark="01"
        />
        <MetricCard
          label="Students Below 75%"
          value={String(scoped.filter(s => s.attendancePercent < store.settings.attendanceThreshold).length)}
          detail="Flagged on recovery radar"
          icon={<AlertTriangle size={18} />}
          mark="02"
          warn
        />
        <MetricCard
          label="Cohort Consistency"
          value="94.2%"
          detail="Anti-proxy fidelity score"
          detailTone="good"
          icon={<CalendarDays size={18} />}
          mark="03"
        />
      </div>

      <div className="dashboard-grid">
        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">COHORT PROGRESSION</span>
              <h2>Campus Presence Trend</h2>
            </div>
            <Badge tone="green">Healthy</Badge>
          </div>
          <div className="chart-area" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={week} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="instArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#00d2ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    backgroundColor: 'rgba(14, 18, 25, 0.95)',
                    border: '1px solid rgba(0, 210, 255, 0.3)',
                    color: '#ffffff',
                  }}
                  formatter={(v: number) => [`${v}%`, 'Attendance']}
                />
                <Area type="monotone" dataKey="rate" stroke="#00d2ff" strokeWidth={2.5} fill="url(#instArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="chart-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">COHORT BENCHMARK</span>
              <h2>Class Comparison</h2>
            </div>
            <Badge tone="blue">Across Engineering</Badge>
          </div>
          <div className="chart-area" style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    backgroundColor: 'rgba(14, 18, 25, 0.95)',
                    border: '1px solid rgba(61, 129, 227, 0.3)',
                    color: '#ffffff',
                  }}
                  formatter={(v: number) => [`${v}%`, 'Class Average']}
                />
                <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.average >= 75 ? '#00d2ff' : '#ffaa00'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
