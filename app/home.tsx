"use client";

import { useRouter } from "next/navigation";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";

export default () => {

    const { push } = useRouter();

    const redirectJoin = () => {
        push("/join");
    }

    const redirectNew = () => {
        push("/create");
    }

    return (
        <>
            <div>
                <ButtonPrimary onClick={redirectJoin}>
                    Join a Room
                </ButtonPrimary>
                <ButtonSecondary onClick={redirectNew}>
                    Create New Room
                </ButtonSecondary>
            </div>
        </>
    )
}