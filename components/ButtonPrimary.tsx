import { ButtonProps } from "@/types";

export default ({ children, onClick, disabled=false, type="button" }: ButtonProps) => {
    return (
        <>
        <button className="bg-teal-900" onClick={onClick} type={type} disabled={disabled}>
            {children}
        </button>
        </>
    )
}