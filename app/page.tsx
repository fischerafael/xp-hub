import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Bem-vindo ao <span className="text-primary">Exp Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Uma plataforma moderna e poderosa para transformar suas ideias em
            realidade. Construído com Next.js, Tailwind CSS e shadcn/ui.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="w-full sm:w-auto">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Recursos Principais
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tudo que você precisa para criar aplicações incríveis
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Performance</CardTitle>
                <CardDescription>
                  Construído com Next.js para máxima performance e otimização
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Aproveite o poder do React Server Components e otimizações
                  automáticas para criar aplicações rápidas e eficientes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 Design Moderno</CardTitle>
                <CardDescription>
                  Interface bonita e responsiva com Tailwind CSS e shadcn/ui
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Componentes acessíveis e customizáveis que seguem as melhores
                  práticas de design e UX.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Fácil de Usar</CardTitle>
                <CardDescription>
                  Configuração simples e desenvolvimento ágil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comece a desenvolver rapidamente com uma stack moderna e
                  ferramentas prontas para uso.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 Responsivo</CardTitle>
                <CardDescription>
                  Funciona perfeitamente em todos os dispositivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Design adaptativo que garante uma experiência perfeita em
                  desktop, tablet e mobile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌙 Modo Escuro</CardTitle>
                <CardDescription>
                  Suporte nativo para tema claro e escuro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Interface que se adapta automaticamente às preferências do
                  usuário com suporte completo a dark mode.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 TypeScript</CardTitle>
                <CardDescription>Type-safe desde o início</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Desenvolvimento mais seguro e produtivo com TypeScript
                  configurado e pronto para uso.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Pronto para começar?</CardTitle>
              <CardDescription className="text-base">
                Junte-se a nós e comece a construir algo incrível hoje mesmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" className="mt-4">
                Começar Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
