export default ({ children }: { children: any }) => {

    const classes = "default bg-orange-100 text-orange-800 p-3 text-sm";

    return (
        <div className={classes}>
            {children}
        </div>
    )
}