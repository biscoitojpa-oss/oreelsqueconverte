import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ReelForm } from "@/components/ReelForm";
import { ReelOutput } from "@/components/ReelOutput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormData {
  businessType: string;
  painPoint: string;
  objective: string;
  tone: string;
}

interface ReelOutput {
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
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<ReelOutput | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('generate-reel', {
        body: data
      });

      if (error) {
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          toast.error("Limite de requisições excedido. Tente novamente em alguns segundos.");
        } else if (error.message?.includes('402')) {
          toast.error("Créditos insuficientes. Por favor, adicione créditos à sua conta.");
        } else {
          toast.error("Erro ao gerar conteúdo. Tente novamente.");
        }
        console.error("Error:", error);
        return;
      }

      setOutput(response);
      toast.success("Reel gerado com sucesso!");
    } catch (err) {
      console.error("Error generating reel:", err);
      toast.error("Erro ao gerar conteúdo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOutput(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Hero />

        <main className="mt-8 sm:mt-12">
          {output ? (
            <ReelOutput output={output} onReset={handleReset} />
          ) : (
            <ReelForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 mt-12 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Jarvas — Distribuição Orgânica™ by{" "}
            <span className="text-primary">Lápis Criativo</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
