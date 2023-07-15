import { InputProps } from "@/types";

interface InputNumberProps extends InputProps {
    value?: number,
    min?: number,
    max?: number
}

export default ({ onInput, label, required=true, value, min=2, max=10 }: InputNumberProps) => {

    const classes = "default px-3 py-3 outline-none w-full";

    return (
        <div>
            {label &&
                <div className="mb-2">
                    {label}
                </div>}
            <input className={classes} type="number" onInput={onInput} value={value} min={min} max={max} required={required} />
        </div>
    )
}