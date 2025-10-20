import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as React from "react";

function Logo({className}: React.ComponentProps<"div">) {
    return (
        <motion.div
            whileHover={{ scale: 1.3 }}
            className={cn("text-3xl font-bold text-blue-600 cursor-pointer", className)}
        >
            Logo
        </motion.div>
    );
}

export default Logo;
