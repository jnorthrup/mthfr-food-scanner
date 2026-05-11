import { Loader2, Shield } from "lucide-react";

export function LoadingScreen() {
  return (
    <div
      data-design-id="loading-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <div className="flex flex-col items-center">
        <div
          data-design-id="loading-icon"
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-8 shadow-2xl shadow-primary/30"
        >
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 data-design-id="loading-title" className="text-2xl font-bold mb-3 tracking-tight">
          MTHFR Scanner
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span data-design-id="loading-text">Optimizing Engines...</span>
        </div>
      </div>
    </div>
  );
}
