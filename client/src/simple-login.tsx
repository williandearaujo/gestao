import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building } from "lucide-react";
import { useSignIn, useSession } from "@clerk/clerk-react";

interface SimpleLoginProps {
  onLogin: (user: any) => void;
}

export function SimpleLogin({ onLogin }: SimpleLoginProps) {
  const { signIn, setActive } = useSignIn();
  const { isSignedIn, isLoaded } = useSession();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: username,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onLogin(result?.createdUserId || username);
      } else {
        setError("⚠️ Verificação adicional necessária.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  // Enquanto o estado da sessão não estiver carregado, não renderiza nada
  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Building className="text-primary-foreground" size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">OL Tecnologia</CardTitle>
          <p className="text-gray-600 dark:text-gray-400">Acesse seu painel de gestão</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu nome de usuário"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-4 flex flex-col items-center gap-2 text-sm">
            <Button
              variant="link"
              className="text-blue-600 dark:text-blue-400"
              onClick={() => (window.location.href = "/sign-up")}
            >
              Cadastrar novo usuário
            </Button>
            <Button
              variant="link"
              className="text-blue-600 dark:text-blue-400"
              onClick={() => (window.location.href = "/sign-in")}
            >
              Esqueci minha senha
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Credenciais padrão:</p>
            <p>
              Usuário:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                admin
              </code>
            </p>
            <p>
              Senha:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                admin123
              </code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
