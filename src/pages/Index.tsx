
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, X, Shield, Settings, Plus, Trash2 } from "lucide-react";
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
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [trustedTeam, setTrustedTeam] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({ name: "", whatsapp: "", role: "" });
  const { toast } = useToast();

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTeam = localStorage.getItem('trustedTeam');
    if (savedTeam) {
      setTrustedTeam(JSON.parse(savedTeam));
    } else {
      // Dados iniciais
      const initialTeam: TeamMember[] = [
        { name: "Maria Silva", whatsapp: "11999887766", role: "Supervisora de Suporte", verified: true },
        { name: "João Santos", whatsapp: "11988776655", role: "Analista Senior", verified: true },
        { name: "Ana Costa", whatsapp: "11977665544", role: "Analista Pleno", verified: true },
      ];
      setTrustedTeam(initialTeam);
      localStorage.setItem('trustedTeam', JSON.stringify(initialTeam));
    }
  }, []);

  // Salvar dados no localStorage
  const saveTeamData = (team: TeamMember[]) => {
    setTrustedTeam(team);
    localStorage.setItem('trustedTeam', JSON.stringify(team));
  };

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

  const clearValidation = () => {
    setInputNumber("");
    setValidationResult(null);
    setFoundMember(null);
  };

  const handleAdminLogin = () => {
    if (adminPassword === "admin123") {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      toast({
        title: "Login Admin realizado",
        description: "Você agora pode gerenciar os números de confiança",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const addNewMember = () => {
    if (!newMember.name || !newMember.whatsapp || !newMember.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const newTeamMember: TeamMember = {
      ...newMember,
      verified: true,
    };

    const updatedTeam = [...trustedTeam, newTeamMember];
    saveTeamData(updatedTeam);
    setNewMember({ name: "", whatsapp: "", role: "" });
    
    toast({
      title: "Membro adicionado",
      description: `${newMember.name} foi adicionado à equipe`,
    });
  };

  const removeMember = (index: number) => {
    const memberName = trustedTeam[index].name;
    const updatedTeam = trustedTeam.filter((_, i) => i !== index);
    saveTeamData(updatedTeam);
    
    toast({
      title: "Membro removido",
      description: `${memberName} foi removido da equipe`,
    });
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
          
          {/* Admin Button */}
          <Button 
            onClick={() => setShowAdminLogin(!showAdminLogin)}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>

        {/* Admin Login */}
        {showAdminLogin && !isAdminMode && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Login Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Digite a senha admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button onClick={handleAdminLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                Entrar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Admin Panel */}
        {isAdminMode && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Painel Administrativo</CardTitle>
              <CardDescription className="text-white/70">
                Gerencie os números de confiança da equipe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Member */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nome"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  placeholder="WhatsApp"
                  value={newMember.whatsapp}
                  onChange={(e) => setNewMember({...newMember, whatsapp: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Input
                  placeholder="Cargo"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button onClick={addNewMember} className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Membro
              </Button>

              {/* Team List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trustedTeam.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="text-white">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-white/70">{formatWhatsAppNumber(member.whatsapp)} - {member.role}</div>
                    </div>
                    <Button
                      onClick={() => removeMember(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setIsAdminMode(false)} 
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Sair do Admin
              </Button>
            </CardContent>
          </Card>
        )}

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
            {validationResult === 'trusted' && foundMember && (
              <Alert className="border-green-400/50 bg-green-500/20 backdrop-blur-sm">
                <Check className="h-5 w-5 text-green-400" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div className="font-bold text-green-300 text-lg">
                      ✅ NÚMERO CONFIÁVEL - Membro da Equipe Jonas Kaz
                    </div>
                    <div className="text-green-200 bg-green-500/10 p-3 rounded">
                      <strong>Nome:</strong> {foundMember.name}<br />
                      <strong>Cargo:</strong> {foundMember.role}<br />
                      <strong>WhatsApp:</strong> {formatWhatsAppNumber(foundMember.whatsapp)}
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
