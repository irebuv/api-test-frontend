import { Button } from "@/components/ui/button";
import { useCartDispatch } from "../context";

type Props = { id: number; title: string; price: number };

export function AddToCartButton({ id, title, price }: Props) {
    const dispatch = useCartDispatch();
    return (
        <Button
            onClick={() =>
                dispatch({ type: "ADD", payload: { id, title, price } })
            }
            className="px-3 py-2 rounded bg-violet-600 text-white cursor-pointer"
        >
            Add to cart
        </Button>
    );
}
