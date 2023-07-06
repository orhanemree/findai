import { FormProps } from "@/types";

export default ({ children, onSubmit, novalidate=true }: FormProps) => {

    const classes = "grid gap-5";

    return (
        <form className={classes} onSubmit={onSubmit} noValidate={novalidate}>
            {children}
        </form>
    )
}