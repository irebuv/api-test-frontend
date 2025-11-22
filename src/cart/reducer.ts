import { CartAction, CartState } from "@/types/cart";

export const initialCartState: CartState = {
    items: {},
}

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type){
        case "ADD": {
            const {id, price, title} = action.payload;
            const nextQty = (state.items[id]?.qty ?? 0) + (action.payload.qty ?? 1);
            return {
                ...state,
                items: {
                    ...state.items,
                    [id]: {id, title, price, qty: nextQty},
                },
            }
        }
        case "REMOVE": {
            const copy = {...state.items};
            delete copy[action.payload.id];
            return {...state, items: copy};
        }
        case "SET_QTY": {
            const {id, qty} = action.payload;
            if (qty <= 0){
                const copy = {...state.items};
                delete copy[id];
                return {...state, items: copy};
            }
            const prev = state.items[id];
            if(!prev) return state;
            return {
                ...state,
                items: {...state.items, [id]: {...prev, qty}},
            }
        }
        case "CLEAR":
            return initialCartState;
        case "REPLACE":
            return action.payload;
        default:
            return state;
    }
}