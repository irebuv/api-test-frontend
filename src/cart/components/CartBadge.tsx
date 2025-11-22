import { useCartState } from "../context";
import { useCartTotals } from "../selectors";

export function CartBadge() {
    const state = useCartState();
    const { count } = useCartTotals(state);
    return (
        <div className="inline-flex items-center gap-2">
            <span>🛒</span>
            <span className="text-sm font-medium">{count}</span>
        </div>
    );
}
