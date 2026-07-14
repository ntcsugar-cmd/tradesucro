import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** Container — the page-width wrapper. Matches the max-width used across the homepage. */
export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={clsx("mx-auto w-full max-w-page px-6 md:px-10", className)} {...props}>
      {children}
    </div>
  );
}

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 12;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: Cols;
  colsSm?: Cols;
  colsMd?: Cols;
  colsLg?: Cols;
  gap?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

const colsMap: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};
const colsSmMap: Record<Cols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
};
const colsMdMap: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};
const colsLgMap: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

const gapMap = {
  none: "gap-0",
  sm: "gap-3",
  md: "gap-6",
  lg: "gap-10",
};

/** Grid — a responsive CSS grid with breakpoint-aware column counts. */
export function Grid({ cols = 1, colsSm, colsMd, colsLg, gap = "md", className, children, ...props }: GridProps) {
  return (
    <div
      className={clsx(
        "grid",
        colsMap[cols],
        colsSm && colsSmMap[colsSm],
        colsMd && colsMdMap[colsMd],
        colsLg && colsLgMap[colsLg],
        gapMap[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  children: ReactNode;
}

const spanMap: Record<NonNullable<GridItemProps["span"]>, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  6: "col-span-6",
  12: "col-span-12",
};

/** GridItem — an explicit column span within a Grid. */
export function GridItem({ span, className, children, ...props }: GridItemProps) {
  return (
    <div className={clsx(span && spanMap[span], className)} {...props}>
      {children}
    </div>
  );
}
