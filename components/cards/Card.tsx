import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  children: ReactNode;
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/** Card — the base surface for grouping content, used throughout dashboards and listings. */
export function Card({ padding = "md", interactive = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-line rounded-sm dark:bg-charcoal-soft dark:border-white/10",
        interactive && "transition-all hover:border-gold/40 hover:shadow-card cursor-pointer dark:hover:border-gold/40",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("flex items-start justify-between gap-4 mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx("font-body font-semibold text-[15px] text-charcoal dark:text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={clsx("text-xs text-ink-faint dark:text-white/40 mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("mt-5 pt-4 border-t border-line dark:border-white/10 flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  );
}
