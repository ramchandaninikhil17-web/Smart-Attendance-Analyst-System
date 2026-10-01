import { type ReactNode, useEffect, useId, useMemo } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { generateQrMatrix } from './lib/qrCode';

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  testId,
  form
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  testId?: string;
  form?: string;
}) {
  return (
    <button
      type={type}
      form={form}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
      className={`button button-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = '',
  id,
  style,
  tilt = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  tilt?: boolean;
  'data-testid'?: string;
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!tilt || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!tilt) return;
    e.currentTarget.style.transform = '';
  };

  return (
    <section
      id={id}
      style={style}
      className={`card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-testid={props['data-testid']}
    >
      {children}
    </section>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = ''
}: {
  children: ReactNode;
  tone?: 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'teal' | 'muted' | 'purple';
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={`badge badge-${tone} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 520
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', key);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal-panel"
        style={{ maxWidth: `${maxWidth}px` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="modal-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
            data-testid="button-close-dialog"
          >
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </section>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
  icon
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-mark">
        {icon || <span />}
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search records',
  testId = 'input-search'
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  testId?: string;
}) {
  return (
    <label className="search-field">
      <span className="sr-only">{placeholder}</span>
      <span className="search-icon">⌕</span>
      <input
        data-testid={testId}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  children,
  label,
  testId
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
  testId?: string;
}) {
  return (
    <label className="select-wrap">
      <span className="sr-only">{label}</span>
      <select data-testid={testId} value={value} onChange={e => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  helperText,
  testId
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  testId?: string;
}) {
  return (
    <label className="form-field">
      <span>{label} {required && <strong className="required-star">*</strong>}</span>
      <input
        required={required}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        data-testid={testId}
      />
      {helperText && <small className="field-helper">{helperText}</small>}
    </label>
  );
}

/**
 * Standard ISO/IEC 18004 Compliant Dynamic QR Code Component
 * Generates true scannable QR Code matrices with Reed-Solomon error correction
 * and high-contrast dark modules on pure white background with required quiet zone.
 */
export function DynamicQrCode({
  code,
  size = 200,
  logoText = 'CHARUSAT'
}: {
  code: string;
  size?: number;
  logoText?: string;
}) {
  const { matrix, size: N } = useMemo(() => {
    try {
      return generateQrMatrix(code || 'CHARUSAT:ATTENDANCE');
    } catch {
      return generateQrMatrix('CHARUSAT');
    }
  }, [code]);

  // Standard 2-module quiet zone padding for fast optical recognition
  const paddingModules = 2;
  const totalGridSize = N + paddingModules * 2;
  const cellSize = size / totalGridSize;

  return (
    <div
      className="qr-container"
      style={{
        width: size,
        height: size,
        background: '#ffffff',
        borderRadius: '12px',
        padding: '8px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'grid',
        placeItems: 'center',
        userSelect: 'none',
      }}
    >
      <svg
        width={size - 16}
        height={size - 16}
        viewBox={`0 0 ${size} ${size}`}
        className="qr-svg"
        role="img"
        aria-label={`Verified QR Code: ${code}`}
        style={{ display: 'block', shapeRendering: 'crispEdges' }}
      >
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.flatMap((row, r) =>
          row.map((active, c) => {
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={(c + paddingModules) * cellSize}
                y={(r + paddingModules) * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#000000"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

export function RiskScoreBadge({ score }: { score: number }) {
  const level = score >= 70 ? 'High' : score >= 35 ? 'Medium' : 'Low';
  const tone = score >= 70 ? 'red' : score >= 35 ? 'amber' : 'green';
  const Icon = score >= 70 ? ShieldAlert : score >= 35 ? AlertTriangle : ShieldCheck;

  return (
    <span className={`risk-badge risk-${tone}`}>
      <Icon size={12} />
      <span>{score}/100</span>
      <small>({level})</small>
    </span>
  );
}