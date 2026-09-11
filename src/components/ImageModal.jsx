import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { API_BASE } from "../services/api";

export default function ImageModal({ image, isOpen, onClose }) {
  if (!image) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 bg-white shadow-lg rounded-full w-9 h-9 flex items-center justify-center hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            {/* Rounded Image */}
            <img
              src={`${API_BASE}/uploads/${image}`}
              alt="Preview"
              className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-full border-4 border-white shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
