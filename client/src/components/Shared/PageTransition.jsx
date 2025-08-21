import { motion } from "framer-motion";
import React from "react";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}       // page enter hote hi halka neeche se
      animate={{ opacity: 1, y: 0 }}        // smooth fade in + slide up
      exit={{ opacity: 0, y: -15 }}         // page leave hote hi halka upar fade out
      transition={{ duration: 0.4, ease: "easeInOut" }} // smooth timing
      className="min-h-[80vh] w-full"
    >
      {children}
    </motion.div>
  );
}
