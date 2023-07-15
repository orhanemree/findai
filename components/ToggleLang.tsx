"use client";

import { useContext } from "react";
import { Context } from "@/context/Context";

import FlagEN from "./flag/FlagEN";
import FlagTR from "./flag/FlagTR";

export default () => {

    const { lang, setLang } = useContext(Context) as { lang: string, setLang: (val: string) => void };

    const changeLang = async () => {
        const newLang = lang !== "TR" ? "TR" : "EN";
        setLang(newLang);

        // set new language to cookies
        await fetch("/api/cookie", {
            method: "POST",
            body: JSON.stringify({ cookies: [
                { name: "language", value: newLang }
            ] })
        });
    }

    return (
        <button onClick={changeLang}>
            {lang !== "TR" ? 
                <FlagEN />
            :
                <FlagTR />
            }
        </button>
    )
}