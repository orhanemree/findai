import { ButtonProps } from "@/types";

export default ({ children, onClick, disabled=false, type="button" }: ButtonProps) => {

    const classes = `default px-3 py-2 \
${!disabled ? "bg-lime-200 cursor-pointer" : "bg-zinc-200 opacity-60"}`;

    return (
        <button className={classes} onClick={onClick} type={type} disabled={disabled}>
            {children}
        </button>
    )
}