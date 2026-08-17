# Diagnóstico de acesso docente

Em 17 de agosto de 2026, o domínio `https://modelo-dinamico-vib8.vercel.app` foi conferido. A interface publicada apresenta o botão único **“Entrar como professor”** e não apresenta o campo de e-mail nem o botão **“Enviar acesso”** implementados na versão local migrada para Supabase.

Uma requisição para `/api/collaboration` retornou **404 / NOT_FOUND**. Portanto, essa implantação não inclui a função serverless responsável por registrar grupos, persistir os dossiês e dar suporte ao fluxo Supabase.

O bundle JavaScript ativo no domínio é `assets/index-8OAtE4ds.js`, diferente do bundle produzido pela versão local migrada. Essas evidências confirmam que o Vercel ainda está servindo a versão anterior do repositório. Antes de testar o login novamente, é necessário atualizar o repositório conectado ao Vercel com o pacote Supabase/Vercel e fazer um novo deploy com as variáveis configuradas.
