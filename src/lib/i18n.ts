/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppLanguage = 'pt' | 'en' | 'es' | 'fr' | 'it' | 'de';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt', name: 'Português', nativeName: 'Português (Brasil)', flag: '🇧🇷', speechLang: 'pt-BR' },
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', speechLang: 'en-US' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', speechLang: 'es-ES' },
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', speechLang: 'fr-FR' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', speechLang: 'it-IT' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪', speechLang: 'de-DE' }
];

export const UI_TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  pt: {
    appTitle: 'Protocolo de Cura Integrada',
    appSubtitle: '21 Dias de Transmutação e Elevação Quântica',
    hello: 'Olá',
    day: 'Dia',
    dayOf: 'de 21',
    startToday: 'Iniciar Dia',
    myJournal: 'Meu Diário',
    streak: 'Sequência',
    days: 'dias',
    completed: 'Concluído',
    progress: 'Progresso',
    contactTherapist: 'Fale Conosco',
    whatsappTooltip: 'Conversar com Terapeuta Éverton Piceni no WhatsApp',
    language: 'Idioma',
    audioLanguage: 'Áudio & Tradução',
    proPlan: 'Plano Pro',
    anamnesis: 'Anamnese Quântica',
    specificTreatment: 'Tratamento Específico (R$ 70)',
    settings: 'Configurações',
    logout: 'Sair',
    breatheInhale: 'Inspire Luz e Paz...',
    breatheHold: 'Retenha e Sinta o Sagrado...',
    breatheExhale: 'Solte todas as tensões...',
    decreeTitle: 'Decreto Sagrado do Dia',
    startMeditation: 'Iniciar Meditação Guiada',
    nextStage: 'Próxima Etapa',
    previousStage: 'Etapa Anterior',
    concludeDay: 'Concluir Dia e Salvar Diário',
    healingBalm: 'Bálsamo de Amor',
    transmutation: 'Chama Violeta',
    sealing: 'Blindagem e Selamento',
    grounding: 'Aterramento Sagrado',
    vitality: 'Vitalidade Celular'
  },
  en: {
    appTitle: 'Integrated Healing Protocol',
    appSubtitle: '21 Days of Quantum Transmutation & Elevation',
    hello: 'Hello',
    day: 'Day',
    dayOf: 'of 21',
    startToday: 'Start Day',
    myJournal: 'My Journal',
    streak: 'Streak',
    days: 'days',
    completed: 'Completed',
    progress: 'Progress',
    contactTherapist: 'Contact Us',
    whatsappTooltip: 'Chat directly with Therapist Éverton Piceni on WhatsApp',
    language: 'Language',
    audioLanguage: 'Audio & Translation',
    proPlan: 'Pro Plan',
    anamnesis: 'Quantum Anamnesis',
    specificTreatment: 'Specific Treatment ($15 / R$ 70)',
    settings: 'Settings',
    logout: 'Sign Out',
    breatheInhale: 'Inhale Light and Peace...',
    breatheHold: 'Hold and Feel the Sacred Presence...',
    breatheExhale: 'Release and let go of all tensions...',
    decreeTitle: 'Sacred Daily Decree',
    startMeditation: 'Start Guided Meditation',
    nextStage: 'Next Stage',
    previousStage: 'Previous Stage',
    concludeDay: 'Complete Day & Save Journal',
    healingBalm: 'Love Healing Balm',
    transmutation: 'Violet Flame Transmutation',
    sealing: 'Shielding & Cosmic Sealing',
    grounding: 'Sacred Grounding',
    vitality: 'Cellular Vitality'
  },
  es: {
    appTitle: 'Protocolo de Sanación Integrada',
    appSubtitle: '21 Días de Transmutación y Elevación Cuántica',
    hello: 'Hola',
    day: 'Día',
    dayOf: 'de 21',
    startToday: 'Iniciar Día',
    myJournal: 'Mi Diario',
    streak: 'Racha',
    days: 'días',
    completed: 'Completado',
    progress: 'Progreso',
    contactTherapist: 'Contáctanos',
    whatsappTooltip: 'Habla con el Terapeuta Éverton Piceni por WhatsApp',
    language: 'Idioma',
    audioLanguage: 'Audio y Traducción',
    proPlan: 'Plan Pro',
    anamnesis: 'Anamnesis Cuántica',
    specificTreatment: 'Tratamiento Específico (R$ 70)',
    settings: 'Ajustes',
    logout: 'Cerrar Sesión',
    breatheInhale: 'Inhala Luz y Paz...',
    breatheHold: 'Retén y Siente la Presencia Sagrada...',
    breatheExhale: 'Suelta todas las tensiones...',
    decreeTitle: 'Decreto Sagrado del Día',
    startMeditation: 'Iniciar Meditación Guiada',
    nextStage: 'Siguiente Etapa',
    previousStage: 'Etapa Anterior',
    concludeDay: 'Concluir Día y Guardar Diario',
    healingBalm: 'Bálsamo de Amor',
    transmutation: 'Llama Violeta',
    sealing: 'Blindaje y Sellado',
    grounding: 'Anclaje Sagrado',
    vitality: 'Vitalidad Celular'
  },
  fr: {
    appTitle: 'Protocole de Guérison Intégrée',
    appSubtitle: '21 Jours de Transmutation et Élévation Quantique',
    hello: 'Bonjour',
    day: 'Jour',
    dayOf: 'sur 21',
    startToday: 'Commencer le Jour',
    myJournal: 'Mon Journal',
    streak: 'Série',
    days: 'jours',
    completed: 'Terminé',
    progress: 'Progrès',
    contactTherapist: 'Contactez-nous',
    whatsappTooltip: 'Discuter avec le Thérapeute Éverton Piceni sur WhatsApp',
    language: 'Langue',
    audioLanguage: 'Audio & Traduction',
    proPlan: 'Plan Pro',
    anamnesis: 'Anamnèse Quantique',
    specificTreatment: 'Traitement Spécifique (R$ 70)',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    breatheInhale: 'Inspirez Lumière et Paix...',
    breatheHold: 'Retenez et Ressentez la Présence Sacrée...',
    breatheExhale: 'Relâchez toutes les tensions...',
    decreeTitle: 'Décret Sacré du Jour',
    startMeditation: 'Démarrer la Méditation Guidée',
    nextStage: 'Étape Suivante',
    previousStage: 'Étape Précédente',
    concludeDay: 'Terminer la Journée et Enregistrer',
    healingBalm: "Baume d'Amour",
    transmutation: 'Flamme Violette',
    sealing: 'Protection et Scellement',
    grounding: 'Ancrage Sacré',
    vitality: 'Vitalité Cellulaire'
  },
  it: {
    appTitle: 'Protocollo di Guarigione Integrata',
    appSubtitle: '21 Giorni di Trasmutazione ed Elevazione Quantica',
    hello: 'Ciao',
    day: 'Giorno',
    dayOf: 'di 21',
    startToday: 'Inizia Giorno',
    myJournal: 'Mio Diario',
    streak: 'Serie',
    days: 'giorni',
    completed: 'Completato',
    progress: 'Progresso',
    contactTherapist: 'Contattaci',
    whatsappTooltip: 'Parla con il Terapeuta Éverton Piceni su WhatsApp',
    language: 'Lingua',
    audioLanguage: 'Audio e Traduzione',
    proPlan: 'Piano Pro',
    anamnesis: 'Anamnesi Quantica',
    specificTreatment: 'Trattamento Specifico (R$ 70)',
    settings: 'Impostazioni',
    logout: 'Esci',
    breatheInhale: 'Inspira Luce e Pace...',
    breatheHold: 'Trattieni e Senti la Sacra Presenza...',
    breatheExhale: 'Rilascia tutte le tensioni...',
    decreeTitle: 'Sacro Decreto del Giorno',
    startMeditation: 'Inizia Meditazione Guidata',
    nextStage: 'Tappa Successiva',
    previousStage: 'Tappa Precedente',
    concludeDay: 'Concludi Giorno e Salva Diario',
    healingBalm: "Balsamo d'Amore",
    transmutation: 'Fiamma Viola',
    sealing: 'Sigillo e Protezione',
    grounding: 'Radicamento Sacro',
    vitality: 'Vitalità Cellulare'
  },
  de: {
    appTitle: 'Integriertes Heilungsprotokoll',
    appSubtitle: '21 Tage Quantentransmutation und Erhöhung',
    hello: 'Hallo',
    day: 'Tag',
    dayOf: 'von 21',
    startToday: 'Tag Beginnen',
    myJournal: 'Mein Tagebuch',
    streak: 'Serie',
    days: 'Tage',
    completed: 'Abgeschlossen',
    progress: 'Fortschritt',
    contactTherapist: 'Kontaktieren Sie uns',
    whatsappTooltip: 'Chatten Sie mit Therapeut Éverton Piceni auf WhatsApp',
    language: 'Sprache',
    audioLanguage: 'Audio & Übersetzung',
    proPlan: 'Pro-Plan',
    anamnesis: 'Quantenanamnese',
    specificTreatment: 'Spezifische Behandlung (R$ 70)',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    breatheInhale: 'Licht und Frieden einatmen...',
    breatheHold: 'Halten und die heilige Präsenz spüren...',
    breatheExhale: 'Alle Spannungen loslassen...',
    decreeTitle: 'Heiliges Tagesdekret',
    startMeditation: 'Geführte Meditation starten',
    nextStage: 'Nächste Stufe',
    previousStage: 'Vorherige Stufe',
    concludeDay: 'Tag abschließen und Tagebuch speichern',
    healingBalm: 'Heilender Liebesbalsam',
    transmutation: 'Violette Flamme',
    sealing: 'Kosmische Versiegelung & Schutz',
    grounding: 'Heilige Erdung',
    vitality: 'Zelluläre Vitalität'
  }
};

