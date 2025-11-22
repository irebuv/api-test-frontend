import { CartState } from "@/types/cart";
import { useMemo } from "react";

export function useCartTotals(state: CartState){
    return useMemo(() => {
        const items = Object.values(state.items);
        const count = items.reduce((acc, it) => acc + it.qty, 0);
        const subtotal = items.reduce((acc, it) => acc + it.qty * it.price, 0);
        return {count, subtotal, items};
    }, [state.items]);
}