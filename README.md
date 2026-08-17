# Modelo Dinâmico Educacional

Aplicação colaborativa para uma atividade de **Inteligência de Mercado em MBA**. O professor configura a diretriz e quatro metas; até seis grupos se cadastram, constroem um dossiê por meta e acompanham indicadores de progresso e robustez.

> O fluxo pedagógico é: **diretriz → meta → KIT → hipóteses → FCS → KIQs → evidências → memo executivo**.

## Funcionalidades

| Perfil | Funcionalidades |
| --- | --- |
| Professor | Assume a turma, configura diretriz e quatro metas, libera os grupos e acompanha indicadores e lacunas. |
| Grupo | Cadastra integrantes, recebe código de acesso, trabalha em ciclos independentes por meta e vê a evolução coletiva preservando a privacidade. |
| Demonstração | Rota isolada com caso fictício e indicadores prontos para apresentação. |

## Rotas

| Rota | Uso |
| --- | --- |
| `/` | Painel do professor. |
| `/grupos` | Cadastro e acesso de grupos. |
| `/grupos/evolucao` | Comparativo agregado da turma; requer código de grupo. |
| `/demo` | Apresentação isolada com dados fictícios. |

## Desenvolvimento local

```bash
pnpm install
pnpm run dev
pnpm run check
pnpm test
pnpm run build
```

## Arquitetura atual

O projeto usa React/Vite no cliente, Express/tRPC no servidor, Drizzle ORM em MySQL e autenticação OAuth da plataforma de origem. A estrutura principal é:

```text
client/       # Interface React
server/       # API tRPC, regras de domínio e persistência
drizzle/      # Esquema e migrações MySQL atuais
shared/       # Cálculo de qualidade e tipos compartilhados
docs/         # Guias de publicação externa e migração
```

## Publicação externa

O guia de Git, Vercel e Supabase está em [`docs/DEPLOYMENT_GIT_VERCEL_SUPABASE.md`](./docs/DEPLOYMENT_GIT_VERCEL_SUPABASE.md). Ele explica por que a aplicação exige refatoração antes de uma publicação externa e fornece o esquema PostgreSQL de referência em [`docs/supabase/0001_schema.sql`](./docs/supabase/0001_schema.sql).

## Privacidade

O dashboard coletivo projeta somente indicadores agregados. Contatos dos integrantes, códigos de acesso e documentos de outros grupos não são retornados ao grupo conectado. A regra é coberta por teste automatizado.

## Validação

O projeto possui testes de atividade, qualidade, autorização do professor e privacidade do painel coletivo. O registro de validações funcionais está em [`QA_NOTES.md`](./QA_NOTES.md).
