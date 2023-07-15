"use client";

import { useContext } from "react";
import { Context } from "@/context/Context"; 
import { useRouter } from "next/navigation";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";


export default () => {

    const { lang } = useContext(Context) as { lang: string };

    const { push } = useRouter();

    return (
        <div className="grid gap-5 text-xl">
            <ButtonPrimary onClick={() => push("/join")}>
                {lang !== "TR" ? "Join a Room" : "Bir Odaya Katıl"}
            </ButtonPrimary>
            <ButtonSecondary onClick={() => push("/create")}>
                {lang !== "TR" ? "Create New Room" : "Yeni Oda Oluştur"}
            </ButtonSecondary>
        </div>
    )
}