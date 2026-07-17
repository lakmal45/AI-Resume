import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AILoadingOverlay({ isVisible, message = "AI is working its magic..." }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 bg-card border border-border p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <Sparkles className="w-5 h-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-lg font-medium text-foreground">{message}</div>
        <p className="text-sm text-muted-foreground max-w-[250px] text-center">
          Please wait while we process and generate the best results for you.
        </p>
      </div>
    </div>
  );
}
