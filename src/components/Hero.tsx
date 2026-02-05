import { Sparkles, TrendingUp, Eye, Repeat } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <header className="text-center py-12 px-4 relative">
      {/* Logo/Brand */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">Distribuição Orgânica™</span>
      </motion.div>

      {/* Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
      >
        <span className="text-gradient">Jarvas</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
      >
        Gere Reels que o algoritmo entrega para <span className="text-foreground font-medium">desconhecidos</span>.
        <br className="hidden sm:block" />
        Mesmo com zero seguidores.
      </motion.p>

      {/* Features pills */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {[
          { icon: <Eye className="w-4 h-4" />, label: "Retenção" },
          { icon: <Repeat className="w-4 h-4" />, label: "Replay" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Explorar/Reels" },
        ].map((feature, i) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm"
          >
            <span className="text-primary">{feature.icon}</span>
            <span className="text-foreground">{feature.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
    </header>
  );
}
