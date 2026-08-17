# Índice Técnico do Projeto

> **Finalidade:** orientar a documentação que será adicionada posteriormente ao repositório. Este arquivo é apenas um índice; não contém especificações completas nem realiza integração com serviços externos.

## 1. Visão do Produto

1.1. Objetivo educacional do Modelo Dinâmico Educacional.  
1.2. Perfis de uso: professor, grupo de alunos e administrador.  
1.3. Fluxo pedagógico: decisão, hipóteses, FCS, KIQs, evidências, memo e rubrica.  
1.4. Escopo atual e evolução planejada para seis grupos colaborativos.

## 2. Arquitetura da Aplicação

2.1. Stack de interface e estrutura de diretórios.  
2.2. Rotas, páginas, componentes e estado da aplicação.  
2.3. Estratégia de persistência atual e limitações do armazenamento local.  
2.4. Ambiente de desenvolvimento, compilação e publicação.  
2.5. Convenções visuais, acessibilidade e responsividade.

## 3. Modelo de Domínio

3.1. Atividade, diretrizes e contrato de decisão.  
3.2. Frentes de investigação, KIT, hipóteses, FCS e KIQs.  
3.3. Evidências, memo executivo e rubrica.  
3.4. Grupo, membro, papel e participação.  
3.5. Progresso, qualidade analítica e indicadores de robustez.

## 4. Cadastro e Privacidade de Grupos

4.1. Cadastro do grupo e identificação dos membros.  
4.2. Dados coletados: nome, e-mail e telefone.  
4.3. Consentimento, finalidade pedagógica, retenção e exclusão de dados.  
4.4. Regras de visibilidade para professor, grupo e demais estudantes.  
4.5. Validações de formulário e tratamento de dados pessoais.

## 5. Integração com Supabase

5.1. Criação e configuração do projeto.  
5.2. Variáveis de ambiente e separação entre chaves públicas e sigilosas.  
5.3. Esquema de banco de dados e relacionamentos.  
5.4. Políticas de segurança por linha e perfis de acesso.  
5.5. Autenticação de professor e grupos.  
5.6. Armazenamento de anexos, se adotado.  
5.7. Atualizações de dados e acompanhamento em tempo real.  
5.8. Migrações, backup e estratégia de restauração.

## 6. Dashboard e Visualizações

6.1. Visão geral do professor.  
6.2. Progresso dos seis grupos por etapa.  
6.3. Cobertura de hipóteses, FCS, KIQs e evidências.  
6.4. Indicadores de qualidade e robustez analítica.  
6.5. Critérios de alerta e necessidades de intervenção docente.  
6.6. Visualização individual do grupo e histórico de alterações.

## 7. Indicador de Qualidade Analítica

7.1. Componentes do indicador e pesos.  
7.2. Completude estrutural da entrega.  
7.3. Coerência entre decisão, hipótese, FCS, KIQ e recomendação.  
7.4. Diversidade, recência e limitações das evidências.  
7.5. Explicação do resultado para alunos e professor.  
7.6. Limites do indicador: apoio à aprendizagem, sem substituir a rubrica docente.

## 8. Orientação Contextual

8.1. Pop-ups de ajuda por campo.  
8.2. Exemplos de boa formulação e sinais de alerta.  
8.3. Critérios de exibição sem interromper o fluxo de trabalho.  
8.4. Acessibilidade, teclado e tecnologias assistivas.

## 9. Versionamento com Git

9.1. Inicialização do repositório e `.gitignore`.  
9.2. Estrutura de branches e convenção de commits.  
9.3. Variáveis de ambiente, arquivos locais e prevenção de segredos no repositório.  
9.4. Pull requests, revisão e checklist de qualidade.  
9.5. Releases, tags e notas de versão.  
9.6. Integração contínua: verificação de tipos, compilação e testes.

## 10. Operação e Governança

10.1. Preparação de turma e criação das atividades.  
10.2. Acompanhamento durante a aula.  
10.3. Avaliação, feedback e encerramento da turma.  
10.4. Exportação de dados e relatórios.  
10.5. Suporte, incidentes e registro de mudanças.

## 11. Testes e Critérios de Aceite

11.1. Fluxos de professor, grupo e membro.  
11.2. Confiabilidade de persistência e sincronização.  
11.3. Segurança e privacidade de dados pessoais.  
11.4. Métricas, gráficos e cálculo do indicador de qualidade.  
11.5. Compatibilidade entre navegadores e dispositivos.  
11.6. Acessibilidade e validação final de experiência de uso.

## 12. Documentos a Serem Criados Posteriormente

| Arquivo sugerido | Conteúdo planejado |
| --- | --- |
| `README.md` | Visão geral, pré-requisitos, execução local e comandos do projeto. |
| `docs/ARQUITETURA.md` | Estrutura técnica, componentes, fluxos e decisões de arquitetura. |
| `docs/MODELO_DE_DADOS.md` | Entidades, relacionamentos, dicionário de dados e regras de domínio. |
| `docs/SUPABASE.md` | Configuração, variáveis, autenticação, tabelas, políticas e migrações. |
| `docs/PRIVACIDADE.md` | Finalidade dos dados, visibilidade, retenção e boas práticas de proteção. |
| `docs/DASHBOARD.md` | Métricas, gráficos, filtros e indicadores de qualidade. |
| `docs/GUIA_DOCENTE.md` | Preparação, condução, avaliação e exportação da atividade. |
| `docs/CONTRIBUICAO.md` | Convenções de Git, commits, branches, revisão e testes. |
| `docs/ROADMAP.md` | Evolução por versões e critérios de aceite. |
