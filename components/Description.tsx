export default ({ children }: { children: any }) => {

    const classes = "default bg-zinc-100 text-zinc-800 p-3 text-sm h-min";

    return (
        <div className={classes}>
            {children}
        </div>
    )
}