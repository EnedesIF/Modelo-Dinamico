// Guia didático — Laboratório de Perguntas / Inteligência de Mercado para MBA.
// Design: editorial acadêmico; foco em decisão, evidência e recomendação executiva.

#import "report-theme.typ": report-accent, report-theme
#import "@preview/glossarium:0.5.10"

#show: report-theme.with(
  title: "Guia da Atividade",
  author: "Modelo Dinâmico Educacional",
  rhythm: "report",
  running-header: true,
)

#let teal = report-accent
#let soft-teal = rgb("#e8f1ed")
#let soft-gold = rgb("#fff5d7")
#let ink = rgb("#19363a")
#let muted = rgb("#587174")

#let callout(title, body, fill: soft-teal) = block(
  fill: fill,
  radius: 9pt,
  inset: 12pt,
  stroke: (left: 3pt + teal),
)[
  #text(size: 9pt, weight: "bold", fill: teal)[#title]
  #v(3pt)
  #text(size: 10pt, fill: ink)[#body]
]

#let field(label, description) = block(
  fill: rgb("#fbf8f1"),
  radius: 7pt,
  stroke: 0.5pt + rgb("#d9d2c5"),
  inset: 9pt,
)[
  #text(size: 8pt, weight: "bold", fill: teal)[#label]
  #v(2pt)
  #text(size: 9pt, fill: muted)[#description]
]

// ---------- Capa ----------
#page(margin: (top: 27%, x: 2.2cm), numbering: none, header: none)[
  #set par(first-line-indent: 0em)
  #align(center)[
    #text(size: 10pt, weight: "bold", fill: teal)[MODELO DINÂMICO EDUCACIONAL]
    #v(1.2em)
    #text(size: 28pt, weight: "bold", fill: ink)[Guia da Atividade]
    #v(0.45em)
    #text(size: 16pt, fill: teal)[Inteligência de Mercado para MBA]
    #v(1.5em)
    #line(length: 42%, stroke: 1pt + teal)
    #v(1.4em)
    #text(size: 11pt, fill: muted)[
      Da decisão executiva à recomendação defensável
    ]
    #v(4.8em)
    #block(fill: soft-teal, radius: 12pt, inset: 16pt, width: 78%)[
      #text(size: 10pt, weight: "bold", fill: teal)[Ciclo de inteligência]
      #v(5pt)
      #text(size: 11pt, fill: ink)[
        Decisão → Hipóteses → Requisitos de inteligência → Evidências → Análise → Recomendação
      ]
    ]
    #v(4em)
    #text(size: 9pt, fill: muted)[Material de orientação para estudantes de pós-graduação lato sensu]
  ]
]

// ---------- Sumário ----------
#page(numbering: none, header: none)[
  #outline(title: [Sumário], indent: 1.5em)
]

// ---------- Corpo ----------
#counter(page).update(1)

= O desafio da atividade

Esta atividade coloca sua equipe no papel de uma célula de inteligência de mercado que assessora um decisor executivo. O objetivo não é reunir o maior número possível de dados, nem preencher campos isolados. O objetivo é reduzir uma incerteza relevante para que uma escolha concreta possa ser feita com maior qualidade.

Ao final, sua equipe deve entregar um dossiê que explique *o que recomenda*, *por que recomenda*, *quais evidências sustentam a posição*, *quais alternativas foram descartadas* e *o que ainda permanece incerto*.

#callout(
  [Princípio da atividade],
  [Inteligência de mercado só cria valor quando melhora uma decisão. Toda pergunta, fonte, indicador e análise deve ter uma função explícita na escolha que o decisor precisa realizar.],
)

== Objetivos de aprendizagem

Ao concluir o exercício, espera-se que você consiga formular uma questão-chave de inteligência orientada por decisão, levantar hipóteses concorrentes, transformar fatores críticos em requisitos de inteligência, avaliar limites de evidências e redigir uma recomendação executiva clara.

