import { CartAction, CartState } from "@/types/cart";
import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from "react";
import { cartReducer, initialCartState } from "./reducer";
import { loadCart, saveCart } from "./storage";

const CartStateCtx = createContext<CartState | undefined>(undefined);
const CartDispatchCtx = createContext<Dispatch<CartAction> | undefined>(
    undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(
        cartReducer,
        initialCartState,
        (init) => loadCart<CartState>(init)
    );

    useEffect(() => {
        saveCart(state);
    }, [state]);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== "cart:v1") return;
            try {
                const next = e.newValue ? (JSON.parse(e.newValue) as CartState) : initialCartState;
                if (JSON.stringify(next) !== JSON.stringify(state)){
                    dispatch({type: "REPLACE", payload: next} as any);
                }
            } catch {
                //
            }
        }
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [state, dispatch]);

    return (
        <CartDispatchCtx.Provider value={dispatch}>
            <CartStateCtx.Provider value={state}>
                {children}
            </CartStateCtx.Provider>
        </CartDispatchCtx.Provider>
    );
}

export function useCartState() {
    const ctx = useContext(CartStateCtx);
    if (!ctx)
        throw new Error("useCartState must be used within <CartProvider>");
    return ctx;
}

export function useCartDispatch() {
    const ctx = useContext(CartDispatchCtx);
    if (!ctx)
        throw new Error("useCartDispatch must be used within <CartProvider>");
    return ctx;
}
