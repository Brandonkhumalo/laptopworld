import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/263782482482"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-success px-4 py-3 font-semibold text-success-foreground shadow-lg hover:opacity-90 transition-opacity"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    whileHover={{ scale: 1.05 }}
    aria-label="Chat with us on WhatsApp"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="hidden sm:inline text-sm">Chat with us</span>
  </motion.a>
);

export default WhatsAppButton;
