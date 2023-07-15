import "@/assets/globals.css";

import { Metadata } from "next";
import { ContextProvider } from "@/context/Context";
import ToggleLang from "@/components/ToggleLang";

export const metadata: Metadata = {
    title: "Find AI",
    description: "Find secret ChatGPT AI in a chat room. Playable game! by Orhan Emre Dikicigil",
    authors: { name: "Orhan Emre Dikicigil - orhanemree", url: "https://github.com/orhanemree" },
    openGraph: {
        title: "Find AI",
        description: "Find secret ChatGPT AI in a chat room. Playable game! by Orhan Emre Dikicigil"
    }
}

export default ({ children }: { children: React.ReactNode }) => {

    return (
        <html lang="en">
            <body>
                <ContextProvider>
                    <div className="max-w-[500px]">
                        <nav className="absolute top-5 right-5">
                            <ToggleLang />
                        </nav>
                        {children}
                    </div>
                </ContextProvider>
            </body>
        </html>
    )
}
