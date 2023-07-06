import { UserSchema } from "@/types";


export default ({ user, showRole=false }: { user: UserSchema, showRole?: boolean } ) => {

    const classes = "border-2 border-black w-16 h-16 rounded-[50%] \
flex items-center justify-center font-bold";

    return (
        <div className={classes} style={{backgroundColor: user.displayColor!+"80"}}>
            {showRole && (user.role === "ai" ? "ai" : "pl")}
        </div>
    )
}