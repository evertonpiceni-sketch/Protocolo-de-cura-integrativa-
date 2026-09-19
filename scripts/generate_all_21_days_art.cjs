const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const DAYS_DATA = [
  {
    day: 1,
    title: "PRESENÇA E CHÃO",
    stages: [
      { name: "1. ESTADO INICIAL", desc: "Mente dispersa, pouca presença." },
      { name: "2. A LUZ CHEGA", desc: "Uma nova energia começa a se conectar." },
      { name: "3. A ENERGIA DESCE", desc: "A luz percorre todo o seu corpo." },
      { name: "4. ENRAIZAMENTO", desc: "A energia se estabiliza nos seus pés." },
      { name: "5. INTEGRAÇÃO", desc: "Mais presença. Mais vida em você." }
    ],
    main: "AQUI COMEÇA A SUA REINTEGRAÇÃO.",
    sub: "VOCÊ CHEGA COMO ESTÁ. / VOCÊ PERMITE. / VOCÊ RECEBE. / VOCÊ SE SUSTENTA. / VOCÊ VOLTA PARA VOCÊ."
  },
  {
    day: 2,
    title: "VOLTAR AO CORPO",
    stages: [
      { name: "1. DISTÂNCIA", desc: "Você se percebe de longe." },
      { name: "2. ESCUTA", desc: "A atenção retorna à pele e à respiração." },
      { name: "3. VARREDURA", desc: "A luz percorre o corpo inteiro com suavidade." },
      { name: "4. HABITAR", desc: "Pernas, ventre, peito e braços ganham presença." },
      { name: "5. PRESENÇA", desc: "Você volta a morar no próprio corpo." }
    ],
    main: "VOCÊ VOLTA A HABITAR O PRÓPRIO CORPO.",
    sub: "A presença começa quando você se sente por dentro."
  },
  {
    day: 3,
    title: "UM PEQUENO COMEÇO",
    stages: [
      { name: "1. PAUSA", desc: "Você reconhece que pode começar pequeno." },
      { name: "2. CENTRO", desc: "A luz se reúne no centro do corpo." },
      { name: "3. IMPULSO", desc: "Ela avança suavemente para braços e mãos." },
      { name: "4. GESTO", desc: "O corpo se inclina para uma pequena ação." },
      { name: "5. INÍCIO", desc: "Você se move sem se cobrar." }
    ],
    main: "VOCÊ COMEÇA SEM SE VIOLENTAR.",
    sub: "Um pequeno passo já abre caminho."
  },
  {
    day: 4,
    title: "PERMITIR-SE RECEBER",
    stages: [
      { name: "1. RESGUARDO", desc: "Você se fecha para se proteger." },
      { name: "2. SUAVIZAÇÃO", desc: "O peito começa a relaxar." },
      { name: "3. ABERTURA", desc: "A luz se expande do peito aos braços e mãos." },
      { name: "4. RECEPÇÃO", desc: "O corpo se torna receptivo e seguro." },
      { name: "5. ACOLHIMENTO", desc: "Você permite que algo bom entre." }
    ],
    main: "VOCÊ SE PERMITE RECEBER.",
    sub: "Receber também é um gesto de cura."
  },
  {
    day: 5,
    title: "CUIDAR DE SI",
    stages: [
      { name: "1. ESQUECIMENTO", desc: "Você percebe o quanto se deixou para depois." },
      { name: "2. RETORNO", desc: "As mãos voltam ao peito e ao ventre." },
      { name: "3. AMPARO", desc: "A luz envolve rosto, peito e abdômen como um manto." },
      { name: "4. TERNURA", desc: "O corpo se sente cuidado por dentro." },
      { name: "5. AUTOACOLHIMENTO", desc: "Você se trata com mais gentileza." }
    ],
    main: "VOCÊ SE ACOLHE COM TERNURA.",
    sub: "Cuidar de si também é voltar para si."
  },
  {
    day: 6,
    title: "REABRIR ESPAÇO PARA O PRAZER",
    stages: [
      { name: "1. RECOLHIMENTO", desc: "A vida parece ter perdido o gosto." },
      { name: "2. BRASA", desc: "Um calor suave desperta no ventre." },
      { name: "3. PULSO", desc: "A luz ganha vida no centro do corpo." },
      { name: "4. EXPANSÃO", desc: "Quadris, peito e rosto se iluminam com suavidade." },
      { name: "5. VIVACIDADE", desc: "Você volta a sentir prazer de existir." }
    ],
    main: "VOCÊ VOLTA A SENTIR O GOSTO DA VIDA.",
    sub: "O prazer pode retornar de forma suave e segura."
  },
  {
    day: 7,
    title: "RECONHECER O QUE SE REPETE",
    stages: [
      { name: "1. AUTOMÁTICO", desc: "Padrões agem sem serem vistos." },
      { name: "2. OBSERVAÇÃO", desc: "A atenção sobe para cabeça, olhos e nuca." },
      { name: "3. CLAREZA", desc: "A luz circula o campo mental." },
      { name: "4. PERCEPÇÃO", desc: "O padrão se revela com mais nitidez." },
      { name: "5. CONSCIÊNCIA", desc: "Você enxerga o que se repetia em silêncio." }
    ],
    main: "VOCÊ ENXERGA O QUE SE REPETE.",
    sub: "Ver com clareza já começa a transformar."
  },
  {
    day: 8,
    title: "LIBERAR O QUE JÁ NÃO SUSTENTA",
    stages: [
      { name: "1. PESO", desc: "O corpo carrega excessos e tensões." },
      { name: "2. IDENTIFICAÇÃO", desc: "Ombros, costas e peito mostram onde dói." },
      { name: "3. DISSOLUÇÃO", desc: "A luz encontra os pontos densos e suaviza." },
      { name: "4. LIBERAÇÃO", desc: "O excesso começa a se desprender." },
      { name: "5. ALÍVIO", desc: "Você solta o que já não sustenta." }
    ],
    main: "VOCÊ SE ALIVIA DO QUE ERA PESO.",
    sub: "Nem tudo o que foi carregado precisa continuar."
  },
  {
    day: 9,
    title: "ESCOLHER UMA RESPOSTA DIFERENTE",
    stages: [
      { name: "1. IMPULSO ANTIGO", desc: "A reação automática se apresenta." },
      { name: "2. PAUSA", desc: "Mente e corpo ganham um intervalo." },
      { name: "3. ALINHAMENTO", desc: "A luz desce da cabeça ao peito." },
      { name: "4. ESCOLHA", desc: "A nova resposta alcança garganta e mãos." },
      { name: "5. DIREÇÃO", desc: "Você responde de um lugar mais consciente." }
    ],
    main: "VOCÊ ESCOLHE UMA RESPOSTA DIFERENTE.",
    sub: "Entre o impulso e a ação, existe espaço."
  },
  {
    day: 10,
    title: "RECONHECER O PRÓPRIO VALOR",
    stages: [
      { name: "1. DÚVIDA", desc: "O seu valor parece distante." },
      { name: "2. LEMBRANÇA", desc: "Uma centelha reacende no peito." },
      { name: "3. DIGNIDADE", desc: "A luz sobe pela coluna e pelo rosto." },
      { name: "4. PRESENÇA", desc: "A postura se torna mais inteira." },
      { name: "5. MERECIMENTO", desc: "Você se reconhece como importante." }
    ],
    main: "VOCÊ SE RECORDA DO PRÓPRIO VALOR.",
    sub: "O seu valor não depende de provar nada."
  },
  {
    day: 11,
    title: "SUAVIZAR A COBRANÇA",
    stages: [
      { name: "1. PRESSÃO", desc: "A mente e os ombros carregam exigência." },
      { name: "2. ESCUTA", desc: "Você nota o peso que vem de dentro." },
      { name: "3. ALÍVIO", desc: "A luz amolece testa, cabeça e ombros." },
      { name: "4. DOÇURA", desc: "O peito respira com mais espaço." },
      { name: "5. GENTILEZA", desc: "Você se trata com menos rigidez." }
    ],
    main: "VOCÊ SE TRATA COM MAIS DOÇURA.",
    sub: "Nem toda mudança precisa nascer da cobrança."
  },
  {
    day: 12,
    title: "REENCONTRAR QUEM EU SOU",
    stages: [
      { name: "1. DISPERSÃO", desc: "Distância de si." },
      { name: "2. A LUZ SURGE", desc: "Uma lembrança interior desperta." },
      { name: "3. ALINHAMENTO", desc: "Um feixe de luz percorre o centro do corpo." },
      { name: "4. UNIFICAÇÃO", desc: "O eixo se estabiliza e reúne suas partes." },
      { name: "5. RETORNO", desc: "Você volta ao centro de si." }
    ],
    main: "VOCÊ VOLTA AO CENTRO DE SI.",
    sub: "Aqui, você se recorda de quem é."
  },
  {
    day: 13,
    title: "ABRIR UMA PEQUENA PORTA",
    stages: [
      { name: "1. FECHAMENTO", desc: "Tudo parece estreito." },
      { name: "2. UM SINAL", desc: "Uma abertura começa a surgir." },
      { name: "3. CENTRO VIVO", desc: "A luz desperta no peito e nas mãos." },
      { name: "4. PASSAGEM", desc: "A luz se abre para a frente como uma porta." },
      { name: "5. POSSIBILIDADE", desc: "Um novo caminho se revela." }
    ],
    main: "VOCÊ PERCEBE UMA NOVA POSSIBILIDADE.",
    sub: "Pequenas aberturas podem mudar tudo."
  },
  {
    day: 14,
    title: "PERMITIR O CONTATO",
    stages: [
      { name: "1. RESGUARDO", desc: "Você se recolhe." },
      { name: "2. SUAVIZAÇÃO", desc: "A presença amolece a proteção." },
      { name: "3. CONEXÃO", desc: "A luz conecta peito, garganta e mãos." },
      { name: "4. APROXIMAÇÃO", desc: "O contato se torna seguro." },
      { name: "5. ENCONTRO", desc: "Você se aproxima sem se perder." }
    ],
    main: "VOCÊ SE APROXIMA SEM SE PERDER.",
    sub: "O contato pode ser suave e seguro."
  },
  {
    day: 15,
    title: "SUSTENTAR UMA PEQUENA AÇÃO",
    stages: [
      { name: "1. INTENÇÃO", desc: "Você decide começar." },
      { name: "2. BASE", desc: "A luz firma pernas e pés." },
      { name: "3. IMPULSO", desc: "O centro do corpo ganha direção." },
      { name: "4. CONTINUIDADE", desc: "A ação se sustenta com suavidade." },
      { name: "5. CONSTÂNCIA", desc: "Você começa e continua." }
    ],
    main: "VOCÊ COMEÇA E CONTINUA.",
    sub: "Pequenos passos também são movimento."
  },
  {
    day: 16,
    title: "ENXERGAR O PRÓXIMO PASSO",
    stages: [
      { name: "1. NÉVOA", desc: "Nem tudo está claro." },
      { name: "2. FOCO", desc: "A visão interna começa a se abrir." },
      { name: "3. CLAREZA", desc: "A luz desperta olhos, testa e peito." },
      { name: "4. DIREÇÃO", desc: "Um pequeno caminho aparece à frente." },
      { name: "5. PASSO", desc: "Você vê apenas o próximo passo." }
    ],
    main: "VOCÊ VÊ APENAS O PRÓXIMO PASSO.",
    sub: "Não é preciso ver tudo para seguir."
  },
  {
    day: 17,
    title: "DESBLOQUEAR CAMINHOS",
    stages: [
      { name: "1. BLOQUEIO", desc: "Algo parece travado." },
      { name: "2. MOVIMENTO", desc: "Uma nova corrente começa a surgir." },
      { name: "3. PASSAGEM", desc: "A luz atravessa o eixo central." },
      { name: "4. FLUXO", desc: "O caminho à frente volta a se abrir." },
      { name: "5. LIBERAÇÃO", desc: "O que estava travado volta a circular." }
    ],
    main: "VOCÊ VOLTA A CIRCULAR.",
    sub: "Quando o caminho respira, você também respira."
  },
  {
    day: 18,
    title: "CAMINHAR SEM CERTEZA ABSOLUTA",
    stages: [
      { name: "1. DÚVIDA", desc: "Nem tudo está garantido." },
      { name: "2. PRESENÇA", desc: "Você respira e permanece." },
      { name: "3. CORAGEM SERENA", desc: "A luz sustenta pés, pernas e peito." },
      { name: "4. PASSO A PASSO", desc: "O caminho surge sem mostrar tudo." },
      { name: "5. CONTINUIDADE", desc: "Você segue sem precisar controlar tudo." }
    ],
    main: "VOCÊ SEGUE SEM PRECISAR CONTROLAR TUDO.",
    sub: "Às vezes, seguir já é suficiente."
  },
  {
    day: 19,
    title: "ESCOLHER A VIDA NOVAMENTE",
    stages: [
      { name: "1. SILÊNCIO", desc: "Tudo desacelera." },
      { name: "2. CHAMADO", desc: "Uma centelha reacende no peito." },
      { name: "3. SIM", desc: "A luz se espalha pelo corpo." },
      { name: "4. RETOMADA", desc: "A presença volta a ganhar força." },
      { name: "5. VIDA", desc: "Você escolhe a continuidade." }
    ],
    main: "VOCÊ ESCOLHE A CONTINUIDADE.",
    sub: "A vida pode ser escolhida de novo."
  },
  {
    day: 20,
    title: "REINTEGRAR AS PARTES DE MIM",
    stages: [
      { name: "1. DISPERSÃO", desc: "Partes de você estão afastadas." },
      { name: "2. CHAMADO", desc: "Pontos de luz começam a responder." },
      { name: "3. APROXIMAÇÃO", desc: "As partes se reúnem no centro." },
      { name: "4. HARMONIA", desc: "Tudo volta a conversar entre si." },
      { name: "5. INTEGRAÇÃO", desc: "Você se reconhece como um todo." }
    ],
    main: "VOCÊ SE RECONHECE COMO UM TODO.",
    sub: "O que estava separado pode voltar a se unir."
  },
  {
    day: 21,
    title: "EU REINTEGRO A VIDA",
    stages: [
      { name: "1. CHEGADA", desc: "Você está aqui." },
      { name: "2. PRESENÇA", desc: "A luz percorre todo o corpo." },
      { name: "3. ESTABILIZAÇÃO", desc: "O centro se firma com serenidade." },
      { name: "4. EXPANSÃO", desc: "A vida se expande dentro e ao redor." },
      { name: "5. PLENITUDE", desc: "Você reintegra a vida em si." }
    ],
    main: "VOCÊ REINTEGRA A VIDA EM SI.",
    sub: "Aqui, a vida volta a circular plenamente."
  }
];

