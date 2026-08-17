# Modelo de variáveis de ambiente

Use esta tabela para cadastrar as variáveis no provedor de hospedagem ou para criar um arquivo local que permaneça fora do Git. **Não copie segredos reais para documentos, commits, tickets ou capturas de tela.**

| Variável | Exposição | Valor de exemplo | Uso |
| --- | --- | --- | --- |
| `DATABASE_URL` | Somente servidor | `postgresql://...` | Conexão Postgres, se o backend usar ORM/driver direto. |
| `VITE_SUPABASE_URL` | Cliente e servidor | `https://[ref].supabase.co` | URL pública do projeto Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Cliente e servidor | `[anon-key]` | Cliente Supabase; exige RLS ativo. |
| `SUPABASE_URL` | Somente servidor | `https://[ref].supabase.co` | Cliente administrativo server-side. |
| `SUPABASE_SERVICE_ROLE_KEY` | Somente servidor | `[service-role-key]` | Operações privilegiadas. Nunca prefixar com `VITE_`. |
| `APP_ORIGIN` | Somente servidor | `https://[dominio]` | Origem permitida para callbacks e redirecionamentos. |

Em desenvolvimento local, use um arquivo `.env.local` ignorado pelo Git. No Vercel, cadastre cada variável separadamente em **Settings → Environment Variables**, distinguindo `Preview` e `Production`.
