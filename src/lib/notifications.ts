/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyReminderConfig {
  enabled: boolean;
  time: string;
  lastTriggeredDate?: string;
}

export const CARE_REMINDERS = [
  'Seu momento está esperando por você. Alguns minutos também são cuidado.',
  'Se fizer sentido hoje, reserve alguns minutos para voltar para você.',
  'Você pode chegar como está. Seu espaço de cuidado continua aqui.',
  'Pequenos momentos de presença também contam.'
];

class LocalNotificationManager {
  private timerId: any = null;
  private inAppCallback: ((title: string, body: string) => void) | null = null;

  public setInAppNotifier(callback: (title: string, body: string) => void) {
    this.inAppCallback = callback;
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') return (await Notification.requestPermission()) === 'granted';
    } catch (e) {
      console.warn('Could not request notification permission', e);
    }
    return false;
  }

  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }

  public sendNotification(title: string, body: string, icon = '/app-icon.jpg') {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, icon, tag: 'cura-integrada-daily' }); }
      catch (e) { console.warn('Failed to create native notification', e); }
    }
    this.inAppCallback?.(title, body);
  }

  public startDailyChecker(reminderTime = '20:00', userName = 'você', currentDay = 1, _anamnesisComplaints: string[] = [], isCurrentMomentCompleted = false) {
    if (this.timerId) clearInterval(this.timerId);

    const checkTime = () => {
      if (isCurrentMomentCompleted) return;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0];
      const lastTriggered = localStorage.getItem('cura_integrada_last_reminder_date');
      if (hhmm !== reminderTime || lastTriggered === today) return;

      localStorage.setItem('cura_integrada_last_reminder_date', today);
      const title = userName && userName !== 'você' ? `${userName}, este momento é seu.` : 'Este momento é seu.';
      const body = currentDay >= 1 && currentDay <= 21
        ? 'Seu momento está esperando por você. Alguns minutos também são cuidado.'
        : CARE_REMINDERS[Math.floor(Math.random() * CARE_REMINDERS.length)];
      this.sendNotification(title, body);
    };

    this.timerId = setInterval(checkTime, 30000);
    checkTime();
  }

  public stopDailyChecker() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  public triggerDay21Completion() {
    this.sendNotification(
      'Você concluiu este ciclo.',
      'Reconheça o caminho que percorreu. Sem pressa para chegar a outro lugar: este momento também merece ser acolhido.'
    );
  }
}

export const localNotificationManager = new LocalNotificationManager();
