# Verificação visual — 14 de agosto de 2026

## Painel do professor

A página inicial foi aberta no ambiente de pré-visualização. A navegação lateral, a escolha de perfil, a área de diretrizes, os quatro campos de metas, os indicadores do método e os controles de exportação e salvamento foram renderizados corretamente. A composição segue a direção **Laboratório de Perguntas**, com contraste adequado entre o texto e as superfícies de papel/azul-petróleo.

## Liberação do perfil de aluno

Após o preenchimento das diretrizes e das quatro metas, o perfil de aluno foi liberado corretamente. A tela apresenta o contexto definido pelo professor, as quatro metas selecionáveis, o campo de nome, KIT, FCS inicial, quatro KIQs obrigatórios e um roteiro de preenchimento com progresso em percentual.

## Validação parcial da resposta

Com nome, meta, KIT, um FCS e seus quatro KIQs preenchidos, o roteiro indicou **80%** de completude. O sistema manteve a mensagem de que faltam três FCS e o botão de envio permaneceu indisponível, confirmando a regra mínima de quatro FCS.

## Expansão de FCS

O comando **Adicionar FCS** criou corretamente o segundo e o terceiro fatores, cada um com controles próprios de título e quatro KIQs. A mensagem de requisito foi atualizada de três para um FCS pendente, preservando a consistência do progresso.

## Envio completo

Após a criação do quarto FCS e o preenchimento dos dezesseis KIQs, o roteiro atingiu **100%** e habilitou o botão de envio. A entrega foi registrada com sucesso e exibida no histórico do aluno, incluindo a meta respondida, o KIT, quatro FCS e dezesseis KIQs.

## Painel do professor

O professor visualizou a entrega enviada no painel de respostas, com indicadores de entregas registradas, alunos participantes e fatores analisados. A resposta exibiu corretamente a estudante, a meta, o KIT, os quatro FCS e os quatro KIQs de cada fator.

## Resultado da validação

O fluxo completo foi validado: configuração da atividade → liberação do aluno → validação de requisitos → envio → histórico do aluno → acompanhamento do professor.

## Evolução MBA — contrato de decisão

A versão avançada foi aberta e validada visualmente. O painel do professor passou a incluir os campos de **decisor**, **decisão**, **prazo**, **alternativas**, **critérios**, **restrições** e **consequência de errar ou adiar**. Um contrato completo, juntamente com as quatro frentes, libera corretamente o ciclo de investigação MBA para os alunos.

## Evolução MBA — dossiê do aluno

O perfil de aluno apresenta as seis etapas definidas para MBA: identificação e frente, KIT decisório, três hipóteses concorrentes, FCS com KIQs e plano de coleta, dossiê de evidências e memo executivo. A inclusão dinâmica de um novo FCS foi verificada, com os respectivos campos de driver, indicador, risco de interpretação, quatro KIQs, fonte, método, evidência mínima, sinal decisório e confiança.

## Evolução MBA — rubrica

O painel do professor inclui uma rubrica própria para MBA, com sete critérios ponderados: enquadramento da decisão, KIT e hipóteses, FCS e KIQs, rigor das evidências, qualidade da análise, recomendação e trade-offs, e comunicação executiva. Os pesos e os parâmetros de avaliação de 1 a 5 estão visíveis e coerentes com o desenho pedagógico proposto.

## Evolução MBA — avaliação da entrega

O painel de entregas preservou os registros existentes por compatibilidade e apresentou a rubrica avaliatória por critério. Uma pontuação de teste foi aplicada ao critério de enquadramento da decisão; o cartão da entrega e a média do painel foram atualizados automaticamente com a nota ponderada, confirmando o funcionamento do cálculo.

## Versão colaborativa — entrada e acesso docente

A tela inicial apresenta o cadastro de grupo com nome, e-mail e telefone dos integrantes, o aviso de finalidade educacional dos dados e o acesso posterior por código exclusivo. A alternância para o painel docente foi validada sem sessão ativa: a aplicação protege a visualização de contatos, indicadores e acompanhamento ao vivo e apresenta a entrada autenticada do professor.

## Redesenho por meta — referência em planilha

A estrutura do arquivo de referência foi incorporada como quatro ciclos independentes. Cada meta agora contém seu próprio KIT, quatro FCS, quatro KIQs por FCS, evidências e recomendação. A interface substitui o formulário vertical contínuo por seleção de meta, abas de etapa e edição de um FCS por vez; os KIQs desse FCS são apresentados em uma grade comparável. Os testes de qualidade confirmam que o progresso e a robustez de cada meta são calculados separadamente.

## Configuração docente e pop-ups de orientação

A tela do grupo foi validada em estado bloqueado: sem atividade publicada por um professor, o cadastro de grupo não é exibido e a interface orienta o fluxo de configuração. Os testes automatizados confirmam que uma atividade sem professor responsável ou mantida como rascunho não é liberada. Os pop-ups orientativos foram substituídos por uma janela modal em camada superior, eliminando o recorte lateral observado em campos próximos à borda.

## Primeiro acesso do professor

O painel docente passou a permitir que o primeiro usuário autenticado assuma uma turma ainda sem responsável. Após essa primeira configuração, a alteração permanece restrita ao professor responsável e aos administradores. Os testes de autorização cobrem posse inicial, edição pelo responsável, bloqueio de outro usuário e exceção administrativa.

## Portal dos grupos e indicadores de resposta

O acesso dos grupos foi separado em uma rota própria, com interface de cadastro, código de retorno e estado de aguardo da liberação docente. A tela foi revisada visualmente no estado sem atividade publicada. O cálculo de qualidade agora também registra completude de FCS, KIQs, hipóteses, evidências, fontes declaradas e campos do memo; o painel docente mostra cobertura agregada, comparação entre grupos e lacunas prioritárias. Os testes automatizados validam as métricas por meta e o projeto compila sem erros de tipagem.

## Versão demonstrativa

A rota independente de demonstração foi verificada visualmente com dados explicitamente fictícios e sem qualquer contato pessoal. Ela apresenta um caso de decisão, quatro metas, grupos exemplificativos, gráficos comparativos, indicadores de cobertura, tabela de estrutura das respostas e roteiro de apresentação, sem interferir na atividade real da turma.

## Evolução coletiva dos grupos

Foi criada a rota protegida `/grupos/evolucao`, disponível somente após cadastro ou entrada por código. O painel compara progresso e robustez dos grupos, mostra o avanço do grupo conectado por meta e deixa explícito que respostas textuais, documentos, integrantes, e-mails e telefones não são exibidos. A consulta de dados projeta somente indicadores agregados e essa regra foi coberta por teste automatizado.

Confirmar que a regra de no mínimo quatro FCS e quatro KIQs por FCS impede o envio incompleto e habilita uma resposta completa.
