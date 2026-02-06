import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { ReelForm } from "@/components/ReelForm";
import { ReelOutput } from "@/components/ReelOutput";
import { SavedReelsList } from "@/components/SavedReelsList";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Film } from "lucide-react";

interface FormData {
  businessType: string;
  painPoint: string;
  objective: string;
  tone: string;
}

interface VideoPrompt {
  title: string;
  prompt: string;
  extendPrompt: string;
}

interface ReelOutputData {
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
  videoPrompts: VideoPrompt[];
  // Legacy support for old saved reels
  videoPrompt?: string;
  variations: {
    alternativeHooks: string[];
    alternativeClosings: string[];
    controversialVersion: string;
  };
  algorithmObjective: string;
}

interface SavedReelData {
  id: string;
  title: string | null;
  business_type: string;
  pain_point: string;
  objective: string;
  tone: string;
  script: {
    hook: string;
    development: string;
    closing: string;
  };
  screen_text: {
    frame1: string;
    frame2: string;
    frame3: string;
  };
  video_prompt: string;
  video_prompts?: VideoPrompt[];
  variations: {
    alternativeHooks: string[];
    alternativeClosings: string[];
    controversialVersion: string;
  };
  algorithm_objective: string;
  created_at: string;
}

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<ReelOutputData | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const { user } = useAuth();

  const activeTab = searchParams.get("tab") || "generate";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setCurrentFormData(data);
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
    setCurrentFormData(null);
  };

  const handleSelectSavedReel = (reel: SavedReelData) => {
    // Transform saved reel to output format
    // Handle legacy single videoPrompt or new videoPrompts array
    const videoPrompts = reel.video_prompts || (reel.video_prompt ? [{
      title: "Prompt Principal",
      prompt: reel.video_prompt,
      extendPrompt: ""
    }] : []);

    const transformedOutput: ReelOutputData = {
      script: reel.script,
      screenText: reel.screen_text,
      videoPrompts,
      videoPrompt: reel.video_prompt,
      variations: reel.variations,
      algorithmObjective: reel.algorithm_objective,
    };
    
    setCurrentFormData({
      businessType: reel.business_type,
      painPoint: reel.pain_point,
      objective: reel.objective,
      tone: reel.tone,
    });
    
    setOutput(transformedOutput);
    setSearchParams({ tab: "generate" });
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
          {user ? (
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Gerar Reel
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Meus Reels
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate">
                {output ? (
                  <ReelOutput 
                    output={output} 
                    onReset={handleReset} 
                    formData={currentFormData}
                  />
                ) : (
                  <ReelForm onSubmit={handleSubmit} isLoading={isLoading} />
                )}
              </TabsContent>

              <TabsContent value="saved">
                <div className="w-full max-w-4xl mx-auto">
                  <SavedReelsList onSelectReel={handleSelectSavedReel} />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <>
              {output ? (
                <ReelOutput 
                  output={output} 
                  onReset={handleReset} 
                  formData={currentFormData}
                />
              ) : (
                <ReelForm onSubmit={handleSubmit} isLoading={isLoading} />
              )}
            </>
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
