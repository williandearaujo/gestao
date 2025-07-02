import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { Building } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);
    
    try {
      const success = await login(data.username, data.password);
      if (!success) {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      setError("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                {...form.register("username")}
                placeholder="Digite seu nome de usuário"
                className={form.formState.errors.username ? "border-red-500" : ""}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                placeholder="Digite sua senha"
                className={form.formState.errors.password ? "border-red-500" : ""}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Credenciais padrão:</p>
            <p>Usuário: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">admin</code></p>
            <p>Senha: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">admin123</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
