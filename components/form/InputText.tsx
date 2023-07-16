import { InputProps } from "@/types";

interface InputTextProps extends InputProps {
    value?: string,
    disabled?: boolean
}

export default ({ onInput, label, value, required=true, disabled=false }: InputTextProps) => {

    const classes = "default px-3 py-3 outline-none w-full";

    return (
        <div>
            {label &&
                <div className="mb-2">
                    {label}
                </div>}
            <input className={classes} type="text" value={value} onInput={onInput} required={required} disabled={disabled}/>
        </div>
    )
}