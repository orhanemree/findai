import { UserSchema } from "@/types";
import { motion } from "framer-motion";

export default ({ user, showRole=false }: { user: UserSchema, showRole?: boolean } ) => {

    const classes = "border-2 border-black w-16 h-16 rounded-[50%] \
flex items-center justify-center font-bold";

    return (
        <motion.div className={classes} style={{backgroundColor: user.displayColor!+"80"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {showRole && (user.role === "ai" ? "ai" : "pl")}
        </motion.div>
    )
}