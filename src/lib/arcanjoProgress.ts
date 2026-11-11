export interface ArcanjoProgressState {
  totalCompleted: number;
  nextAvailableDay: number;
  consecutiveCompletedDays: number;
  journeyCompleted: boolean;
}

/**
 * The Arcanjo day grid allows users to revisit/select days independently.
 * Use the first missing day, not completedDays.length + 1, so gaps never
 * unlock a later day or misreport the sequential progress count.
 */
export function getArcanjoProgressState(completedDays: readonly number[]): ArcanjoProgressState {
  const completed = new Set(
    completedDays.filter(day => Number.isInteger(day) && day >= 1 && day <= 7)
  );

  let nextAvailableDay = 7;
  let consecutiveCompletedDays = 0;

  for (let day = 1; day <= 7; day += 1) {
    if (!completed.has(day)) {
      nextAvailableDay = day;
      break;
    }
    consecutiveCompletedDays += 1;
  }

  const totalCompleted = completed.size;

  return {
    totalCompleted,
    nextAvailableDay,
    consecutiveCompletedDays,
    journeyCompleted: totalCompleted === 7
  };
}
