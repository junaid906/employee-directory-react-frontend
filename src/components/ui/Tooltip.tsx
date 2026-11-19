import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: "top" | "bottom";
}

const SHOW_DELAY_MS = 500;
const GAP_PX = 8;
const FLIP_BELOW_TOP_PX = 48;

// Wraps a single element. The wrapper uses display: contents so the child's
// own positioning is unaffected. The tooltip is portalled to <body> so React
// Flow's zoom transform doesn't scale it, and it is dismissed on pan or zoom.
export default function Tooltip({ label, children }: TooltipProps) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const showTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!position) return;

    function dismiss() {
      setPosition(null);
    }

    window.addEventListener("wheel", dismiss, { capture: true, passive: true });
    window.addEventListener("pointerdown", dismiss, { capture: true });
    return () => {
      window.removeEventListener("wheel", dismiss, { capture: true });
      window.removeEventListener("pointerdown", dismiss, { capture: true });
    };
  }, [position]);

  useEffect(() => clearShowTimer, []);

  function clearShowTimer() {
    window.clearTimeout(showTimerRef.current);
  }

  function scheduleShow(event: SyntheticEvent<HTMLSpanElement>) {
    const trigger = event.currentTarget.firstElementChild;
    if (!trigger) return;

    clearShowTimer();
    showTimerRef.current = window.setTimeout(() => {
      const rect = trigger.getBoundingClientRect();
      const placement = rect.top > FLIP_BELOW_TOP_PX ? "top" : "bottom";
      setPosition({
        left: rect.left + rect.width / 2,
        top: placement === "top" ? rect.top - GAP_PX : rect.bottom + GAP_PX,
        placement,
      });
    }, SHOW_DELAY_MS);
  }

  function hide() {
    clearShowTimer();
    setPosition(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.key === "Escape") hide();
  }

  return (
    <span
      className="contents"
      onMouseEnter={scheduleShow}
      onMouseLeave={hide}
      onFocus={scheduleShow}
      onBlur={hide}
      onKeyDown={handleKeyDown}
    >
      {children}
      {position &&
        createPortal(
          <div
            role="tooltip"
            style={{ top: position.top, left: position.left }}
            className={`pointer-events-none fixed z-1000 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs font-medium text-white shadow-md ${position.placement === "top" ? "-translate-y-full" : ""}`}
          >
            {label}
          </div>,
          document.body,
        )}
    </span>
  );
}
