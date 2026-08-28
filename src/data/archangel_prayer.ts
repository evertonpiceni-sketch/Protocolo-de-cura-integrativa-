/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Oração de Limpeza Espiritual de 21 Dias do Arcanjo Miguel
 * (Gratuito para todos os praticantes)
 */

export interface ArchangelPrayerSection {
  title: string;
  text: string;
}

export const ARCHANGEL_MICHAEL_PRAYER_FULL: ArchangelPrayerSection[] = [
  {
    title: "1. Invocação e Decreto de Proteção Cósmica",
    text: `Apelo ao Cristo para acalmar os meus medos e para apagar todo mecanismo de controle externo que possa interferir com esta cura.
Peço ao meu Eu Superior que feche a minha aura e estabeleça um canal crístico para os propósitos da minha cura, para que só as energias crísticas possam fluir até mim.
Não se poderá fazer outro uso deste canal que não seja para o fluxo de energias divinas.`
  },
  {
    title: "2. Apelo ao Arcanjo Miguel e aos Mestres de Luz",
    text: `Apelo agora ao Arcanjo Miguel, da 13ª Dimensão, para que sele e proteja completamente esta sagrada experiência.
Apelo ao Círculo de Segurança da 13ª Dimensão para que sele, proteja e aumente completamente o escudo de Miguel, assim como para que remova qualquer coisa que não seja de natureza crística e que exista atualmente dentro deste campo.
Apelo aos Mestres Ascensionados e aos nossos assistentes crísticos para que removam e dissolvam completamente cada uma das estruturas e seus implantes, parasitas, armas espirituais e dispositivos de limitação autoimpostos, tanto conhecidos como desconhecidos.`
  },
  {
    title: "3. Revogação de Votos, Pactos e Cordões Energéticos",
    text: `Uma vez completado isso, apelo pela completa restauração e reparação do campo de energia original, infundido com a energia dourada de Cristo.
Eu sou livre! Eu sou livre! Eu sou livre! Eu sou livre! Eu sou livre! Eu sou livre! Eu sou livre!
Eu, [NOME], declaro e revogo todos e cada um dos compromissos de fidelidade, votos, acordos ou contratos de associação que já não servem ao meu bem mais elevado, nesta vida, vidas passadas, vidas simultâneas, em todas as dimensões, períodos de tempo e localizações.
Eu ordeno a todas as entidades ligadas a esses contratos que cessem e desistam agora e abandonem meu campo de energia para sempre e de forma irrevogável, levando todos os seus artifícios e energias com elas.`
  },
  {
    title: "4. Selamento e Consagração com o Fogo Crístico",
    text: `Para assegurar isto, apelo ao Sagrado Espírito Shekinah para que seja testemunha da dissolução de todos os contratos, dispositivos e energias semeadas que não honram a Deus.
Eu agora declaro a minha aliança com Deus através do Cristo e dedico todo o meu ser, meu corpo físico, mental, emocional e espiritual à vibração de Cristo, desde este momento em diante e retroativamente.
Que o Arcanjo Miguel sele este tratamento com sua Espada de Luz Azul Flamejante e que a chama da purificação reine no meu coração.
Eu sou livre, protegido e abençoado na presença do Criador.
Que assim seja. Está feito, selado e consagrado.`
  }
];

export const ARCHANGEL_MICHAEL_FULL_TEXT = ARCHANGEL_MICHAEL_PRAYER_FULL.map(s => `${s.title}\n\n${s.text}`).join('\n\n');
