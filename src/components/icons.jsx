// Shared line-icon set — same stroke language as the tree/car icons in
// EnvironmentalImpact (viewBox 0 0 40 40, 1.6 stroke, round caps, no fill).
// Color is inherited via `currentColor` so each caller sets it with CSS.

function IconBase({ children, className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PanelIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="6" y="10" width="28" height="18" rx="1.5" />
      <line x1="6" y1="19" x2="34" y2="19" />
      <line x1="15.3" y1="10" x2="15.3" y2="28" />
      <line x1="24.6" y1="10" x2="24.6" y2="28" />
      <line x1="14" y1="28" x2="12" y2="33" />
      <line x1="26" y1="28" x2="28" y2="33" />
    </IconBase>
  );
}

export function InverterIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="10" y="6" width="20" height="28" rx="2.5" />
      <path d="M21 11L14 22H19L17 29L26 17H20L21 11Z" />
    </IconBase>
  );
}

export function MonitorIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="11" y="5" width="18" height="30" rx="3" />
      <path d="M15 25L19 19L23 22L27 14" />
      <line x1="17" y1="31" x2="23" y2="31" />
    </IconBase>
  );
}

export function RoutingIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="20" cy="8" r="3" />
      <circle cx="8" cy="30" r="3" />
      <circle cx="32" cy="30" r="3" />
      <path d="M20 11V17M20 17L10 27M20 17L30 27" />
    </IconBase>
  );
}

export function DollarIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="20" cy="20" r="14" />
      <path d="M20 11V29M25 15.5C25 12.5 22.5 11 20 11C17 11 15 12.5 15 15C15 18 18 18.5 20 19C23 19.5 25 20.5 25 24C25 27 22.5 29 20 29C17.5 29 15 27.5 15 25" />
    </IconBase>
  );
}

export function CloudIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 27H27C30 27 32 25 32 22C32 19 30 17.3 27.5 17C27 13 23.8 10 20 10C16.5 10 13.6 12.4 12.7 15.7C9 16 6 19 6 22.5C6 25 8.3 27 11 27Z" />
    </IconBase>
  );
}

export function PlugIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M14 6V14M26 6V14M11 14H29V20C29 25 25 29 20 29C15 29 11 25 11 20V14Z" />
      <line x1="20" y1="29" x2="20" y2="35" />
    </IconBase>
  );
}

export function PlugCheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M14 4.5V11M26 4.5V11M11 11H29V17C29 22 25 26 20 26C15 26 11 22 11 17V11Z" />
      <path d="M14.5 32L18 35.5L26 27" />
    </IconBase>
  );
}

export function ShieldIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 6L32 10V19C32 27 27 32 20 35C13 32 8 27 8 19V10L20 6Z" />
      <path d="M14 20L18 24L27 14" />
    </IconBase>
  );
}

export function BatteryIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="5" y="13" width="27" height="15" rx="2.5" />
      <rect x="32" y="17" width="3" height="7" rx="1" fill="currentColor" stroke="none" />
      <path d="M20 17L15 23H19L18 27L24 20H20L20 17Z" />
    </IconBase>
  );
}

export function WalletIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 12C7 10.3 8.3 9 10 9H28C29.7 9 31 10.3 31 12V29C31 30.7 29.7 32 28 32H10C8.3 32 7 30.7 7 29V12Z" />
      <path d="M7 16H31" />
      <circle cx="25" cy="23" r="2" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function WrenchIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M24 8C21.5 5.5 17.5 5.5 15 8C13 10 12.6 12.8 13.8 15L7 21.8C6 22.8 6 24.3 7 25.3C8 26.3 9.5 26.3 10.5 25.3L17.2 18.5C19.5 19.7 22.3 19.3 24.3 17.3C26.8 14.8 26.8 10.8 24.3 8.3" />
    </IconBase>
  );
}

export function ChatIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 12C8 10.3 9.3 9 11 9H29C30.7 9 32 10.3 32 12V22C32 23.7 30.7 25 29 25H16L10 30V25H11C9.3 25 8 23.7 8 22V12Z" />
      <line x1="13" y1="14.5" x2="27" y2="14.5" />
      <line x1="13" y1="19" x2="22" y2="19" />
    </IconBase>
  );
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="17" cy="17" r="9" />
      <line x1="23.5" y1="23.5" x2="33" y2="33" />
    </IconBase>
  );
}

export function BlueprintIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 32L20 8L32 32Z" />
      <line x1="13.5" y1="24" x2="26.5" y2="24" />
      <circle cx="20" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function HouseIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 20L20 7L34 20" />
      <path d="M10 17V32H30V17" />
      <rect x="17" y="21" width="6" height="11" />
    </IconBase>
  );
}

export function BuildingIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="9" y="6" width="22" height="28" rx="1.5" />
      <line x1="9" y1="14" x2="31" y2="14" />
      <line x1="9" y1="22" x2="31" y2="22" />
      <line x1="16.3" y1="6" x2="16.3" y2="34" />
      <line x1="23.6" y1="6" x2="23.6" y2="34" />
    </IconBase>
  );
}

export function ToolsIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M25 9C22.5 6.5 18.5 6.5 16 9C14 11 13.6 13.8 14.8 16L8 22.8C7 23.8 7 25.3 8 26.3C9 27.3 10.5 27.3 11.5 26.3L18.2 19.5C20.5 20.7 23.3 20.3 25.3 18.3C27.8 15.8 27.8 11.8 25.3 9.3" />
      <path d="M27 13L33 7" />
    </IconBase>
  );
}

export function SunIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="20" cy="20" r="7" />
      <line x1="20" y1="4" x2="20" y2="9" />
      <line x1="20" y1="31" x2="20" y2="36" />
      <line x1="4" y1="20" x2="9" y2="20" />
      <line x1="31" y1="20" x2="36" y2="20" />
      <line x1="8.5" y1="8.5" x2="12" y2="12" />
      <line x1="28" y1="28" x2="31.5" y2="31.5" />
      <line x1="8.5" y1="31.5" x2="12" y2="28" />
      <line x1="28" y1="12" x2="31.5" y2="8.5" />
    </IconBase>
  );
}

export function BoltIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M22 5L10 22H18L16 35L30 16H21L22 5Z" />
    </IconBase>
  );
}

export function LeafIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M10 30C10 16 20 8 32 8C32 22 24 30 12 30H10Z" />
      <path d="M10 30C14 24 20 19 27 15" />
    </IconBase>
  );
}

export function ClockIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="20" cy="20" r="14" />
      <path d="M20 12V20L26 24" />
    </IconBase>
  );
}
