
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [inputNumber, setInputNumber] = useState("");
  const [validationResult, setValidationResult] = useState<'trusted' | 'suspicious' | null>(null);
  const { toast } = useToast();

  const formatWhatsAppNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length === 11) {
      return cleanNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanNumber.length === 10) {
      return cleanNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleanNumber;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsAppNumber(e.target.value);
    setInputNumber(formatted);
  };

  const validateNumber = () => {
    const cleanInput = inputNumber.replace(/\D/g, '');
    
    if (cleanInput.length < 10) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de WhatsApp válido",
        variant: "destructive"
      });
      return;
    }

    if (cleanInput === '41997053702') {
      setValidationResult('trusted');
      toast({
        title: "✅ Número Confiável",
        description: "Este número pertence à Equipe Jonas Kaz",
      });
    } else {
      setValidationResult('suspicious');
      toast({
        title: "⚠️ Número Suspeito",
        description: "Este número NÃO pertence à nossa equipe",
        variant: "destructive"
      });
    }
  };

  const clearValidation = () => {
    setInputNumber("");
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-6">
            Verifique a confiabilidade do Número de WhatsApp
          </h1>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white/90">
            <p className="text-lg leading-relaxed">
              Bem-vindo(a)! Utilize este formulário para verificar se o número de WhatsApp que entrou em contato pertence a um colaborador da <strong className="text-blue-300">Equipe Jonas Kaz</strong>.
            </p>
            <p className="mt-3 text-white/80">
              Basta digitar o número no campo abaixo e, em instantes, informaremos se ele é confiável e oficialmente utilizado por nossa empresa.
            </p>
          </div>
        </div>

        {/* Validador Principal */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-white text-2xl">
              <Shield className="h-6 w-6 text-blue-400" />
              Validador de Número
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: (11) 99999-9999"
                value={inputNumber}
                onChange={handleInputChange}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && validateNumber()}
              />
              <Button 
                onClick={validateNumber} 
                className="bg-blue-600 hover:bg-blue-700 px-8"
                disabled={!inputNumber.trim()}
              >
                Validar
              </Button>
              {validationResult && (
                <Button 
                  onClick={clearValidation} 
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Limpar
                </Button>
              )}
            </div>

            {/* Resultado da Validação */}
            {validationResult === 'trusted' && (
              <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
                <Check className="h-5 w-5 text-green-400" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="font-bold text-green-300 text-lg">
                      ✅ NÚMERO CONFIÁVEL - Membro da Equipe Jonas Kaz
                    </div>
                    <div className="text-green-200 bg-green-500/10 p-3 rounded">
                      Este número pertence oficialmente à <strong>Equipe Jonas Kaz</strong> e você pode confiar no contato.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {validationResult === 'suspicious' && (
              <Alert className="border-red-400/50 bg-red-500/20 backdrop-blur-sm">
                <X className="h-5 w-5 text-red-400" />
                <AlertDescription>
                  <div className="space-y-4">
                    <div className="font-bold text-red-300 text-lg">
                      ⚠️ NÚMERO SUSPEITO - NÃO é da Equipe Jonas Kaz
                    </div>
                    <div className="text-red-200 bg-red-500/10 p-3 rounded">
                      Este número não pertence à nossa equipe oficial. Se alguém está se passando por membro da Equipe Jonas Kaz, reporte imediatamente para nossos canais oficiais.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