// Stage texts translated dynamically for multi-language speech synthesis and display
export const STAGE_AUDIO_TRANSLATIONS: Record<AppLanguage, Record<string, { title: string; subtitle: string; text: string; mantras?: string[]; affirmation?: string }>> = {
  pt: {
    ABERTURA: {
      title: 'Abertura e Decreto de Aceitação',
      subtitle: 'Permissão Sagrada',
      text: 'Eu, [NOME], aceito receber nesse momento com todo o meu coração, o Protocolo de Cura Integrada de 21 dias, conforme canalizado e aplicado por Éverton Rodrigo Piceni.',
      mantras: [
        'Eu aceito minha cura.',
        'Eu me abro para a luz cósmica.',
        'Está decretado no meu coração.'
      ]
    },
    ATERRAMENTO: {
      title: 'O Aterramento e a Limpeza da Mente',
      subtitle: 'Conexão com a Terra e Silêncio Mental',
      text: 'Feche os olhos... Respire fundo... Puxe o ar calmamente pelo nariz... sinta seus pulmões se expandirem... e solte devagar pela boca, liberando todas as tensões do dia.\n\nDeixe de lado os julgamentos, os diagnósticos e os rótulos. Neste espaço sagrado, você é apenas consciência, luz e merecimento.\n\nVisualize agora que raízes fortes e luminosas saem da sola dos seus pés e da base da sua coluna. Elas descem profundamente, cruzando as camadas da Terra até se conectarem com o coração do planeta. Sinta-se seguro... Sinta-se perfeitamente aterrado e protegido.\n\nUma profunda energia de purificação ancestral começa a cobrir o seu corpo agora. Sinta como um sopro leve de ervas sagradas tocando a sua testa, o seu peito e as suas costas. Leve embora toda a ansiedade, acalme os pensamentos acelerados e dissipe o cansaço acumulado. O seu campo está limpo... Respire na certeza de que você está pronto para receber.',
      mantras: [
        'Eu estou seguro e protegido.',
        'Minha energia está aterrada no coração da Terra.',
        'Meu campo está limpo e sereno.'
      ]
    },
    VITALIDADE: {
      title: 'Vitalidade e Alinhamento Cerebral',
      subtitle: 'Recalibração e Foco do Sistema Nervoso',
      text: 'Imagine agora um calor suave, reconfortante e vitalizador nascendo na base da sua coluna. Esse calor começa a subir, vértebra por vértebra, preenchendo o seu corpo com uma nova força de vida. Toda a apatia, a tristeza profunda e o esgotamento extremo começam a se dissolver. A vitalidade retorna para cada uma das suas células.\n\nNo topo da sua cabeça e ao redor do seu corpo, pequenos cristais de luz pura se formam. Eles vibram em uma frequência curativa, desfazendo suavemente as memórias de dor gravadas no seu corpo físico e emocional.\n\nPontos sutis de luz dourada e azul se posicionam suavemente na sua cabeça, organizando todo o fluxo de energia do seu cérebro. Sinta a sua mente encontrar um ponto perfeito de foco, clareza e paz. O excesso de estímulos é silenciado. As correntes elétricas dos seus pensamentos encontram um ritmo equilibrado e manso. O seu sistema nervoso está sendo totalmente recalibrado agora.',
      mantras: [
        'A vitalidade retorna para cada célula.',
        'Minha mente está em foco, clareza e paz.',
        'Meu sistema nervoso está recalibrado.'
      ]
    },
    TRANSMUTACAO: {
      title: 'Transmutação de Traumas e Proteção Psíquica',
      subtitle: 'A Chama Violeta e o Escudo Safira',
      text: 'Sinta a vibração se elevar a um nível profundo e reconfortante. Uma onda de energia veloz penetra nas camadas mais escondidas do seu inconsciente. Deixe que essa força trabalhe. Ela está alcançando as feridas antigas, os traumas da infância e os medos reprimidos que você nem lembra que existem. Sinta as barreiras invisíveis ruírem, dissipando as paranoias e acalmar qualquer instabilidade oculta na sua alma.\n\nUma poderosa cúpula de luz azul-safira se fecha ao seu redor. Você está completamente protegido contra pensamentos de autossabotagem ou influências externas.\n\nDentro dessa armadura azul, uma fogueira sagrada de Chama Violeta se acende, envolvendo o seu corpo sem queimar. Veja as suas mágoas, as suas culpas inconscientes e as dores da rejeição serem jogadas voluntariamente nesse fogo violeta, transformando-se em pura força de recomeço.\n\nA tempestade interna perde a força. O turbilhão passou. Acima da sua cabeça, as asas de uma grande ave sagrada trazem o silêncio protetor do cosmos. Sinta o desapego das dores do ego. Há paz no seu silêncio.',
      mantras: [
        'A Chama Violeta transmuta todo medo e dor.',
        'Estou protegido pela luz azul-safira.',
        'Há paz profunda no meu silêncio interior.'
      ]
    },
    BALSAMO: {
      title: 'O Bálsamo do Amor e a Regeneração Celular',
      subtitle: 'Amor Incondicional e Névoa Regeneradora',
      text: 'Após a grande limpeza, a energia se torna pura doçura... Sinta uma luz rosa-quartzo emanar do centro do seu peito. Ela se expande por todo o seu ser, curando a dor do abandono e preenchendo cada espaço vazio com autoaceitação, compaixão e um profundo amor por sua própria jornada.\n\nUma cascata de ouro líquido desce do infinito, lavando o topo da sua cabeça e iluminando cada átomo do seu corpo. Essa luz dourada se funde a uma névoa verde-oliva brilhante, que entra suavemente pelas suas vias respiratórias.\n\nSinta o ar preencher seus pulmões, sua garganta e seus brônquios com pura saúde. Há uma regeneração física e espiritual completa acontecendo em você agora. O céu e a terra se alinham no seu peito em perfeita harmonia. Você é perfeito... Você é luz... Você é um reflexo da Fonte Criadora.',
      mantras: [
        'Eu sou amor incondicional e autoaceitação.',
        'Minha saúde e células se regeneram em luz.',
        'Eu sou um reflexo da Fonte Criadora.'
      ]
    },
    SELAMENTO: {
      title: 'Selamento, Caminhos Abertos e Libertação',
      subtitle: 'Estabilidade Cósmica e Mantras de Cura',
      text: 'Para selar e blindar este tratamento, sinta uma presença imponente, firme e próspera se ancorar ao seu lado. Todos os obstáculos invisíveis que travavam a sua vida material, emocional e espiritual são quebrados agora. Os seus caminhos estão totalmente abertos.\n\nVisualize-se agora sentado firmemente em um trono feito de nuvens mansas e seguras. O mundo lá fora continua girando, mas aqui dentro, você encontrou a sua estabilidade e o seu poder pessoal. A "nova chance" foi dada e o tratamento está selado no seu DNA cósmico.\n\nEu sou livre para ser feliz.\nEu me perdoo por todas as vezes que duvidei de mim mesmo.\nEu sou cura.\nEu sou amor.\nEu estou em paz.\n\nSinto muito.\nMe perdoe.\nEu te amo.\nSou grato.\n\nGratidão.',
      mantras: [
        'Eu sou livre para ser feliz.',
        'Eu sou cura, amor e paz.',
        'Sinto muito. Me perdoe. Eu te amo. Sou grato.'
      ]
    }
  },
  en: {
    ABERTURA: {
      title: 'Opening & Decree of Acceptance',
      subtitle: 'Sacred Permission',
      text: 'I, [NOME], accept at this moment with all my heart, the 21-Day Integrated Healing Protocol, as channeled and applied by Éverton Rodrigo Piceni.',
      mantras: [
        'I accept my healing.',
        'I open myself to cosmic light.',
        'It is decreed in my heart.'
      ]
    },
    ATERRAMENTO: {
      title: 'Grounding & Mind Cleansing',
      subtitle: 'Connection with the Earth & Mental Silence',
      text: 'Close your eyes... Take a deep breath... Inhale calmly through your nose... feel your lungs expand... and release slowly through your mouth, releasing all the tensions of the day.\n\nSet aside judgments, diagnoses, and labels. In this sacred space, you are only consciousness, light, and worthiness.\n\nVisualize strong and luminous roots coming out from the soles of your feet and the base of your spine. They descend deeply, crossing the layers of the Earth until they connect with the planet’s crystalline heart. Feel safe... Feel perfectly grounded and protected.\n\nA profound energy of ancestral purification begins to cover your body now. Feel like a gentle breeze of sacred herbs touching your forehead, chest, and back. Carry away all anxiety, calm racing thoughts, and dissolve accumulated fatigue. Your field is clean... Breathe in the certainty that you are ready to receive.',
      mantras: [
        'I am safe and protected.',
        'My energy is rooted in the Earth core.',
        'My field is clean and serene.'
      ]
    },
    VITALIDADE: {
      title: 'Vitality & Brain Alignment',
      subtitle: 'Nervous System Recalibration & Focus',
      text: 'Now imagine a gentle, comforting, and vitalizing warmth rising from the base of your spine. This warmth ascends vertebra by vertebra, filling your body with new life force. All apathy, deep sadness, and exhaustion begin to dissolve. Vitality returns to every single one of your cells.\n\nAt the crown of your head and around your body, small crystals of pure light form. They vibrate at a healing frequency, gently dissolving memories of pain stored in your physical and emotional body.\n\nSubtle points of golden and blue light gently position themselves on your head, organizing your brain’s energy flow. Feel your mind find perfect focus, clarity, and peace. Stimulus overload is silenced. The electrical currents of your thoughts find a calm and balanced rhythm. Your nervous system is now fully recalibrated.',
      mantras: [
        'Vitality returns to every cell.',
        'My mind is in clarity, focus, and peace.',
        'My nervous system is fully recalibrated.'
      ]
    },
    TRANSMUTACAO: {
      title: 'Trauma Transmutation & Psychic Protection',
      subtitle: 'The Violet Flame & Sapphire Shield',
      text: 'Feel the vibration rise to a deep and comforting level. A swift wave of energy penetrates the deepest hidden layers of your subconscious. Let this force do its work. It reaches old wounds, childhood traumas, and repressed fears you may not even remember. Feel invisible barriers crumble, dispelling paranoias and calming any hidden soul instability.\n\nA powerful dome of sapphire-blue light closes around you. You are completely protected against self-sabotaging thoughts or external influences.\n\nInside this blue armor, a sacred bonfire of Violet Flame ignites, enveloping your body without burning. Watch your sorrows, unconscious guilt, and pains of rejection willingly cast into this violet fire, transforming into pure strength for new beginnings.\n\nThe internal storm subsides. The whirlwind has passed. Above your head, the wings of a sacred cosmic bird bring protective silence. Feel the detachment from ego pain. There is peace in your silence.',
      mantras: [
        'The Violet Flame transmutes all fear and pain.',
        'I am protected by sapphire-blue light.',
        'Deep peace dwells in my inner silence.'
      ]
    },
    BALSAMO: {
      title: 'Balm of Love & Cellular Regeneration',
      subtitle: 'Unconditional Love & Regenerating Mist',
      text: 'After the great cleansing, the energy becomes pure sweetness... Feel a rose-quartz light emanate from the center of your chest. It expands through your whole being, healing the pain of abandonment and filling every empty space with self-acceptance, compassion, and profound love for your own journey.\n\nA cascade of liquid gold descends from the infinite, washing the crown of your head and illuminating every atom of your body. This golden light merges with a shimmering olive-green mist that enters gently through your airways.\n\nFeel the air fill your lungs, throat, and bronchi with pure health. Complete physical and spiritual regeneration is occurring in you right now. Heaven and Earth align in your chest in perfect harmony. You are perfect... You are light... You are a reflection of the Creator Source.',
      mantras: [
        'I am unconditional love and self-acceptance.',
        'My health and cells regenerate in light.',
        'I am a reflection of the Creator Source.'
      ]
    },
    SELAMENTO: {
      title: 'Sealing, Open Paths & Liberation',
      subtitle: 'Cosmic Stability & Healing Mantras',
      text: 'To seal and shield this treatment, feel an imposing, firm, and prosperous presence anchor at your side. All invisible obstacles blocking your material, emotional, and spiritual life are broken now. Your paths are completely open.\n\nVisualize yourself firmly seated upon a throne made of gentle, safe clouds. The outer world keeps turning, but within, you have found your stability and personal power. The "fresh start" is granted and the treatment is sealed in your cosmic DNA.\n\nI am free to be happy.\nI forgive myself for all the times I doubted myself.\nI am healing.\nI am love.\nI am in peace.\n\nI am sorry.\nPlease forgive me.\nI love you.\nThank you.\n\nGratitude.',
      mantras: [
        'I am free to be happy.',
        'I am healing, love, and peace.',
        'I am sorry. Please forgive me. I love you. Thank you.'
      ]
    }
  },
  es: {
    ABERTURA: {
      title: 'Apertura y Decreto de Aceptación',
      subtitle: 'Permiso Sagrado',
      text: 'Yo, [NOME], acepto recibir en este momento con todo mi corazón, el Protocolo de Sanación Integrada de 21 días, según lo canalizado y aplicado por Éverton Rodrigo Piceni.',
      mantras: [
        'Acepto mi sanación.',
        'Me abro a la luz cósmica.',
        'Está decretado en mi corazón.'
      ]
    },
    ATERRAMENTO: {
      title: 'El Anclaje y la Limpieza Mental',
      subtitle: 'Conexión con la Tierra y Silencio Mental',
      text: 'Cierra los ojos... Respira hondo... Inhala con calma por la nariz... siente cómo se expanden tus pulmones... y suelta despacio por la boca, liberando todas las tensiones del día.\n\nDeja a un lado los juicios, los diagnósticos y las etiquetas. En este espacio sagrado, eres solo conciencia, luz y merecimiento.\n\nVisualiza ahora raíces fuertes y luminosas saliendo de las plantas de tus pies y de la base de tu columna. Descienden profundamente, cruzando las capas de la Tierra hasta conectarse con el corazón del planeta. Siéntete seguro... Siéntete perfectamente anclado y protegido.\n\nUna profunda energía de purificación ancestral comienza a cubrir tu cuerpo ahora. Siente como un suave soplo de hierbas sagradas tocando tu frente, tu pecho y tu espalda. Llévate toda la ansiedad, calma los pensamientos acelerados y disipa el cansancio acumulado. Tu campo está limpio... Respira en la certeza de que estás listo para recibir.',
      mantras: [
        'Estoy seguro y protegido.',
        'Mi energía está anclada en el corazón de la Tierra.',
        'Mi campo está limpio y sereno.'
      ]
    },
    VITALIDADE: {
      title: 'Vitalidad y Alineación Cerebral',
      subtitle: 'Recalibración y Enfoque del Sistema Nervioso',
      text: 'Imagina ahora un calor suave, reconfortante y vitalizador naciendo en la base de tu columna. Ese calor comienza a subir, vértebra por vértebra, llenando tu cuerpo con una nueva fuerza de vida. Toda apatía, tristeza profunda y agotamiento comienzan a disolverse. La vitalidad regresa a cada una de tus células.\n\nEn la coronilla de tu cabeza y alrededor de tu cuerpo, se forman pequeños cristales de luz pura. Vibran en una frecuencia curativa, disolviendo suavemente las memorias de dolor grabadas en tu cuerpo físico y emocional.\n\nPuntos sutiles de luz dorada y azul se posicionan suavemente en tu cabeza, organizando todo el flujo de energía de tu cerebro. Siente cómo tu mente encuentra un punto perfecto de enfoque, claridad y paz. El exceso de estímulos se silencia. Las corrientes eléctricas de tus pensamientos encuentran un ritmo equilibrado y manso. Tu sistema nervioso está siendo totalmente recalibrado ahora.',
      mantras: [
        'La vitalidad regresa a cada célula.',
        'Mi mente está en enfoque, claridad y paz.',
        'Mi sistema nervioso está recalibrado.'
      ]
    },
    TRANSMUTACAO: {
      title: 'Transmutación de Traumas y Protección Psíquica',
      subtitle: 'La Llama Violeta y el Escudo de Zafiro',
      text: 'Siente la vibración elevarse a un nivel profundo y reconfortante. Una onda de energía veloz penetra en las capas más escondidas de tu inconsciente. Deja que esa fuerza trabaje. Está alcanzando las heridas antiguas, los traumas de la infancia y los miedos reprimidos que ni recuerdas que existen. Siente cómo se derrumban las barreras invisibles, disipando paranoias y calmando cualquier inestabilidad oculta en tu alma.\n\nUna poderosa cúpula de luz azul-zafiro se cierra a tu alrededor. Estás completamente protegido contra pensamientos de autosabotaje o influencias externas.\n\nDentro de esa armadura azul, se enciende una hoguera sagrada de Llama Violeta, envolviendo tu cuerpo sin quemar. Mira tus rencores, culpas inconscientes y dolores del rechazo arrojarse voluntariamente a ese fuego violeta, transformándose en pura fuerza de nuevo comienzo.\n\nLa tormenta interna pierde fuerza. El torbellino pasó. Sobre tu cabeza, las alas de una gran ave sagrada traen el silencio protector del cosmos. Siente el desapego de los dolores del ego. Hay paz en tu silencio.',
      mantras: [
        'La Llama Violeta transmuta todo miedo y dolor.',
        'Estoy protegido por la luz azul-zafiro.',
        'Hay profunda paz en mi silencio interior.'
      ]
    },
    BALSAMO: {
      title: 'El Bálsamo del Amor y la Regeneración Celular',
      subtitle: 'Amor Incondicional y Niebla Regeneradora',
      text: 'Tras la gran limpieza, la energía se vuelve pura dulzura... Siente una luz rosa-cuarzo emanar del centro de tu pecho. Se expande por todo tu ser, sanando el dolor del abandono y llenando cada espacio vacío con autoaceptación, compasión y un profundo amor por tu propio camino.\n\nUna cascada de oro líquido desciende del infinito, lavando la coronilla de tu cabeza e iluminando cada átomo de tu cuerpo. Esta luz dorada se fusiona con una niebla verde-oliva brillante, que entra suavemente por tus vías respiratorias.\n\nSiente el aire llenar tus pulmones, tu garganta y tus bronquios de pura salud. Hay una regeneración física y espiritual completa ocurriendo en ti ahora. El cielo y la tierra se alinean en tu pecho en perfecta armonía. Eres perfecto... Eres luz... Eres un reflejo de la Fuente Creadora.',
      mantras: [
        'Soy amor incondicional y autoaceptación.',
        'Mi salud y células se regeneran en luz.',
        'Soy un reflejo de la Fuente Creadora.'
      ]
    },
    SELAMENTO: {
      title: 'Sellado, Caminos Abiertos y Liberación',
      subtitle: 'Estabilidad Cósmica y Mantras de Sanación',
      text: 'Para sellar y blindar este tratamiento, siente una presencia imponente, firme y próspera anclarse a tu lado. Todos los obstáculos invisibles que trababan tu vida material, emocional y espiritual se rompen ahora. Tus caminos están totalmente abiertos.\n\nVisualízate ahora sentado firmemente en un trono hecho de nubes mansas y seguras. El mundo exterior sigue girando, pero aquí dentro, has encontrado tu estabilidad y poder personal. La "nueva oportunidad" ha sido otorgada y el tratamiento queda sellado en tu ADN cósmico.\n\nYo soy libre para ser feliz.\nMe perdono por todas las veces que dudé de mí mismo.\nYo soy sanación.\nYo soy amor.\nYo estoy en paz.\n\nLo siento.\nPor favor perdóname.\nTe amo.\nGracias.\n\nGratitud.',
      mantras: [
        'Soy libre para ser feliz.',
        'Soy sanación, amor y paz.',
        'Lo siento. Perdóname. Te amo. Gracias.'
      ]
    }
  },
  fr: {
    ABERTURA: {
      title: 'Ouverture et Décret d’Acceptation',
      subtitle: 'Permission Sacrée',
      text: 'Moi, [NOME], j’accepte de recevoir en cet instant de tout mon cœur le Protocole de Guérison Intégrée de 21 jours, tel que canalisé et appliqué par Éverton Rodrigo Piceni.',
      mantras: ['J’accepte ma guérison.', 'Je m’ouvre à la lumière cosmique.']
    },
    ATERRAMENTO: {
      title: 'Ancrage et Nettoyage de l’Esprit',
      subtitle: 'Connexion à la Terre et Silence Mental',
      text: 'Fermez les yeux... Respirez profondément... Inspirez calmement par le nez... sentez vos poumons se remplir... et relâchez lentement par la bouche, libérant toutes les tensions du jour.\n\nLaissez de côté les jugements et les étiquettes. Dans cet espace sacré, vous êtes conscience, lumière et plénitude.\n\nVisualisez des racines lumineuses partant de vos pieds et de votre colonne, descendant jusqu’au cœur cristallin de la Terre. Sentez-vous en sécurité, ancré et protégé.\n\nUne énergie de purification ancestrale enveloppe votre corps. Respirez dans la certitude que vous êtes prêt à recevoir.',
      mantras: ['Je suis en sécurité et protégé.', 'Mon énergie est ancrée dans la Terre.']
    },
    VITALIDADE: {
      title: 'Vitalité et Alignement Cérébral',
      subtitle: 'Recalibration du Système Nerveux',
      text: 'Imaginez une chaleur douce et vivifiante montant de la base de votre colonne vertébrale, vertèbre par vertèbre. La vitalité revient dans chacune de vos cellules.\n\nDes cristaux de lumière pure et des points dorés et bleus organisent le flux énergétique de votre cerveau. Votre esprit trouve clarté, paix et concentration parfaite.',
      mantras: ['La vitalité revient dans chaque cellule.', 'Mon esprit est en paix et clarté.']
    },
    TRANSMUTACAO: {
      title: 'Transmutation des Traumatismes et Bouclier Psychique',
      subtitle: 'La Flamme Violette et le Dôme Saphir',
      text: 'Une puissante coupole bleu-saphir se forme autour de vous. À l’intérieur, la Flamme Violette sacrée transmute vos chagrins, culpabilités et blessures du passé en pure force de renouveau.\n\nLa tempête intérieure s’apaise. Il y a une paix profonde dans votre silence.',
      mantras: ['La Flamme Violette transmute toute douleur.', 'Je suis protégé par la lumière saphir.']
    },
    BALSAMO: {
      title: 'Baume d’Amour et Régénération Cellulaire',
      subtitle: 'Amour Inconditionnel et Régénération',
      text: 'Une lumière rose-quartz émane du centre de votre poitrine, guérissant les blessures du cœur. Une cascade d’or liquide et une brume vert-olive remplissent vos voies respiratoires de pure santé.\n\nVous êtes régénéré, parfait et aligné avec la Source Créatrice.',
      mantras: ['Je suis amour et auto-acceptation.', 'Mes cellules se régénèrent dans la lumière.']
    },
    SELAMENTO: {
      title: 'Scellement, Chemins Ouverts et Libération',
      subtitle: 'Stabilité Cosmique et Mantras',
      text: 'Tous les obstacles invisibles sont brisés. Vos chemins sont grands ouverts. Vous êtes assis sur un trône de paix et de stabilité intérieure.\n\nJe suis libre d’être heureux.\nJe me pardonne.\nJe suis guérison.\nJe suis amour.\nJe suis en paix.\n\nDésolé. Pardonne-moi. Je t’aime. Merci.\nGratitude.',
      mantras: ['Je suis libre d’être heureux.', 'Désolé. Pardonne-moi. Je t’aime. Merci.']
    }
  },
  it: {
    ABERTURA: {
      title: 'Apertura e Decreto di Accettazione',
      subtitle: 'Permesso Sacro',
      text: 'Io, [NOME], accetto di ricevere in questo momento con tutto il cuore il Protocollo di Guarigione Integrata di 21 giorni, canalizzato e applicato da Éverton Rodrigo Piceni.',
      mantras: ['Accetto la mia guarigione.', 'Mi apro alla luce cosmica.']
    },
    ATERRAMENTO: {
      title: 'Radicamento e Pulizia Mentale',
      subtitle: 'Connessione con la Terra e Silenzio',
      text: 'Chiudi gli occhi... Respira profondamente... Inspira con calma dal naso... e rilascia lentamente dalla bocca tutte le tensioni della giornata.\n\nVisualizza radici luminose scendere dai tuoi piedi fino al cuore cristallino della Terra. Sei al sicuro, perfettamente radicato e protetto.\n\nUn soffio di purificazione ancestrale pulisce il tuo campo. Sei pronto a ricevere.',
      mantras: ['Sono al sicuro e protetto.', 'La mia energia è radicata nella Terra.']
    },
    VITALIDADE: {
      title: 'Vitalità e Allineamento Cerebrale',
      subtitle: 'Ricalibrazione del Sistema Nervoso',
      text: 'Un calore dolce e rigenerante risale lungo la colonna vertebrale, riempiendo ogni cellula di nuova vita. Cristalli di luce pura e punti dorati riorganizzano il flusso energetico della mente in perfetta calma e chiarezza.',
      mantras: ['La vitalità ritorna in ogni cellula.', 'La mia mente è in pace e chiarezza.']
    },
    TRANSMUTACAO: {
      title: 'Trasmutazione dei Traumi e Protezione Psichica',
      subtitle: 'Fiamma Viola e Scudo Zaffiro',
      text: 'Una potente cupola di luce blu zaffiro ti protegge. All’interno, la Sacra Fiamma Viola dissolve risentimenti e paure, trasformandoli in pura forza di rinascita.\n\nLa tempesta si placa. C’è pace nel tuo silenzio interiore.',
      mantras: ['La Fiamma Viola trasmuta ogni dolore.', 'Sono protetto dalla luce zaffiro.']
    },
    BALSAMO: {
      title: 'Balsamo d’Amore e Rigenerazione Cellulare',
      subtitle: 'Amore Incondizionato',
      text: 'Una luce rosa-quarzo sana ogni ferita emotiva. Una cascata d’oro e una nebbia verde brillante rigenerano il tuo corpo e i tuoi organi in pura salute.',
      mantras: ['Io sono amore incondizionato.', 'Le mie cellule si rigenerano nella luce.']
    },
    SELAMENTO: {
      title: 'Sigillo, Vie Aperte e Liberazione',
      subtitle: 'Stabilità Cosmica',
      text: 'Tutti gli ostacoli sono sciolti. I tuoi cammini sono aperti. Sei saldo nel tuo potere e nella tua pace interiore.\n\nIo sono libero di essere felice.\nIo mi perdono.\nIo sono guarigione.\nIo sono amore.\nIo sono in pace.\n\nMi dispiace. Perdonami. Ti amo. Grazie.\nGratitudine.',
      mantras: ['Io sono libero di essere felice.', 'Mi dispiace. Perdonami. Ti amo. Grazie.']
    }
  },
  de: {
    ABERTURA: {
      title: 'Eröffnung und Annahmedekret',
      subtitle: 'Heilige Erlaubnis',
      text: 'Ich, [NOME], nehme in diesem Moment von ganzem Herzen das 21-tägige integrierte Heilungsprotokoll an, kanalisiert und angewendet von Éverton Rodrigo Piceni.',
      mantras: ['Ich nehme meine Heilung an.', 'Ich öffne mich dem kosmischen Licht.']
    },
    ATERRAMENTO: {
      title: 'Erdung und Geistreinigung',
      subtitle: 'Verbindung zur Erde und Gedankenstille',
      text: 'Schließe sanft die Augen... Atme tief durch die Nase ein... und lasse langsam durch den Mund alle Anspannungen des Tages los.\n\nVisualisiere leuchtende Wurzeln, die von deinen Füßen tief in das Herz der Erde wachsen. Du bist geborgen, geerdet und geschützt.\n\nDein Energiefeld ist gereinigt und bereit zu empfangen.',
      mantras: ['Ich bin sicher und geschützt.', 'Meine Energie ist in der Erde verwurzelt.']
    },
    VITALIDADE: {
      title: 'Zelluläre Vitalität und Gehirnausrichtung',
      subtitle: 'Neukalibrierung des Nervensystems',
      text: 'Eine sanfte, vitalisierende Wärme steigt Wirbel für Wirbel an deiner Wirbelsäule auf und erfüllt jede Zelle mit Lebenskraft. Kristalle reinen Lichts bringen Geist und Nervensystem in vollkommene Ruhe und Klarheit.',
      mantras: ['Vitalität erfüllt jede Zelle.', 'Mein Geist ist klar und friedvoll.']
    },
    TRANSMUTACAO: {
      title: 'Transmutation von Traumata und Schutz',
      subtitle: 'Die Violette Flamme und Saphirschild',
      text: 'Ein saphirblauer Lichtdom schützt dich. Darin entzündet sich die heilige Violette Flamme und verwandelt alten Schmerz, Ängste und Sorgen in reine Kraft des Neuanfangs.',
      mantras: ['Die Violette Flamme wandelt jeden Schmerz.', 'Ich bin vollkommen geschützt.']
    },
    BALSAMO: {
      title: 'Balsam der Liebe und Zellregeneration',
      subtitle: 'Bedingungslose Liebe',
      text: 'Rosenquarzfarbenes Licht heilt alle emotionalen Wunden im Herzzentrum. Goldenes Licht und ein vitalisierender Nebel regenerieren Körper und Organe in vollkommener Gesundheit.',
      mantras: ['Ich bin bedingungslose Liebe.', 'Meine Zellen regenerieren im Licht.']
    },
    SELAMENTO: {
      title: 'Versiegelung, Offene Wege und Befreiung',
      subtitle: 'Kosmische Stabilität',
      text: 'Alle unsichtbaren Hindernisse lösen sich auf. Deine Wege sind frei. Du bist tief in deinem inneren Frieden verankert.\n\nIch bin frei, glücklich zu sein.\nIch vergebe mir selbst.\nIch bin Heilung.\nIch bin Liebe.\nIch bin in Frieden.\n\nEs tut mir leid. Bitte verzeih mir. Ich liebe dich. Danke.\nDankbarkeit.',
      mantras: ['Ich bin frei, glücklich zu sein.', 'Es tut mir leid. Bitte verzeih mir. Ich liebe dich. Danke.']
    }
  }
};