async function generateAll() {
  const daysDir = path.join(__dirname, "../public/brand/days");
  if (!fs.existsSync(daysDir)) {
    fs.mkdirSync(daysDir, { recursive: true });
  }

  // Dia 1 is already the master original art
  const dia1Dest = path.join(daysDir, "dia-01.png");
  if (!fs.existsSync(dia1Dest)) {
    fs.copyFileSync(path.join(__dirname, "../public/brand/reintegracao-presenca-arte.png"), dia1Dest);
  }

  const bgBase64 = "data:image/png;base64," + fs.readFileSync(path.join(__dirname, "../public/brand/reintegracao-presenca-arte.png")).toString("base64");

  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1214, height: 1295 });

  const initialHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { width: 1214px; height: 1295px; background: #0c0e12; overflow: hidden; font-family: "Plus Jakarta Sans", sans-serif; color: #fff; }
      .canvas-wrap { position: relative; width: 1214px; height: 1295px; }
      .bg-img { position: absolute; inset: 0; width: 1214px; height: 1295px; z-index: 1; }

      /* Day Header Mask */
      .day-header-mask {
        position: absolute;
        top: 135px;
        left: 200px;
        width: 814px;
        height: 110px;
        background: radial-gradient(ellipse at center, rgba(16, 26, 40, 0.98) 0%, rgba(12, 20, 32, 0.95) 70%, rgba(12, 20, 32, 0) 100%);
        z-index: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      .day-num {
        font-family: "Cinzel", serif;
        font-size: 20px;
        letter-spacing: 7px;
        color: #e5c158;
        font-weight: 700;
        margin-bottom: 4px;
        text-shadow: 0 0 12px rgba(229, 193, 88, 0.4);
      }
      .day-title {
        font-family: "Cinzel", serif;
        font-size: 34px;
        letter-spacing: 3px;
        color: #f8fafc;
        font-weight: 600;
        text-shadow: 0 2px 10px rgba(0,0,0,0.8);
      }

      /* 5 Stage Columns Mask */
      .stage-masks-bar {
        position: absolute;
        top: 260px;
        left: 55px;
        width: 1104px;
        height: 115px;
        z-index: 5;
        display: flex;
        justify-content: space-between;
      }
      .stage-col-box {
        width: 210px;
        background: radial-gradient(ellipse at center, rgba(16, 28, 44, 0.96) 0%, rgba(11, 20, 32, 0.9) 80%, rgba(11, 20, 32, 0) 100%);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 10px 8px;
      }
      .stage-name {
        font-size: 13px;
        font-weight: 700;
        color: #e5c158;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 6px;
        text-shadow: 0 0 8px rgba(229, 193, 88, 0.3);
      }
      .stage-desc {
        font-size: 12px;
        line-height: 1.45;
        color: #cbd5e1;
        font-weight: 400;
      }

      /* Bottom Affirmation Card Mask */
      .bottom-card-mask {
        position: absolute;
        top: 1040px;
        left: 170px;
        width: 874px;
        height: 175px;
        background: rgba(14, 22, 34, 0.95);
        border: 1px solid rgba(212, 175, 55, 0.45);
        border-radius: 12px;
        z-index: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px 40px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8), inset 0 0 25px rgba(212, 175, 55, 0.08);
      }
      .main-phrase {
        font-family: "Cinzel", serif;
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #ffffff;
        margin-bottom: 12px;
        text-shadow: 0 2px 12px rgba(0,0,0,0.9);
      }
      .sub-phrase {
        font-size: 14px;
        letter-spacing: 1px;
        color: #e2e8f0;
        line-height: 1.6;
        opacity: 0.92;
      }
    </style>
  </head>
  <body>
    <div class="canvas-wrap">
      <img class="bg-img" src="${bgBase64}" />
      <div class="day-header-mask">
        <div id="day-num" class="day-num">DIA 1</div>
        <div id="day-title" class="day-title">PRESENÇA E CHÃO</div>
      </div>
      <div class="stage-masks-bar">
        <div class="stage-col-box">
          <div id="s0-name" class="stage-name">1. ESTADO INICIAL</div>
          <div id="s0-desc" class="stage-desc">Mente dispersa, pouca presença.</div>
        </div>
        <div class="stage-col-box">
          <div id="s1-name" class="stage-name">2. A LUZ CHEGA</div>
          <div id="s1-desc" class="stage-desc">Uma nova energia começa a se conectar.</div>
        </div>
        <div class="stage-col-box">
          <div id="s2-name" class="stage-name">3. A ENERGIA DESCE</div>
          <div id="s2-desc" class="stage-desc">A luz percorre todo o seu corpo.</div>
        </div>
        <div class="stage-col-box">
          <div id="s3-name" class="stage-name">4. ENRAIZAMENTO</div>
          <div id="s3-desc" class="stage-desc">A energia se estabiliza nos seus pés.</div>
        </div>
        <div class="stage-col-box">
          <div id="s4-name" class="stage-name">5. INTEGRAÇÃO</div>
          <div id="s4-desc" class="stage-desc">Mais presença. Mais vida em você.</div>
        </div>
      </div>
      <div class="bottom-card-mask">
        <div id="main-phrase" class="main-phrase">AQUI COMEÇA A SUA REINTEGRAÇÃO.</div>
        <div id="sub-phrase" class="sub-phrase">VOCÊ CHEGA COMO ESTÁ. / VOCÊ PERMITE. / VOCÊ RECEBE. / VOCÊ SE SUSTENTA. / VOCÊ VOLTA PARA VOCÊ.</div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(initialHtml);
  // Wait once for fonts
  await page.evaluate(() => document.fonts.ready);

  for (const item of DAYS_DATA) {
    const padDay = String(item.day).padStart(2, "0");
    const outPath = path.join(daysDir, `dia-${padDay}.png`);

    if (item.day === 1) {
      console.log(`Dia 01 preserved as original master art.`);
      continue;
    }

    console.log(`Rendering Dia ${padDay}: ${item.title}...`);

    await page.evaluate((d) => {
      document.getElementById("day-num").innerText = "DIA " + d.day;
      document.getElementById("day-title").innerText = d.title;
      d.stages.forEach((s, i) => {
        document.getElementById(`s${i}-name`).innerText = s.name;
        document.getElementById(`s${i}-desc`).innerText = s.desc;
      });
      document.getElementById("main-phrase").innerText = d.main;
      document.getElementById("sub-phrase").innerText = d.sub;
    }, item);

    await page.screenshot({ path: outPath });
  }

  await browser.close();
  console.log("Successfully generated all 21 approved day artworks!");
}

generateAll().catch(err => {
  console.error("Generation error:", err);
  process.exit(1);
});
