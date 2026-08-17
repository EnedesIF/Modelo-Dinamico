# Documentação de publicação externa

Este diretório reúne o material necessário para preparar o **Modelo Dinâmico Educacional** para versionamento em Git, implantação externa no Vercel e migração planejada para o Supabase.

| Documento | Finalidade |
| --- | --- |
| [`DEPLOYMENT_GIT_VERCEL_SUPABASE.md`](./DEPLOYMENT_GIT_VERCEL_SUPABASE.md) | Roteiro completo, por fase, para Git, Vercel e Supabase. |
| [`supabase/0001_schema.sql`](./supabase/0001_schema.sql) | Esquema inicial PostgreSQL para revisão e aplicação no Supabase. |
| [`ENVIRONMENT_TEMPLATE.md`](./ENVIRONMENT_TEMPLATE.md) | Inventário sem segredos das variáveis exigidas após a migração. |
| [`../QA_NOTES.md`](../QA_NOTES.md) | Registro da validação funcional realizada no projeto. |

> **Importante:** o sistema atual usa Node/Express, tRPC, Drizzle para MySQL e autenticação específica da plataforma de origem. A publicação no Vercel e o uso do Supabase requerem a migração descrita neste guia; não é uma troca exclusiva de variáveis de ambiente.
