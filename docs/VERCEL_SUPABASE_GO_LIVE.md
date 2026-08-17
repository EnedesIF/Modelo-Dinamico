# Colocando o Modelo Dinâmico no ar com Vercel e Supabase

## Objetivo

Esta entrega substitui a demonstração estática por uma aplicação persistente. A professora entra com e-mail e senha, configura a diretriz e quatro metas, e os grupos registram seus dossiês no Supabase. A API em `api/collaboration.ts` roda como função serverless no Vercel; assim, a chave administrativa do Supabase não chega ao navegador.

## 1. Atualize o repositório Git

Substitua o conteúdo do repositório pelos arquivos do pacote `modelo-dinamico-educacional-supabase-vercel.zip`. Preserve as pastas `api`, `client`, `shared`, `docs` e os arquivos `package.json`, `pnpm-lock.yaml` e `vercel.json`. Faça um commit com a mensagem `feat: conecta Supabase e API serverless`.

## 2. Ajuste o Supabase Auth

No Supabase, abra **Authentication → URL Configuration** e preencha:

| Campo | Valor |
| --- | --- |
| Site URL | `https://modelo-dinamico-vib8.vercel.app` |
| Redirect URLs | `https://modelo-dinamico-vib8.vercel.app/**` |

Em **Authentication → Providers → Email**, mantenha o provedor de e-mail habilitado para autenticação por senha. O painel docente usa **e-mail e senha**, sem magic link. Antes do primeiro login, crie a conta da professora em **Authentication → Users → Add user → Create new user**, informando o e-mail, uma senha forte e habilitando **Auto Confirm User**.

## 3. Complete as variáveis no Vercel

As variáveis públicas já podem estar registradas. Confirme as três abaixo:

| Variável | Origem | Sensível |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Não |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key | Não |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role/secret key | Sim |

Cadastre todas em **Production and Preview**. A terceira variável é exclusiva da função serverless; não use o prefixo `VITE_` e não a exponha em capturas ou mensagens.

## 4. Faça o redeploy

Depois do commit e da terceira variável, abra **Vercel → Deployments → Redeploy**. O build usa `pnpm exec vite build`, publica `dist/public` e cria a função em `/api/collaboration`.

## 5. Validação mínima

Abra o domínio público e siga esta sequência: entre como professora com e-mail e senha; cadastre a diretriz e as quatro metas; libere a turma; crie um grupo; registre uma resposta e recarregue a página. O dossiê deve permanecer salvo e o painel coletivo deve atualizar os indicadores sem exibir respostas ou contatos de outros grupos.
