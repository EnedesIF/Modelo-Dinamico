# Revisão pedagógica — atividade de Inteligência de Mercado para MBA

- [x] Diagnosticar lacunas do modelo atual de KIT, FCS e KIQs para uma turma de pós-graduação.
- [x] Propor uma arquitetura de atividade baseada em decisão executiva, evidências e hipóteses.
- [x] Definir entregáveis, critérios de qualidade e rubrica de avaliação para nível MBA.
- [x] Recomendar melhorias futuras para incorporar a revisão pedagógica à aplicação.

## Implementação da versão MBA

- [x] Adicionar contrato de decisão com decisor, alternativas, prazo, critérios, restrições e consequência.
- [x] Adicionar hipóteses concorrentes e sinais de confirmação ou refutação.
- [x] Expandir FCS e KIQs com plano de evidências, fontes, métodos, sinais decisórios e confiança.
- [x] Incluir dossiê de evidências, memo executivo e recomendações estratégicas.
- [x] Incluir rubrica de avaliação e painel de acompanhamento do professor.
- [x] Testar e documentar o ciclo avançado de inteligência.

## Guia em PDF para os alunos

- [x] Consolidar as instruções, entregas, rubrica e roteiro da atividade.
- [x] Diagramar o guia em PDF com a identidade visual do Laboratório de Perguntas.
- [x] Revisar e entregar o PDF final.

## Versão colaborativa por grupos

- [x] Preparar a arquitetura de dados para seis grupos e o acesso persistente por grupo.
- [x] Implementar o cadastro de grupo e o registro dos membros com nome, e-mail e telefone.
- [x] Implementar edição compartilhada da atividade e acompanhamento atualizado do professor.
- [x] Criar dashboard visual com gráficos de progresso, evidências, hipóteses e qualidade por grupo.
- [x] Adicionar ajuda contextual em cada etapa e campo crítico da atividade.
- [x] Implementar indicador explicável de qualidade e robustez analítica.
- [x] Testar o fluxo colaborativo, a privacidade dos dados e a experiência do professor.

## Preparação para documentação e Supabase

- [x] Criar o índice técnico do repositório e da futura integração com o Supabase.
- [x] Produzir documentação detalhada, guia de Git e plano de integração em etapa posterior.

## Redesenho do fluxo por meta

- [x] Analisar a organização de metas, FCS e KIQs da planilha de referência.
- [x] Substituir o fluxo vertical contínuo por navegação hierárquica Meta → FCS → KIQs.
- [x] Implementar edição focada em uma meta e um FCS por vez, com indicador de completude.
- [x] Validar o novo layout em telas de notebook e dispositivos móveis.

## Configuração da turma pelo professor

- [x] Criar painel docente para cadastrar a diretriz da turma e as quatro metas.
- [x] Persistir a configuração e tornar os títulos das metas disponíveis para os grupos.
- [x] Manter o cadastro de grupos bloqueado até a configuração ser liberada pelo professor.
- [x] Validar os fluxos de professor, grupo e persistência da configuração.

## Correção de pop-ups orientativos

- [x] Corrigir o recorte lateral dos pop-ups de ajuda contextual.
- [x] Adaptar o posicionamento dos pop-ups para campos próximos às bordas e telas menores.
- [x] Validar a legibilidade dos textos de orientação.

## Correção do acesso do professor

- [x] Permitir que o primeiro professor autenticado assuma a configuração inicial da turma.
- [x] Restringir alterações posteriores ao professor responsável ou administrador.
- [x] Ajustar a tela docente para o novo fluxo de acesso.
- [x] Testar a autorização e o cadastro inicial das metas.

## Entrada dos grupos e análises de respostas

- [x] Criar página própria de cadastro e acesso para os grupos, desvinculada do painel do professor.
- [x] Registrar indicadores de completude e qualidade por meta, FCS, KIQ, evidência e memo.
- [x] Exibir comparações entre grupos e identificar lacunas analíticas no painel docente.
- [x] Testar a entrada de grupos, a persistência de respostas e os indicadores.

## Versão demonstrativa

- [x] Criar uma atividade de demonstração pré-configurada, sem dados pessoais.
- [x] Exibir grupos fictícios e indicadores analíticos consistentes para apresentação.
- [x] Separar a demonstração da atividade real de professor e grupos.
- [x] Validar o fluxo de apresentação da demonstração.

## Dashboard coletivo dos grupos

