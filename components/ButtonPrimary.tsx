import { ButtonProps } from "@/types";

export default ({ children, onClick, disabled=false, type="button" }: ButtonProps) => {

    const classes = `default px-6 py-3 \
${!disabled ? "bg-emerald-700 cursor-pointer text-white" : "bg-zinc-200 opacity-60"}`;

    return (
        <button className={classes} onClick={onClick} type={type} disabled={disabled}>
            {children}
        </button>
    )
}