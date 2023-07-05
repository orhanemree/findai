import { InputProps } from "@/types";

export default ({ onInput, label, required=true }: InputProps) => {
    return (
        <>
            {label &&
                <div>
                    {label}
                </div>}
            <input type="text" onInput={onInput} required={required} />
        </>
    )
}