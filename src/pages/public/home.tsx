import { useQueryData } from "@/hooks/useQueryData";
import MainLayout from "../../layouts/main-layout";
import { Flex, Text } from "@radix-ui/themes";
import { BusinessResponse } from "@/types/businesses";
import Modal from "@/components/ui/custom/simple-modal";
import { Suspense, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/custom/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useClickOutside } from "@/hooks/useClickOutside";
import { CartProvider } from "@/cart/context";
import { CartBadge } from "@/cart/components/CartBadge";
import { AddToCartButton } from "@/cart/components/AddToCartButton";
import { CartList } from "@/cart/components/CartList";
import WhackAMole from "@/games/WhackAMole";
import GamesController from "@/games/GamesController";
import { Button } from "@/components/ui/button";

//
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Home',
//         href: '/home',
//     },
// ];
export default function Home() {
    const [open, setOpen] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openHook, setOpenHook] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [theme, setTheme] = useLocalStorage("theme", "light");
    const { data } = useQueryData<BusinessResponse, {}>({
        url: "/businesses",
        initial: {},
    });
    useClickOutside(ref, () => setOpenHook(false));
    console.log(data);
    return (
        <MainLayout>
            <div className="w-[1000px] m-auto">
                <Flex direction="column" gap="2" className="mb-4">
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <Button
                                className="!cursor-pointer"
                                onClick={() => setOpenCart(true)}
                            >
                                <CartBadge />
                            </Button>
                        </div>

                        <div className="flex gap-3">
                            <Suspense fallback={<p>Loading...</p>}>
                                {data?.businesses.map((el) => (
                                    <div key={el.id}>
                                        {el.id}
                                        <AddToCartButton
                                            id={el.id}
                                            title={el.name}
                                            price={el.id * 10}
                                        />
                                    </div>
                                ))}
                            </Suspense>
                        </div>
                        <Modal open={openCart} onOpenChange={setOpenCart}>
                            <CartList />
                        </Modal>
                    </div>
                    <Text>Hello from Radix Themes :)</Text>
                    <div>
                        <div>
                            {isMobile ? "📱 Mobile menu" : "💻 Desktop menu"}
                        </div>
                        <Tooltip text="Click to change theme">
                            <Button
                                onClick={() =>
                                    setTheme(
                                        theme === "light" ? "dark" : "light"
                                    )
                                }
                                className={`${
                                    theme === "light"
                                        ? "!bg-violet-700"
                                        : "!bg-amber-500"
                                } !cursor-pointer`}
                            >
                                useLocalStorage
                            </Button>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip text="Click to learn more">
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={() => setOpen(true)}
                            >
                                Let's go
                            </Button>
                        </Tooltip>
                    </div>
                </Flex>
                <Modal open={open} onOpenChange={setOpen} title="test modal">
                    <Input></Input>
                    <Input></Input>
                    <Input></Input>
                </Modal>
                <div>
                    <div ref={ref}>
                        <button onClick={() => setOpenHook(!openHook)}>
                            Toggle menu
                        </button>
                        {openHook && <div className="menu">Menu content</div>}
                    </div>
                </div>

                <GamesController />
            </div>
        </MainLayout>
    );
}
