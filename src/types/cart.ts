export type CartItem = {
    id: number;
    title: string;
    price: number;
    qty: number;
}

export type CartState = {
    items: Record<string, CartItem>;
}

export type CartAction = 
    | {type: "ADD"; payload: {id: number; title: string; price: number; qty?: number;}}
    | {type: "REMOVE"; payload: {id:number}}
    | {type: "SET_QTY"; payload: {id: number; qty: number}}
    | {type: "CLEAR"}
    | {type: "REPLACE"; payload: CartState}
