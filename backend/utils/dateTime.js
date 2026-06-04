const MANILA_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export const getManilaDayRange = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const shiftedToManila = new Date(date.getTime() + MANILA_OFFSET_MS);
  const startUtcTimestamp = Date.UTC(
    shiftedToManila.getUTCFullYear(),
    shiftedToManila.getUTCMonth(),
    shiftedToManila.getUTCDate()
  ) - MANILA_OFFSET_MS;

  return {
    start: new Date(startUtcTimestamp),
    end: new Date(startUtcTimestamp + DAY_MS - 1)
  };
};
