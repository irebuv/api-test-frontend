import { useCartDispatch, useCartState } from "../context";
import { useCartTotals } from "../selectors";

export function CartList() {
    const state = useCartState();
    const dispatch = useCartDispatch();
    const { items, subtotal } = useCartTotals(state);

    if (items.length === 0) return <div>Your cart is empty.</div>;

    return (
        <div className="space-y-3">
            {items.map((it) => (
                <div
                    key={it.id}
                    className="flex items-center justify-between border rounded p-3"
                >
                    <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-sm text-muted-foreground">
                            ${it.price} × {it.qty}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() =>
                                dispatch({
                                    type: "SET_QTY",
                                    payload: { id: it.id, qty: it.qty - 1 },
                                })
                            }
                        >
                            −
                        </button>
                        <span className="w-8 text-center">{it.qty}</span>
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() =>
                                dispatch({
                                    type: "SET_QTY",
                                    payload: { id: it.id, qty: it.qty + 1 },
                                })
                            }
                        >
                            +
                        </button>
                        <button
                            className="px-2 py-1 border rounded text-red-600"
                            onClick={() =>
                                dispatch({
                                    type: "REMOVE",
                                    payload: { id: it.id },
                                })
                            }
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                        Subtotal
                    </div>
                    <div className="text-xl font-semibold">
                        ${subtotal.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    className="px-4 py-2 rounded bg-emerald-600 text-white"
                    onClick={() => dispatch({ type: "CLEAR" })}
                >
                    Clear cart
                </button>
            </div>
        </div>
    );
}