| Competência | Evidência esperada |
| --- | --- |
| Enquadrar uma decisão | Definir decisor, prazo, alternativas, critérios e restrições. |
| Pensar por hipóteses | Declarar explicações concorrentes e os sinais que as sustentam ou enfraquecem. |
| Planejar inteligência | Construir FCS e KIQs que orientem uma coleta factível e discriminante. |
| Raciocinar com evidências | Separar fato, fonte, limitação e inferência permitida. |
| Comunicar para executivos | Defender uma recomendação, explicitar trade-offs e propor monitoramento. |

= O contrato de decisão

Antes de iniciar a investigação, leia o mandato configurado pelo professor. Ele informa o contexto comum da turma e determina o limite da análise. Não modifique a pergunta para torná-la mais confortável: trabalhe dentro das alternativas, do prazo e das restrições propostas.

O contrato de decisão contém os elementos abaixo.

#table(
  columns: (1fr, 2fr),
  fill: (x, y) => if y == 0 { soft-teal } else { none },
  inset: 8pt,
  stroke: 0.5pt + rgb("#d8dedb"),
  [*Campo*], [*Como interpretar*],
  [Decisor], [A pessoa ou instância que tem autoridade para agir e que utilizará a inteligência.],
  [Decisão], [A escolha concreta que precisa ser feita; não confunda com um tema amplo de pesquisa.],
  [Prazo], [A data que determina a utilidade da informação. Uma boa evidência tardia pode não ser útil.],
  [Alternativas], [As opções plausíveis em disputa. Uma recomendação deve compará-las, não ignorá-las.],
  [Critérios], [As variáveis que definem uma escolha superior, como margem, velocidade, risco ou capacidade.],
  [Restrições], [Condições que não podem ser violadas, como orçamento, compliance, marca ou capacidade operacional.],
  [Consequência], [O custo de errar, atrasar ou tomar uma decisão sem evidência suficiente.],
)

#callout(
  [Teste de qualidade],
  [Se sua análise pudesse ser aplicada a qualquer empresa, em qualquer momento e para qualquer decisão, o mandato ainda está genérico demais.],
  fill: soft-gold,
)

= Seu roteiro de trabalho

O dossiê é construído em seis etapas. A ferramenta apresenta um indicador de progresso, mas a conclusão só ocorre quando cada etapa estiver substancialmente preenchida e logicamente conectada às anteriores.

== Etapa 1 — Escolha uma frente de decisão

Selecione uma das quatro frentes disponibilizadas pelo professor. Cada entrega responde a somente uma frente. Você poderá iniciar outra entrega posteriormente, mas não deve misturar frentes em um mesmo dossiê.

== Etapa 2 — Formule o KIT

O *KIT* é a Questão Chave de Inteligência. Ele deve expressar a incerteza que impede o decisor de escolher entre as alternativas. Um KIT de qualidade tem objeto, decisor, horizonte temporal e consequência decisória.

#field(
  [Estrutura recomendada],
  [“O que precisamos saber, até [prazo], sobre [objeto], para que [decisor] escolha entre [alternativas] segundo [critérios]?”],
)

| Formulação fraca | Formulação adequada |
| --- | --- |
| “Como está o mercado de cosméticos?” | “Quais sinais de demanda, disposição a pagar e reação competitiva precisamos confirmar até setembro para decidir entre entrada no segmento premium, expansão regional ou manutenção do foco atual?” |

== Etapa 3 — Declare hipóteses concorrentes

Antes de buscar dados, registre pelo menos três hipóteses concorrentes. Uma hipótese não é uma opinião: é uma explicação que pode ser fortalecida ou enfraquecida por evidências. Essa etapa reduz o risco de procurar apenas informações que confirmem sua primeira impressão.

Para cada hipótese, a equipe deve apresentar o enunciado, o sinal que a sustentaria e o sinal que a enfraqueceria.

