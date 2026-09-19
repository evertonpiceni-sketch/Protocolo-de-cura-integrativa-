const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1214, height: 1295 });

  const bgBase64 = "data:image/png;base64," + fs.readFileSync("public/brand/reintegracao-presenca-arte.png").toString("base64");

  const html = `
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
        <div class="day-num">DIA 2</div>
        <div class="day-title">VOLTAR AO CORPO</div>
      </div>
      <div class="stage-masks-bar">
        <div class="stage-col-box">
          <div class="stage-name">1. DISTÂNCIA</div>
          <div class="stage-desc">Você se percebe de longe.</div>
        </div>
        <div class="stage-col-box">
          <div class="stage-name">2. ESCUTA</div>
          <div class="stage-desc">A atenção retorna à pele e à respiração.</div>
        </div>
        <div class="stage-col-box">
          <div class="stage-name">3. VARREDURA</div>
          <div class="stage-desc">A luz percorre o corpo inteiro com suavidade.</div>
        </div>
        <div class="stage-col-box">
          <div class="stage-name">4. HABITAR</div>
          <div class="stage-desc">Pernas, ventre, peito e braços ganham presença.</div>
        </div>
        <div class="stage-col-box">
          <div class="stage-name">5. PRESENÇA</div>
          <div class="stage-desc">Você volta a morar no próprio corpo.</div>
        </div>
      </div>
      <div class="bottom-card-mask">
        <div class="main-phrase">VOCÊ VOLTA A HABITAR O PRÓPRIO CORPO.</div>
        <div class="sub-phrase">A presença começa quando você se sente por dentro.</div>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: "public/brand/days/dia-02.png" });
  console.log("Dia 2 generated successfully!");
  await browser.close();
})();
