interface LogoProps {
  size?: number;
  /** Show the "Google Politik" sub-label next to the mark. */
  withTag?: boolean;
}

/**
 * GELITIK mark: a magnifier (search) holding a check (a "gelitik"/tick),
 * rendered in flat navy and blue. Deliberately distinct from any existing
 * search-engine branding.
 */
export function Logo({ size = 36, withTag = false }: LogoProps) {
  return (
    <span className="brand">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        role="img"
        aria-label="GELITIK"
        focusable="false"
      >
        <rect width="40" height="40" rx="10" fill="#0b2545" />
        <circle cx="18.5" cy="17.5" r="8.5" fill="none" stroke="#ffffff" strokeWidth="2.4" />
        <path
          d="M24.9 23.9 L30.5 29.5"
          stroke="#ffffff"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M14.4 17.6 L17.4 20.6 L22.7 14.6"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand__wordmark">GELITIK</span>
      {withTag && <span className="brand__tag">Google Politik</span>}
    </span>
  );
}
