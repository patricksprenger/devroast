# Especificação: Implementação do tRPC

Este documento detalha a integração do tRPC no DevRoast para fornecer uma camada de API com tipagem fim-a-fim, integrada ao Next.js App Router e TanStack Query.

## Contexto
O tRPC permite construir APIs seguras em termos de tipos sem a necessidade de geração de código ou esquemas JSON. No DevRoast, ele servirá como a ponte entre o banco de dados (Drizzle) e a UI, garantindo que mudanças no schema do backend sejam refletidas instantaneamente no frontend.

## Especificação Técnica

### 1. Dependências Principais
- `@trpc/server`, `@trpc/client`, `@trpc/react-query`
- `@tanstack/react-query`
- `zod` (para validação de inputs)
- `superjson` (para suporte a Date/Map/Set no transporte)

### 2. Estrutura de Pastas
- `src/server/`: Lógica de backend (routers, procedures, context).
- `src/trpc/`: Configuração dos clientes para Server e Client Components.
- `src/app/api/trpc/[trpc]/`: Endpoint HTTP para requisições do cliente.

### 3. Padrões de Uso
- **Server Components**: Utilizar chamadas diretas via `t.createCallerFactory` ou utilitários que evitem chamadas HTTP desnecessárias.
- **Client Components**: Hooks padrão do `@trpc/react-query`.

## Decisões de Projeto

1. **React Query v5**: Utilizaremos a versão mais recente para aproveitar o suporte a Suspense e melhor performance em Server Components.
2. **Contexto**: O contexto do tRPC deve incluir a sessão do usuário (quando disponível) e a instância do banco de dados Drizzle.
3. **Error Formatting**: Implementar um formatador de erros customizado para esconder detalhes sensíveis em produção.

## To-dos para Implementação

- [ ] Instalar dependências (`@trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod superjson`).
- [ ] Configurar o core em `src/server/trpc.ts` (initTRPC).
- [ ] Definir o router raiz em `src/server/root.ts`.
- [ ] Criar o handler da API em `src/app/api/trpc/[trpc]/route.ts`.
- [ ] Configurar o cliente para RSC em `src/trpc/server.ts` usando `next/headers`.
- [ ] Configurar o cliente para Client Components em `src/trpc/client.tsx`.
- [ ] Envolver a aplicação com o Provider do tRPC no `layout.tsx`.
- [ ] Implementar um procedure `healthCheck` para testar a conexão.
