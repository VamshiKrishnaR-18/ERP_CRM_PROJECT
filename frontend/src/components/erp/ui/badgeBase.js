import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        // Primary badge for "good" / active states on dark background
        default:
          "border-transparent bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30",
        // Neutral / secondary label
        secondary:
          "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800/80",
        // Error / destructive state
        destructive:
          "border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 focus-visible:ring-red-500/30",
        // Subtle outline style used as a base for status chips
        outline:
          "border-zinc-700 text-zinc-200 bg-zinc-900/40 hover:bg-zinc-800/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

