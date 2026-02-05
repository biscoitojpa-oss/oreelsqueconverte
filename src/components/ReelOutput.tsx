import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, Check, Film, Type, Wand2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ReelOutputProps {
  output: {
    script: {
      hook: string;
      development: string;
      closing: string;
    };
    screenText: {
      frame1: string;
      frame2: string;
      frame3: string;
    };
    videoPrompt: string;
    variations: {
      alternativeHooks: string[];
      alternativeClosings: string[];
      controversialVersion: string;
    };
    algorithmObjective: string;
  };
  onReset: () => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="text-muted-foreground hover:text-primary"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}

function OutputCard({ 
  title, 
  icon, 
  children, 
  copyText,
  className = "" 
}: { 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  copyText?: string;
  className?: string;
}) {
  return (
    <div className={`glass-elevated rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <h3 className="font-display font-semibold">{title}</h3>
        </div>
        {copyText && <CopyButton text={copyText} label={title} />}
      </div>
      {children}
    </div>
  );
}

export function ReelOutput({ output, onReset }: ReelOutputProps) {
  const fullScript = `GANCHO:\n${output.script.hook}\n\nDESENVOLVIMENTO:\n${output.script.development}\n\nFECHAMENTO:\n${output.script.closing}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Algorithm objective */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
          🎯 Objetivo algorítmico: {output.algorithmObjective}
        </span>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Script */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <OutputCard 
            title="Roteiro do Reel" 
            icon={<Film className="w-5 h-5" />}
            copyText={fullScript}
          >
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Gancho (0-2s)</span>
                <p className="text-foreground mt-1">{output.script.hook}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Desenvolvimento</span>
                <p className="text-foreground mt-1">{output.script.development}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fechamento com Loop</span>
                <p className="text-foreground mt-1">{output.script.closing}</p>
              </div>
            </div>
          </OutputCard>
        </motion.div>

        {/* Screen Text */}
        <motion.div variants={itemVariants}>
          <OutputCard 
            title="Texto na Tela" 
            icon={<Type className="w-5 h-5" />}
            copyText={`Frame 1: ${output.screenText.frame1}\nFrame 2: ${output.screenText.frame2}\nFrame 3: ${output.screenText.frame3}`}
          >
            <div className="space-y-3">
              {[
                { label: "Frame 1", text: output.screenText.frame1 },
                { label: "Frame 2", text: output.screenText.frame2 },
                { label: "Frame 3", text: output.screenText.frame3 },
              ].map((frame, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground">{frame.text}</p>
                </div>
              ))}
            </div>
          </OutputCard>
        </motion.div>

        {/* Video Prompt */}
        <motion.div variants={itemVariants}>
          <OutputCard 
            title="Prompt de Vídeo IA" 
            icon={<Wand2 className="w-5 h-5" />}
            copyText={output.videoPrompt}
          >
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <code className="text-sm text-foreground whitespace-pre-wrap">
                {output.videoPrompt}
              </code>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Copie e cole no Veo ou Nano Banana
            </p>
          </OutputCard>
        </motion.div>

        {/* Variations */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <OutputCard 
            title="Variações" 
            icon={<RefreshCw className="w-5 h-5" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">Hooks Alternativos</span>
                <ul className="mt-2 space-y-2">
                  {output.variations.alternativeHooks.map((hook, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {hook}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Fechamentos Alternativos</span>
                <ul className="mt-2 space-y-2">
                  {output.variations.alternativeClosings.map((closing, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {closing}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-destructive font-semibold">Versão Polêmica 🔥</span>
                <p className="text-sm text-foreground mt-2">{output.variations.controversialVersion}</p>
              </div>
            </div>
          </OutputCard>
        </motion.div>
      </div>

      {/* Reset button */}
      <motion.div variants={itemVariants} className="flex justify-center pt-6">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="border-primary/50 text-primary hover:bg-primary/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Gerar Novo Reel
        </Button>
      </motion.div>
    </motion.div>
  );
}
