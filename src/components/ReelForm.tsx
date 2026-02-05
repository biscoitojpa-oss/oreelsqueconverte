import { useState } from "react";
import { RadioCardGroup } from "./ui/radio-card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Sparkles, ArrowRight, Eye, ShoppingCart, Share2, Award, Target, Flame, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  businessType: string;
  painPoint: string;
  objective: string;
  tone: string;
}

interface ReelFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const painPointOptions = [
  { value: "nao_aparece", label: "Não aparece para ninguém", icon: <Eye className="w-4 h-4" /> },
  { value: "nao_vende", label: "Não vende o suficiente", icon: <ShoppingCart className="w-4 h-4" /> },
  { value: "concorrente", label: "Concorrente aparece mais", icon: <Share2 className="w-4 h-4" /> },
  { value: "trafego_pago", label: "Tráfego pago não funciona", icon: <Award className="w-4 h-4" /> },
];

const objectiveOptions = [
  { value: "alcance_frio", label: "Alcance frio (desconhecidos)", icon: <Target className="w-4 h-4" /> },
  { value: "salvamentos", label: "Salvamentos", icon: <Award className="w-4 h-4" /> },
  { value: "compartilhamentos", label: "Compartilhamentos", icon: <Share2 className="w-4 h-4" /> },
  { value: "autoridade", label: "Autoridade no nicho", icon: <Award className="w-4 h-4" /> },
];

const toneOptions = [
  { value: "direto", label: "Direto ao ponto", icon: <Target className="w-4 h-4" /> },
  { value: "polemico", label: "Polêmico", icon: <Flame className="w-4 h-4" /> },
  { value: "educativo", label: "Educativo prático", icon: <BookOpen className="w-4 h-4" /> },
];

export function ReelForm({ onSubmit, isLoading }: ReelFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    painPoint: "",
    objective: "",
    tone: "",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessType.trim().length > 0;
      case 2: return formData.painPoint !== "";
      case 3: return formData.objective !== "";
      case 4: return formData.tone !== "";
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessType" className="text-lg font-display font-semibold">
                Qual é o seu tipo de negócio?
              </Label>
              <p className="text-muted-foreground text-sm mt-1">
                Ex: clínica, imobiliária, loja, prestador de serviço
              </p>
            </div>
            <Input
              id="businessType"
              placeholder="Digite seu tipo de negócio..."
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="h-12 text-base bg-secondary border-border focus:border-primary"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-display font-semibold">
                Qual é a principal dor do seu negócio?
              </Label>
              <p className="text-muted-foreground text-sm mt-1">
                Selecione o problema que mais te afeta
              </p>
            </div>
            <RadioCardGroup
              value={formData.painPoint}
              onValueChange={(value) => setFormData({ ...formData, painPoint: value })}
              options={painPointOptions}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-display font-semibold">
                Qual é o objetivo do conteúdo?
              </Label>
              <p className="text-muted-foreground text-sm mt-1">
                O que você quer que esse Reel alcance?
              </p>
            </div>
            <RadioCardGroup
              value={formData.objective}
              onValueChange={(value) => setFormData({ ...formData, objective: value })}
              options={objectiveOptions}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg font-display font-semibold">
                Qual estilo de tom você prefere?
              </Label>
              <p className="text-muted-foreground text-sm mt-1">
                Como você quer se comunicar?
              </p>
            </div>
            <RadioCardGroup
              value={formData.tone}
              onValueChange={(value) => setFormData({ ...formData, tone: value })}
              options={toneOptions}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm transition-all ${
                s === step
                  ? "bg-primary text-primary-foreground glow-sm"
                  : s < step
                  ? "bg-primary/30 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 transition-all ${
                  s < step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
                Voltar
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="bg-gradient-primary hover:opacity-90 glow-sm"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={!canProceed() || isLoading}
                className="bg-gradient-primary hover:opacity-90 glow-sm"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Reel
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
