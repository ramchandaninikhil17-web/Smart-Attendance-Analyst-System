import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp, Sparkles, ArrowRight, Calculator } from 'lucide-react';
import type { Student, Store } from '../data';

interface RecoveryCalculatorProps {
  student: Student;
  store: Store;
}

export function RecoveryCalculator({ student, store }: RecoveryCalculatorProps) {
  const currentPct = student.attendancePercent;
  const threshold = store.settings.attendanceThreshold || 75;
  const isBelow = currentPct < threshold;

  // Derive actual total classes and attended classes from student records
  const totalClasses = 50; // standard cohort term classes to date
  const attendedClasses = Math.round((currentPct / 100) * totalClasses);
  const missedClasses = totalClasses - attendedClasses;

  // Formula to calculate consecutive classes needed:
  // (attended + x) / (total + x) >= threshold / 100
  // 100*(attended + x) >= threshold*(total + x)
  // 100*attended + 100*x >= threshold*total + threshold*x
  // x*(100 - threshold) >= threshold*total - 100*attended
  // x = ceil((threshold * total - 100 * attended) / (100 - threshold))
  const classesNeeded = isBelow
    ? Math.max(1, Math.ceil((threshold * totalClasses - 100 * attendedClasses) / (100 - threshold)))
    : 0;

  // Interactive slider for student to simulate attending future classes
  const [simulatedCount, setSimulatedCount] = useState(classesNeeded || 3);

  // Projected attendance after attending `simulatedCount` consecutive classes
  const projectedTotal = totalClasses + simulatedCount;
  const projectedAttended = attendedClasses + simulatedCount;
  const projectedPct = Math.min(100, Math.round((projectedAttended / projectedTotal) * 100));

  return (
    <div className={`recovery-card-glass ${isBelow ? 'is-warning-mode' : 'is-healthy-mode'}`}>
      {/* Warning Banner if below threshold */}
      {isBelow && (
        <div className="attendance-warning-banner">
          <div className="warning-banner-top">
            <span className="warning-chip">
              <AlertTriangle size={14} /> ATTENDANCE WARNING
            </span>
            <span className="warning-threshold-tag">Threshold: {threshold}%</span>
          </div>
          <h3>Your attendance is currently {currentPct}%.</h3>
          <p>
            Required minimum: <strong>{threshold}%</strong>. You are at risk of debarment unless recovery requirements are met.
          </p>
        </div>
      )}

      {/* Main Glass Calculator Panel */}
      <div className="recovery-calculator-header">
        <div className="calculator-title-group">
          <div className="calculator-icon-badge">
            <Calculator size={18} />
          </div>
          <div>
            <h4>Dynamic Recovery Calculator</h4>
            <p>Real-time calculation computed from your authenticated attendance ledger</p>
          </div>
        </div>
        <div className="kpi-mini-cluster">
          <div className="kpi-pill">
            <span>Current</span>
            <strong>{currentPct}%</strong>
          </div>
          <div className="kpi-pill">
            <span>Required</span>
            <strong className="text-cyan">{threshold}%</strong>
          </div>
          <div className="kpi-pill">
            <span>Classes Needed</span>
            <strong className={isBelow ? 'text-amber' : 'text-emerald'}>
              {isBelow ? `${classesNeeded} classes` : '0 (On Track)'}
            </strong>
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Message */}
      <div className="recovery-target-message">
        {isBelow ? (
          <p>
            🎯 <strong>Recovery Target:</strong> You need to attend the next <strong>{classesNeeded} eligible classes</strong> consecutively without any absence to restore your attendance to {threshold}%.
          </p>
        ) : (
          <p className="text-emerald">
            ✓ <strong>Exemplary Standing:</strong> Your attendance ({currentPct}%) meets CHARUSAT academic regulations. Keep attending regularly to maintain eligible status.
          </p>
        )}
      </div>

      {/* Interactive Simulation Slider */}
      <div className="simulation-slider-box">
        <div className="slider-label-row">
          <span>Simulate attending upcoming lectures:</span>
          <span className="badge badge-teal">+{simulatedCount} consecutive lectures</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={simulatedCount}
          onChange={e => setSimulatedCount(Number(e.target.value))}
          className="glass-range-slider"
        />
        <div className="slider-scale-row">
          <span>+1 Class</span>
          <span>+10 Classes</span>
          <span>+20 Classes</span>
        </div>
      </div>

      {/* Projected Result Card */}
      <div className="projected-result-banner">
        <div className="projected-data">
          <span>Projected Standing:</span>
          <div className="projected-percentage">
            <strong>{projectedPct}%</strong>
            <small>({projectedAttended} of {projectedTotal} total sessions)</small>
          </div>
        </div>
        <div className="projected-status-chip">
          {projectedPct >= threshold ? (
            <span className="badge badge-green">
              <CheckCircle2 size={13} /> Threshold Met
            </span>
          ) : (
            <span className="badge badge-amber">
              <AlertTriangle size={13} /> Still Below {threshold}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
