const MANILA_TIMEZONE = 'Asia/Manila';
const manilaDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: MANILA_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const formatManilaDateKey = (value) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = manilaDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return null;
  }

  return `${year}-${month}-${day}`;
};

export const getManilaDateKey = (value) => formatManilaDateKey(value);

export const getCurrentManilaDateKey = () => formatManilaDateKey(new Date());
