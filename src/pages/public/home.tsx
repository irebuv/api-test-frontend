import MainLayout from "../../layouts/main-layout";
import { Flex, Text, Button } from "@radix-ui/themes";

//
// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Home',
//         href: '/home',
//     },
// ];
export default function Home() {
    return (
        <MainLayout>
            <div>
                <Flex direction="column" gap="2">
                    <Text>Hello from Radix Themes :)</Text>
                    <Button>Let's go</Button>
                </Flex>
            </div>
        </MainLayout>
    );
}
