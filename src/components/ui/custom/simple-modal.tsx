import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function cn(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    className?: string;
    children: React.ReactNode;
};

export default function Modal({
    open,
    onOpenChange,
    title,
    className,
    children,
}: ModalProps) {
    const portalRef = useRef<HTMLElement | null>(null);
    if (!portalRef.current && typeof document !== "undefined") {
        const el = document.createElement("div");
        el.setAttribute("id", "modal-root");
        document.body.appendChild(el);
        portalRef.current = el;
    }

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        window.addEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    useEffect(() => {
        if (!open) return;

        const content = document.querySelector<HTMLElement>("[role='dialog']")
        if (!content) return;

        const focusable = content.querySelectorAll<HTMLElement>(
            'a[href], textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        (first ?? content).focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab" || focusable.length === 0) return;
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey){
                if (active === first){
                    e.preventDefault();
                    (last ?? first)?.focus();
                }
            } else {
                if (active === last){
                    e.preventDefault();
                    (first ?? last)?.focus();
                }
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open]);

    useLockBodyScroll(open);

    const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onOpenChange(false);
    };

    if (!open || !portalRef.current) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center
         justify-center data-[state=open]:animate-in data-[state=closed]:animate-out"
            role="presentation"
            onMouseDown={onOverlayClick}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                className={cn(
                    "bg-background w-[calc(100%-2rem)] max-w-lg rounded-lg border p-6 shadow-lg",
                    "animate-in fade-in-0 zoom-in-95 duration-200",
                    className
                )}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    {title && (
                        <h2 id="modal=title" className="text-lg font-semibold">
                            {title}
                        </h2>
                    )}
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xs opacity-70 transition hover:opacity-100
                         focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <X className="size-5"></X>
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>,
        portalRef.current
    );
}