#table(
  columns: (1.15fr, 1.4fr, 1.4fr),
  fill: (x, y) => if y == 0 { soft-teal } else { none },
  inset: 7pt,
  stroke: 0.5pt + rgb("#d8dedb"),
  [*Hipótese*], [*Sinal que sustenta*], [*Sinal que enfraquece*],
  [A entrada no segmento premium é atrativa.], [Crescimento consistente da categoria, margem suficiente e lacuna competitiva defensável.], [Alta concentração, aquisição de cliente inviável ou baixa recorrência.],
  [A expansão regional é preferível.], [Demanda comprovada, canais instalados e retorno mais rápido.], [Saturação local, guerra de preço ou capacidade limitada.],
  [A decisão deve ser adiada.], [Dados críticos indisponíveis ou risco regulatório material.], [Evidências convergentes e janela de oportunidade curta.],
)

= Plano de inteligência: FCS e KIQs

== Etapa 4 — Construa quatro FCS

Na ferramenta, *FCS* significa *Fator Crítico de Sucesso* e é tratado como um driver crítico de decisão. Cada FCS deve ser uma condição cujo resultado altera materialmente a recomendação. Não use termos amplos como “concorrência” ou “marketing” sem explicar o mecanismo causal.

Cada FCS deve conter os cinco elementos abaixo.

| Campo | O que registrar |
| --- | --- |
| Fator / driver | A condição crítica, específica e relacionada à decisão. |
| Por que altera a decisão | O mecanismo causal que conecta o fator à recomendação. |
| Indicador ou limiar | O número, faixa ou sinal que será considerado suficiente. |
| Hipótese vinculada | A hipótese que este FCS testa ou ajuda a discriminar. |
| Risco de interpretação | O viés, lacuna ou ambiguidade que pode distorcer a leitura. |

#callout(
  [Exemplo de FCS robusto],
  [“A disposição a pagar do público-alvo sustenta uma margem bruta mínima de 55% após custo de aquisição e trade spend.” Esse fator é específico, mensurável e pode alterar a recomendação.],
)

== Para cada FCS, elabore quatro KIQs

*KIQ* significa Questão Chave de Inteligência. Cada FCS exige quatro KIQs. A pergunta, por si só, não é suficiente: ela deve formar um plano de coleta e de decisão.

#table(
  columns: (1fr, 2fr),
  fill: (x, y) => if y == 0 { soft-teal } else { none },
  inset: 7pt,
  stroke: 0.5pt + rgb("#d8dedb"),
  [*Campo da KIQ*], [*Padrão esperado*],
  [Pergunta], [Delimita o que precisa ser investigado.],
  [Fonte], [Indica a origem prevista: bases setoriais, cliente, concorrente, canal, especialista ou fonte regulatória.],
  [Abordagem de coleta], [Explica como a evidência será obtida: benchmark, entrevista, pesquisa documental, teste ou triangulação.],
  [Evidência mínima], [Define o requisito de suficiência: recência, número de fontes, amostra ou critério de convergência.],
  [Sinal decisório], [Explicita qual resultado mudaria a escolha ou a intensidade da recomendação.],
  [Confiança], [Registra o nível atual de confiança: alta, média ou baixa, de acordo com a qualidade da evidência disponível.],
)

= Dossiê de evidências

== Etapa 5 — Registre pelo menos três evidências críticas

Uma evidência é um fato, dado ou observação verificável. Ela não é a conclusão da equipe. Para cada item, a ferramenta pede que você descreva a fonte, a data ou recência, a relevância, a limitação e a inferência permitida.

#callout(
  [Disciplina analítica],
  [Escreva separadamente: “o que a fonte informa”, “qual a limitação dessa fonte” e “o que podemos inferir a partir dela”. Não transforme uma evidência isolada em certeza.],
  fill: soft-gold,
)

| Componente | Pergunta de controle |
| --- | --- |
| Fato / evidência | O que foi efetivamente observado, medido ou informado? |
| Fonte | Quem produziu a informação e qual a proximidade com o fenômeno? |
| Recência | A informação ainda é útil para a decisão dentro do prazo? |
| Relevância | Qual critério, hipótese ou alternativa esse item ajuda a avaliar? |
| Limitação | O que pode estar ausente, enviesado ou super-representado? |
| Inferência permitida | Qual conclusão é razoável sem extrapolar além da evidência? |

= Memo executivo

== Etapa 6 — Produza a recomendação

