import { cn } from "@/components/ui";

// The Rival Peregrine mark: a diving falcon built from circuit traces.
// Colours come from --mark-a / --mark-b, so it switches with the theme on its own.
export function PeregrineMark({
  size = 28,
  id = "rp",
  glow = false,
  className,
  title,
}: {
  size?: number;
  id?: string;
  glow?: boolean;
  className?: string;
  title?: string;
}) {
  const grad = `${id}-grad`;
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={cn(glow && "dark:drop-shadow-[0_0_10px_rgba(0,229,255,0.55)]", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--mark-a)" }} />
          <stop offset="0.62" style={{ stopColor: "var(--mark-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-b)" }} />
        </linearGradient>
      </defs>
      <polygon points="256,462 422,90 302,232 278,58 256,100 234,58 210,232 90,90" fill={`url(#${grad})`} />
      <g stroke="#0A0B0F" strokeWidth="7" strokeLinecap="round" fill="none">
        <line x1="256" y1="150" x2="256" y2="420" />
        <polyline points="256,330 300,286 352,186" />
        <polyline points="256,330 212,286 160,186" />
        <line x1="300" y1="286" x2="330" y2="286" />
        <line x1="212" y1="286" x2="182" y2="286" />
      </g>
      <g fill="#0A0B0F">
        <circle cx="352" cy="186" r="11" />
        <circle cx="160" cy="186" r="11" />
        <circle cx="330" cy="286" r="8" />
        <circle cx="182" cy="286" r="8" />
        <circle cx="256" cy="150" r="11" />
      </g>
      <circle cx="256" cy="420" r="9" style={{ fill: "var(--mark-b)" }} stroke="#0A0B0F" strokeWidth="5" />
    </svg>
  );
}
