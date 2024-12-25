"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

type AlertProps = {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number; // Auto dismiss duration in ms
  onClose?: () => void;
};

const Alert = ({ message, type = "info", duration = 3000, onClose }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-white border-gray-200 text-gray-400";
      case "error":
        return "bg-white border-red-400 text-red-700";
      case "info":
      default:
        return "bg-blue-100 border-blue-400 text-blue-700";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className={`fixed md:bottom-4 md:right-4 bottom-4 right-4 transform -translate-x-1/2 z-50 md:w-full w-4/5  max-w-md px-4 py-3 border rounded shadow-lg ${getAlertStyles()}`}
        >
          <div className="flex items-center justify-between">
            <span className="md:text-md text-sm">{message}</span>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className="text-xl font-bold leading-none focus:outline-none"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