- [x] Exibir para cada grupo o progresso agregado dos demais, sem respostas individuais ou dados pessoais.
- [x] Incluir comparação de progresso, robustez e cobertura analítica da turma.
- [x] Destacar a posição e a próxima lacuna do grupo conectado.
- [x] Validar a privacidade e a atualização dos dados do painel coletivo.

## Correção de acesso de grupos

- [x] Confirmar o acionamento do cadastro e do acesso por código no portal dos grupos.
- [x] Validar o retorno ao espaço de trabalho após cadastro ou entrada.

## Ajuste de identidade do portal dos grupos

- [x] Destacar Modelo Dinâmico como nome principal da interface.
- [x] Simplificar a chamada principal para Cadastre o grupo.

## Documentação de entrega externa

- [x] Documentar a preparação do repositório e a publicação no Git.
- [x] Documentar a adaptação e implantação externa no Vercel.
- [x] Documentar a migração do banco, autenticação e variáveis para o Supabase.
- [x] Consolidar um guia de operação e verificação pós-implantação.

## Pacote de repositório Git

- [x] Criar uma cópia limpa, sem dependências, builds ou segredos.
- [x] Compactar e verificar o pacote para envio ao repositório remoto.

## Orientação de implantação no Vercel

- [ ] Confirmar a estrutura do repositório no Git antes da importação.
- [ ] Configurar o projeto e o comando de build no Vercel.
- [ ] Registrar as limitações do backend atual e as variáveis para a futura migração ao Supabase.

## Correção de build externo

- [ ] Confirmar a presença de `client/src/main.tsx` e demais arquivos de entrada no Git.
- [ ] Restaurar a árvore de arquivos do projeto antes de uma nova implantação no Vercel.

## Estratégia de implantação externa

- [ ] Configurar build estático de demonstração no Vercel, sem o bootstrap Express atual.
- [ ] Planejar a conversão do backend para Supabase e funções serverless antes da implantação funcional completa.

## Publicação funcional externa

- [ ] Criar o projeto Supabase e aplicar o esquema PostgreSQL da atividade.
- [ ] Converter autenticação, persistência e APIs para Supabase e funções serverless.
- [ ] Configurar as variáveis de ambiente e publicar a versão funcional no Vercel.
- [ ] Validar professor, grupos, dashboard e privacidade no domínio externo.

## Integração Supabase do domínio publicado

- [ ] Criar o projeto Supabase e aplicar o esquema PostgreSQL da atividade.
- [ ] Migrar o acesso docente, grupos e dossiês para Supabase Auth e Postgres.
- [ ] Adaptar o backend para funções serverless no Vercel.
- [ ] Configurar variáveis de ambiente e validar a versão persistente no domínio público.

## Demonstração estática no Vercel

- [ ] Publicar a interface e a rota demonstrativa sem o backend Express atual.
- [ ] Validar o domínio público e registrar que dados persistentes dependem do Supabase.

## Correção de rota estática no Vercel

- [ ] Ajustar a configuração de rota e saída para eliminar o erro 404 do domínio público.
- [ ] Reimplantar e validar a abertura da demonstração no Vercel.

## Correção de entrega estática no Vercel

- [ ] Simplificar a configuração externa para servir `index.html` na página inicial.
- [ ] Confirmar que o domínio público deixa de retornar 404 após o redeploy.

## Migração Supabase e função serverless

- [x] Criar o projeto Supabase e aplicar o esquema PostgreSQL da atividade.
- [x] Adaptar localmente autenticação docente, persistência e API de colaboração para Supabase e Vercel.
- [x] Validar tipagem, build estático, função serverless e testes da migração local.
- [ ] Atualizar o repositório Git externo com o pacote Supabase/Vercel.
- [ ] Cadastrar a chave `SUPABASE_SERVICE_ROLE_KEY` protegida no Vercel.
- [ ] Fazer redeploy e validar professor, grupos, dossiês e dashboard no domínio público.

## Correção do acesso docente

- [x] Diagnosticar por que o botão “Entrar como professor” não inicia a autenticação.
- [x] Exibir uma orientação acionável quando as credenciais Supabase ainda não estiverem disponíveis no ambiente.
- [ ] Validar o botão de entrada, a geração do magic link e o retorno à aplicação.

## Login docente por senha

- [x] Substituir o fluxo de magic link por autenticação docente com e-mail e senha.
- [ ] Criar uma tela de primeiro acesso para cadastrar a conta da professora com senha.
- [x] Preservar a autorização da professora responsável e os fluxos públicos dos grupos.
- [ ] Validar login, criação de conta, logout e persistência da sessão no Supabase.
