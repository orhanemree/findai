import "@/assets/globals.css";

import { ContextProvider } from "@/context/Context";
import ToggleLang from "@/components/ToggleLang";

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
