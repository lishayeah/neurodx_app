import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">NeuroDx</span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            For clinical reasoning support only. Not a definitive diagnosis.
            <br />
            Do not use as the sole basis for urgent medical decisions.
          </p>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NeuroDx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
