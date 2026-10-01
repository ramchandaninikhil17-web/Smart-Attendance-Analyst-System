import React, { useState } from 'react';
import {
  LogIn, UserCheck, QrCode, KeyRound, Fingerprint, Server,
  CheckCircle2, Shield, ChevronRight, Lock
} from 'lucide-react';

const pipelineSteps = [
  {
    id: 'login',
    title: 'Login',
    subtitle: 'Institutional SSO',
    icon: LogIn,
    desc: 'OAuth 2.0 / SAML authentication linked to CHARUSAT student database.',
    status: 'Verified',
  },
  {
    id: 'enrollment',
    title: 'Enrollment',
    subtitle: 'Cohort Roster Binding',
    icon: UserCheck,
    desc: 'Cryptographic binding to enrolled subject and active classroom timetable.',
    status: 'Verified',
  },
  {
    id: 'qr',
    title: 'Rotating QR',
    subtitle: '15-Second Ephemeral Token',
    icon: QrCode,
    desc: 'Projected in classroom; rotates every 15s with HMAC nonce to block screenshots.',
    status: 'Active',
  },
  {
    id: 'code',
    title: 'Live Code',
    subtitle: '6-Digit Synchronization',
    icon: KeyRound,
    desc: 'Synchronized one-time challenge code visible exclusively to present students.',
    status: 'Active',
  },
  {
    id: 'passkey',
    title: 'Passkey',
    subtitle: 'FIDO2 Hardware WebAuthn',
    icon: Fingerprint,
    desc: 'Biometric Touch ID / Face ID attestation signed inside device Secure Enclave.',
    status: 'Armed',
  },
  {
    id: 'server',
    title: 'Server Verification',
    subtitle: 'Anti-Proxy Engine',
    icon: Server,
    desc: 'Multi-point verification of Wi-Fi BSSID, geofence, and epoch timestamp.',
    status: 'Protected',
  },
  {
    id: 'attendance',
    title: 'Attendance',
    subtitle: 'Immutable Ledger Commit',
    icon: CheckCircle2,
    desc: 'Cryptographic timestamp signed and recorded in institutional database.',
    status: 'Secured',
  },
];

export function SecurityPipeline() {
  const [activeStep, setActiveStep] = useState(2); // default highlighted step (Rotating QR)

  return (
    <div className="security-pipeline-card">
      <div className="pipeline-header">
        <div className="pipeline-title-box">
          <div className="pipeline-shield-icon">
            <Shield size={20} />
          </div>
          <div>
            <h3>Multi-Layer Anti-Proxy Architecture</h3>
            <p>End-to-end zero-trust verification pipeline ensuring 100% presence fidelity</p>
          </div>
        </div>
        <div className="security-verified-tag">
          <span className="cyan-pulse-indicator" />
          <span>7/7 SECURITY LAYERS ENGAGED</span>
        </div>
      </div>

      {/* Interactive Glowing Node Diagram */}
      <div className="pipeline-track-wrapper">
        <div className="pipeline-track">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = idx === activeStep;
            const isCompleted = idx < activeStep;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`pipeline-node ${isCurrent ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="node-icon-circle">
                    <Icon size={18} />
                    {isCurrent && <span className="node-glow-ring" />}
                  </div>
                  <div className="node-text">
                    <span className="node-title">{step.title}</span>
                    <span className="node-subtitle">{step.subtitle}</span>
                  </div>
                  <span className="node-status-badge">{step.status}</span>
                </div>

                {idx < pipelineSteps.length - 1 && (
                  <div className="pipeline-connector">
                    <div className="connector-line">
                      <div className="connector-pulse" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Layer Detailed Explainer */}
      <div className="active-layer-detail-box">
        <div className="detail-badge-row">
          <span className="layer-number">LAYER 0{activeStep + 1} OF 07</span>
          <span className="layer-name">{pipelineSteps[activeStep].title} — {pipelineSteps[activeStep].subtitle}</span>
        </div>
        <p className="layer-desc">{pipelineSteps[activeStep].desc}</p>
      </div>
    </div>
  );
}
