# Guia de publicação externa: Git, Vercel e Supabase

**Projeto:** Modelo Dinâmico Educacional  
**Escopo deste guia:** versionamento, implantação e migração de infraestrutura.  
**Atualizado em:** 17 de agosto de 2026.

> **Decisão técnica central:** a aplicação atual é um sistema full-stack com React/Vite, Node/Express, tRPC, Drizzle em dialeto MySQL e autenticação OAuth específica da plataforma atual. Portanto, a ida para Vercel e Supabase deve ser tratada como uma **migração de runtime, banco e autenticação**, e não como simples cópia de arquivos ou alteração de `DATABASE_URL`.

## 1. Estado atual do projeto

O repositório contém uma aplicação de colaboração educacional para MBA. O professor define diretriz e quatro metas; os grupos trabalham em ciclos independentes de KIT, FCS, KIQs, hipóteses, evidências e memo. As respostas alimentam indicadores de progresso e robustez, incluindo um painel coletivo que não expõe documentos textuais ou contatos.

| Camada | Implementação atual | Consequência para a migração |
| --- | --- | --- |
| Interface | React 19, Vite, Tailwind 4, Wouter e Recharts. | Pode permanecer como SPA no Vercel. |
| API | Express + tRPC em um servidor Node único. | Deve ser convertida para Vercel Functions, ou separada em um serviço Node externo. |
| Banco | Drizzle ORM, `mysql2`, dialeto `mysql`. | Deve ser convertido para PostgreSQL/Supabase; os drivers e o esquema mudam. |
| Autenticação docente | OAuth e cookies específicos da plataforma atual. | Deve ser substituída por Supabase Auth ou por outro provedor externo. |
| Acesso de grupos | Código aleatório de grupo validado no servidor. | Deve continuar a ser validado somente no backend; não exponha workspaces diretamente ao cliente. |
| Hospedagem atual | Gerenciada, com URL pública e publicação por checkpoint. | Já está operacional; Vercel é uma opção externa que exige adaptação. |

As rotas funcionais atuais são `/` para o professor, `/grupos` para cadastro/acesso dos grupos, `/grupos/evolucao` para o dashboard coletivo e `/demo` para uma apresentação isolada.

## 2. Estratégia recomendada de migração

O caminho de menor risco é manter a aplicação atual como referência funcional e criar uma ramificação de migração. Assim, o ambiente em produção continua disponível caso a implantação externa exija ajustes.

| Fase | Resultado | Critério de saída |
| --- | --- | --- |
| A. Git | Repositório remoto privado e histórico inicial. | `pnpm check`, `pnpm test` e `pnpm build` passam no clone limpo. |
| B. Supabase | Banco PostgreSQL, RLS e autenticação docente definidos. | O esquema é aplicado e a importação é validada por contagens. |
| C. API | Rotas tRPC/Express adaptadas para funções serverless ou API externa. | Cadastro de grupo, salvamento e painel docente funcionam sem dependências específicas da plataforma atual. |
| D. Vercel | Preview e produção com variáveis configuradas. | Rotas SPA, API, login e persistência passam no checklist de aceite. |

> A hospedagem integrada do projeto já oferece publicação gerenciada e domínio próprio. Ao escolher Vercel, mantenha a implantação atual até concluir os testes de aceitação; isso reduz o risco de indisponibilidade durante a migração.

## 3. Preparação e publicação no Git

### 3.1 Higiene antes do primeiro envio

Revise `.gitignore` e confirme que ele exclui `node_modules/`, `dist/`, `.env*`, logs e arquivos de editor. **Nunca** inclua os valores efetivos de `DATABASE_URL`, chaves do Supabase, credenciais de OAuth ou cookies de sessão. Use apenas o inventário sem segredos em [`ENVIRONMENT_TEMPLATE.md`](./ENVIRONMENT_TEMPLATE.md).

No diretório raiz do projeto, execute os comandos abaixo. Troque os identificadores entre colchetes pelos valores da sua conta.

```bash
cd /caminho/para/modelo-dinamico-educacional
pnpm install --frozen-lockfile
pnpm run check
pnpm test
pnpm run build

git init
git add .
git status
git commit -m "chore: versão inicial do Modelo Dinâmico Educacional"

# Exemplo com GitHub CLI; também é possível criar o repositório pela interface web.
gh repo create [ORGANIZACAO_OU_USUARIO]/modelo-dinamico-educacional --private --source=. --remote=origin --push
```

Após o primeiro envio, trabalhe em uma ramificação exclusiva para a migração:

```bash
git checkout -b migration/supabase-vercel
git push -u origin migration/supabase-vercel
```

### 3.2 Fluxo de trabalho recomendado

| Evento | Ação mínima | Evidência esperada |
| --- | --- | --- |
| Nova funcionalidade | Abrir branch, escrever/atualizar teste e criar pull request. | Pipeline verde e revisão. |
| Alteração de banco | Criar migração SQL versionada e plano de rollback. | Migração aplicada em staging. |
| Alteração de segredo | Atualizar no painel do provedor; nunca em Git. | Variável configurada em Preview e Production. |
| Publicação | Revisar variáveis, rotas e dados de teste. | URL de preview aprovada antes da produção. |

