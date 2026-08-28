/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyReminderConfig {
  enabled: boolean;
  time: string; // "HH:MM" format (e.g. "08:00")
  lastTriggeredDate?: string; // "YYYY-MM-DD"
}

export const INSPIRING_MEDITATION_QUOTES = [
  "👑 Respire fundo e assuma o seu trono de poder pessoal. Sua cura começa agora.",
  "✨ A paz que você busca já habita no silêncio do seu coração. Reserve 15 minutos para você.",
  "💜 A Chama Violeta transmuta todo medo em confiança soberana. Venha meditar hoje.",
  "🌸 Você é um ser de luz em constante expansão. Seu alinhamento diário te espera.",
  "🌊 Deixe o passado ir com ternura e acolha a abundância do momento presente.",
  "☀️ Onde há consciência, não há espaço para a escuridão. Conecte-se com sua essência.",
  "🌿 Respire a cura, solte as tensões e permita que o Reiki harmonize seu campo celular."
];

class LocalNotificationManager {
  private timerId: any = null;
  private inAppCallback: ((title: string, body: string) => void) | null = null;

  public setInAppNotifier(callback: (title: string, body: string) => void) {
    this.inAppCallback = callback;
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        return result === 'granted';
      }
    } catch (e) {
      console.warn("Could not request notification permission", e);
    }
    return false;
  }

  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  public sendNotification(title: string, body: string, icon = '/app-icon.jpg') {
    // 1. Try native Web Notification API
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon,
          tag: 'cura-integrada-daily'
        });
      } catch (e) {
        console.warn("Failed to create native notification", e);
      }
    }
    // 2. Also trigger In-App Toast
    if (this.inAppCallback) {
      this.inAppCallback(title, body);
    }
  }

  public startDailyChecker(reminderTime: string = '20:00', userName = 'Consulente', currentDay: number = 1, anamnesisComplaints: string[] = []) {
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    const checkTime = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split('T')[0];
      const lastTriggered = localStorage.getItem('cura_integrada_last_reminder_date');

      if (currentTimeStr === reminderTime && lastTriggered !== todayStr) {
        localStorage.setItem('cura_integrada_last_reminder_date', todayStr);

        let title = `✨ Hora da sua Prática Diária, ${userName}!`;
        let body = "";

        // Smart push based on anamnesis (Insomnia)
        if (anamnesisComplaints.includes('insonia_cronica') || anamnesisComplaints.includes('cansaço')) {
          title = `🌙 Preparado para desligar a mente?`;
          body = "Seu protocolo de hoje está pronto. Vamos ter uma noite de sono reparadora e profunda.";
        } 
        else if (currentDay >= 1 && currentDay <= 7) {
          // Fase 1
          body = "Hora de desacelerar. O Benzi Reiki e as frequências de purificação aguardam por você. Vamos limpar o peso do dia?";
        } 
        else if (currentDay === 8) {
          // Fase 2 - Início
          title = "🌀 Você entrou na Fase de Transmutação";
          body = "Traumas antigos ou memórias da infância podem ecoar hoje. Não lute contra eles, use o áudio para deixá-los ir.";
        }
        else if (currentDay > 8 && currentDay <= 14) {
          body = "O Karuna Ki continua limpando sua energia. É normal sentir densidade se soltando, apenas ouça o áudio.";
        }
        else if (currentDay === 15) {
          // Fase 3 - Início
          title = "🌸 A tempestade passou...";
          body = "É hora de preencher o seu cardíaco com a doçura do Raio Rosa e a luz da Fonte Primordial. Sinta o acolhimento.";
        }
        else if (currentDay > 15 && currentDay <= 21) {
          body = "A cada dia você se preenche de mais amor incondicional. Realinhe sua frequência com a prática de hoje.";
        }
        else {
          body = INSPIRING_MEDITATION_QUOTES[Math.floor(Math.random() * INSPIRING_MEDITATION_QUOTES.length)];
        }

        this.sendNotification(title, body);
      }
    };

    // Check every 30 seconds
    this.timerId = setInterval(checkTime, 30000);
    // Also run once immediately
    checkTime();
  }

  public stopDailyChecker() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Called explicitly at the end of day 21 audio
  public triggerDay21Completion() {
    this.sendNotification(
      "👑 Tratamento totalmente selado!",
      "No seu DNA cósmico! Você assumiu o seu trono e os caminhos estão abertos. Parabéns pela jornada."
    );
  }
}

export const localNotificationManager = new LocalNotificationManager();
