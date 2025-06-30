
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Check, X, Shield, AlertTriangle, MessageCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  name: string;
  whatsapp: string;
  role: string;
  verified: boolean;
}

const Index = () => {
  const [inputNumber, setInputNumber] = useState("");
  const [validationResult, setValidationResult] = useState<'trusted' | 'suspicious' | null>(null);
  const [foundMember, setFoundMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // Dados mockados da equipe de suporte
  const trustedTeam: TeamMember[] = [
    { name: "Maria Silva", whatsapp: "11999887766", role: "Supervisora de Suporte", verified: true },
    { name: "João Santos", whatsapp: "11988776655", role: "Analista Senior", verified: true },
    { name: "Ana Costa", whatsapp: "11977665544", role: "Analista Pleno", verified: true },
    { name: "Pedro Lima", whatsapp: "11966554433", role: "Analista Junior", verified: true },
    { name: "Carla Oliveira", whatsapp: "11955443322", role: "Coordenadora", verified: true },
  ];

  const formatWhatsAppNumber = (number: string) => {
    // Remove tudo que não é número
    const cleanNumber = number.replace(/\D/g, '');
    
    // Formata o número no padrão brasileiro
    if (cleanNumber.length === 11) {
      return cleanNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanNumber.length === 10) {
      return cleanNumber.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return cleanNumber;
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

    const member = trustedTeam.find(member => 
      member.whatsapp.replace(/\D/g, '') === cleanInput
    );

    if (member) {
      setValidationResult('trusted');
      setFoundMember(member);
      toast({
        title: "✅ Número Confiável",
        description: `Este número pertence a ${member.name} da equipe`,
      });
    } else {
      setValidationResult('suspicious');
      setFoundMember(null);
      toast({
        title: "⚠️ Número Suspeito",
        description: "Este número NÃO pertence à nossa equipe",
        variant: "destructive"
      });
    }
  };

  const reportSuspiciousNumber = () => {
    toast({
      title: "Número Reportado",
      description: "O número suspeito foi reportado para a supervisão. Eles tomarão as medidas necessárias.",
    });
    
    // Aqui você poderia integrar com um sistema de tickets ou email
    console.log(`Número suspeito reportado: ${inputNumber}`);
  };

  const clearValidation = () => {
    setInputNumber("");
    setValidationResult(null);
    setFoundMember(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">Validador WhatsApp</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Valide se um número de WhatsApp pertence à nossa equipe de suporte antes de confiar em ofertas nos grupos
          </p>
        </div>

        {/* Validador Principal */}
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Validar Número
            </CardTitle>
            <CardDescription>
              Digite o número de WhatsApp que você deseja validar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: (11) 99999-9999"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && validateNumber()}
              />
              <Button 
                onClick={validateNumber} 
                className="bg-green-600 hover:bg-green-700"
                disabled={!inputNumber.trim()}
              >
                Validar
              </Button>
              {validationResult && (
                <Button 
                  onClick={clearValidation} 
                  variant="outline"
                >
                  Limpar
                </Button>
              )}
            </div>

            {/* Resultado da Validação */}
            {validationResult === 'trusted' && foundMember && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-semibold text-green-800">
                      ✅ Número CONFIÁVEL - Membro da Equipe
                    </div>
                    <div className="text-sm text-green-700">
                      <strong>Nome:</strong> {foundMember.name}<br />
                      <strong>Cargo:</strong> {foundMember.role}<br />
                      <strong>WhatsApp:</strong> {formatWhatsAppNumber(foundMember.whatsapp)}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {validationResult === 'suspicious' && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="font-semibold text-red-800">
                      ⚠️ Número SUSPEITO - NÃO é da nossa equipe
                    </div>
                    <div className="text-sm text-red-700">
                      Este número não pertence à nossa equipe de suporte. Se alguém está se passando por membro da equipe, reporte imediatamente.
                    </div>
                    <Button 
                      onClick={reportSuspiciousNumber}
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                    >
                      🚨 Reportar Número Suspeito
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Lista da Equipe */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Equipe de Suporte Oficial
            </CardTitle>
            <CardDescription>
              Números verificados da nossa equipe de suporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {trustedTeam.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-800">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.role}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-mono text-sm text-gray-700">
                      {formatWhatsAppNumber(member.whatsapp)}
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Segurança */}
        <Card className="shadow-lg border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Dicas de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-gray-700">
              <div>• <strong>Sempre valide</strong> números antes de confiar em ofertas nos grupos</div>
              <div>• <strong>Nossa equipe nunca</strong> oferece produtos/serviços diretamente nos grupos</div>
              <div>• <strong>Em caso de dúvida</strong>, entre em contato com a supervisão</div>
              <div>• <strong>Reporte imediatamente</strong> qualquer número suspeito que se passe pela equipe</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
