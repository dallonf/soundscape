import { formatTime } from '../formatTime';

it('formats a minute', () => {
  expect(formatTime(1000*60)).toBe('1:00');
});

it('formats a minute and 30 seconds', () => {
  expect(formatTime(1000*60 + 1000*30)).toBe('1:30');
});

it('formats 30 seconds', () => {
  expect(formatTime(1000*30)).toBe('0:30');
});

it('formats less than a second', () => {
  expect(formatTime(50)).toBe('0:01');
})