O memo executivo é a síntese do dossiê. Ele não deve repetir todas as perguntas ou fontes. Ele deve apresentar uma posição clara e defensável para o decisor, apoiada pelas evidências que realmente diferenciam as alternativas.

Seu memo deve conter cinco partes.

#grid(
  columns: 2,
  gutter: 10pt,
  field([Recomendação], [O que o decisor deve fazer agora? Comece com um verbo e uma escolha explícita.]),
  field([Racional], [Quais evidências e inferências sustentam a recomendação?]),
  field([Alternativas descartadas], [O que foi considerado e por que não foi priorizado?]),
  field([Risco residual], [O que ainda não sabemos, qual é a exposição e qual hipótese permanece frágil?]),
  field([Plano de monitoramento], [Quais sinais devem ser acompanhados e qual gatilho exigirá rever a decisão?]),
)

#callout(
  [Regra de comunicação executiva],
  [Uma boa recomendação não promete certeza. Ela declara a melhor ação disponível, as evidências que a sustentam, os trade-offs assumidos e os sinais que podem justificar uma revisão.],
)

= Como sua entrega será avaliada

A quantidade de campos preenchidos é uma condição para entrega, não uma medida de excelência. A avaliação considera qualidade de julgamento, rigor de evidência e utilidade executiva. Cada critério recebe uma nota de 1 a 5 na ferramenta.

#table(
  columns: (1.55fr, 0.45fr, 2fr),
  fill: (x, y) => if y == 0 { soft-teal } else { none },
  inset: 7pt,
  stroke: 0.5pt + rgb("#d8dedb"),
  [*Critério*], [*Peso*], [*O que demonstra desempenho forte*],
  [Enquadramento da decisão], [15%], [Decisor, alternativas, prazo, critérios e restrições aparecem conectados.],
  [KIT e hipóteses], [15%], [A incerteza é relevante e as hipóteses são específicas, concorrentes e refutáveis.],
  [FCS e KIQs], [15%], [Drivers são causais; perguntas orientam coleta e discriminam alternativas.],
  [Rigor das evidências], [20%], [Fontes são adequadas; limites e necessidade de triangulação são reconhecidos.],
  [Qualidade da análise], [15%], [A equipe diferencia fato, inferência e suposição.],
  [Recomendação e trade-offs], [15%], [A posição é inequívoca; riscos e alternativas descartadas são explicitados.],
  [Comunicação executiva], [5%], [O memo é conciso, legível e acionável.],
)

= Checklist antes do envio

Antes de enviar, revise o dossiê como se você fosse o decisor. O checklist abaixo deve ser respondido com honestidade; se uma resposta for “não”, volte ao ponto correspondente e revise.

#table(
  columns: (0.18fr, 2.82fr),
  inset: 7pt,
  stroke: 0.5pt + rgb("#d8dedb"),
  [☐], [A frente escolhida responde a uma decisão e não apenas a um tema de pesquisa.],
  [☐], [O KIT informa o que precisa ser conhecido, para qual decisor, até quando e para qual escolha.],
  [☐], [As três hipóteses podem ser contrariadas por evidências observáveis.],
  [☐], [Os quatro FCS expressam drivers críticos e não títulos genéricos de assunto.],
  [☐], [Cada uma das 16 KIQs informa fonte, abordagem de coleta, evidência mínima e sinal decisório.],
  [☐], [O dossiê contém ao menos três evidências críticas com limitações e inferências explícitas.],
  [☐], [O memo recomenda uma ação, compara alternativas e apresenta risco residual.],
  [☐], [A equipe sabe qual evidência poderia levá-la a rever a recomendação.],
)

= Entrega e defesa

Envie o dossiê pela ferramenta após concluir todas as etapas. O professor terá acesso à estrutura de hipóteses, ao plano de inteligência, às evidências, ao memo e à rubrica. Em uma eventual defesa oral, prepare-se para explicar por que suas evidências são suficientes, que alternativa foi descartada e qual sinal obrigaria a equipe a mudar de posição.

#align(center)[
  #v(1em)
  #text(size: 12pt, weight: "bold", fill: teal)[Perguntas melhores. Evidências mais claras. Decisões mais defensáveis.]
]
