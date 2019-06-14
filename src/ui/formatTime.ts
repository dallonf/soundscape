const SECOND_LENGTH = 1000;
const MINUTE_LENGTH = SECOND_LENGTH * 60;

export const formatTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / MINUTE_LENGTH);
  const seconds = Math.ceil((milliseconds - minutes * MINUTE_LENGTH) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
