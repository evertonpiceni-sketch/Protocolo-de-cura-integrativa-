# Auditoria — Estilo 3 Essência Luminosa — Run 55

Data: 7 de novembro de 2026  
Referência visual oficial: prancha 1001196521.png / file_0000000019d0820eb7a70b6c982619d6. O asset derivado `public/brand/essencia-luminosa/prancha-oficial.webp` foi conferido visualmente e continua sendo o card do seletor React. Decisões aprovadas posteriores prevalecem sobre qualquer detalhe antigo da prancha.

## Corrigido
- Alinhados os tokens ativos em `src/approved-theme.css` à paleta aprovada: marfim `#FFFFF8`, champagne `#F7F3E8`, sálvia `#A6B49B` e ouro suave `#C6A46A`. Removidos do bloco ativo os valores antigos mais saturados `#7E9680` e `#C29648`.
- Corrigida a identificação da prancha no seletor (Estilo 3, não Estilo 2) e removidos ramos condicionais inalcançáveis que mantinham lógica antiga depois do retorno da prancha oficial.
- Corrigida a cadeia de voz: Ajustes de Áudio e Home do Estilo 3 passam a usar IDs válidos do catálogo ElevenLabs; IDs neurais personalizados já salvos são preservados. Valores legados ou nomes de voz do dispositivo são normalizados para a voz oficial Marianne — Meditação. O teste e a narração da Home não caem silenciosamente em Web Speech.
- O player do protocolo mantém o ID neural personalizado quando válido e usa Marianne — Meditação para valores legados/incompatíveis, sem substituição robótica.
- Acrescentados testes de regressão para paleta, prancha, seletor e política de voz.

## Preservado
- Quatro estilos, seletor React único e confirmação explícita antes da aplicação. A preferência persistida não aplica tema automaticamente; o servidor precisa aceitar a escolha.
- Prancha oficial no card do Estilo 3, sem reutilizar a imagem do Natural Sereno.
- Logo oficial discreto como assinatura: opacidade de 30% e 26% em telas pequenas.
- Diário, Anamnese, Numerologia, Mapa Astral, Ho'oponopono, player, seis etapas, respiração, animações, navegação, cursos, banhos, conquistas e Reintegração da Vida.
- Política que impede Solfeggio tonal de reiniciar como trilha durante a narração; ambiência não tonal continua permitida.
- As 21 folhas CSS específicas do Estilo 3 foram verificadas: 329 seletores encontrados e todos estão limitados a `data-layout="essencia-luminosa"` (incluindo regras dentro de media queries).
- InfinitePay continua como checkout e confirmação server-side; não foi reintroduzida cópia manual de chave PIX. A antiga camada DOM de seleção não é montada; o seletor React segue como autoridade.

## Pendente
- Executar novamente lint, testes e build após este commit; o resultado do GitHub Actions será conferido separadamente.
- Teste real da voz neural em sessão autenticada/ElevenLabs e validação de volume, pausa e retomada em dispositivo.
- Capturas renderizadas página por página em desktop e celular. A varredura desta rodada foi estática; não substitui a validação visual em runtime.
- Teste de checkout/retorno InfinitePay em sandbox, sem transação real.
- A prancha do seletor está presente, mas o diretório do Estilo 3 ainda não contém um conjunto próprio de fotografias de natureza para todas as páginas. Não importei imagens do Natural Sereno nem inventei assets; a integração visual de natureza aguarda imagens aprovadas para este estilo.
- Revalidar o alerta de dependências no workflow de segurança, sem atualizar dependências fora do escopo nesta rodada.
