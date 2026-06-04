import { useState, useEffect } from 'react';

const MANILA_TIMEZONE = 'Asia/Manila';

const formatManilaDateTime = () => {
  const formatter = new Intl.DateTimeFormat('en-PH', {
    timeZone: MANILA_TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return formatter.format(new Date());
};

const ManilaNowCard = () => {
  const [manilaTime, setManilaTime] = useState(() => formatManilaDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setManilaTime(formatManilaDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-6 py-4">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-600">Date & Time</p>
          <p className="text-lg font-semibold text-slate-950">{manilaTime}</p>
        </div>
      </div>
    </div>
  );
};

export default ManilaNowCard;
