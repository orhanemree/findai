import { ButtonProps } from "@/types";

export default ({ children, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}