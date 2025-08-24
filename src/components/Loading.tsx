"use client";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="size-16 rounded-full border-t-4 border-solid border-blue-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;
