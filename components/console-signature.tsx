"use client";

import { useEffect } from "react";

let signed = false;

// One styled line for anyone who opens the console.
export function ConsoleSignature() {
  useEffect(() => {
    if (signed) return;
    signed = true;
    console.log(
      "%c0xRIVAL%c // Jack in. Lock on. Strike clean. Hiring? -> /#contact",
      "background:#0A0B0F;color:#00E5FF;font:700 12px monospace;padding:4px 8px;border-left:3px solid #FF2BD6",
      "color:#0091A8;font:12px monospace",
    );
  }, []);
  return null;
}