## 4. Migração para Supabase

### 4.1 Criar o projeto e aplicar o esquema

Crie um projeto Supabase PostgreSQL e salve as credenciais em local seguro. Em um projeto de desenvolvimento vazio, abra o **SQL Editor**, revise e aplique [`supabase/0001_schema.sql`](./supabase/0001_schema.sql). O esquema usa `jsonb` para o dossiê e para as métricas, `timestamptz` para datas e RLS ativada em todas as tabelas de domínio.

O arquivo mantém `student_groups`, `group_members` e `group_workspaces` separados. Essa separação preserva a regra pedagógica e de privacidade: o dashboard coletivo deve retornar apenas `name`, `progress`, `quality_score`, `quality_level` e métricas agregadas, nunca contatos, códigos de acesso ou documentos de outro grupo.

### 4.2 Converter banco e dados

A origem atual é MySQL/TiDB e o destino é Postgres. A documentação oficial do Supabase descreve migração de MySQL via ferramenta de migração ou `pgloader`; para conexões pooladas, indica o modo **Session** no destino. [3]

Antes de qualquer cópia, faça backup lógico e registre as contagens atuais:

```sql
select 'learning_activities' as tabela, count(*) from learning_activities
union all select 'student_groups', count(*) from student_groups
union all select 'group_members', count(*) from group_members
union all select 'group_workspaces', count(*) from group_workspaces;
```

Para este projeto, **não execute uma migração MySQL→Postgres cegamente em produção**. As diferenças de dialeto incluem `int autoincrement`, `mysqlEnum`, JSON em texto, `timestamp` e o campo `ownerId`. O roteiro seguro é: criar o esquema Postgres, transformar dados em staging, importar tabelas em ordem de dependência e reconciliar as contagens e amostras antes da troca.

| Ordem | Origem | Destino | Conversão necessária |
| --- | --- | --- | --- |
| 1 | `users` | `auth.users` + `profiles` | Não migre tokens/sessões. Recrie logins e associe professores ao novo `uuid`. |
| 2 | `learning_activities` | `learning_activities` | `contractJson` e `goalsJson` tornam-se `jsonb`; `isActive` torna-se booleano. |
| 3 | `student_groups` | `student_groups` | Manter código, nome, status e chave da atividade. |
| 4 | `group_members` | `group_members` | Importar sob acesso restrito; contém e-mail e telefone. |
| 5 | `group_workspaces` | `group_workspaces` | `documentJson` e `metricsJson` tornam-se `jsonb`; validar percentuais entre 0 e 100. |

### 4.3 Autenticação e autorização

Use **Supabase Auth** para professor e co-professores. O Supabase emite JWTs e integra autorização de banco via Row Level Security (RLS). [4] Para este produto, a recomendação é manter os grupos com código de acesso, mas validar esse código exclusivamente em uma função de servidor; não exponha uma tabela consultável por uma chave de grupo no navegador.

| Perfil | Mecanismo | Acesso permitido |
| --- | --- | --- |
| Professor | Supabase Auth, `profiles.role` em `teacher` ou `admin`. | Configuração, dados completos dos próprios grupos e dashboard docente. |
| Grupo | Código de acesso enviado a uma API server-side. | Somente seu workspace, seus integrantes e o painel coletivo agregado. |
| Dashboard coletivo | API server-side filtrada. | Apenas nome do grupo e indicadores agregados. |
| Navegador | `VITE_SUPABASE_ANON_KEY` com RLS ativo. | Autenticação e leituras explicitamente autorizadas. |

**Nunca** disponibilize `SUPABASE_SERVICE_ROLE_KEY` ou a string `DATABASE_URL` no cliente. A chave de serviço deve ficar apenas em Vercel Functions ou em outro backend confiável. Mesmo com RLS, mantenha validações de dono, código de grupo e limites de seis grupos na API.

### 4.4 Adaptações de código necessárias

| Arquivo/área atual | Alteração necessária |
| --- | --- |
| `drizzle/schema.ts` | Converter `mysqlTable` e tipos MySQL para `pgTable`, `uuid`, `jsonb`, `boolean` e `timestamp(..., { withTimezone: true })`, ou substituir Drizzle por `@supabase/supabase-js`. |
| `drizzle.config.ts` | Alterar `dialect: "mysql"` para `dialect: "postgresql"` e usar a URL Postgres do Supabase. |
| `server/db.ts` | Substituir `mysql2` por driver Postgres/cliente Supabase e manter validação de código de grupo no servidor. |
| `server/_core/oauth.ts` | Substituir Manus OAuth por Supabase Auth; configurar URLs de redirecionamento para Preview e Production. |
| `server/routers.ts` | Preservar contratos tRPC ou mover rotas para Vercel Functions; manter `protectedProcedure` equivalente para professor. |
| `server/_core/storageProxy.ts` | Remover a dependência de storage da plataforma atual ou trocar por Supabase Storage, se houver anexos no futuro. |

