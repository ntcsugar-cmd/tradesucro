import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto border border-line dark:border-white/10">
      <table className={clsx("w-full border-collapse text-left", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx("bg-charcoal/[0.03] dark:bg-white/[0.04]", className)} {...props}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={clsx("divide-y divide-line dark:divide-white/10", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TR({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={clsx("hover:bg-gold/[0.04] dark:hover:bg-gold/[0.08] transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}

interface THProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  children: ReactNode;
}

export function TH({ className, sortable, sortDirection, onSort, children, ...props }: THProps) {
  return (
    <th
      className={clsx(
        "px-5 py-3 font-mono text-[11px] uppercase tracking-widest2 text-ink-faint dark:text-white/40 font-medium",
        className
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="flex items-center gap-1.5 hover:text-charcoal dark:hover:text-white transition-colors"
        >
          {children}
          {sortDirection === "asc" ? (
            <ArrowUp size={12} />
          ) : sortDirection === "desc" ? (
            <ArrowDown size={12} />
          ) : (
            <ArrowUpDown size={12} className="opacity-40" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TD({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx("px-5 py-4 text-[13.5px] text-charcoal dark:text-white align-middle", className)} {...props}>
      {children}
    </td>
  );
}
