## XP Hub

Aplicação Next.js para organizar experiências (XP) com autenticação via Google SSO.

## Requisitos

- Node.js 18+
- npm
- Conta Firebase com OAuth Google habilitado

## Instalação

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Variáveis de ambiente

Crie um arquivo `.env` baseado em `.env.example` com as credenciais do Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Todas as chaves são públicas porque o Firebase é consumido no cliente.

## Google SSO

- O módulo `src/infra/firebase/` centraliza a configuração do Firebase e do `GoogleAuthProvider`.
- `useAuth` expõe `signInWithGoogle`, que cria/busca usuários locais através de `user-service`.
- O botão principal da landing (`HomePage`) dispara o fluxo de login e redireciona para `/app` após sucesso.

## Estrutura de rotas

- Arquivos de rota em `app/**/page.tsx` apenas importam componentes de `src/routes`.
- Componentes completos das páginas permanecem em `src/routes/*`.
