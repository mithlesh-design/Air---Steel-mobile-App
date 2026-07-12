import { useRef } from "react";

const DOUBLE_TAP_MS          = 300;
const DOUBLE_TAP_MAX_DIST_PX = 40;
const TAP_MAX_MOVE_PX        = 10;
const TAP_MAX_MS             = 250;
const TOGGLE_COOLDOWN_MS     = 400;

const CENTER_X_MIN = 0.25, CENTER_X_MAX = 0.75;
const CENTER_Y_MIN = 0.20, CENTER_Y_MAX = 0.80;

/**
 * The middle 50% × 60% of a container. In both readers this is exactly the gap
 * between the left/right quarter page-turn tap zones, so the two gestures can
 * never overlap — and an expand triggered from here can't land a synthetic
 * click on a tap zone in the newly-mounted fullscreen view.
 */
export const isCenterPoint = (x: number, y: number, rect: DOMRect) => {
  const fx = (x - rect.left) / rect.width;
  const fy = (y - rect.top) / rect.height;
  return fx > CENTER_X_MIN && fx < CENTER_X_MAX
      && fy > CENTER_Y_MIN && fy < CENTER_Y_MAX;
};

type Gesture = {
  deltaX: number;
  deltaY: number;
  deltaT: number;
  clientX: number;
  clientY: number;
  rect: DOMRect;
};

/**
 * Double-tap the centre of a reader page to toggle preview ↔ fullscreen.
 *
 * @param onToggle  Called once per accepted double-tap.
 * @param enabled   Pass false to suppress the gesture (e.g. while zoomed in).
 */
export function useDoubleTapToggle(onToggle: () => void, enabled: boolean = true) {
  const lastTapTime = useRef(0);
  const lastTapX = useRef(0);
  const lastTapY = useRef(0);
  const lastToggleTime = useRef(0);

  // Browsers also synthesize a dblclick after a touch double-tap; without this
  // cooldown one physical gesture would toggle twice and land back where it started.
  const fire = () => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastToggleTime.current < TOGGLE_COOLDOWN_MS) return;
    lastToggleTime.current = now;
    onToggle();
  };

  /**
   * Classifies a finished gesture. Any non-null result means it was a tap and
   * the caller should stop processing it as a swipe.
   *
   * "double" — a centre double-tap; onToggle has already fired.
   * "tap"    — a lone tap (or the first of a pair).
   */
  const handleGesture = ({ deltaX, deltaY, deltaT, clientX, clientY, rect }: Gesture): "double" | "tap" | null => {
    const isTap = Math.abs(deltaX) < TAP_MAX_MOVE_PX
               && Math.abs(deltaY) < TAP_MAX_MOVE_PX
               && deltaT < TAP_MAX_MS;
    if (!isTap) {
      lastTapTime.current = 0; // a swipe or scroll breaks the double-tap chain
      return null;
    }

    const now = Date.now();
    const gap = now - lastTapTime.current;
    const dist = Math.hypot(clientX - lastTapX.current, clientY - lastTapY.current);
    if (gap < DOUBLE_TAP_MS && dist < DOUBLE_TAP_MAX_DIST_PX && isCenterPoint(clientX, clientY, rect)) {
      lastTapTime.current = 0;
      fire();
      return "double";
    }

    lastTapTime.current = now;
    lastTapX.current = clientX;
    lastTapY.current = clientY;
    return "tap";
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (isCenterPoint(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())) fire();
  };

  return { handleGesture, handleDoubleClick };
}
