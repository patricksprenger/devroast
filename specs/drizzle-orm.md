# Especificação: Implementação do Drizzle ORM e Banco de Dados

Este documento detalha a especificação para a implementação do Drizzle ORM com PostgreSQL, incluindo a estrutura do banco de dados, enums e o plano de implantação utilizando Docker Compose.

## 1. Visão Geral do Banco de Dados

O banco de dados do **DevRoast** será responsável por armazenar os usuários, os códigos submetidos (roasts), as análises detalhadas (issues) e as sugestões de melhoria (diffs).

## 2. Decisões de Projeto

1. **Autenticação**: Como o serviço de auth ainda não foi definido, manteremos uma tabela de `users` simplificada. Ela servirá para identificar autores no Leaderboard e permitir futuras integrações com serviços de OAuth ou JWT.
2. **Privacidade**: Adicionada a flag `is_private` na tabela `roasts`. Se `true`, o roast não aparecerá no Leaderboard global, sendo acessível apenas via link direto (ou pelo próprio usuário se logado).
3. **Deleção**: Não utilizaremos Soft Delete. A remoção de registros será física para manter o banco enxuto e evitar complexidade desnecessária nesta fase.

---

## 3. Tabelas e Esquema (Drizzle ORM)

### 3.1 Enums
- **LanguageEnum**: `['javascript', 'typescript', 'python', 'rust', 'go', 'cpp', 'html', 'css', 'other']`
- **SeverityEnum**: `['critical', 'warning', 'good', 'info']`
- **RoastModeEnum**: `['technical', 'sarcasm']`

### 3.2 Tabelas

#### `users`
- `id`: uuid (primary key, default random)
- `username`: varchar(50) (unique, not null)
- `email`: varchar(255) (unique, not null)
- `avatar_url`: text
- `created_at`: timestamp (default now)
- `updated_at`: timestamp (default now)

#### `roasts`
- `id`: uuid (primary key, default random)
- `user_id`: uuid (foreign key referencing `users.id`, nullable para roasts anônimos)
- `code`: text (not null)
- `language`: language_enum (not null)
- `score`: decimal(3, 1) (not null)
- `verdict`: varchar(100) (not null)
- `roast_quote`: text (not null)
- `mode`: roast_mode_enum (default 'sarcasm')
- `is_private`: boolean (default false)
- `created_at`: timestamp (default now)

#### `roast_issues`
- `id`: uuid (primary key, default random)
- `roast_id`: uuid (foreign key referencing `roasts.id`, cascade delete)
- `title`: varchar(255) (not null)
- `description`: text (not null)
- `severity`: severity_enum (not null)
- `line_number`: integer (nullable)
- `created_at`: timestamp (default now)

#### `roast_diffs`
- `id`: uuid (primary key, default random)
- `roast_id`: uuid (foreign key referencing `roasts.id`, cascade delete)
- `original_code`: text (not null)
- `improved_code`: text (not null)
- `explanation`: text (not null)
- `created_at`: timestamp (default now)

---

## 4. Docker Compose (PostgreSQL)

Arquivo `docker-compose.yml` sugerido na raiz do projeto:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-devroast}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 5. Configuração do Projeto

### Dependências
- `drizzle-orm`
- `postgres` (driver)
- `dotenv`
- `drizzle-kit` (dev dependency para migrações)

### Variáveis de Ambiente (`.env`)
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/devroast
```

---

## 6. To-dos para Implantação

- [ ] Criar arquivo `docker-compose.yml` para o PostgreSQL.
- [ ] Instalar dependências (`npm install drizzle-orm postgres` e `npm install -D drizzle-kit`).
- [ ] Configurar o arquivo `drizzle.config.ts` na raiz.
- [ ] Criar a estrutura de pastas `src/db` e `src/db/schema`.
- [ ] Definir o esquema completo em `src/db/schema/index.ts` seguindo esta especificação.
- [ ] Criar o cliente do Drizzle em `src/db/index.ts`.
- [ ] Executar o comando de push/migração do Drizzle para criar as tabelas no banco.
- [ ] Validar a conexão realizando um teste simples de inserção.
