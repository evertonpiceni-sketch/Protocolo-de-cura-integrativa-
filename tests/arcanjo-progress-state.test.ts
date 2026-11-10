import assert from 'node:assert/strict';
import test from 'node:test';
import { getArcanjoProgressState } from '../src/lib/arcanjoProgress';

test('the Dashboard keeps the first unfinished Arcanjo day current when completion history has gaps', () => {
  assert.deepEqual(getArcanjoProgressState([2, 3]), {
    totalCompleted: 2,
    nextAvailableDay: 1,
    consecutiveCompletedDays: 0,
    journeyCompleted: false
  });

  assert.deepEqual(getArcanjoProgressState([1, 3]), {
    totalCompleted: 2,
    nextAvailableDay: 2,
    consecutiveCompletedDays: 1,
    journeyCompleted: false
  });
});

test('the Dashboard advances only through a contiguous completed sequence', () => {
  assert.deepEqual(getArcanjoProgressState([1, 2, 3]), {
    totalCompleted: 3,
    nextAvailableDay: 4,
    consecutiveCompletedDays: 3,
    journeyCompleted: false
  });
});

test('the Arcanjo progress state ignores duplicate and invalid day values', () => {
  assert.deepEqual(getArcanjoProgressState([1, 1, 2, 0, 8, -1]), {
    totalCompleted: 2,
    nextAvailableDay: 3,
    consecutiveCompletedDays: 2,
    journeyCompleted: false
  });
});

test('all seven completed days close the journey without reporting an eighth day', () => {
  assert.deepEqual(getArcanjoProgressState([1, 2, 3, 4, 5, 6, 7]), {
    totalCompleted: 7,
    nextAvailableDay: 7,
    consecutiveCompletedDays: 7,
    journeyCompleted: true
  });
});
