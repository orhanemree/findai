"use client";

import { getCookies } from "@/utils/func";
import { createContext, useState, useEffect } from "react";

//@ts-ignore :)
export const Context = createContext();

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [lang, setLang] = useState();

    useEffect(() => {
        setLang(getCookies().language);
    }, []);

    return (
        <Context.Provider value={{ lang, setLang }}>
            {children}
        </Context.Provider>
    )
}