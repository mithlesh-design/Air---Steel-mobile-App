import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Fades reader chrome out after a period of inactivity.
 *
 * @param active  Whether the chrome exists at all (i.e. fullscreen is open).
 *                Going false clears the timer and resets to visible, so the
 *                next entry into fullscreen always starts with chrome shown.
 * @param delayMs How long the chrome stays up after each reveal.
 */
export function useAutoHideChrome(active: boolean, delayMs: number = 2000) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<number | undefined>(undefined);

  const clear = () => {
    if (timer.current !== undefined) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
  };

  const show = useCallback(() => {
    clear();
    setVisible(true);
    timer.current = window.setTimeout(() => setVisible(false), delayMs);
  }, [delayMs]);

  useEffect(() => {
    if (!active) {
      clear();
      setVisible(true);
    }
  }, [active]);

  useEffect(() => clear, []);

  return { visible, show };
}
