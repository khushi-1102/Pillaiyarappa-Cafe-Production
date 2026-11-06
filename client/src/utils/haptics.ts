/**
 * Haptic feedback utility for mobile browsers.
 * Uses navigator.vibrate with enhanced tactile durations and global event attachment.
 */
export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    switch (type) {
      case 'light':
        // Crisp, delicate micro-haptic (18ms)
        navigator.vibrate(18);
        break;
      case 'selection':
        // Clean selection tick (24ms)
        navigator.vibrate(24);
        break;
      case 'medium':
        // Tight, premium tactile click for Add to Cart (32ms)
        navigator.vibrate(32);
        break;
      case 'heavy':
        navigator.vibrate([26, 18, 26]);
        break;
      case 'success':
        navigator.vibrate([18, 22, 18]);
        break;
      case 'warning':
        navigator.vibrate([28, 32, 28]);
        break;
      default:
        navigator.vibrate(22);
    }
  } catch {
    // Graceful fallback for environments where vibration is prohibited
  }
}

/**
 * Automatically initializes global haptic feedback on all interactive elements
 * (buttons, links, tab pills, cart toggles, close buttons, etc.) across the website.
 */
let isGlobalHapticsInitialized = false;

export function initGlobalHaptics(): void {
  if (typeof window === 'undefined' || isGlobalHapticsInitialized) return;
  isGlobalHapticsInitialized = true;

  let lastHapticTime = 0;

  const handleGlobalInteraction = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Detect clickable/interactive elements
    const interactive = target.closest(
      'button, a, [role="button"], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, summary, .interactive-press, [data-interactive]'
    );

    if (interactive) {
      const now = Date.now();
      // Debounce slightly to prevent double-firing from synthetic touch events
      if (now - lastHapticTime > 70) {
        lastHapticTime = now;
        triggerHaptic('light');
      }
    }
  };

  // 'pointerdown' triggers the millisecond a finger makes contact for zero perceptible latency
  window.addEventListener('pointerdown', handleGlobalInteraction, {
    passive: true,
    capture: true,
  });
}

// Auto-initialize when loaded on client
if (typeof window !== 'undefined') {
  initGlobalHaptics();
}

