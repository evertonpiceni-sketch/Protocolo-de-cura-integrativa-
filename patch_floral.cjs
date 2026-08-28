const fs = require('fs');
let code = fs.readFileSync('src/lib/anamnesisTreatmentEngine.ts', 'utf8');

const newFloralLogic = `
  let recommendedFloral = 'Rescue Remedy (Para alívio imediato, ansiedade e equilíbrio emocional)';
  let recommendedAromatherapy = 'Óleo Essencial de Lavanda (Calmante, reduz estresse e melhora o sono)';

  // Diretrizes de Receituário Integrativo
  if (category === 'saude_fisica' || complaints.includes('cansaco_extremo') || complaints.includes('baixa_imunidade') || complaints.includes('dores_corpo')) {
    // Esgotamento/Burnout/Exaustão
    recommendedFloral = 'Olive (Recuperação de energia vital)';
    recommendedAromatherapy = 'Óleo Essencial de Alecrim (Foco e revigorante)';
  } else if (category === 'liberacao_emocional' && (emotional.includes('Angústia no peito') || emotional.includes('Apatia e falta de vontade'))) {
    // Tristeza Profunda/Depressão/Abandono
    recommendedFloral = 'Mustard ou Willow (Acolhimento da alma)';
    recommendedAromatherapy = 'Óleo Essencial de Bergamota (Elevação do humor)';
  } else if (category === 'relacionamentos' || complaints.includes('oscilacoes_humor') || emotional.includes('Irritação constante')) {
    // Instabilidade/Bipolaridade/Borderline
    recommendedFloral = 'Scleranthus (Equilíbrio e oscilações)';
    recommendedAromatherapy = 'Óleo Essencial de Gerânio (Estabilidade emocional)';
  } else if (category === 'liberacao_emocional' || complaints.includes('ansiedade_crise') || emotional.includes('Mente acelerada (não desliga)')) {
    // Ansiedade/Agitação/TDAH
    recommendedFloral = 'Impatiens (Paciência)';
    recommendedAromatherapy = 'Óleo Essencial de Lavanda (Calmante do sistema nervoso)';
  } else if (category === 'prosperidade') {
    recommendedFloral = 'Larch (Para autoconfiança e capacidade de realização)';
    recommendedAromatherapy = 'Óleo Essencial de Canela ou Bergamota (Atração de prosperidade e abundância)';
  } else if (category === 'limpeza_espiritual') {
    recommendedFloral = 'Walnut (Proteção contra influências externas e quebra de laços do passado)';
    recommendedAromatherapy = 'Óleo Essencial de Olíbano (Conexão espiritual profunda e proteção áurica)';
  }
`;

const replaceRegex = /let recommendedFloral = 'Rescue Remedy.*?\n\s*\} else if \(category === 'liberacao_emocional'\) \{.*?\n\s*\}/s;

if (replaceRegex.test(code)) {
    code = code.replace(replaceRegex, newFloralLogic.trim());
    fs.writeFileSync('src/lib/anamnesisTreatmentEngine.ts', code);
    console.log("Success");
} else {
    console.log("Not found");
}
