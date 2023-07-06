import "@/assets/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="max-w-[500px]">
                    {children}
                </div>
            </body>
        </html>
    )
}
