import React from "react";
import { motion } from "framer-motion";
import { Globe, Settings, Shield, HelpCircle, Accessibility, Info } from "lucide-react";

export default function Footer() {
  const items = [
    { label: "About", icon: Info },
    { label: "Privacy & Terms", icon: Shield },
    { label: "Help Center", icon: HelpCircle },
    { label: "Accessibility", icon: Accessibility },
    { label: "Settings", icon: Settings },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-16 bg-slate-900 text-slate-300"
    >
      {/* subtle teal hairline to match header vibe */}
      <div className="h-px bg-gradient-to-r from-teal-500/0 via-teal-500/70 to-green-500/0" />

      <div className="container-app py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Brand + year */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">
            DevHire
          </span>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()}</span>
        </div>

        {/* Utility items (no main navigation here) */}
        <ul className="flex flex-wrap items-center gap-5 text-sm">
          {items.map(({ label, icon: Icon }) => (
            <motion.li key={label} whileHover={{ y: -2 }} className="group relative">
              <button
                type="button"
                title={label}
                className="relative pb-1 flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors duration-200"
              >
                <Icon size={16} className="opacity-85 group-hover:opacity-100" />
                <span>{label}</span>

                {/* animated underline */}
                <span
                  className="pointer-events-none absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 group-hover:scale-x-100 
                  bg-gradient-to-r from-teal-500 to-green-500 rounded-full transition-transform duration-300"
                />
              </button>
            </motion.li>
          ))}

          {/* Language pill (non-interactive display) */}
          <li className="text-sm text-slate-400">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700">
              <Globe size={16} className="opacity-85" />
              <span>English (EN)</span>
            </div>
          </li>
        </ul>
      </div>
    </motion.footer>
  );
}
