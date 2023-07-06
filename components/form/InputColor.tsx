import { InputProps } from "@/types";

export default ({ onInput, label, required=true }: InputProps) => {

    const classes = "appearance-none bg-transparent w-full h-14";

    return (
        <div>
            {label &&
                <div className="mb-2">
                    {label}
                </div>}
            <input className={classes} type="color" onInput={onInput} required={required} />
        </div>
    )
}