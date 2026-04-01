// ════════════════════════════════════════════════════════════════
// Razorpay SDK — Dynamic Script Loader
// ════════════════════════════════════════════════════════════════

let loadPromise: Promise<boolean> | null = null;

/**
 * Lazily loads the Razorpay checkout script.
 * Idempotent — calling multiple times returns the same promise.
 * On network error the cache resets so a retry is possible.
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<boolean>((resolve) => {
    if ((window as unknown as Record<string, unknown>).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null; // Reset so next call retries
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
};
