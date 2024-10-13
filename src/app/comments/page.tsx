"use client";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Chats() {
    const router = useRouter();
    return (
        <Grid className="w-full h-full flex justify-center items-center">
            <Flex direction="row" gap="2" align="center">
                <Button variant="ghost" size="2" onClick={() => router.back()}>
                    <ArrowLeftIcon />
                </Button>
                <Text>You are in comments page</Text>
            </Flex>
        </Grid>
    )
}