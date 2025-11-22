import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TooltipProps = {
    text: string;
    children: React.ReactNode;
};

export function Tooltip({ text, children }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!visible || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({
            top: rect.top - 35,
            left: rect.left + rect.width / 2,
        });
    }, [visible]);

    return (
        <>
            <div
                ref={ref}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="inline-block"
            >
                {children}
            </div>
            {visible &&
                createPortal(
                    <div
                        className="fixed z-50 transform -translate-x-1/2 bg-black
                     text-white text-xs px-2 py-1 rounded shadow-lg cursor-pointer pointer-events-auto select-none"
                        style={{ top: pos.top, left: pos.left }}
                    >
                        {text}
                    </div>,
                    document.body
                )}
        </>
    );
}
