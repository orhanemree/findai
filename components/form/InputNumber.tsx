import { InputProps } from "@/types";

interface InputNumberProps extends InputProps {
    value?: number,
    min?: number,
    max?: number
}

export default ({ onInput, label, required=true, value, min=2, max=10 }: InputNumberProps) => {
    return (
        <>
            {label &&
                <div>
                    {label}
                </div>}
            <input type="number" onInput={onInput} value={value} min={min} max={max} required={required} />
        </>
    )
}