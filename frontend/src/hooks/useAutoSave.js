import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export function useAutoSave(initialData, resumeId) {
  const [saveState, setSaveState] = useState("idle"); // 'idle' | 'saving' | 'saved' | 'error'
  const isFirstRender = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Skip saving on the initial render when data first loads
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Skip if it's a new resume (needs manual create first)
    if (resumeId === "new") return;

    setSaveState("saving");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await api.put(`/api/resumes/${resumeId}`, {
          template: initialData.template,
          resumeJson: JSON.stringify(initialData.dataObj),
        });
        setSaveState("saved");

        // Clear the "saved" status after 2 seconds to revert to idle
        setTimeout(() => setSaveState("idle"), 2000);
      } catch (err) {
        console.error("Auto-save failed", err);
        setSaveState("error");
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(timeoutRef.current);
  }, [initialData, resumeId]);

  return saveState;
}
