import { motion } from "framer-motion";

export default ({ children, color, type }: { children: any, color: string, type: "prompt" | "answer" }) => {

    const classes = "default p-3 bg-stone-100 break-all";

    return (
        <motion.div className={classes} style={{backgroundColor: color+"80" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="text-xs capitalize">
                {type}:
            </div>
            <div>
                {children}
            </div>
        </motion.div>
    )
}