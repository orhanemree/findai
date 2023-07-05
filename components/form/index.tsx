import { FormProps } from "@/types";

export default ({ children, onSubmit, novalidate=true }: FormProps) => {
    return (
        <>
            <form onSubmit={onSubmit} noValidate={novalidate}>
                {children}
            </form>
        </>
    )
}