## 5. Implantação no Vercel

### 5.1 Limite do runtime atual

O Vercel reconhece projetos Vite e oferece suporte a variáveis no build; variáveis expostas ao Vite precisam de prefixo `VITE_`. [1] Entretanto, a aplicação atual não é somente uma SPA Vite: ela inicia um Express server, oferece tRPC em `/api/trpc` e possui callback de OAuth. Portanto, publicar o repositório atual como “Vite” no Vercel serviria apenas os arquivos estáticos e quebraria cadastro, salvamento, dashboard e autenticação.

Escolha uma destas arquiteturas antes de criar o projeto Vercel:

| Opção | Descrição | Recomendação |
| --- | --- | --- |
| **A. Vite + Vercel Functions** | Manter React/Vite e converter operações de servidor para funções em `api/`. | **Recomendada** para este produto. |
| B. Next.js | Migrar front, rotas e autenticação para um framework full-stack. | Válida, porém exige refatoração visual e de rotas maior. |
| C. Backend Node separado | Deixar Vite no Vercel e hospedar Express em outro provedor. | Útil apenas se houver necessidade concreta de servidor persistente. |

### 5.2 Passo a passo para Vite + Functions

1. Instale `@supabase/supabase-js` e, se mantiver tRPC, o adaptador apropriado para um handler HTTP serverless.
2. Mova cada endpoint sensível para `api/`, mantendo segredos somente no runtime da função. Sugestão: `api/groups/register.ts`, `api/groups/workspace.ts`, `api/groups/progress.ts`, `api/teacher/activity.ts` e `api/teacher/dashboard.ts`.
3. Atualize o cliente para chamar esses endpoints ou mantenha tRPC sob uma função única em `api/trpc/[trpc].ts`.
4. Remova o bootstrap que inicia `Express.listen()` no ambiente Vercel; cada Function recebe a requisição individualmente.
5. Adicione fallback de SPA após confirmar que as rotas de API continuam prioritárias. Para uma SPA Vite, o Vercel documenta o rewrite para `/index.html`, necessário para deep links como `/grupos` e `/grupos/evolucao`. [1]

Modelo a adaptar após a criação das Functions:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5.3 Configuração do projeto no Vercel

Conecte o repositório Git e selecione a raiz do repositório como **Root Directory**, pois o projeto possui `package.json` no diretório raiz. Caso a estrutura mude para monorepo, o Vercel permite selecionar uma raiz por projeto antes do deploy. [2]

Configure as variáveis em **Settings → Environment Variables** para `Development`, `Preview` e `Production`.

| Variável | Vite/client | Function/servidor | Observação |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Sim | Opcional | URL pública do projeto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Sim | Opcional | Aceitável no cliente somente com RLS correto. |
| `SUPABASE_URL` | Não | Sim | Equivalente server-side. |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Sim | Segredo; não usar prefixo `VITE_`. |
| `DATABASE_URL` | Não | Opcional | Apenas se o backend usar ORM/driver Postgres direto. |
| `APP_ORIGIN` | Não | Sim | URL do Preview ou Production, conforme ambiente. |

Depois de configurar variáveis, faça deploy de preview a partir da branch `migration/supabase-vercel`. Só promova a branch principal após validar todos os fluxos.

## 6. Checklist de aceitação antes da produção

| Área | Verificação |
| --- | --- |
| Build | `pnpm install --frozen-lockfile`, `pnpm run check`, `pnpm test` e `pnpm run build` passam em clone limpo. |
| Rotas | `/`, `/grupos`, `/grupos/evolucao` e `/demo` não retornam 404 ao recarregar. |
| Professor | Login, assunção da turma, rascunho, publicação e edição das quatro metas funcionam. |
| Grupo | Cadastro, geração de código, reentrada, autosave e dossiê por meta funcionam. |
| Privacidade | Um grupo não vê respostas, contatos, documentos ou código de outro grupo. |
| Supabase | RLS ativa; não há `service_role` no frontend; contagens e amostras de migração reconciliadas. |
| Vercel | Preview usa variáveis de Preview; Production usa variáveis de Production; logs de Function sem segredos. |
| Rollback | A versão atual continua disponível até que o domínio externo seja aprovado. |

## 7. Operação após a implantação

Estabeleça backups do Postgres, revise políticas RLS sempre que criar uma nova tabela e mantenha migrações SQL versionadas. Antes de alterar o cálculo de robustez, adicione testes de unidade para as métricas, pois elas orientam a leitura pedagógica do professor.

Para atualização quase imediata do painel coletivo, comece com polling com intervalo curto, como a versão atual. Só adote Supabase Realtime após validar que o benefício pedagógico justifica a complexidade adicional e que a publicação das tabelas respeita as políticas de privacidade.

## Referências

[1] [Vercel — Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)  
[2] [Vercel — Using Monorepos](https://vercel.com/docs/monorepos)  
[3] [Supabase — Migrate from MySQL to Supabase](https://supabase.com/docs/guides/platform/migrating-to-supabase/mysql)  
[4] [Supabase — Auth](https://supabase.com/docs/guides/auth)
