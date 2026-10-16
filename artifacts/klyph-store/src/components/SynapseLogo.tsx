import type { SVGProps } from 'react';

interface SynapseLogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
  showWordmark?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export default function SynapseLogo({
  size = 32,
  showWordmark = false,
  theme = 'auto',
  className = '',
  ...props
}: SynapseLogoProps) {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#FFFFFF' : '#0F172A';
  const cobaltColor = '#2563EB';

  return (
    <div
      className={`synapse-logo-lockup ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="synapse-logo-title"
        className="synapse-logo-mark"
        {...props}
      >
        <title id="synapse-logo-title">SYNAPSE LABS Logo</title>

        {/* Outer Concentric Precision Chamfer Ring */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeOpacity={isDark ? '0.9' : '0.85'}
        />

        {/* 45-Degree Telemetry Slit Masking Arc */}
        <path
          d="M 38.14 9.86 A 20 20 0 0 1 44 24"
          stroke={cobaltColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Inner Synaptic Sensor Core */}
        <circle
          cx="24"
          cy="24"
          r="9.5"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeDasharray="4 2.5"
          strokeOpacity={isDark ? '0.6' : '0.4'}
        />

        {/* Central Optical Telemetry Node */}
        <circle cx="24" cy="24" r="4" fill={cobaltColor} />
        <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />

        {/* Telemetry Coordinate Tick Marks */}
        <line x1="24" y1="4" x2="24" y2="7.5" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="24" y1="40.5" x2="24" y2="44" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="4" y1="24" x2="7.5" y2="24" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.5" />
      </svg>

      {showWordmark && (
        <span
          className="synapse-logo-wordmark"
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}
        >
          <strong
            style={{
              fontSize: '15px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: isDark ? '#FFFFFF' : '#0F172A',
            }}
          >
            SYNAPSE
          </strong>
          <small
            style={{
              fontSize: '9.5px',
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: cobaltColor,
              marginTop: '2px',
            }}
          >
            LABS
          </small>
        </span>
      )}
    </div>
  );
}
