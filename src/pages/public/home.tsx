import { useQueryData } from "@/hooks/useQueryData";
import MainLayout from "../../layouts/main-layout";
import { Flex, Text, Button } from "@radix-ui/themes";
import { BusinessResponse } from "@/types/businesses";
import Modal from "@/components/ui/custom/simple-modal";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/custom/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useClickOutside } from "@/hooks/useClickOutside";

//
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Home',
//         href: '/home',
//     },
// ];
export default function Home() {
    const [open, setOpen] = useState(false);
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
            </div>
            <div>
                <div ref={ref}>
                    <button onClick={() => setOpenHook(!openHook)}>Toggle menu</button>
                    {openHook && <div className="menu">Menu content</div>}
                </div>
            </div>
        </MainLayout>
    );
}
