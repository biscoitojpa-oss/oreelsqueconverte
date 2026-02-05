import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Film, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SavedReel {
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
  variations: {
    alternativeHooks: string[];
    alternativeClosings: string[];
    controversialVersion: string;
  };
  algorithm_objective: string;
  created_at: string;
}

interface SavedReelsListProps {
  onSelectReel: (reel: SavedReel) => void;
}

export function SavedReelsList({ onSelectReel }: SavedReelsListProps) {
  const [reels, setReels] = useState<SavedReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchReels();
    }
  }, [user]);

  const fetchReels = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_reels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedReels = (data || []).map((reel) => ({
        id: reel.id,
        title: reel.title,
        business_type: reel.business_type,
        pain_point: reel.pain_point,
        objective: reel.objective,
        tone: reel.tone,
        script: reel.script as SavedReel["script"],
        screen_text: reel.screen_text as SavedReel["screen_text"],
        video_prompt: reel.video_prompt,
        variations: reel.variations as SavedReel["variations"],
        algorithm_objective: reel.algorithm_objective,
        created_at: reel.created_at,
      }));
      
      setReels(transformedReels);
    } catch (error) {
      console.error("Error fetching reels:", error);
      toast.error("Erro ao carregar Reels salvos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("saved_reels")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setReels(reels.filter((reel) => reel.id !== id));
      toast.success("Reel excluído com sucesso");
    } catch (error) {
      console.error("Error deleting reel:", error);
      toast.error("Erro ao excluir Reel");
    } finally {
      setDeletingId(null);
    }
  };

  const painPointLabels: Record<string, string> = {
    "no-visibility": "Não aparece",
    "no-sales": "Não vende",
    "competitor": "Concorrência forte",
    "paid-traffic": "Tráfego pago falha",
  };

  const objectiveLabels: Record<string, string> = {
    "cold-reach": "Alcance Frio",
    "saves": "Salvamentos",
    "shares": "Compartilhamentos",
    "authority": "Autoridade",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="text-center py-12">
        <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Nenhum Reel salvo ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Gere seu primeiro Reel e salve para acessar depois
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-display font-semibold text-foreground">
        Seus Reels Salvos ({reels.length})
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {reels.map((reel, index) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer group"
            onClick={() => onSelectReel(reel)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">
                  {reel.title || reel.business_type}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(reel.created_at), "d 'de' MMMM, HH:mm", { locale: ptBR })}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {objectiveLabels[reel.objective] || reel.objective}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {painPointLabels[reel.pain_point] || reel.pain_point}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectReel(reel);
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(reel.id);
                  }}
                  disabled={deletingId === reel.id}
                >
                  {deletingId === reel.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
              {reel.script.hook}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
