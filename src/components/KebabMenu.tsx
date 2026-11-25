import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type KebabMenuProps = {
  label: string;
  onSelect: () => void;
};

export function KebabMenu({ label, onSelect }: KebabMenuProps) {
  const [pos, setPos] = useState<{ top: number; left: number; flip: boolean } | null>(null);

  useEffect(() => {
    if (!pos) return;
    function close() {
      setPos(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos]);

  return (
    <div className="kebab">
      <button
        type="button"
        className="kebab-btn"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={pos !== null}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          if (pos) {
            setPos(null);
            return;
          }
          const rect = event.currentTarget.getBoundingClientRect();
          const flip = rect.bottom + 72 > window.innerHeight;
          setPos({ top: flip ? rect.top - 4 : rect.bottom + 4, left: rect.right, flip });
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {pos
        ? createPortal(
            <div
              role="menu"
              className="menu"
              style={{
                top: pos.top,
                left: pos.left,
                transform: pos.flip ? "translate(-100%, -100%)" : "translateX(-100%)",
              }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPos(null);
                  onSelect();
                }}
              >
                {label}
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
