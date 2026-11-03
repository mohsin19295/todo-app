export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-200/40 bg-gradient-to-br from-white/20 via-cyan-300/25 to-white/5 px-4 py-2 text-sm font-medium text-white shadow-[0_0_18px_rgba(0,255,255,0.16)] transition hover:border-cyan-100/60 hover:from-white/30 hover:via-cyan-200/35 disabled:cursor-wait disabled:opacity-60",
  edit:
    "shrink-0 cursor-pointer text-sm text-blue-400 transition hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "shrink-0 cursor-pointer text-sm text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50",
  quiet:
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/15 disabled:opacity-50",
};

export const todoButton = {
  edit:
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-sky-300/40 bg-sky-400/10 px-3 py-1.5 text-sm font-medium text-sky-200 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50",
};

export const fieldClass =
  "w-full rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-white outline-none transition placeholder:text-white/45 focus:border-cyan-200/50 focus:ring-1 focus:ring-cyan-200/40";

export const selectClass =
  "rounded-lg border border-dark-border bg-dark-bg px-4 py-2 text-sm text-white shadow-sm outline-none transition hover:bg-white/10 focus:border-cyan-200/50 focus:ring-1 focus:ring-cyan-200/40 cursor-pointer";

export const statusDot = {
  "To Do": "bg-emerald-400",
  "In Progress": "bg-amber-300",
  Done: "bg-sky-300",
};
