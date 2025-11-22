import { useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    callback: () => void
) {
    useEffect(() => {
        function handleClick(event: MouseEvent) {
            const el = ref.current;
            if (el && !el.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, callback]);
}
