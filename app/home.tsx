"use client";

import { useContext } from "react";
import { Context } from "@/context/Context"; 
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";


export default () => {

    const { lang } = useContext(Context) as { lang: string };

    const { push } = useRouter();

    return (
        <motion.div className="grid gap-5 text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <ButtonPrimary onClick={() => push("/join")}>
                {lang !== "TR" ? "Join a Room" : "Bir Odaya Katıl"}
            </ButtonPrimary>
            <ButtonSecondary onClick={() => push("/create")}>
                {lang !== "TR" ? "Create New Room" : "Yeni Oda Oluştur"}
            </ButtonSecondary>
        </motion.div>
    )
}