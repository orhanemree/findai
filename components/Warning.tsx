import { motion } from "framer-motion";

export default ({ children }: { children: any }) => {

    const classes = "default bg-orange-100 text-orange-800 p-3 text-sm";

    return (
        <motion.div className={classes}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {children}
        </motion.div>
    )
}