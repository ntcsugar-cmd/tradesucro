import { ElementType, HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

/**
 * Heading — display type, Fraunces serif.
 * Levels map to a fixed scale so headings stay consistent across the app.
 */
type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: ElementType;
  children: ReactNode;
}

const headingStyles: Record<HeadingLevel, string> = {
  1: "text-[2.5rem] sm:text-[3.25rem] leading-[1.08] tracking-tight font-medium",
  2: "text-[2rem] sm:text-[2.5rem] leading-[1.12] tracking-tight font-medium",
  3: "text-[1.5rem] sm:text-[1.75rem] leading-[1.2] font-medium",
  4: "text-[1.125rem] sm:text-[1.25rem] leading-[1.3] font-medium",
};

export function Heading({ level = 2, as, className, children, ...props }: HeadingProps) {
  const Tag = as ?? (`h${level}` as ElementType);
  return (
    <Tag
      className={clsx("font-display text-charcoal dark:text-white", headingStyles[level], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Subheading — body face, used directly under a Heading to introduce a section. */
interface SubheadingProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function Subheading({ className, children, ...props }: SubheadingProps) {
  return (
    <p
      className={clsx("font-body text-[15px] sm:text-base text-ink-soft dark:text-white/50 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/** Body text — the default paragraph style, with size variants. */
type TextSize = "sm" | "md" | "lg";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  muted?: boolean;
  as?: ElementType;
  children: ReactNode;
}

const textSizes: Record<TextSize, string> = {
  sm: "text-[13px] leading-relaxed",
  md: "text-[14.5px] leading-relaxed",
  lg: "text-[16px] leading-relaxed",
};

export function Text({ size = "md", muted = false, as, className, children, ...props }: TextProps) {
  const Tag = as ?? "p";
  return (
    <Tag
      className={clsx("font-body", textSizes[size], muted ? "text-ink-soft dark:text-white/50" : "text-charcoal dark:text-white", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Caption — smallest type, mono, for labels, metadata, and timestamps. */
interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  uppercase?: boolean;
  children: ReactNode;
}

export function Caption({ uppercase = true, className, children, ...props }: CaptionProps) {
  return (
    <span
      className={clsx(
        "font-mono text-[11px] text-ink-faint dark:text-white/40 tracking-wide",
        uppercase && "uppercase tracking-widest2",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
