import clsx from "clsx";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "offline" | "away";
  className?: string;
}

const sizeStyles = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-base",
};

const statusStyles = {
  online: "bg-success",
  offline: "bg-gray-400",
  away: "bg-gold",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ src, name, size = "md", status, className }: AvatarProps) {
  return (
    <span className={clsx("relative inline-flex shrink-0", sizeStyles[size], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={clsx("h-full w-full rounded-full object-cover border border-line", sizeStyles[size])}
        />
      ) : (
        <span
          className={clsx(
            "flex h-full w-full items-center justify-center rounded-full bg-navy-700 font-mono font-medium text-white",
            sizeStyles[size]
          )}
          aria-label={name}
        >
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white",
            statusStyles[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </span>
  );
}
